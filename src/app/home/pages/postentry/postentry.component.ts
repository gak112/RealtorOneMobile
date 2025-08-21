// src/app/more/components/postentry/postentry.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  inject,
  signal,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormControl,
  NonNullableFormBuilder,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonButton,
  IonCheckbox,
  IonFooter,
  IonImg,
  IonBadge,
} from '@ionic/angular/standalone';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  cloudUploadOutline,
  trashOutline,
  add,
  caretDownOutline,
  caretUpOutline,
  close,
} from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { PostsService } from 'src/app/more/services/posts.service';
import { FirebaseError } from '@angular/fire/app';
import { UcWidgetComponent, UcWidgetModule } from 'ngx-uploadcare-widget';
import { PostRequest } from 'src/app/models/request.model';

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
type RentUnits = 'Monthly' | 'Yearly';
type AgeAction = 'underconstruction' | 'noofyears';
type FurnishingType = 'Fully-Furnished' | 'Semi-Furnished' | 'Unfurnished';
type PropertyType =
  | 'Shop'
  | 'Office'
  | 'Warehouse'
  | 'Factory'
  | 'Showroom'
  | 'Land'
  | 'Other';
type SubType =
  | 'Shopping Mall'
  | 'Co-Working Space'
  | 'IT Park'
  | 'Showroom'
  | 'Other';

type PostEntryForm = {
  propertyTitle: FormControl<string>;
  houseType: FormControl<HouseType>;
  houseCondition: FormControl<'Old Houses' | 'New Houses' | null>;
  rooms: FormControl<number | null>;
  bhkType: FormControl<BHKType | null>;
  furnishingType: FormControl<FurnishingType | null>;
  propertyType: FormControl<PropertyType | null>;
  subType: FormControl<SubType | null>;
  securityDeposit: FormControl<number | null>;
  totalPropertyUnits: FormControl<Units | null>;
  propertySize: FormControl<number | null>;
  propertySizeBuildUp: FormControl<number | null>;
  northFacing: FormControl<string | null>;
  northSize: FormControl<number | null>;
  southFacing: FormControl<string | null>;
  southSize: FormControl<number | null>;
  eastFacing: FormControl<string | null>;
  eastSize: FormControl<number | null>;
  westFacing: FormControl<string | null>;
  westSize: FormControl<number | null>;
  toilets: FormControl<number | null>;
  poojaRoom: FormControl<number | null>;
  livingDining: FormControl<number | null>;
  kitchen: FormControl<number | null>;
  floor: FormControl<string | null>;
  amenities: FormControl<string[]>;
  ageOfProperty: FormControl<string | null>;
  noOfYears: FormControl<number | null>;
  rentPrice: FormControl<number | null>;
  rentUnits: FormControl<RentUnits | null>;
  costOfProperty: FormControl<number | null>;
  addressOfProperty: FormControl<string | null>;
  lat: FormControl<number | null>;
  lng: FormControl<number | null>;
  description: FormControl<string | null>;
  negotiable: FormControl<boolean>;
  images: FormControl<string[]>;
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
    IonSegment,
    IonSegmentButton,
    IonFooter,
    IonBadge,
    IonCheckbox,
    UcWidgetModule,
  ],
  templateUrl: './postentry.component.html',
  styleUrls: ['./postentry.component.scss'],
})
export class PostentryComponent implements OnInit {
  // DI
  private fb = inject(NonNullableFormBuilder);
  private modalCtrl = inject(ModalController);
  private nav = inject(NavController);
  private toastCtrl = inject(ToastController);
  private postsService = inject(PostsService);

  // Inputs
  @Input() saleType: 'sale' | 'rent' = 'sale';
  @Input() category: 'residential' | 'commercial' | 'plots' | 'lands' =
    'residential';
  @Input() editId: string | null = null;

