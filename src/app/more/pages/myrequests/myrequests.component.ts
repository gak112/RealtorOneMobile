import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  computed,
  effect,
  signal,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  ModalController,
  IonSpinner,
  IonSearchbar,
} from '@ionic/angular/standalone';
import {
  Firestore,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PostsService } from 'src/app/more/services/posts.service';
import {
  MyPropertyCardComponent,
  IProperty,
  IPropertyImage,
} from '../../components/my-property-card/my-property-card.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

type PostPayload = any; // your PostRequest-like shape

@Component({
  selector: 'app-myrequests',
  templateUrl: './myrequests.component.html',
  styleUrls: ['./myrequests.component.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    MyPropertyCardComponent,
  ],
})
export class MyrequestsComponent implements OnInit {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ chevronBackOutline });
  }

  @Input() user: any | null = null;

  ngOnInit(): void {
    return;
    // this.afs.collection(`requests`,
    // ref => ref.where('uid', '==', this.user.uid)).valueChanges({idField: 'id'}).subscribe((data: any) => {
    //   this.properties = data;
    // });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  readonly searchQuery = signal('');

  onSearch(ev: CustomEvent) {
    const val = ((ev.detail as any)?.value ?? '').toString();
    this.searchQuery.set(val);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  private afs = inject(Firestore);

  // Query: order by createdAt desc. Ensure you set createdAt = serverTimestamp() on create.
  private postsCol = collection(this.afs, 'posts');
  private q = query(this.postsCol, orderBy('createdAt', 'desc'), limit(200));

  private rows$: Observable<PostDoc[]> = collectionData(this.q, {
    idField: 'id',
  }) as Observable<PostDoc[]>;

  // Stream → signal; map docs to the IProperty shape your card expects
  readonly properties = toSignal<any[]>(
    this.rows$.pipe(map((docs) => docs.map(this.toProperty)))
  );

  // basic loading signal (first render until we get anything)
  readonly loading = computed(() => this.properties().length === 0);

  private toProperty = (d: PostDoc): any => {
    const id = d.id;

    // Build images array for the card
    const imgs: string[] = Array.isArray(d.images)
      ? d.images.filter(Boolean)
      : [];
    const propertyImages: IPropertyImage[] = imgs.map((url, i) => ({
      id: `${id}-${i}`,
      image: url,
    }));

    // Price preference: price → costOfProperty → rent
    const rawPrice = d.priceOfSale ?? d.priceOfRent ?? 0;
    const price = Number(rawPrice) || 0;

    // Sizes formatted as strings
    const size = d.propertySize ?? '—';
    const sizeStr = String(size);

    return {
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      id,
      propertyTitle: String(d.propertyTitle ?? '—'),
      priceOfSale: Number(d.priceOfSale ?? 0),
      priceOfRent: Number(d.priceOfRent ?? 0),
      priceOfRentType: String(d.priceOfRentType ?? '—'),
      addressOfProperty: String(d.addressOfProperty ?? '—'),
      houseType: String(d.houseType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      propertySize: Number(d.propertySize ?? 0),
      propertyImages,
      saleType: String(d.saleType ?? 'sale') as 'sale' | 'rent',
      category: String(d.category ?? 'residential') as
        | 'residential'
        | 'commercial'
        | 'plots'
        | 'lands',
      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? id),
      commercialType: String(d.commercialType ?? '—'),
      floor: String(d.floor ?? '—'),
      propertyStatus: String(d.propertyStatus ?? 'Available'),
      houseCondition: String(d.houseCondition ?? '—'),
      rooms: Number(d.rooms ?? 0),
      furnishingType: String(d.furnishingType ?? '—'),
      commercialSubType: String(d.commercialSubType ?? '—'),
      securityDeposit: Number(d.securityDeposit ?? 0),
      propertySizeBuiltup: Number(d.propertySizeBuiltup ?? 0),
      sizeBuiltupUnits: String(d.sizeBuiltupUnits ?? '—'),
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
      images: Array.isArray(d.images)
        ? d.images.map((url, i) => ({ id: `${id}-${i}`, image: url }))
        : [],
      videoResources: Array.isArray(d.videoResources)
        ? d.videoResources.map((url, i) => ({ id: `${id}-${i}`, video: url }))
        : [],
      createdBy: String(d.createdBy ?? '—'),
      updatedBy: String(d.updatedBy ?? '—'),
      sortDate: Number(d.sortDate ?? 0),
      isDeleted: Boolean(d.isDeleted ?? false),
      deletedBy: String(d.deletedBy ?? '—'),
      deletedAt: d.deletedAt,
      status: String(d.status ?? 'Available'),
      fullSearchText: Array.isArray(d.fullSearchText) ? d.fullSearchText : [],
      totalPropertyUnits: String(d.totalPropertyUnits ?? '—'),
      facingUnits: String(d.facingUnits ?? '—'),
      lat: Number(d.lat ?? 0),
      lng: Number(d.lng ?? 0),
      description: String(d.description ?? '—'),
    };
  };
}

/* ------------ Firestore doc shape ------------ */
type PostDoc = {
  id: string;
  images?: string[];
  propertyTitle?: string;
  saleType?: string;
  category?: string;
  addressOfProperty?: string;
  houseType?: string;
  bhkType?: string;
  propertySize?: number | string;
  agentName?: string;
  propertyId?: string;
  propertyStatus?: string;
  costOfProperty?: number | string;
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
  propertySizeBuiltup?: number;
  sizeBuiltupUnits?: string;
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
  lat?: number;
  lng?: number;
  description?: string;
  videoResources?: string[];
  createdBy?: string;
  updatedBy?: string;
  sortDate?: number;
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: any;
  status?: string;
  fullSearchText?: string[];
  totalPropertyUnits?: string;
  facingUnits?: string;

  createdAt?: any;
  updatedAt?: any;
  // …any other fields you store
};
