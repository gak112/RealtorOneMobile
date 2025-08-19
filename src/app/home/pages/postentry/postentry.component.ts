import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  inject,
  signal,
  OnInit,
  Input,
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
} from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

type HouseType =
  | 'Apartment'
  | 'Individual House/Villa'
  | 'Gated Community Villa';
type BHKType = '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | '+5BHK';
type Units = 'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre';
type RentUnits = 'Monthly' | 'Yearly';
type AgeAction = 'underconstruction' | 'noofyears';

type PostEntryForm = {
  title: FormControl<string>;
  houseType: FormControl<HouseType | ''>;
  houseCondition: FormControl<'Old Houses' | 'New Houses' | null>;
  rooms: FormControl<number | null>;
  bhkType: FormControl<BHKType | null>;
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
  noOfYears: FormControl<number | null>;
  rent: FormControl<number | null>;
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
  ],
  templateUrl: './postentry.component.html',
  styleUrls: ['./postentry.component.scss'],
})
export class PostentryComponent {
  // DI
  private fb = inject(NonNullableFormBuilder);
  private modalCtrl = inject(ModalController);
  private nav = inject(NavController);
  private toastCtrl = inject(ToastController);
  // private http = inject(HttpClient);

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
  };

  // UI state (signals)
  readonly ageOfPropertyAction = signal<AgeAction>('underconstruction');
  readonly imgsBusy = signal(false);
  readonly imgsPct = signal(0);
  readonly loading = signal(false);
  readonly pageError = signal<string | null>(null);

  @Input() action: any;
  @Input() actionType: any;

  // reactive form
  postEntryForm = this.fb.group<PostEntryForm>({
    title: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    houseType: this.fb.control<HouseType | ''>('', {
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
    noOfYears: this.fb.control<number | null>(
      { value: null, disabled: true },
      { validators: [Validators.min(0)] }
    ),
    rent: this.fb.control<number | null>(null, {
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
    negotiable: this.fb.control(true),
    images: this.fb.control<string[]>([]),
  });

  // signalized controls (perf: avoid reading whole form in template)
  private sel<T>(name: keyof PostEntryForm) {
    const c = this.postEntryForm.controls[name];
    return toSignal(c.valueChanges as Observable<T>, {
      initialValue: c.value as T,
    });
  }
  readonly amenities$ = this.sel<string[]>('amenities');
  readonly images$ = this.sel<string[]>('images');
  readonly units$ = this.sel<Units | null>('totalPropertyUnits');

  // derived signals
  readonly formValid = computed(() => this.postEntryForm.valid);
  readonly canSubmit = computed(() => this.formValid() && !this.loading());
  readonly floors = PostentryComponent.FLOORS;
  readonly unitShort = computed(() => {
    const u = this.units$();
    return u ? PostentryComponent.UNIT_SHORT[u] : 'Sq Ft';
  });

  constructor() {
    addIcons({
      chevronBackOutline,
      cloudUploadOutline,
      trashOutline,
      add,
      caretDownOutline,
      caretUpOutline,
    });

    // enable/disable "noOfYears" based on segment
    effect(() => {
      const ctrl = this.postEntryForm.controls.noOfYears;
      if (this.ageOfPropertyAction() === 'underconstruction') {
        if (ctrl.enabled) ctrl.disable({ emitEvent: false });
        if (ctrl.value !== null) ctrl.setValue(null, { emitEvent: false });
      } else if (ctrl.disabled) {
        ctrl.enable({ emitEvent: false });
      }
    });

    // rent → require rentUnits
    effect(() => {
      const rent = this.postEntryForm.controls.rent.value ?? 0;
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

  // helpers
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

  private mapHttpError(err: unknown): string {
    const any = err as any;
    const status = any?.status ?? 0;
    const msg = any?.error?.message || any?.message;
    if (status === 0) return 'Network error. Check your connection.';
    if (status === 400) return msg || 'Bad request. Please review the form.';
    if (status === 401) return 'Unauthorized. Please sign in again.';
    if (status === 403) return 'Forbidden.';
    if (status === 404) return 'Service not found.';
    if (status === 413) return 'Payload too large.';
    if (status === 422) return msg || 'Validation failed.';
    if (status >= 500) return 'Server error. Try again later.';
    return msg || `Unexpected error (${status}).`;
  }

  // events
  dismiss() {
    this.modalCtrl
      .getTop()
      .then((m) => (m ? m.dismiss() : this.nav.back()) as void);
  }

  // async amenitiesList() {
  //   const modal = await this.modalCtrl.create({
  //     component: AmenitiesComponent,
  //     enterAnimation: forwardEnterAnimation,
  //     leaveAnimation: backwardEnterAnimation,
  //     componentProps: { selected: [...(this.amenities$() || [])] },
  //     canDismiss: true,
  //     presentingElement: (await this.modalCtrl.getTop()) ?? undefined,
  //   });
  //   await modal.present();
  //   const { data, role } = await modal.onWillDismiss<string[]>();
  //   if (role === 'confirm' && Array.isArray(data)) {
  //     this.ctrl('amenities').setValue(data as never);
  //     this.toast(
  //       `Added ${data.length} amenit${data.length === 1 ? 'y' : 'ies'}`,
  //       'success'
  //     );
  //   }
  // }

  async amenitiesList() {
    const modal = await this.modalCtrl.create({
      component: AmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
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

  //  async selectVentureImages(evt: Event) {
  //    const input = evt.target as HTMLInputElement;
  //    const files = Array.from(input.files ?? []);
  //    if (!files.length) return;

  //    const current = (this.images$() || []).slice(0);
  //    if (current.length + files.length > PostentryComponent.MAX_FILES) {
  //      this.toast(`Max ${PostentryComponent.MAX_FILES} images.`, 'danger');
  //      input.value = '';
  //      return;
  //    }

  //    this.imgsBusy.set(true);
  //    this.pageError.set(null);

  //    try {
  //      let accepted = 0;
  //      const next = current;

  //      for (let i = 0; i < files.length; i++) {
  //        const f = files[i];
  //        if (!PostentryComponent.ACCEPTED_TYPES.has(f.type)) { this.toast(`${f.name}: unsupported type.`, 'danger'); continue; }
  //        if (f.size > PostentryComponent.MAX_SIZE_BYTES) { this.toast(`${f.name}: too large (>6MB).`, 'danger'); continue; }

  //        const url = URL.createObjectURL(f);
  //        if ('createImageBitmap' in window) { try { await createImageBitmap(f); } catch {} }
  //        next.push(url);
  //        accepted++;
  //        this.imgsPct.set(Math.round(((i + 1) / files.length) * 100));
  //        await new Promise(r => setTimeout(r, 8));
  //      }

  //      this.ctrl('images').setValue(next);
  //      if (accepted) this.toast(`Added ${accepted} image${accepted === 1 ? '' : 's'}`, 'success');
  //    } catch {
  //      this.pageError.set('Failed to add images.');
  //      this.toast('Failed to add images.', 'danger');
  //    } finally {
  //      this.imgsBusy.set(false);
  //      this.imgsPct.set(0);
  //      input.value = '';
  //    }
  //  }

  //  deleteImageByUrl(url: string) {
  //    try { URL.revokeObjectURL(url); } catch {}
  //    const filtered = (this.images$() || []).filter(u => u !== url);
  //    this.ctrl('images').setValue(filtered);
  //  }

  async submit() {
    this.pageError.set(null);
    this.postEntryForm.markAllAsTouched();
    if (!this.formValid()) {
      this.toast('Please fix the highlighted fields.', 'danger');
      this.focusFirstInvalid();
      return;
    }

    this.loading.set(true);
    try {
      const payload = this.postEntryForm.getRawValue();
      console.log(payload);
      // TODO: replace with real API call:
      // await this.http.post('/api/properties', payload).toPromise();
      await new Promise((r) => setTimeout(r, 350));
      this.toast('Property saved', 'success');
      // Optional:
      // this.postEntryForm.reset({ negotiable: true, images: [] });
      // this.dismiss();
    } catch (e) {
      const msg = this.mapHttpError(e);
      this.pageError.set(msg);
      this.toast(msg, 'danger');
    } finally {
      this.loading.set(false);
    }
  }
}
