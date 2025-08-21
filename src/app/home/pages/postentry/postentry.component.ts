// src/app/more/components/postentry/postentry.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FirebaseError } from '@angular/fire/app';
import { Geolocation } from '@capacitor/geolocation';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  caretDownOutline,
  caretUpOutline,
  chevronBackOutline,
  close,
  cloudUploadOutline,
  trashOutline,
} from 'ionicons/icons';
import { UcWidgetComponent, UcWidgetModule } from 'ngx-uploadcare-widget';
import { Observable } from 'rxjs';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import { PostsService } from 'src/app/more/services/posts.service';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

type HouseType =
  | 'Apartment'
  | 'Individual House/Villa'
  | 'Gated Community Villa'
  | '';
type BHKType = '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | '+5BHK';
type Units =
  | 'Sq Feet'
  | 'Sq Yard'
  | 'Sq Mtr'
  | 'Acre'
  | 'Feet'
  | 'Yard'
  | 'Mtr';
type RentType = 'Monthly' | 'Yearly';
type FurnishingType = 'Fully-Furnished' | 'Semi-Furnished' | 'Unfurnished';
type CommercialType =
  | 'Shop'
  | 'Office'
  | 'Warehouse'
  | 'Factory'
  | 'Showroom'
  | 'Land'
  | 'Other';
type CommercialSubType =
  | 'Shopping Mall'
  | 'Co-Working Space'
  | 'IT Park'
  | 'Showroom'
  | 'Other';

const DEFAULT_UNITS: Units = 'Sq Feet';

type PostEntryForm = {
  propertyTitle: FormControl<string | null>;
  houseType: FormControl<HouseType | null>;
  houseCondition: FormControl<'Old Houses' | 'New Houses' | null>;
  rooms: FormControl<number | null>;
  bhkType: FormControl<BHKType | null>;
  furnishingType: FormControl<FurnishingType | null>;
  commercialType: FormControl<CommercialType | null>;
  commercialSubType: FormControl<CommercialSubType | null>;
  securityDeposit: FormControl<number | null>;

  // sizes
  totalPropertyUnits: FormControl<Units | null>;
  propertySize: FormControl<number | null>;
  propertySizeBuildUp: FormControl<number | null>;
  sizeBuiltupUnits: FormControl<Units | null>;

  // facing (shared units)
  facingUnits: FormControl<Units | null>;
  northFacing: FormControl<string | null>;
  northSize: FormControl<number | null>;
  southFacing: FormControl<string | null>;
  southSize: FormControl<number | null>;
  eastFacing: FormControl<string | null>;
  eastSize: FormControl<number | null>;
  westFacing: FormControl<string | null>;
  westSize: FormControl<number | null>;

  // counts
  toilets: FormControl<number | null>;
  poojaRoom: FormControl<number | null>;
  livingDining: FormControl<number | null>;
  kitchen: FormControl<number | null>;
  floor: FormControl<string | null>;

  amenities: FormControl<string[] | null>;
  ageOfProperty: FormControl<string | null>;

  // prices
  priceOfSale: FormControl<number | null>;
  priceOfRent: FormControl<number | null>;
  priceOfRentType: FormControl<RentType | null>;

  // address
  addressOfProperty: FormControl<string | null>;
  lat: FormControl<number | null>;
  lng: FormControl<number | null>;

  description: FormControl<string | null>;
  negotiable: FormControl<boolean | null>;
  images: FormControl<string[] | null>;
  videoResources: FormControl<string[] | null>;
};

@Component({
  selector: 'app-postentry',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonIcon,
    IonImg,
    IonFooter,
    IonCheckbox,
    IonSegment,
    IonSegmentButton,
    UcWidgetModule,
  ],
  templateUrl: './postentry.component.html',
  styleUrls: ['./postentry.component.scss'],
})
export class PostentryComponent implements OnInit {
  // DI
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  private nav = inject(NavController);
  private toastCtrl = inject(ToastController);
  private postsService = inject(PostsService);

  // Inputs
  @Input() saleType: 'sale' | 'rent' = 'sale';
  @Input() category: 'residential' | 'commercial' | 'plots' | 'lands' =
    'residential';
  @Input() editId: string | null = null;

  // signals for SaleType/Category
  readonly saleTypeSig = signal<'sale' | 'rent'>(this.saleType);
  readonly categorySig = signal<'residential' | 'commercial' | 'plots' | 'lands'>(
    this.category
  );

