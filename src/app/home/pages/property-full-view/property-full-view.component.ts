// src/app/pages/property-full-view/property-full-view.component.ts
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  computed,
} from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonImg,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline,
  chevronBackOutline,
  imagesOutline,
  locationOutline,
} from 'ionicons/icons';
import {
  AmentitycardComponent,
  IAmentity,
} from '../../components/amentitycard/amentitycard.component';
import { HomeAllPhotosComponent } from '../home-all-photos/home-all-photos.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  limit,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PostRequest } from 'src/app/models/request.model'; // your interface

type PropertyVM = {
  id: string;

  // Banner
  saleType: string; // "Sale" / "Rent" (pretty)
  saleTypeKey: 'sale' | 'rent';
  category: string; // "Residential" / "Commercial" etc.
  costOfProperty: string; // "₹1,20,00,000" for sale
  rentPrice: string; // "₹45,000/Monthly" for rent

  // Header / title
  propertyTitle: string;
  location: string; // addressOfProperty or "—"

  // Images
  images: string[];

  // House details
  houseType: string;
  bhkType: string;
  bedrooms: string;
  bathrooms: string;
  poojaRoom: string;
  dining: string;
  kitchen: string;
  floor: string;
  furnishingType: string;

  // Sizes
  totalSize: string; // "4000 Sqft"
  buildUpSize: string; // "1200 Sqft"
  yearBuilt: string; // derived from noOfYears
  houseFacing: string;
  ageOfProperty: string; // "10 Years" / "New" / "Under Construction"

  // ... existing fields ...

  // Units used for sizes (derived from totalPropertyUnits)
  unitsShort: string;

  // Dimensions (split: text + value + unit)
  northFacing: string;
  northSizeValue: string;
  northSizeUnit: string;
  southFacing: string;
  southSizeValue: string;
  southSizeUnit: string;
  eastFacing: string;
  eastSizeValue: string;
  eastSizeUnit: string;
  westFacing: string;
  westSizeValue: string;
  westSizeUnit: string;
  // Footer / misc (if stored)
  agentName: string;
  propertyId: string;
  listingType: string;
  propertyStatus: string;

  // Description / amenities
  description: string;
  amenityNames: string[];
};

