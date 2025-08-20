import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { serverTimestamp, addDoc, collection, Firestore } from '@angular/fire/firestore';

export type SaleType = 'sale' | 'rent';
export type Category = 'residential' | 'commercial' | 'plots' | 'lands';

export type Amenity = { id: string; name: string; createdAt: number };
export type Post = {
  id: string;
  saleType: SaleType;
  category: Category;

  title: string;
  houseType: 'Apartment' | 'Individual House/Villa' | 'Gated Community Villa' | '' | null;
  houseCondition: 'Old Houses' | 'New Houses' | null;
  rooms: number | null;
  bhkType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | '+5BHK' | null;

  totalPropertyUnits: 'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre' | null;
  propertySize: number | null;
  propertySizeBuildUp: number | null;

  northFacing: string | null; northSize: number | null;
  southFacing: string | null; southSize: number | null;
  eastFacing: string | null;  eastSize: number | null;
  westFacing: string | null;  westSize: number | null;

  toilets: number | null;
  poojaRoom: number | null;
  livingDining: number | null;
  kitchen: number | null;
  floor: string | null;

  amenities: string[]; // amenity names
  ageAction: 'underconstruction' | 'noofyears';
  noOfYears: number | null;

  rent: number | null;
  rentUnits: 'Monthly' | 'Yearly' | null;

  costOfProperty: number | null;

  addressOfProperty: string | null;
  lat: number | null; lng: number | null;

  description: string | null;
  negotiable: boolean;

  images: string[];

  createdAt: number;
  updatedAt: number;
};

const LS_POSTS = 'db_posts_v1';
const LS_AMENITIES = 'db_amenities_v1';

@Injectable({ providedIn: 'root' })
export class RequestFormService {
  private posts = signal<Post[]>([]);
  private amenities = signal<Amenity[]>([]);

  constructor() {
    // load
    try {
      const p = JSON.parse(localStorage.getItem(LS_POSTS) || '[]');
      const a = JSON.parse(localStorage.getItem(LS_AMENITIES) || '[]');
      this.posts.set(Array.isArray(p) ? p : []);
      this.amenities.set(Array.isArray(a) ? a : []);
    } catch {
      this.posts.set([]); this.amenities.set([]);
    }
    // persist
    effect(() => localStorage.setItem(LS_POSTS, JSON.stringify(this.posts())));
    effect(() => localStorage.setItem(LS_AMENITIES, JSON.stringify(this.amenities())));
  }

  // ---------- Amenities ----------
  amenitiesSignal = this.amenities.asReadonly();
  addAmenity(name: string) {
    const exists = this.amenities().some(a => a.name.toLowerCase() === name.toLowerCase());
    if (exists) return;
    const item: Amenity = { id: crypto.randomUUID(), name, createdAt: Date.now() };
    this.amenities.update(arr => [item, ...arr]);
  }

  // ---------- Posts ----------
  postsSignal = this.posts.asReadonly();
  getPost(id: string) {
    return this.posts().find(p => p.id === id) || null;
  }

  addPost(data: Omit<Post, 'id'|'createdAt'|'updatedAt'>) {
    const now = Date.now();
    const item: Post = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, ...data };
    this.posts.update(arr => [item, ...arr]);
    return item.id;
  }

  private firestore = inject(Firestore);

  private colRef() {
    return collection(this.firestore, 'posts'); // "table" = Firestore collection
  }

  async create2(payload: any) {
    const now = serverTimestamp();
    const ref = await addDoc(this.colRef(), {
      ...payload,
      createdAt: now,
      updatedAt: now,
    });
    return ref.id; // new document id
  }

  updatePost(id: string, patch: Partial<Post>) {
    const now = Date.now();
    this.posts.update(arr => arr.map(p => p.id === id ? { ...p, ...patch, updatedAt: now } : p));
  }

  deletePost(id: string) {
    this.posts.update(arr => arr.filter(p => p.id !== id));
  }
}