  // UI state
  readonly loading = signal(false);
  readonly pageError = signal<string | null>(null);

  // header + button labels
  readonly isEdit = computed(() => !!this.editId);
  readonly headerTitle = computed(() =>
    this.isEdit() ? 'Edit Property Details' : 'Property Details Entry'
  );
  readonly actionLabel = computed(() => (this.isEdit() ? 'Update' : 'Submit'));

  // floors
  readonly floors = ['Ground', ...Array.from({ length: 40 }, (_, i) => `${i + 1}`)];

  // form
  postEntryForm = this.fb.group<PostEntryForm>({
    propertyTitle: this.fb.control<string | null>(''),

    houseType: this.fb.control<HouseType | null>(null),
    houseCondition: this.fb.control<'Old Houses' | 'New Houses' | null>(null),
    rooms: this.fb.control<number | null>(null),
    bhkType: this.fb.control<BHKType | null>(null),
    furnishingType: this.fb.control<FurnishingType | null>(null),

    commercialType: this.fb.control<CommercialType | null>(null),
    commercialSubType: this.fb.control<CommercialSubType | null>(null),
    securityDeposit: this.fb.control<number | null>(null),

    totalPropertyUnits: this.fb.control<Units | null>(DEFAULT_UNITS),
    propertySize: this.fb.control<number | null>(null),
    propertySizeBuildUp: this.fb.control<number | null>(null),
    sizeBuiltupUnits: this.fb.control<Units | null>(DEFAULT_UNITS),

    facingUnits: this.fb.control<Units | null>(DEFAULT_UNITS),
    northFacing: this.fb.control<string | null>(null),
    northSize: this.fb.control<number | null>(null),
    southFacing: this.fb.control<string | null>(null),
    southSize: this.fb.control<number | null>(null),
    eastFacing: this.fb.control<string | null>(null),
    eastSize: this.fb.control<number | null>(null),
    westFacing: this.fb.control<string | null>(null),
    westSize: this.fb.control<number | null>(null),

    toilets: this.fb.control<number | null>(null),
    poojaRoom: this.fb.control<number | null>(null),
    livingDining: this.fb.control<number | null>(null),
    kitchen: this.fb.control<number | null>(null),
    floor: this.fb.control<string | null>(null),

    amenities: this.fb.control<string[] | null>([]),
    ageOfProperty: this.fb.control<string | null>(null),

    priceOfSale: this.fb.control<number | null>(null),
    priceOfRent: this.fb.control<number | null>(null),
    priceOfRentType: this.fb.control<RentType | null>(null),

    addressOfProperty: this.fb.control<string | null>(null),
    lat: this.fb.control<number | null>(null),
    lng: this.fb.control<number | null>(null),

    description: this.fb.control<string | null>(null),
    negotiable: this.fb.control<boolean | null>(true),
    images: this.fb.control<string[] | null>([]),
    videoResources: this.fb.control<string[] | null>([]),
  });

  // mini-selectors
  private sel<T>(name: keyof PostEntryForm) {
    const c = this.postEntryForm.controls[name];
    return toSignal(c.valueChanges as unknown as Observable<T>, {
      initialValue: c.value as T,
    });
  }
  readonly facingUnits$ = this.sel<Units | null>('facingUnits');

  // unit short for facing labels
  readonly unitShort = computed(() => {
    switch (this.facingUnits$() || DEFAULT_UNITS) {
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
        return 'Sqft';
    }
  });

  // chip view for amenities
  amenities = signal<string[]>([]);
  hasAmenities = computed(() => this.amenities().length > 0);

  constructor() {
    addIcons({
      chevronBackOutline,
      cloudUploadOutline,
      trashOutline,
      add,
      caretDownOutline,
      caretUpOutline,
      close,
    });

    // mirror amenities control <-> signal (for chip UI)
    effect(() => {
      this.amenities.set(this.postEntryForm.controls.amenities.value ?? []);
    });
  }

  // helpers
  ctrl = (name: keyof PostEntryForm) => this.postEntryForm.controls[name];

  private async toast(
    message: string,
    color: 'danger' | 'warning' | 'success' | 'medium' = 'warning'
  ) {
    const t = await this.toastCtrl.create({
      message,
      duration: 2200,
      position: 'top',
      color,
    });
    await t.present();
  }