  // constants
  private static readonly FLOORS = [
    'Ground',
    ...Array.from({ length: 40 }, (_, i) => `${i + 1}`),
  ];
  private static readonly MAX_FILES = 12;
  private static readonly MAX_SIZE_BYTES = 6 * 1024 * 1024;
  private static readonly ACCEPTED_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
  ]);
  private static readonly UNIT_SHORT: Record<Units, string> = {
    'Sq Feet': 'Sq Ft',
    'Sq Yard': 'Sq Yd',
    'Sq Mtr': 'Sq m',
    Acre: 'Acre',
    Feet: 'Ft',
    Yard: 'Yd',
    Mtr: 'Mtr',
  };

  // UI state
  readonly ageOfPropertyAction = signal<AgeAction>('underconstruction');
  readonly imgsBusy = signal(false);
  readonly imgsPct = signal(0);
  readonly loading = signal(false);
  readonly pageError = signal<string | null>(null);

  // form
  postEntryForm = this.fb.group<PostEntryForm>({
    propertyTitle: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    houseType: this.fb.control<HouseType>('', {
      validators: [Validators.required],
    }),
    houseCondition: this.fb.control<'Old Houses' | 'New Houses' | null>(null),
    rooms: this.fb.control<number | null>(null),
    bhkType: this.fb.control<BHKType | null>(null, {
      validators: [Validators.required],
    }),
    totalPropertyUnits: this.fb.control<Units | null>(null, {
      validators: [Validators.required],
    }),
    furnishingType: this.fb.control<FurnishingType | null>(null),
    propertyType: this.fb.control<PropertyType | null>(null),
    subType: this.fb.control<SubType | null>(null),
    securityDeposit: this.fb.control<number | null>(null),
    propertySize: this.fb.control<number | null>(null, {
      validators: [Validators.min(1)],
    }),
    propertySizeBuildUp: this.fb.control<number | null>(null, {
      validators: [Validators.min(1)],
    }),
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
    floor: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    amenities: this.fb.control<string[]>([]),
    ageOfProperty: this.fb.control<string | null>(null),
    noOfYears: this.fb.control<number | null>(
      { value: null, disabled: true },
      { validators: [Validators.min(0)] }
    ),
    rentPrice: this.fb.control<number | null>(null, {
      validators: [Validators.min(1)],
    }),
    rentUnits: this.fb.control<RentUnits | null>(null),
    costOfProperty: this.fb.control<number | null>(null, {
      validators: [Validators.min(1)],
    }),
    addressOfProperty: this.fb.control<string | null>(null),
    lat: this.fb.control<number | null>(null),
    lng: this.fb.control<number | null>(null),
    description: this.fb.control<string | null>(null),
    negotiable: this.fb.control<boolean>(true),
    images: this.fb.control<string[]>([]),
  });

  // signals from controls
  private sel<T>(name: keyof PostEntryForm) {
    const c = this.postEntryForm.controls[name];
    return toSignal(c.valueChanges as unknown as Observable<T>, {
      initialValue: c.value as T,
    });
  }
  readonly amenities$ = this.sel<string[]>('amenities');
  readonly images$ = this.sel<string[]>('images');
  readonly units$ = this.sel<Units | null>('totalPropertyUnits');

  // derived
  readonly formValid = computed(() => this.postEntryForm.valid);
  readonly canSubmit = computed(() => this.formValid() && !this.loading());
  readonly floors = PostentryComponent.FLOORS;
  readonly unitShort = computed(() => {
    const u = this.units$();
    return u ? PostentryComponent.UNIT_SHORT[u] : 'Ft';
    // template calls unitShort() — signals are callable
  });

  // chip view state (kept but mirrored to form)
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

    // Enable/disable "noOfYears" based on segment
    effect(() => {
      const ctrl = this.postEntryForm.controls.noOfYears;
      if (this.ageOfPropertyAction() === 'underconstruction') {
        if (ctrl.enabled) ctrl.disable({ emitEvent: false });
        if (ctrl.value !== null) ctrl.setValue(null, { emitEvent: false });
      } else if (ctrl.disabled) {
        ctrl.enable({ emitEvent: false });
      }
    });

    effect(() => {
      this.amenities.set(this.amenities$() ?? []);
    });

    // rent → require rentUnits
    effect(() => {
      const rent = this.postEntryForm.controls.rentPrice.value ?? 0;
      const unitsCtrl = this.postEntryForm.controls.rentUnits;
      if (rent > 0) {
        unitsCtrl.addValidators([Validators.required]);
      } else {
        unitsCtrl.clearValidators();
        if (unitsCtrl.value !== null)
          unitsCtrl.setValue(null, { emitEvent: false });
      }
      unitsCtrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  // helper for template
  ctrl = (name: keyof PostEntryForm) => this.postEntryForm.controls[name];

  private async toast(
    message: string,
    color: 'danger' | 'warning' | 'success' | 'medium' = 'warning'
  ) {
    const t = await this.toastCtrl.create({
      message,
      duration: 2400,
      position: 'top',
      color,
    });
    await t.present();
  }

  private focusFirstInvalid() {
    const el = document.querySelector('form .ng-invalid') as HTMLElement | null;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.focus?.();
  }

  private mapError(err: unknown): string {
    // Proper FirebaseError mapping (prevents every error looking like "Network error")
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'permission-denied':
          return 'Permission denied. Check Firestore security rules for /posts.';
        case 'unavailable':
          return 'Service unavailable. You may be offline or Firestore is temporarily unreachable.';
        case 'deadline-exceeded':
          return 'Request timed out. Please try again.';
        case 'failed-precondition':
          return 'Precondition failed. If you are using emulator/indexes, verify indexes/schemas.';
        case 'cancelled':
          return 'Request cancelled. Please retry.';
        case 'resource-exhausted':
          return 'Resource exhausted (quota). Check Firestore limits/billing.';
        case 'unauthenticated':
          return 'You must be signed in to create or update posts.';
        case 'not-found':
          return 'Document not found.';
        default:
          return `Firestore error: ${err.code}`;
      }
    }

    const any = err as any;
    const status = any?.status ?? 0;
    const msg = any?.error?.message || any?.message;
    if (!navigator.onLine)
      return 'You appear to be offline. Please check your connection.';
    if (status >= 500) return 'Server error. Try again later.';
    if (status === 413) return 'Payload too large.';
    if (status === 422) return msg || 'Validation failed.';
    if (status === 404) return 'Service not found.';
    if (status === 403) return 'Forbidden.';
    if (status === 401) return 'Unauthorized.';
    if (status === 400) return msg || 'Bad request.';
    return msg || 'Unexpected error.';
  }

  dismiss() {
    this.modalCtrl
      .getTop()
      .then((m) => (m ? m.dismiss() : this.nav.back()) as void);
  }

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
      // 🔁 keep form control in sync for submit()
      this.ctrl('amenities').setValue([...data] as never);
    }
  }

  removeAmenity(index: number) {
    const list = [...this.amenities()];
    list.splice(index, 1);
    this.amenities.set(list);
    this.ctrl('amenities').setValue(list as never);
  }

  ageOfPropertyChanged(ev: CustomEvent) {
    this.ageOfPropertyAction.set((ev.detail as any).value as AgeAction);
  }

  async openLocation() {
    try {
      const perm = await Geolocation.requestPermissions();
      if (perm.location === 'denied')
        return this.toast('Location permission denied.', 'danger');
      const { coords } = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      const { latitude, longitude } = coords;
      this.postEntryForm.patchValue(
        {
          lat: latitude,
          lng: longitude,
          addressOfProperty: `Lat: ${latitude.toFixed(
            6
          )}, Lng: ${longitude.toFixed(6)}`,
        },
        { emitEvent: false }
      );
      this.toast('Location captured', 'success');
    } catch {
      this.toast('Unable to get location.', 'danger');
    }
  }

  // async selectVentureImages(evt: Event) {
  //   const input = evt.target as HTMLInputElement;
  //   const files = Array.from(input.files ?? []);
  //   if (!files.length) return;

  //   const current = (this.images$() || []).slice(0);
  //   if (current.length + files.length > PostentryComponent.MAX_FILES) {
  //     this.toast(`Max ${PostentryComponent.MAX_FILES} images.`, 'danger');
  //     input.value = '';
  //     return;
  //   }

  //   this.imgsBusy.set(true);
  //   this.pageError.set(null);

  //   try {
  //     let accepted = 0;
  //     const next = current;

  //     for (let i = 0; i < files.length; i++) {
  //       const f = files[i];
  //       if (!PostentryComponent.ACCEPTED_TYPES.has(f.type)) {
  //         this.toast(`${f.name}: unsupported type.`, 'danger');
  //         continue;
  //       }
  //       if (f.size > PostentryComponent.MAX_SIZE_BYTES) {
  //         this.toast(`${f.name}: too large (>6MB).`, 'danger');
  //         continue;
  //       }

  //       const url = URL.createObjectURL(f);
  //       if ('createImageBitmap' in window) {
  //         try {
  //           await createImageBitmap(f);
  //         } catch {}
  //       }
  //       next.push(url);
  //       accepted++;
  //       this.imgsPct.set(Math.round(((i + 1) / files.length) * 100));
  //       await new Promise((r) => setTimeout(r, 8));
  //     }

  //     this.ctrl('images').setValue(next as never);
  //     if (accepted)
  //       this.toast(
  //         `Added ${accepted} image${accepted === 1 ? '' : 's'}`,
  //         'success'
  //       );
  //   } catch (e) {
  //     this.pageError.set(this.mapError(e));
  //     this.toast(this.pageError()!, 'danger');
  //   } finally {
  //     this.imgsBusy.set(false);
  //     this.imgsPct.set(0);
  //     input.value = '';
  //   }
  // }

  // deleteImageByUrl(url: string) {
  //   try {
  //     URL.revokeObjectURL(url);
  //   } catch {}
  //   const filtered = (this.images$() || []).filter((u) => u !== url);
  //   this.ctrl('images').setValue(filtered as never);
  // }

  @ViewChild('kyc') kyc: UcWidgetComponent;
  images = [];
  @Input() edit;

  onComplete(event): void {
    if (event.count === 10) {
      this.showError('Images Exceed., please upload images upto 10');
      return;
    }
    this.kyc.reset();
    this.kyc.clearUploads();

    if (event.count) {
      for (let i = 0; i < event.count; i++) {
        this.images.push(event.cdnUrl + '/nth/' + i + '/');
      }
    } else {
      this.images.push(event.cdnUrl);
    }
    this.postEntryForm.patchValue(
      { images: this.images },
      { emitEvent: false }
    );

    if (2 - this.images.length === 1) {
      this.kyc.multiple = false;
    }
  }

  removeImg(i) {
    this.images.splice(i, 1);
    this.postEntryForm.patchValue(
      { images: this.images },
      { emitEvent: false }
    );
  }

  async submit() {
    this.pageError.set(null);
    this.postEntryForm.markAllAsTouched();

    if (!this.postEntryForm.valid) {
      this.toast('Please fix the highlighted fields.', 'danger');
      this.focusFirstInvalid();
      return;
    }

    if (!navigator.onLine) {
      const msg = 'You appear to be offline. Please check your connection.';
      this.pageError.set(msg);
      this.toast(msg, 'danger');
      return;
    }

    this.loading.set(true);
    try {
      const raw = this.postEntryForm.getRawValue();

      // Build strict payload
      const payload: PostRequest = {
        ...raw,
        // ensure arrays are not undefined
        amenities: raw.amenities ?? [],
        images: raw.images ?? [],
        saleType: this.saleType,
        category: this.category,
      } as PostRequest;

      if (this.editId) {
        await this.postsService.update(this.editId, payload);
        await this.toast('Property updated', 'success');
      } else {
        await this.postsService.create(payload);
        await this.toast('Property saved', 'success');
      }

      // Reset to sensible defaults
      this.postEntryForm.reset({} as Partial<PostEntryForm> as any, {
        emitEvent: false,
      });
      this.amenities.set([]);
    } catch (e) {
      const msg = this.mapError(e);
      this.pageError.set(msg);
      this.toast(msg, 'danger');
    } finally {
      this.loading.set(false);
    }
  }

  async ngOnInit() {
    // keep amenities chip view in sync if user edits existing doc

    if (this.editId) {
      try {
        this.loading.set(true);
        const doc = await this.postsService.getById(this.editId);
        if (doc) {
          this.postEntryForm.patchValue(doc as any, { emitEvent: false });
          this.amenities.set((doc as any).amenities ?? []);
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

  async showError(msg: any) {
    const toast = await this.toastr.create({
      message: msg,
      position: 'top',
      color: 'danger',
      duration: 2000,
    });
    (await this.toastr.getTop())?.dismiss();
    await toast.present();
  }
}
