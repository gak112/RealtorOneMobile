// src/app/services/saved.service.ts
import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/** Payload your UI/components pass in */
export type SavedDocPayload = {
  id: string;
  propertyTitle: string;
  addressOfProperty: string;
  saleType: 'sale' | 'rent';
  category: 'residential' | 'commercial' | 'plots' | 'agriculturalLands';
  priceOfSale: number;
  priceOfRent: number;
  priceOfRentType?: string;
  houseType: string;
  bhkType: string;
  PlotArea: number | string;
  availabilityStatus: string;
  agentName: string;
  propertyId: string;
  floor?: string;
  commercialType?: string;
  propertyImages: { id: string; image: string }[];
  furnishingType?: string;
  houseFacingType?: string;
};

/** Flat collection document stored in Firestore */
export type SavedDocStored = SavedDocPayload & {
  uid: string; // reference to user who saved
  key: string; // `${uid}__${propertyId}` deterministic doc id
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
};

@Injectable({ providedIn: 'root' })
export class SavedService {
  private afs = inject(Firestore);

  /** cache of “is saved?” reactive flags keyed by `${uid}:${propertyId}` */
  private cache = new Map<string, WritableSignal<boolean>>();
  /** unsubscribe fns for live listeners (one per `${uid}:${propertyId}`) */
  private unsub = new Map<string, () => void>();

  /** ---- utils ---- */
  private assertUid(uid: string) {
    if (!uid) throw new Error('Missing user id.');
  }
  private assertPid(id: string) {
    if (!id) throw new Error('Missing property id.');
  }
  private key(uid: string, propertyId: string) {
    return `${uid}__${propertyId}`;
  }
  private docRef(
    uid: string,
    propertyId: string
  ): DocumentReference<DocumentData> {
    return doc(this.afs, `saved_properties/${this.key(uid, propertyId)}`);
  }
  private flag(uid: string, propertyId: string): WritableSignal<boolean> {
    const k = `${uid}:${propertyId}`;
    if (!this.cache.has(k)) this.cache.set(k, signal(false));
    return this.cache.get(k)!;
  }

  /** Reactive boolean for templates */
  isSavedSignal(uid: string, propertyId: string) {
    return () => this.flag(uid, propertyId)();
  }

  /** Begin a live listener for a specific (uid, propertyId) */
  async ensureLoaded(uid: string, propertyId: string): Promise<void> {
    this.assertUid(uid);
    this.assertPid(propertyId);
    const k = `${uid}:${propertyId}`;
    if (this.unsub.has(k)) return; // already listening

    const s = this.flag(uid, propertyId);
    const stop = onSnapshot(
      this.docRef(uid, propertyId),
      (snap) => s.set(snap.exists()),
      (err) => {
        console.error('[SavedService] listener error', err);
        s.set(false);
      }
    );
    this.unsub.set(k, stop);
  }

  /** One-shot check (non-reactive) */
  async isSaved(uid: string, propertyId: string): Promise<boolean> {
    this.assertUid(uid);
    this.assertPid(propertyId);
    const snap = await getDoc(this.docRef(uid, propertyId));
    return snap.exists();
  }

  /** Stream all saved docs for a given user (flat collection) */
  list$(uid: string): Observable<SavedDocStored[]> {
    this.assertUid(uid);
    const col = collection(this.afs, 'saved_properties');
    const qRef = query(
      col,
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );
    return collectionData(qRef, { idField: 'key' }) as unknown as Observable<
      SavedDocStored[]
    >;
  }

  /** Normalize images array */
  private normalizeImages(
    pid: string,
    imgs: { id?: string; image?: string }[] | undefined
  ) {
    if (!Array.isArray(imgs)) return [];
    return imgs
      .filter((x) => x && typeof x.image === 'string' && x.image)
      .map((x, i) => ({
        id: String(x.id ?? `${pid}-${i}`),
        image: String(x.image),
      }));
  }

  /** Create/update a saved item (flat collection). Preserves createdAt on updates. */
  async save(uid: string, payload: SavedDocPayload): Promise<void> {
    this.assertUid(uid);
    if (!payload?.id) throw new Error('Missing property id.');

    const ref = this.docRef(uid, payload.id);
    const snap = await getDoc(ref);

    const base: SavedDocStored = {
      ...payload,
      uid,
      key: this.key(uid, payload.id),
      propertyImages: this.normalizeImages(payload.id, payload.propertyImages),
      updatedAt: serverTimestamp(),
      ...(snap.exists() ? {} : { createdAt: serverTimestamp() }),
    };

    await setDoc(ref, base, { merge: true });

    // optimistic local flag
    this.flag(uid, payload.id).set(true);
  }

  /** Alias */
  add(uid: string, payload: SavedDocPayload): Promise<void> {
    return this.save(uid, payload);
  }

  /** Remove a saved item */
  async unsave(uid: string, propertyId: string): Promise<void> {
    this.assertUid(uid);
    this.assertPid(propertyId);
    await deleteDoc(this.docRef(uid, propertyId));
    this.flag(uid, propertyId).set(false);
  }

  /** Alias */
  remove(uid: string, propertyId: string): Promise<void> {
    return this.unsave(uid, propertyId);
  }

  /** Toggle save/unsave (returns action performed) */
  async toggle(
    uid: string,
    payload: SavedDocPayload
  ): Promise<'saved' | 'unsaved'> {
    this.assertUid(uid);
    if (!payload?.id) throw new Error('Missing property id.');

    const ref = this.docRef(uid, payload.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
      this.flag(uid, payload.id).set(false);
      return 'unsaved';
    }

    await this.save(uid, payload);
    this.flag(uid, payload.id).set(true);
    return 'saved';
  }

  /** Cleanup all listeners (e.g., on logout) */
  stopAll() {
    for (const stop of this.unsub.values()) {
      try {
        stop();
      } catch {}
    }
    this.unsub.clear();
  }

  /** Stop one listener */
  stop(uid: string, propertyId: string) {
    const k = `${uid}:${propertyId}`;
    const stop = this.unsub.get(k);
    if (stop) {
      try {
        stop();
      } catch {}
      this.unsub.delete(k);
    }
  }
}
