import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonImg,
  IonLabel,
  IonButton,
  ModalController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  callOutline,
  chevronBackOutline,
  imagesOutline,
  locationOutline,
  createOutline,
} from 'ionicons/icons';

import { DecimalPipe } from '@angular/common';
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

import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  AmentitycardComponent,
  IAmentity,
} from '../../components/amentitycard/amentitycard.component';
import { HomeAllPhotosComponent } from '../home-all-photos/home-all-photos.component';
import { PostentryComponent } from '../postentry/postentry.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

/** --- DB Shape (postentry) --- */
export type PostDoc = {
  id: string;
  saleType?: 'sale' | 'rent' | string;
  category?: string;

  priceOfSale?: number | string;
  priceOfRent?: number | string;
  priceOfRentType?: string;

  propertyTitle?: string;
  addressOfProperty?: string;

  images?: string[];

  houseType?: string;
  bhkType?: string;
  poojaRoom?: number | string;
  livingDining?: number | string; // some docs may call this "dining"
  dining?: number | string; // normalize below
  kitchen?: number | string;
  floor?: string;
  furnishingType?: string;

  propertySize?: number | string;
  totalPropertyUnits?: string;

  /** Some projects saved either `propertySizeBuiltUp` or `propertySizeBuiltup` */
  propertySizeBuiltup?: number | string;
  sizeBuiltupUnits?: string;

  /** Age variants across datasets */
  ageOfProperty?: string | number;
  propertyAge?: string | number;
  age?: string | number;

  facingUnits?: string;
  northFacing?: string;
  northSize?: number | string;
  eastFacing?: string;
  eastSize?: number | string;
  southFacing?: string;
  southSize?: number | string;
  westFacing?: string;
  westSize?: number | string;

  agentName?: string;
  propertyId?: string;
  status?: string;
  propertyStatus?: string;

  description?: string;
  amenities?: string[];

  isDeleted?: boolean;
  createdAt?: any; // Firestore Timestamp
};

type PropertyVM = {
  id: string;
  saleType: string;
  saleTypeKey: 'sale' | 'rent';
  category: string;

  priceOfSale: number;
  priceOfRent: number;
  priceOfRentType: string;

  propertyTitle: string;
  addressOfProperty: string;
  images: string[];

  houseType: string;
  bhkType: string;
  poojaRoom: string;
  dining: string;
  kitchen: string;
  floor: string;
  furnishingType: string;

  propertySize: string;
  totalPropertyUnits: string;

  propertySizeBuiltup: string;
  sizeBuiltupUnits: string;

  ageOfProperty: string; // normalized human string

  facingUnits: string;
  northFacing: string;
  northSizeValue: string;
  southFacing: string;
  southSizeValue: string;
  eastFacing: string;
  eastSizeValue: string;
  westFacing: string;
  westSizeValue: string;

  agentName: string;
  propertyId: string;
  propertyStatus: string;

  description: string;
  amenityNames: string[];
};

