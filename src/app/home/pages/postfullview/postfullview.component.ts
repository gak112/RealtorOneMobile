import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonImg,
  IonLabel,
  IonButton,
  IonBadge,
  IonChip,
  IonList,
  IonItem,
  IonSkeletonText,
  ModalController,
  ToastController,
  IonFooter,
} from '@ionic/angular/standalone';

import { Location } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  shareOutline,
  locationOutline,
  homeOutline,
  businessOutline,
  pricetagOutline,
  timeOutline,
  cubeOutline,
  filmOutline,
  callOutline,
  navigateCircle,
} from 'ionicons/icons';

import { Firestore, doc, docData } from '@angular/fire/firestore';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import {
  switchMap,
  map,
  distinctUntilChanged,
  catchError,
} from 'rxjs/operators';
import { IAmentity } from '../../components/amentitycard/amentitycard.component';

/** Replace with your project model if you have one */
export interface IProperty {
  id: string;
  saleType: 'sale' | 'rent';
  category: 'residential' | 'commercial' | 'plots' | 'agriculturalLands';
  propertyTitle?: string;
  addressOfProperty?: string;

  priceOfSale?: number;
  priceOfRent?: number;
  priceOfRentType?: 'Monthly' | 'Yearly';
  securityDeposit?: number;

  houseType?: string;
  houseCondition?: 'Old Houses' | 'New Houses';
  bhkType?: string;
  houseFacingType?:
    | 'North Facing'
    | 'South Facing'
    | 'East Facing'
    | 'West Facing';
  rooms?: number;
  toilets?: number;
  poojaRoom?: number;
  livingDining?: number;
  kitchen?: number;

  furnishingType?: 'Fully-Furnished' | 'Semi-Furnished' | 'Unfurnished';
  floor?: string;

  commercialType?: string;
  commercialSubType?: string;

  PlotArea?: number;
  plotAreaUnits?: string;
  builtUpArea?: number;
  builtUpAreaUnits?: string;

  facingUnits?: string;
  northFacing?: string;
  northSize?: number;
  southFacing?: string;
  southSize?: number;
  eastFacing?: string;
  eastSize?: number;
  westFacing?: string;
  westSize?: number;

  amenities?: string[];
  ageOfProperty?: string;
  negotiable?: boolean;
  availabilityStatus?: string;
  description?: string;

  propertyImages?: { id: string; image: string }[];
  images?: { id: string; image: string }[];
  videoResources?: { id: string; video: string }[];

  agentName?: string;

  createdAt?: any;
  updatedAt?: any;
}

@Component({
  selector: 'app-postfullview',
  templateUrl: './postfullview.component.html',
  styleUrls: ['./postfullview.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonImg,
    IonLabel,
    IonButton,
    IonBadge,
    IonChip,
    IonList,
    IonItem,
    IonSkeletonText,
    IonFooter,
  ],
  providers: [ModalController],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostfullviewComponent {
  /** Pass a full object or an id to fetch from Firestore (`posts/{id}`) */
  propertyIn = input<IProperty | null>(null);
  id = input<string>('');

  private readonly modalController = inject(ModalController);
  private readonly toast = inject(ToastController);
  private readonly location = inject(Location);
  private readonly afs = inject(Firestore);

  /** ✅ Always give `toSignal` an Observable (fallback to of(null)) */
  private readonly id$ = toObservable(this.id);
  private readonly remoteSig = toSignal<IProperty | null>(
    this.id$.pipe(
      map((v) => (v ?? '').trim()),
      distinctUntilChanged(),
      switchMap((pid) =>
        pid
          ? (docData(doc(this.afs, `posts/${pid}`), { idField: 'id' }) as any)
          : of(null)
      ),
      catchError(() => of(null))
    ),
    { initialValue: null }
  );

  /** Prefer direct input object; else the loaded one */
  readonly model = computed<IProperty | null>(
    () => this.propertyIn() || this.remoteSig()
  );

  readonly pageError = computed(() =>
    this.id() && !this.model() ? 'Property not found.' : null
  );

  readonly headerTitle = computed(
    () => this.model()?.propertyTitle || 'Property'
  );
  readonly saleType = computed(() => this.model()?.saleType || 'sale');
  readonly category = computed(() => this.model()?.category || 'residential');

  readonly images = computed(() => {
    const m = this.model();
    return m?.propertyImages?.length
      ? m.propertyImages
      : m?.images?.length
      ? m.images
      : [];
  });
  readonly video = computed(
    () => this.model()?.videoResources?.[0]?.video || ''
  );
  readonly amenities = computed(() => this.model()?.amenities || []);

  // readonly amenities = computed<IAmentity[]>(() => {
  //   const names = this.model()?.amenities ?? [];
  //   return names.map((name, i) => ({
  //     id: String(i + 1),
  //     name,
  //     image: 'assets/img/amenity-placeholder.png',
  //   }));
  // });

  readonly priceLine = computed(() => {
    const m = this.model();
    if (!m) return '';
    const inr = (n?: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
    if (m.saleType === 'sale') return inr(m.priceOfSale);
    const period = (m.priceOfRentType || 'Monthly').trim();
    return `${inr(m.priceOfRent)} / ${period}`;
  });

  readonly secDepositLine = computed(() => {
    const m = this.model();
    if (!m || m.saleType !== 'rent') return '';
    if (this.category() !== 'commercial' || !m.securityDeposit) return '';
    return `Security Deposit: ₹${Number(m.securityDeposit).toLocaleString(
      'en-IN'
    )}`;
  });

  readonly unitShort = computed(() => {
    const m = this.model();
    const u = m?.facingUnits || m?.plotAreaUnits || '';
    const map: Record<string, string> = {
      'Square Feet': 'Sqft',
      'Sq Feet': 'Sqft',
      'Sq Yard': 'SqYd',
      'Sq Mtr': 'SqM',
    };
    return map[u] || u;
  });

  readonly hasImages = computed(() => (this.images() || []).length > 0);
  readonly hasVideo = computed(() => !!this.video());
  readonly availability = computed(
    () => this.model()?.availabilityStatus || ''
  );

  constructor() {
    addIcons({
      chevronBackOutline,
      shareOutline,
      locationOutline,
      homeOutline,
      businessOutline,
      pricetagOutline,
      timeOutline,
      cubeOutline,
      filmOutline,
      callOutline,
      navigateCircle
    });
  }

  dismiss() {
    this.modalController.getTop().then((top) => {
      if (top) this.modalController.dismiss().catch(() => this.location.back());
      else this.location.back();
    });
  }

  async share() {
    try {
      const m = this.model();
      if (!m || !navigator.share) return;
      const text = `${m.propertyTitle || 'Property'} • ${this.priceLine()}
${m.addressOfProperty || ''}`;
      await navigator.share({ title: 'Property', text });
    } catch {
      this.presentToast('Unable to share.', 'medium');
    }
  }

  formatINR(n?: number) {
    return `₹${Number(n || 0).toLocaleString('en-IN')}`;
  }

  private async presentToast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'
  ) {
    const t = await this.toast.create({
      message,
      duration: 1500,
      position: 'top',
      color,
    });
    await t.present();
  }
}
