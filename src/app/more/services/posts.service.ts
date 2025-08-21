// src/app/core/posts.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
  FieldValue,
  QueryConstraint,
  orderBy,
  CollectionReference,
  DocumentData,
  setDoc,
  query,
  where,
  limit,
  deleteDoc,
} from '@angular/fire/firestore';
import { PostRequest } from 'src/app/models/request.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private afs = inject(Firestore);

  private colRef() {
    return collection(this.afs, 'posts');
  }

  // private colRef(): CollectionReference<DocumentData> {
  //   return collection(this.afs, 'posts');
  // }

  async getById(id: string) {
    const snap = await getDoc(doc(this.afs, 'posts', id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }

  async create(payload: PostRequest) {
    const now = serverTimestamp();
    const ref = await addDoc(this.colRef(), {
      ...payload,
      createdAt: now,
      updatedAt: now,
      sortDate: now,
      createdBy: '',
      updatedBy: '',
      isDeleted: false,
      deletedBy: null,
      deletedAt: null,
    });
    return ref.id;
  }

  async update(id: string, patch: Partial<PostRequest>) {
    const now = serverTimestamp();
    await updateDoc(doc(this.afs, 'posts', id), {
      ...patch,
      updatedAt: now,
    });
    return id;
  }

  /** Soft delete keeps data for audit and avoids breaking queries */
  // async deleteSoft(id: string, deletedBy: string | null = null) {
  //   const now = serverTimestamp();
  //   await updateDoc(doc(this.afs, 'posts', id), {
  //     isDeleted: true,
  //     deletedBy: deletedBy ?? 'system',
  //     deletedAt: now,
  //     updatedAt: now,
  //   });
  //   return id;
  // }


   async deleteSoft(id: string, deletedBy?: string) {
    const now = serverTimestamp();
    await updateDoc(doc(this.afs, 'posts', id), {
      isDeleted: true,
      deletedAt: now,
      deletedBy: deletedBy ?? null,
      updatedAt: now,
    });
    return id;
  }

  /** If you ever need a hard delete, uncomment and use carefully */
  // async deleteHard(id: string) {
  //   await deleteDoc(doc(this.afs, 'posts', id));
  //   return id;
  // }

  /** Query helper: not required, but handy */
  getListQuery({ take = 100 } = {}) {
    return query(
      this.colRef(),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc'),
      limit(take)
    );
  }

  async deleteHard(id: string) {
    await deleteDoc(doc(this.afs, 'posts', id));
    return id;
  }
}