  private mapError(err: unknown): string {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'permission-denied':
          return 'Permission denied. Check Firestore rules for /posts.';
        case 'unauthenticated':
          return 'You must be signed in.';
        case 'unavailable':
          return 'Service unavailable. Try again.';
        default:
          return `Firestore error: ${err.code}`;
      }
    }
    const any = err as any;
    const msg = any?.error?.message || any?.message || 'Unexpected error.';
    if (!navigator.onLine)
      return 'You appear to be offline. Please check your connection.';
    return msg;
  }

  // nav
  dismiss() {
    this.modalCtrl
      .getTop()
      .then((m) => (m ? m.dismiss() : this.nav.back()) as void);
  }

  // segments
  saleTypeChanged(ev: CustomEvent) {
    this.saleTypeSig.set((ev.detail as any)?.value as 'sale' | 'rent');
  }
  categoryChanged(ev: CustomEvent) {
    this.categorySig.set(
      (ev.detail as any)?.value as 'residential' | 'commercial' | 'plots' | 'lands'
    );
  }

  // amenities modal
  async openAmenities() {
    const modal = await this.modalCtrl.create({
      component: AmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: { selectedAmenities: this.amenities() },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<string[]>();
    if (Array.isArray(data)) {
      this.amenities.set(data);
      this.ctrl('amenities').setValue([...data] as never);
    }
  }
  removeAmenity(index: number) {
    const list = [...this.amenities()];
    list.splice(index, 1);
    this.amenities.set(list);
    this.ctrl('amenities').setValue(list as never);
  }

  // location
  async openLocation() {
    try {
      const perm = await Geolocation.requestPermissions();
      if (perm.location === 'denied') {
        await this.toast('Location permission denied.', 'danger');
        return;
      }
      const { coords } = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      const { latitude, longitude } = coords;
      this.postEntryForm.patchValue(
        {
          lat: latitude,
          lng: longitude,
          addressOfProperty: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
        },
        { emitEvent: false }
      );
      this.toast('Location captured', 'success');
    } catch {
      this.toast('Unable to get location.', 'danger');
    }
  }

  // images (Uploadcare)
  @ViewChild('kyc') kyc: UcWidgetComponent | undefined;
  images: string[] = [];
  @Input() edit = false;

  onComplete(event: any): void {
    if (event?.count && event.count > 10) {
      this.showError('Images exceed limit. Upload up to 10.');
      return;
    }
    this.kyc?.reset();
    this.kyc?.clearUploads();

    if (event?.count) {
      for (let i = 0; i < event.count; i++)
        this.images.push(event.cdnUrl + '/nth/' + i + '/');
    } else if (event?.cdnUrl) {
      this.images.push(event.cdnUrl);
    }
    this.postEntryForm.patchValue({ images: this.images }, { emitEvent: false });

    if (2 - this.images.length === 1 && this.kyc) (this.kyc as any).multiple = false;
  }

  removeImg(i: number) {
    this.images.splice(i, 1);
    this.postEntryForm.patchValue({ images: this.images }, { emitEvent: false });
  }

  async submit() {
    this.pageError.set(null);
    if (!navigator.onLine) {
      const msg = 'You appear to be offline. Please check your connection.';
      this.pageError.set(msg);
      await this.toast(msg, 'danger');
      return;
    }

    this.loading.set(true);
    try {
      const raw = this.postEntryForm.getRawValue();

      // ensure units are never null in payload
      const payload: any = {
        ...raw,
        images: raw.images ?? [],
        amenities: raw.amenities ?? [],
        totalPropertyUnits: raw.totalPropertyUnits || DEFAULT_UNITS,
        sizeBuiltupUnits: raw.sizeBuiltupUnits || DEFAULT_UNITS,
        facingUnits: raw.facingUnits || DEFAULT_UNITS,
        saleType: this.saleTypeSig(),
        category: this.categorySig(),
      };

      if (this.isEdit()) {
        await this.postsService.update(this.editId as string, payload);
        await this.toast('Property updated', 'success');
      } else {
        await this.postsService.create(payload);
        await this.toast('Property saved', 'success');
      }

      this.resetFormAndUI();
    } catch (e) {
      const msg = this.mapError(e);
      this.pageError.set(msg);
      await this.toast(msg, 'danger');
    } finally {
      this.loading.set(false);
    }
  }

  async ngOnInit() {
    // initialize SaleType/Category from @Inputs
    this.saleTypeSig.set(this.saleType);
    this.categorySig.set(this.category);

    if (this.editId) {
      try {
        this.loading.set(true);
        const doc = await this.postsService.getById(this.editId);
        if (doc) {
          // normalize/migrate legacy fields → current form shape
          const normalized = this.normalizeDocForForm(doc as any);

          const existingSaleType = (normalized as any).saleType as 'sale' | 'rent' | undefined;
          const existingCategory = (normalized as any).category as
            | 'residential'
            | 'commercial'
            | 'plots'
            | 'lands'
            | undefined;

          if (existingSaleType) this.saleTypeSig.set(existingSaleType);
          if (existingCategory) this.categorySig.set(existingCategory);

          this.postEntryForm.patchValue(normalized, { emitEvent: false });
          this.images = normalized.images ?? [];
          this.amenities.set(normalized.amenities ?? []);
        } else {
          this.pageError.set('Post not found.');
        }
      } catch (e) {
        this.pageError.set(this.mapError(e));
      } finally {
        this.loading.set(false);
      }
    }
  }

  private toastr = inject(ToastController);
  private async showError(msg: string) {
    const toast = await this.toastr.create({
      message: msg,
      position: 'top',
      color: 'danger',
      duration: 2000,
    });
    (await this.toastr.getTop())?.dismiss();
    await toast.present();
  }

  private resetFormAndUI() {
    this.postEntryForm.reset(
      {
        propertyTitle: '',
        houseType: null,
        houseCondition: null,
        rooms: null,
        bhkType: null,
        furnishingType: null,

        commercialType: null,
        commercialSubType: null,
        securityDeposit: null,

        totalPropertyUnits: DEFAULT_UNITS,
        propertySize: null,
        propertySizeBuildUp: null,
        sizeBuiltupUnits: DEFAULT_UNITS,

        facingUnits: DEFAULT_UNITS,
        northFacing: null,
        northSize: null,
        southFacing: null,
        southSize: null,
        eastFacing: null,
        eastSize: null,
        westFacing: null,
        westSize: null,

        toilets: null,
        poojaRoom: null,
        livingDining: null,
        kitchen: null,
        floor: null,

        amenities: [],
        ageOfProperty: null,

        priceOfSale: null,
        priceOfRent: null,
        priceOfRentType: null,

        addressOfProperty: null,
        lat: null,
        lng: null,
        description: null,
        negotiable: true,
        images: [],
        videoResources: [],
      } as any,
      { emitEvent: false }
    );

    this.amenities.set([]);
    this.images = [];
    this.ctrl('images').setValue([] as never, { emitEvent: false });

    this.saleTypeSig.set('sale');
    this.categorySig.set('residential');

    this.kyc?.reset();
    this.kyc?.clearUploads();
  }

  /**
   * Bring any legacy / inconsistent document into the current form shape.
   * - backfills default units if missing
   * - maps old `propertySizeBuiltup` -> `propertySizeBuildUp` (case)
   * - prefers any existing side-specific units to set shared `facingUnits`
   */
  private normalizeDocForForm(doc: any) {
    const out: any = { ...doc };

    // Case normalization: some data may have 'propertySizeBuiltup'
    if (out.propertySizeBuiltup != null && out.propertySizeBuildUp == null) {
      out.propertySizeBuildUp = out.propertySizeBuiltup;
    }

    // Default units if missing
    out.totalPropertyUnits = (out.totalPropertyUnits as Units) || DEFAULT_UNITS;
    out.sizeBuiltupUnits = (out.sizeBuiltupUnits as Units) || out.totalPropertyUnits || DEFAULT_UNITS;

    // If the doc has per-side unit fields, pick one to seed facingUnits; else keep what's present or default
    const candidateFacingUnit =
      out.northSizeUnit ||
      out.southSizeUnit ||
      out.eastSizeUnit ||
      out.westSizeUnit ||
      out.facingUnits;

    out.facingUnits = (candidateFacingUnit as Units) || DEFAULT_UNITS;

    // Clean images / amenities
    out.images = Array.isArray(out.images) ? out.images.filter(Boolean) : [];
    out.amenities = Array.isArray(out.amenities) ? out.amenities.filter(Boolean) : [];

    return out;
  }
}
