import { Component, inject, OnInit, signal, computed } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonSearchbar,
  IonSpinner,
  ModalController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

import {
  Firestore,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';

import { MyPropertyCardComponent } from '../../components/my-property-card/my-property-card.component';
import { IPropertyImage } from 'src/app/models/property.model';

type PostDoc = {
  id: string;
  images?: string[];
  propertyTitle?: string;
  saleType?: string;
  category?: string;
  addressOfProperty?: string;
  houseType?: string;
  houseFacingType?: string;
  bhkType?: string;
  PlotArea?: number | string;
  agentName?: string;
  propertyId?: string;
  priceOfSale?: number;
  priceOfRent?: number;
  priceOfRentType?: string;
  commercialType?: string;
  floor?: string;
  houseCondition?: string;
  rooms?: number;
  furnishingType?: string;
  commercialSubType?: string;
  securityDeposit?: number;
  builtUpArea?: number;
  builtUpAreaUnits?: string;
  northFacing?: string;
  northSize?: number;
  southFacing?: string;
  southSize?: number;
  eastFacing?: string;
  eastSize?: number;
  westFacing?: string;
  westSize?: number;
  toilets?: number;
  poojaRoom?: number;
  livingDining?: number;
  kitchen?: number;
  amenities?: string[];
  ageOfProperty?: string;
  negotiable?: boolean;
  videoResources?: string[];
  createdBy?: string;
  updatedBy?: string;
  sortDate?: number;
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: any;
  fullSearchText?: string[];
  plotAreaUnits?: string;
  facingUnits?: string;
  availabilityStatus?: string;
  lat?: number;
  lng?: number;
  description?: string;

  createdAt?: any;
  updatedAt?: any;
};

@Component({
  selector: 'app-myrequests',
  standalone: true,
  templateUrl: './myrequests.component.html',
  styleUrls: ['./myrequests.component.scss'],
  imports: [
    CommonModule,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    IonSpinner,
    MyPropertyCardComponent,
  ],
})
export class MyrequestsComponent implements OnInit {
  private readonly modalController = inject(ModalController);
  private readonly afs = inject(Firestore);

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {}

  dismiss() {
    this.modalController.dismiss();
  }

  /** UI state */
  readonly searchQuery = signal<string>('');
  readonly errorMsg = signal<string | null>(null);

  /** Base Firestore query (latest first; cap at 200 for fast client filtering) */
  private readonly postsCol = collection(this.afs, 'posts');
  private readonly baseQuery = query(
    this.postsCol,
    orderBy('createdAt', 'desc'),
    limit(200)
  );

  /** Firestore stream with error handling + initial empty list to avoid flicker */
  private readonly allRows = toSignal<PostDoc[]>(
    collectionData(this.baseQuery, { idField: 'id' }).pipe(
      map((rows) => rows as PostDoc[]),
      startWith([] as PostDoc[]),
      catchError((err) => {
        console.error('[Myrequests] Firestore error:', err);
        this.errorMsg.set('Failed to load properties. Please try again.');
        return of([] as PostDoc[]);
      })
    )
  );

  /** Map Firestore docs → card-friendly objects */
  readonly properties = computed(() => this.allRows().map(this.toProperty));

  /** Loading while we still have nothing and no error */
  readonly loading = computed(
    () => this.errorMsg() == null && this.properties().length === 0
  );

  /** Client-side filtered list (fast + robust) */
  readonly filtered = computed(() => {
    const q = normalize(this.searchQuery());
    if (!q) return this.properties();

    const tokens = q.split(/\s+/).filter(Boolean);
    const fields = (p: any) =>
      [
        p.propertyTitle,
        p.addressOfProperty,
        p.agentName,
        p.category,
        p.saleType,
        p.houseType,
        p.commercialType,
        p.bhkType,
        p.propertyId,
      ]
        .join(' ')
        .toLowerCase();

    return this.properties().filter((p) => {
      const hay = fields(p);
      return tokens.every((t) => hay.includes(t));
    });
  });

  onSearch(ev: CustomEvent) {
    const val = String((ev as any)?.detail?.value ?? '');
    this.searchQuery.set(val);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  /** Safe mapper: PostDoc -> object your card expects */
  private toProperty = (d: PostDoc): any => {
    const id = d.id;

    // images → [{id, image}]
    const imgs: string[] = Array.isArray(d.images)
      ? d.images.filter(Boolean)
      : [];
    const propertyImages: IPropertyImage[] = imgs.map((url, i) => ({
      id: `${id}-${i}`,
      image: url,
    }));

    return {
      id,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,

      propertyTitle: String(d.propertyTitle ?? '—'),
      addressOfProperty: String(d.addressOfProperty ?? '—'),

      saleType: (d.saleType as any) ?? 'sale', // 'sale' | 'rent'
      category: (d.category as any) ?? 'residential', // 'residential' | 'commercial' | 'plots' | 'agriculturalLands'

      priceOfSale: Number(d.priceOfSale ?? 0),
      priceOfRent: Number(d.priceOfRent ?? 0),
      priceOfRentType: String(d.priceOfRentType ?? 'Monthly'),

      houseType: String(d.houseType ?? '—'),
      houseFacingType: String(d.houseFacingType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      PlotArea: Number(d.PlotArea ?? 0),

      propertyImages,
      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? id),

      commercialType: String(d.commercialType ?? '—'),
      floor: String(d.floor ?? '—'),
      houseCondition: String(d.houseCondition ?? '—'),
      rooms: Number(d.rooms ?? 0),
      furnishingType: String(d.furnishingType ?? '—'),
      commercialSubType: String(d.commercialSubType ?? '—'),

      securityDeposit: Number(d.securityDeposit ?? 0),
      builtUpArea: Number(d.builtUpArea ?? 0),
      builtUpAreaUnits: String(d.builtUpAreaUnits ?? '—'),

      northFacing: String(d.northFacing ?? '—'),
      northSize: Number(d.northSize ?? 0),
      southFacing: String(d.southFacing ?? '—'),
      southSize: Number(d.southSize ?? 0),
      eastFacing: String(d.eastFacing ?? '—'),
      eastSize: Number(d.eastSize ?? 0),
      westFacing: String(d.westFacing ?? '—'),
      westSize: Number(d.westSize ?? 0),

      toilets: Number(d.toilets ?? 0),
      poojaRoom: Number(d.poojaRoom ?? 0),
      livingDining: Number(d.livingDining ?? 0),
      kitchen: Number(d.kitchen ?? 0),

      amenities: Array.isArray(d.amenities) ? d.amenities : [],

      ageOfProperty: String(d.ageOfProperty ?? '—'),
      negotiable: Boolean(d.negotiable ?? false),

      images: imgs.map((url, i) => ({ id: `${id}-${i}`, image: url })), // (if card uses .images)
      videoResources: Array.isArray(d.videoResources)
        ? d.videoResources.map((url, i) => ({ id: `${id}-${i}`, video: url }))
        : [],

      createdBy: String(d.createdBy ?? '—'),
      updatedBy: String(d.updatedBy ?? '—'),
      sortDate: Number(d.sortDate ?? 0),
      isDeleted: Boolean(d.isDeleted ?? false),
      deletedBy: String(d.deletedBy ?? '—'),
      deletedAt: d.deletedAt,

      fullSearchText: Array.isArray(d.fullSearchText) ? d.fullSearchText : [],
      plotAreaUnits: String(d.plotAreaUnits ?? '—'),
      facingUnits: String(d.facingUnits ?? '—'),
      lat: Number(d.lat ?? 0),
      lng: Number(d.lng ?? 0),
      description: String(d.description ?? '—'),
      availabilityStatus: String(d.availabilityStatus ?? '-'),
    };
  };
}

/** Lowercase + trim + collapse spaces (good enough for client filtering) */
function normalize(s: string): string {
  return (s || '').toLowerCase().normalize('NFKD').replace(/\s+/g, ' ').trim();
}
