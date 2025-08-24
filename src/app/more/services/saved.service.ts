import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

export interface SavedDocPayload {
  id: string;
  propertyTitle?: string;
  addressOfProperty?: string;
  saleType?: 'sale' | 'rent';
  category?: string;
  priceOfSale?: number;
  priceOfRent?: number;
  houseType?: string;
  bhkType?: string;
  propertySize?: string | number;
  propertyStatus?: string;
  agentName?: string;
  propertyId?: string;
  propertyImages?: { id: string; image: string }[];
  floor?: string;
  commercialType?: string;
}

@Injectable({ providedIn: 'root' })
export class SavedService {
  private afs = inject(Firestore);

  /**
   * In-memory cache of saved flags keyed by `${uid}:${propertyId}`.
   * Using signals means all components stay in sync instantly.
   */
  private cache = signal<Record<string, boolean>>({});

  /** Read-only helper for components */
  isSaved(uid: string, propertyId: string) {
    return !!this.cache()[`${uid}:${propertyId}`];
  }

  /** Updatable signal accessor for templates (keeps referential stability) */
  isSavedSignal(uid: string, propertyId: string) {
    const key = `${uid}:${propertyId}`;
    // return a derived lookup via getter function
    return () => !!this.cache()[key];
  }

  /** Lazily check Firestore once (no-op if we already know) */
  async ensureLoaded(uid: string, propertyId: string) {
    const key = `${uid}:${propertyId}`;
    if (key in this.cache()) return;
    const ref = doc(this.afs, `admins/${uid}/saved_properties/${propertyId}`);
    const snap = await getDoc(ref);
    this.setKey(key, snap.exists());
  }

  async save(uid: string, payload: SavedDocPayload) {
    const ref = doc(this.afs, `admins/${uid}/saved_properties/${payload.id}`);
    await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
    this.setKey(`${uid}:${payload.id}`, true);
  }

  async unsave(uid: string, propertyId: string) {
    const ref = doc(this.afs, `admins/${uid}/saved_properties/${propertyId}`);
    await deleteDoc(ref);
    this.setKey(`${uid}:${propertyId}`, false);
  }

  async toggle(uid: string, payload: SavedDocPayload) {
    const key = `${uid}:${payload.id}`;
    const known = this.cache()[key];
    if (known === undefined) {
      // If unknown, read once then branch.
      await this.ensureLoaded(uid, payload.id);
    }
    if (this.isSaved(uid, payload.id)) {
      await this.unsave(uid, payload.id);
      return 'unsaved' as const;
    } else {
      await this.save(uid, payload);
      return 'saved' as const;
    }
  }

  private setKey(key: string, value: boolean) {
    const next = { ...this.cache() };
    next[key] = value;
    this.cache.set(next);
  }
}
