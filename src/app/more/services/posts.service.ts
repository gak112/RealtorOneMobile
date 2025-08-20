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
} from '@angular/fire/firestore';

export interface PostPayload {
  // ------- your form fields -------
  title: string;
  houseType:
    | 'Apartment'
    | 'Individual House/Villa'
    | 'Gated Community Villa'
    | '';
  houseCondition: 'Old Houses' | 'New Houses' | null;
  rooms: number | null;
  bhkType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | '+5BHK' | null;
  totalPropertyUnits: 'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre' | null;
  propertySize: number | null;
  propertySizeBuildUp: number | null;
  northFacing: string | null;
  northSize: number | null;
  southFacing: string | null;
  southSize: number | null;
  eastFacing: string | null;
  eastSize: number | null;
  westFacing: string | null;
  westSize: number | null;
  toilets: number | null;
  poojaRoom: number | null;
  livingDining: number | null;
  kitchen: number | null;
  floor: string | null;
  amenities: string[];
  noOfYears: number | null;
  rent: number | null;
  rentUnits: 'Monthly' | 'Yearly' | null;
  costOfProperty: number | null;
  addressOfProperty: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  negotiable: boolean;
  images: string[];
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  createdBy: string;
  updatedBy: string;
  sortDate: number;
  isDeleted: boolean;
  deletedBy: string | null;
  deletedAt: Timestamp | FieldValue | null;
  status: string;
  fullSearchText: string[];

  // ------- extras you add on submit -------
  saleType: 'sale' | 'rent';
  category: 'residential' | 'commercial' | 'plots' | 'lands';

  // timestamps are set in service
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private afs = inject(Firestore);

  private colRef() {
    return collection(this.afs, 'posts');
  }

  async getById(id: string) {
    const snap = await getDoc(doc(this.afs, 'posts', id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }

  async create(payload: PostPayload) {
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

  async update(id: string, patch: Partial<PostPayload>) {
    const now = serverTimestamp();
    await updateDoc(doc(this.afs, 'posts', id), {
      ...patch,
      updatedAt: now,
    });
    return id;
  }

 
}
