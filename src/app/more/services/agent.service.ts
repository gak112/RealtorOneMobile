// src/app/services/agent-onboarding.service.ts
import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  collectionData,
  limit,
  orderBy,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { defer, map, Observable, of } from 'rxjs';
import { agentDetails } from 'src/app/models/agent.model';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private fs = inject(Firestore);
  private userRef = (uid: string) => doc(this.fs, 'users', uid);

  async recordTerms(uid: string, version: string) {
    const ref = doc(this.fs, `users/${uid}`);
    await setDoc(
      ref,
      {
        terms: { accepted: true, version, at: serverTimestamp() },
        wantsToBeAgent: true,
      },
      { merge: true }
    );
  }

  async leaveAgent(uid: string) {
    const ref = doc(this.fs, `users/${uid}`);
    await updateDoc(ref, {
      agent: false,
      wantsToBeAgent: false,
    });
  }

  async createAgent(
    uid: string,
    payload: Omit<agentDetails, 'id' | 'uid' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const colRef = collection(this.fs, 'agententry');
    const docRef = await addDoc(colRef, {
      uid,
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Update existing agent document by id
  async updateAgent(id: string, payload: Partial<agentDetails>) {
    const ref = doc(this.fs, 'agententry', id);
    return updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp(),
    } as any);
  }
  async getAgent(agentId: string) {
    const snap = await getDoc(doc(this.fs, 'agents', agentId));
    return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null;
  }

  // Live doc by uid (assuming agents collection documents store uid)
  getAgentByUid$(uid: string): Observable<any | null> {
    const col = collection(this.fs, 'agententry');
    const q = query(col, where('uid', '==', uid), limit(1));
    // collectionData cannot read a query with limit easily; fallback to manual
    return new Observable((observer) => {
      // one-shot first, or use onSnapshot if you need realtime
      getDocs(q)
        .then((snap) => {
          const doc = snap.docs[0];
          observer.next(doc ? { id: doc.id, ...doc.data() } : null);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  async getAgentByUidOnce(uid: string): Promise<any | null> {
    const col = collection(this.fs, 'agententry');
    const q = query(col, where('uid', '==', uid), limit(1));
    const snap = await getDocs(q);
    const d = snap.docs[0];
    return d ? { id: d.id, ...d.data() } : null;
  }

  async setNormalUser(uid: string, termsVersion = 'v1'): Promise<void> {
    const ref = doc(this.fs, `users/${uid}`);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // create with baseline shape
      await setDoc(ref, {
        uid,
        roles: { isAgent: false },
        flags: { agentPromptDismissed: true },
        termsVersion,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      return;
    }

    // update existing
    await updateDoc(ref, {
      'roles.isAgent': false,
      'flags.agentPromptDismissed': true,
      termsVersion,
      updatedAt: serverTimestamp(),
    });
  }

  // agententry collection: docs keyed by agentId; each doc has uid
  watchAgentByUid(uid: () => string): Observable<any | null> {
    return defer(() => {
      const u = uid();
      if (!u) return of(null);
      const col = collection(this.fs, 'agententry');
      const q = query(col, where('uid', '==', u), limit(1));
      return collectionData(q, { idField: 'id' }).pipe(
        map((arr) => arr[0] ?? null)
      );
    });
  }

  watchReferrals(agentId: string): Observable<any[]> {
    const col = collection(this.fs, `agententry/${agentId}/referrals`);
    const q = query(col, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  watchRenewalProperties(agentId: string): Observable<any[]> {
    const col = collection(this.fs, `agententry/${agentId}/renewalProperties`);
    const q = query(col, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
}
