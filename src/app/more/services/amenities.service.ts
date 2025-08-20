// src/app/services/amenities.service.ts
import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export type AmenityDoc = { id: string; amenityName: string };

@Injectable({ providedIn: 'root' })
export class AmenitiesService {
  private db = inject(Firestore);

  /** Live stream of amenities ordered by name */
  streamAmenities(): Observable<AmenityDoc[]> {
    const ref = query(collection(this.db, 'amenities'), orderBy('amenityName'));
    return collectionData(ref, { idField: 'id' }) as Observable<AmenityDoc[]>;
  }
}
