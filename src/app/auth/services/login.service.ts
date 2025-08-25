import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, map } from 'rxjs';
import { AuthService } from './auth.service';
import { IUser } from '../models/user.model';
import { generateSecureCode } from 'src/app/utils/secure.code';
import { buildRealtorUser } from 'src/app/utils/user.builder';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private afs = inject(AngularFirestore);
  private auth = inject(AuthService);

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
    const user = buildRealtorUser({
      uid,
      fullName,
      phone: normalized,
      loginEmail
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
}