@Component({
  selector: 'app-property-full-view',
  standalone: true,
  templateUrl: './property-full-view.component.html',
  styleUrls: ['./property-full-view.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonImg,
    IonLabel,
    IonButton,
    AmentitycardComponent,
    DecimalPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyFullViewComponent {
  private modalController = inject(ModalController);
  private route = inject(ActivatedRoute);
  private afs = inject(Firestore);

  /** Accept input from parent (either name) */
  property = input<PostDoc | null>(null);
  propertyIn = input<PostDoc | null>(null);

  constructor() {
    addIcons({
      chevronBackOutline,
      locationOutline,
      callOutline,
      imagesOutline,
      createOutline,
    });
  }

  /** VM source: input → route id → latest by createdAt (desc) */
  private vm$ = this.buildVm$();
  readonly vm = toSignal<PropertyVM | null>(this.vm$, { initialValue: null });

  /** UI computed helpers */
  readonly images = computed(() => {
    const imgs = this.vm()?.images ?? [];
    return imgs.length ? imgs : ['assets/img/no-image.png'];
  });

  readonly amenities = computed<IAmentity[]>(() => {
    const names = this.vm()?.amenityNames ?? [];
    return names.map((name, i) => ({
      id: String(i + 1),
      name,
      image: 'assets/img/amenity-placeholder.png',
    }));
  });

  dismiss() {
    this.modalController.dismiss();
  }

  async openAllPhotos() {
    const m = await this.modalController.create({
      component: HomeAllPhotosComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: { images: this.images() },
    });
    await m.present();
  }

  async openEdit() {
    const data = this.vm();
    if (!data) return;
    const m = await this.modalController.create({
      component: PostentryComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: {
        editId: data.id,
        saleType: data.saleTypeKey,
        category: data.category.toLowerCase(),
      },
    });
    await m.present();
    await m.onWillDismiss(); // docData keeps VM fresh
  }

  /** ---------------- VM Builder ---------------- */
  private buildVm$(): Observable<PropertyVM | null> {
    const preferInputSig = computed<PostDoc | null>(
      () => this.property() ?? this.propertyIn()
    );
    const preferInput$ = toObservable(preferInputSig);
    const routeId$ = this.route.paramMap.pipe(map((pm) => pm.get('id')));

    // Latest from "postentry" ordered by createdAt desc
    const latest$ = (() => {
      const colRef = collection(this.afs, 'postentry');
      const qLatest = query(
        colRef,
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      return collectionData(qLatest, { idField: 'id' }).pipe(
        map((rows) => (rows?.[0] ? this.mapToVM(rows[0] as PostDoc) : null))
      );
    })();

    return combineLatest([preferInput$, routeId$]).pipe(
      switchMap(([docFromParent, rid]) => {
        if (docFromParent) return of(this.mapToVM(docFromParent));
        if (rid) {
          const ref = doc(this.afs, 'postentry', rid);
          return docData(ref, { idField: 'id' }).pipe(
            map((d) => (d ? this.mapToVM(d as PostDoc) : null))
          );
        }
        return latest$;
      })
    );
  }

  /** ---------------- Mapping & Normalization ---------------- */
  private mapToVM(d: PostDoc): PropertyVM {
    const id = d.id;

    // sale type
    const saleTypeKey = (
      str(d.saleType).toLowerCase() === 'rent' ? 'rent' : 'sale'
    ) as 'sale' | 'rent';
    const saleType = capFirst(saleTypeKey);

    // category
    const category = capFirst(str(d.category) || 'Residential');

    // prices
    const priceOfSale = num([d.priceOfSale]);
    const priceOfRent = num([d.priceOfRent]);
    const priceOfRentType = nonEmpty([d.priceOfRentType], '—');

    // core text
    const propertyTitle = nonEmpty([d.propertyTitle], '—');
    const addressOfProperty = nonEmpty([d.addressOfProperty], '—');

    // images
    const images = Array.isArray(d.images) ? d.images.filter(Boolean) : [];

    // house basics
    const houseType = nonEmpty([d.houseType], '—');
    const bhkType = nonEmpty([d.bhkType], '—');
    const poojaRoom = toDisplayCount(d.poojaRoom);
    const dining = toDisplayCount(d.dining ?? d.livingDining);
    const kitchen = toDisplayCount(d.kitchen);
    const floor = nonEmpty([d.floor], '—');
    const furnishingType = nonEmpty([d.furnishingType], '—');

    // sizes
    const totalPropertyUnits = unitShort(
      nonEmpty([d.totalPropertyUnits], 'Sqft')
    );
    const sizeBuiltupUnits = unitShort(nonEmpty([d.sizeBuiltupUnits], 'Sqft'));

    const propertySizeVal = num([d.propertySize]);
    const propertySize = propertySizeVal > 0 ? fmtIN(propertySizeVal) : '—';

    // support both propertySizeBuiltUp & propertySizeBuiltup
    const builtupRaw = pickFirstDefined(d.propertySizeBuiltup);
    const propertySizeBuiltupVal = num([builtupRaw]);
    const propertySizeBuiltup =
      propertySizeBuiltupVal > 0 ? fmtIN(propertySizeBuiltupVal) : '—';

    // age normalization (ageOfProperty / propertyAge / age)
    const ageRaw = pickFirstDefined(d.ageOfProperty, d.propertyAge, d.age);
    const ageOfProperty = ageToDisplay(ageRaw) ?? '—';

    // facing
    const facingUnits = unitShort(nonEmpty([d.facingUnits], 'Ft'));

    const northFacing = nonEmpty([d.northFacing], '—');
    const northSizeValue = sizeToDisplay(d.northSize, facingUnits);

    const southFacing = nonEmpty([d.southFacing], '—');
    const southSizeValue = sizeToDisplay(d.southSize, facingUnits);

    const eastFacing = nonEmpty([d.eastFacing], '—');
    const eastSizeValue = sizeToDisplay(d.eastSize, facingUnits);

    const westFacing = nonEmpty([d.westFacing], '—');
    const westSizeValue = sizeToDisplay(d.westSize, facingUnits);

    // meta
    const agentName = nonEmpty([d.agentName], '—');
    const propertyId = nonEmpty([d.propertyId], id);
    const propertyStatus = nonEmpty([d.status, d.propertyStatus], 'Available');

    const description = nonEmpty([d.description], '—');
    const amenityNames = Array.isArray(d.amenities)
      ? d.amenities.filter(Boolean)
      : [];

    return {
      id,
      saleType,
      saleTypeKey,
      category,
      priceOfSale,
      priceOfRent,
      priceOfRentType,
      propertyTitle,
      addressOfProperty,
      images,
      houseType,
      bhkType,
      poojaRoom,
      dining,
      kitchen,
      floor,
      furnishingType,
      propertySize,
      totalPropertyUnits,
      propertySizeBuiltup,
      sizeBuiltupUnits,
      ageOfProperty,
      facingUnits,
      northFacing,
      northSizeValue,
      southFacing,
      southSizeValue,
      eastFacing,
      eastSizeValue,
      westFacing,
      westSizeValue,
      agentName,
      propertyId,
      propertyStatus,
      description,
      amenityNames,
    };
  }
}

/* ---------------- helpers ---------------- */
function pickFirstDefined<T>(...vals: (T | null | undefined)[]): T | undefined {
  for (const v of vals)
    if (v !== undefined && v !== null && String(v) !== '') return v;
  return undefined;
}
function str(v: unknown): string {
  return (v ?? '').toString().trim();
}
function nonEmpty(candidates: Array<unknown>, fallback = '—'): string {
  for (const v of candidates) {
    const s = str(v);
    if (s) return s;
  }
  return fallback;
}
function isFiniteNum(v: unknown): boolean {
  const n = Number(v);
  return Number.isFinite(n);
}
function num(candidates: Array<unknown>): number {
  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}
function fmtIN(n: number): string {
  return Number(n).toLocaleString('en-IN');
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
    default:
      return u || 'Sqft';
  }
}
function toDisplayCount(v: unknown): string {
  if (isFiniteNum(v)) {
    const n = Number(v);
    return n > 0 ? String(n) : '—';
  }
  const s = str(v);
  return s || '—';
}
function sizeToDisplay(v: unknown, units: string): string {
  if (isFiniteNum(v)) {
    const n = Number(v);
    return n > 0 ? `${fmtIN(n)} ${units}` : '—';
  }
  return '—';
}
function ageToDisplay(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = str(v);
  if (!s) return null;
  // if numeric, show in "X years" style when sensible
  if (isFiniteNum(s)) {
    const n = Number(s);
    if (n <= 0) return '—';
    if (n === 1) return '1 year';
    return `${n} years`;
  }
  return s; // already a nice string like "0-1 year", "New", "5-10 years"
}
function capFirst(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
