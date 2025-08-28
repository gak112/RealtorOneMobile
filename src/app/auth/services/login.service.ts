import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, map } from 'rxjs';
import { IUser } from '../models/user.model';
import { IUserSequence } from '../models/sequence.model';
import { generateSecureCode } from 'src/app/utils/secure.code';
import { buildRealtorUser } from 'src/app/utils/user.builder';
import { AuthService } from 'src/app/services/auth.service';
import { serverTimestamp } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private afs = inject(AngularFirestore);
  private auth = inject(AuthService);

  // Sequence ID configuration
  private readonly SEQUENCE_COLLECTION = 'sequences';
  private readonly USER_SEQUENCE_KEY = 'user_sequence';

  /** After OTP verification */
  async verifyAndLogin(phone: string, fullName = '') {
    const normalized = this.normalizePhone(phone);
    const existing = await this.findByPhone(normalized);
    console.log(existing, 'existing');
    if (existing) {
      // login with stored secret
      const doc: any = await this.afs.doc(`users/${existing.uid}`).ref.get();
      console.log(doc, 'doc', doc.data());
      return this.auth.login(existing.loginEmail, doc.data()?.secureData);
    }

    // register new user
    const authSecret = generateSecureCode(32);
    const loginEmail = `${normalized}@realtorone.app`;

    const cred = await this.auth.register(loginEmail, authSecret);
    const uid = cred.user?.uid!;
    
    // Generate sequence ID for new user
    const sequenceId = await this.generateNextSequenceId();
    
    const user = buildRealtorUser({
      uid,
      fullName,
      phone: normalized,
      loginEmail,
      readableId: sequenceId, // Use sequence ID instead of phone number
    });
    console.log(user);

    await this.afs.doc(`users/${uid}`).set({ ...user, authSecret });
    return this.auth.login(loginEmail, authSecret);
  }

  private findByPhone(phone: string) {
    return firstValueFrom(
      this.afs
        .collection<IUser>('users', (ref) =>
          ref.where('phone', '==', phone).where('isDeleted', '==', false)
        )
        .valueChanges({ idField: 'uid' })
        .pipe(map((arr) => arr?.[0] ?? null))
    );
  }

  private normalizePhone(p: string) {
    return String(p).replace(/\D+/g, '').slice(-10);
  }

  /**
   * Generates the next sequence ID for user registration
   * Uses Firestore transaction to ensure atomic increment
   * Returns format: "ro00001", "ro00002", etc.
   */
  private async generateNextSequenceId(): Promise<string> {
    const sequenceRef = this.afs.doc(`${this.SEQUENCE_COLLECTION}/${this.USER_SEQUENCE_KEY}`);
    
    try {
      // Use transaction to atomically increment the sequence
      const result = await this.afs.firestore.runTransaction(async (transaction) => {
        const sequenceDoc = await transaction.get(sequenceRef.ref);
        
        let currentSequence = 1; // Default to 1 if no sequence exists
        
        if (sequenceDoc.exists) {
          const data = sequenceDoc.data() as IUserSequence;
          currentSequence = (data?.currentSequence || 0) + 1;
        }
        
        // Update the sequence document
        transaction.set(sequenceRef.ref, {
          currentSequence,
          updatedAt: serverTimestamp(),
        });
        
        return currentSequence;
      });
      
      // Format the sequence ID with leading zeros (5 digits)
      const formattedSequence = result.toString().padStart(5, '0');
      return `ro${formattedSequence}`;
      
    } catch (error) {
      console.error('Error generating sequence ID:', error);
      // Fallback: generate a timestamp-based ID if transaction fails
      const timestamp = Date.now();
      const fallbackSequence = (timestamp % 100000).toString().padStart(5, '0');
      return `ro${fallbackSequence}`;
    }
  }
}