@Component({
  selector: 'app-property-full-view',
  templateUrl: './property-full-view.component.html',
  styleUrls: ['./property-full-view.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonImg,
    AmentitycardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyFullViewComponent implements OnInit {
  private modalController = inject(ModalController);
  private route = inject(ActivatedRoute);
  private afs = inject(Firestore);

  constructor() {
    addIcons({
      chevronBackOutline,
      locationOutline,
      callOutline,
      imagesOutline,
    });
  }

  /** ---------------- DATA (Signals) ---------------- */

  // Load :id document; otherwise show the latest by createdAt desc
  private vm$ = this.createVm$();
  readonly vm = toSignal<PropertyVM | null>(this.vm$, { initialValue: null });

  // Helpers for template
  readonly images = computed(() => this.vm()?.images ?? []);
  readonly amenities = computed<IAmentity[]>(() => {
    const names = this.vm()?.amenityNames ?? [];
    return names.map((name, i) => ({
      id: String(i + 1),
      name,
      image: 'assets/img/amenity-placeholder.png',
    }));
  });

  /** ---------------- UI ---------------- */

  dismiss() {
    this.modalController.dismiss();
  }

  async openAllPhotos() {
    const modal = await this.modalController.create({
      component: HomeAllPhotosComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: { images: this.images() },
    });
    return modal.present();
  }

  ngOnInit() {}

  /** ---------------- Internals ---------------- */

  private createVm$(): Observable<PropertyVM | null> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const ref = doc(this.afs, 'posts', id);
      return docData(ref, { idField: 'id' }).pipe(
        map((d) => (d ? this.mapToVM(d as PostRequest & { id: string }) : null))
      );
    }

    // Latest: filter out deleted, order by createdAt desc
    const col = collection(this.afs, 'posts');
    const qLatest = query(
      col,
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    // If you prefer numeric `sortDate`, switch to:
    // const qLatest = query(col, where('isDeleted','==',false), orderBy('sortDate','desc'), limit(1));

    return collectionData(qLatest, { idField: 'id' }).pipe(
      map((rows) =>
        rows?.[0] ? this.mapToVM(rows[0] as PostRequest & { id: string }) : null
      )
    );
  }

  private mapToVM(d: PostRequest & { id: string }): PropertyVM {
    const id = d.id;

    // Banner pieces
    const saleTypeKey = (
      String(d.saleType || 'sale').toLowerCase() === 'rent' ? 'rent' : 'sale'
    ) as 'sale' | 'rent';
    const saleType = capFirst(saleTypeKey); // "Sale"/"Rent"
    const category = capFirst(str(d.category) || 'residential');

    // Price display
    const saleAmount = pickNumber([d.costOfProperty]);
    const rentAmount = pickNumber([d.rentPrice]);
    const costOfProperty = saleAmount > 0 ? `₹${fmt(saleAmount)}` : '₹—';
    const rentPrice =
      rentAmount > 0
        ? `₹${fmt(rentAmount)}${d.rentUnits ? '/' + d.rentUnits : ''}`
        : '₹—';

    // Images
    const images = Array.isArray(d.images) ? d.images.filter(Boolean) : [];

    // Location / Title
    const propertyTitle = str(d.propertyTitle) || '—';
    const location = str(d.addressOfProperty) || '—';

    // House details
    const houseType = str(d.houseType) || '—';
    const bhkType = str(d.bhkType) || '—';
    const bedrooms = str(d.rooms ?? guessBedroomsFromBhk(bhkType)) || '—';
    const bathrooms = numToStr(d.toilets);
    const poojaRoom = numToStr(d.poojaRoom);
    const dining = numToStr(d.livingDining);
    const kitchen = numToStr(d.kitchen);
    const floor = str(d.floor) || '—';
    const furnishingType = str(d.furnishingType) || '—';

    // Sizes & units
    const unitsShortStr = unitShort(str(d.totalPropertyUnits) || 'Sq Feet');
    const totalSize =
      isNum(d.propertySize) && d.propertySize! > 0
        ? `${fmt(Number(d.propertySize))} ${unitsShortStr}`
        : '—';
    const buildUpSize =
      isNum(d.propertySizeBuildUp) && d.propertySizeBuildUp! > 0
        ? `${fmt(Number(d.propertySizeBuildUp))} ${unitsShortStr}`
        : '—';

    // Age
    const ageAction = str(d.ageOfProperty); // "underconstruction" | "noofyears" | etc.
    const ageYears = isNum(d.noOfYears) ? Number(d.noOfYears) : null;
    const ageOfProperty =
      ageAction === 'underconstruction'
        ? 'Under Construction'
        : ageYears !== null
        ? `${ageYears} Years`
        : '—';
    const yearBuilt =
      ageYears !== null ? `${new Date().getFullYear() - ageYears}` : '—';

    // Dimensions — split facing text and size (value + unit) per direction
    const northFacing = str(d.northFacing) || '—';
    const northSizeValue =
      isNum(d.northSize) && d.northSize! > 0 ? fmt(Number(d.northSize)) : '—';
    const northSizeUnit = northSizeValue !== '—' ? unitsShortStr : '';

    const southFacing = str(d.southFacing) || '—';
    const southSizeValue =
      isNum(d.southSize) && d.southSize! > 0 ? fmt(Number(d.southSize)) : '—';
    const southSizeUnit = southSizeValue !== '—' ? unitsShortStr : '';

    const eastFacing = str(d.eastFacing) || '—';
    const eastSizeValue =
      isNum(d.eastSize) && d.eastSize! > 0 ? fmt(Number(d.eastSize)) : '—';
    const eastSizeUnit = eastSizeValue !== '—' ? unitsShortStr : '';

    const westFacing = str(d.westFacing) || '—';
    const westSizeValue =
      isNum(d.westSize) && d.westSize! > 0 ? fmt(Number(d.westSize)) : '—';
    const westSizeUnit = westSizeValue !== '—' ? unitsShortStr : '';

    // Facing summary
    const houseFacing =
      eastFacing !== '—'
        ? eastFacing
        : westFacing !== '—'
        ? westFacing
        : northFacing !== '—'
        ? northFacing
        : southFacing;

    // Footer / misc (if present)
    const agentName = str((d as any).agentName) || '—';
    const propertyId = str((d as any).propertyId) || id;
    const listingType = str((d as any).listingType) || '—';
    const propertyStatus =
      str(d.status ?? (d as any).propertyStatus) || 'Available';

    // Description / amenities
    const description = str(d.description) || '—';
    const amenityNames = Array.isArray(d.amenities)
      ? d.amenities.filter(Boolean)
      : [];

    return {
      id,
      saleType,
      saleTypeKey,
      category,
      costOfProperty,
      rentPrice,

      propertyTitle,
      location,

      images,

      houseType,
      bhkType,
      bedrooms,
      bathrooms,
      poojaRoom,
      dining,
      kitchen,
      floor,
      furnishingType,

      totalSize,
      buildUpSize,
      yearBuilt,
      houseFacing,
      ageOfProperty,

      unitsShort: unitsShortStr,

      northFacing,
      northSizeValue,
      northSizeUnit,
      southFacing,
      southSizeValue,
      southSizeUnit,
      eastFacing,
      eastSizeValue,
      eastSizeUnit,
      westFacing,
      westSizeValue,
      westSizeUnit,

      agentName,
      propertyId,
      listingType,
      propertyStatus,

      description,
      amenityNames,
    };
  }
}

/* ---------------- helpers ---------------- */
function str(v: unknown): string {
  return (v ?? '').toString().trim();
}
function isNum(v: unknown): v is number {
  return Number.isFinite(Number(v));
}
function fmt(n: number): string {
  return Number(n).toLocaleString('en-IN');
}
function capFirst(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function numToStr(n: number | null | undefined): string {
  return isNum(n) ? String(n) : '—';
}
function unitShort(u: string): string {
  switch (u) {
    case 'Sq Feet':
      return 'Sqft';
    case 'Sq Yard':
      return 'Sq Yd';
    case 'Sq Mtr':
      return 'Sq m';
    case 'Feet':
      return 'Ft';
    case 'Yard':
      return 'Yd';
    case 'Mtr':
      return 'm';
    case 'Acre':
      return 'Acre';
    default:
      return u || 'Sqft';
  }
}
function guessBedroomsFromBhk(bhk: string): number | '' {
  const m = /(\d+)/.exec(bhk || '');
  return m ? Number(m[1]) : '';
}
function pickNumber(vals: Array<unknown>): number {
  for (const v of vals) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}
