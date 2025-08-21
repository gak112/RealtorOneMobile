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

import { PostentryComponent } from '../postentry/postentry.component';
import { PostRequestForm } from 'src/app/models/request.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

type PropertyVM = {
  id: string;

  // Banner
  saleType: string; // "Sale" | "Rent"
  saleTypeKey: 'sale' | 'rent';
  category: string;
  priceOfSale: number;
  priceOfRent: number;
  priceOfRentType: string;

  // Header / title
  propertyTitle: string;
  addressOfProperty: string;

  // Images (URLs)
  images: string[];

  // House details
  houseType: string;
  bhkType: string;
  poojaRoom: string;
  dining: string;
  kitchen: string;
  floor: string;
  furnishingType: string;

  // Sizes (numbers and units kept separate)
  propertySize: string; // e.g. "4,000" or "—"
  totalPropertyUnits: string; // e.g. "Sqft"
  propertySizeBuiltup: string; // e.g. "1,200" or "—"
  sizeBuiltupUnits: string; // e.g. "Sqft"
  ageOfProperty: string;

  // Facing
  facingUnits: string; // e.g. "Ft", "Sqft"
  northFacing: string;
  northSizeValue: string;
  southFacing: string;
  southSizeValue: string;
  eastFacing: string;
  eastSizeValue: string;
  westFacing: string;
  westSizeValue: string;

  // Footer
  agentName: string;
  propertyId: string;
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
    IonLabel,
    IonButton,
    AmentitycardComponent,
    DecimalPipe,
    CurrencyPipe,
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
      createOutline,
    });
  }

  /** ---------------- DATA (Signals) ---------------- */

  // Live VM: if :id route provided use that doc; else fetch latest by createdAt desc (isDeleted == false)
  private vm$ = this.createVm$();
  readonly vm = toSignal<PropertyVM | null>(this.vm$, { initialValue: null });

  // Images with fallback
  readonly images = computed(() => {
    const list = this.vm()?.images ?? [];
    return list.length ? list : ['assets/img/no-image.png'];
  });

  // Amenities mapped to component model
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

  /** Open PostEntry editor prefilled for this doc */
  async openEdit() {
    const data = this.vm();
    if (!data) return;

    const modal = await this.modalController.create({
      component: PostentryComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: {
        editId: data.id,
        saleType: data.saleTypeKey,
        category: data.category.toLowerCase(),
      },
    });
    await modal.present();
    await modal.onWillDismiss();
  }

  ngOnInit() {}

  /** ---------------- Internals ---------------- */

  private createVm$(): Observable<PropertyVM | null> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const ref = doc(this.afs, 'posts', id);
      return docData(ref, { idField: 'id' }).pipe(
        map((d) =>
          d ? this.mapToVM(d as PostRequestForm & { id: string }) : null
        )
      );
    }

    // Fallback: latest non-deleted by createdAt desc
    const col = collection(this.afs, 'posts');
    const qLatest = query(
      col,
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    return collectionData(qLatest, { idField: 'id' }).pipe(
      map((rows) =>
        rows?.[0]
          ? this.mapToVM(rows[0] as PostRequestForm & { id: string })
          : null
      )
    );
  }

  private mapToVM(d: PostRequestForm & { id: string }): PropertyVM {
    const id = d.id;

    // Banner
    const saleTypeKey = (
      String(d.saleType || 'sale')
        .trim()
        .toLowerCase() === 'rent'
        ? 'rent'
        : 'sale'
    ) as 'sale' | 'rent';
    const saleType = capFirst(saleTypeKey);
    const category = capFirst(str(d.category) || 'residential');

    // Prices
    const priceOfSale = pickNumber([d.priceOfSale]);
    const priceOfRent = pickNumber([d.priceOfRent]);

    // Images
    const images = Array.isArray(d.images) ? d.images.filter(Boolean) : [];

    // Header
    const propertyTitle = str(d.propertyTitle) || '—';
    const addressOfProperty = str(d.addressOfProperty) || '—';

    // House details
    const houseType = str(d.houseType) || '—';
    const bhkType = str(d.bhkType) || '—';
    const poojaRoom = numToStr(d.poojaRoom);
    const dining = numToStr(d.livingDining);
    const kitchen = numToStr(d.kitchen);
    const floor = str(d.floor) || '—';
    const furnishingType = str(d.furnishingType) || '—';

    // ---- Units & Sizes (normalize both field spellings) ----
    const totalPropertyUnits = unitShort(
      str(d.totalPropertyUnits || 'Sq Feet')
    );
    const sizeBuiltupUnits = unitShort(
      str((d as any).sizeBuiltupUnits || d.totalPropertyUnits || 'Sq Feet')
    );

    const propertySizeVal = pickNumber([d.propertySize]);
    const propertySize = propertySizeVal > 0 ? fmt(propertySizeVal) : '—';

    // Accept both propertySizeBuildUp (camel U) and propertySizeBuiltup (lowercase u)
    const builtUpRaw =
      (d as any).propertySizeBuildUp ?? (d as any).propertySizeBuiltup;
    const propertySizeBuiltupVal = pickNumber([builtUpRaw]);
    const propertySizeBuiltup =
      propertySizeBuiltupVal > 0 ? fmt(propertySizeBuiltupVal) : '—';

    // Age
    const rawAge = str(d.ageOfProperty);
    const ageYears = isNum(d.ageOfProperty) ? Number(d.ageOfProperty) : null;
    const ageOfProperty =
      rawAge.toLowerCase() === 'underconstruction'
        ? 'Under Construction'
        : ageYears !== null
        ? `${ageYears} Years`
        : rawAge || '—';

    // Facing (shared units)
    const facingUnits = unitShort(str((d as any).facingUnits || 'Feet'));

    const northFacing = str(d.northFacing) || '—';
    const northSizeValue =
      isNum(d.northSize) && d.northSize! > 0 ? fmt(Number(d.northSize)) : '—';

    const southFacing = str(d.southFacing) || '—';
    const southSizeValue =
      isNum(d.southSize) && d.southSize! > 0 ? fmt(Number(d.southSize)) : '—';

    const eastFacing = str(d.eastFacing) || '—';
    const eastSizeValue =
      isNum(d.eastSize) && d.eastSize! > 0 ? fmt(Number(d.eastSize)) : '—';

    const westFacing = str(d.westFacing) || '—';
    const westSizeValue =
      isNum(d.westSize) && d.westSize! > 0 ? fmt(Number(d.westSize)) : '—';

    // Footer / misc
    const agentName = str((d as any).agentName) || '—';
    const propertyId = str((d as any).propertyId) || id;
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
      priceOfSale: Number(priceOfSale),
      priceOfRent: Number(priceOfRent),
      priceOfRentType: String(d.priceOfRentType ?? '—'),

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

      propertySize, // number string only
      totalPropertyUnits, // unit short
      propertySizeBuiltup, // number string only
      sizeBuiltupUnits, // unit short
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
function pickNumber(vals: Array<unknown>): number {
  for (const v of vals) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}
