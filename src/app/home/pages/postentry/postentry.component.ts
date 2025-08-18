import {
  Component,
  OnInit,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  cloudUploadOutline,
  trashOutline,
  caretDownOutline,
} from 'ionicons/icons';

// AngularFire **compat** (v6 API)
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import {
  forwardEnterAnimation,
  backwardEnterAnimation,
} from 'src/app/services/animation';
import { LocationComponent } from '../location/location.component';
import { finalize } from 'rxjs/operators';

// If you actually use these modals, keep imports; otherwise you can remove.
// import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
// import { LocationComponent } from '../location/location.component';
// import { forwardEnterAnimation, backwardEnterAnimation } from 'src/app/services/animation';

type SaveError = { code?: string; message: string };

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
export class PostentryComponent implements OnInit {
  // Signals as inputs (don’t interpolate in template; always call as fn)
  readonly actionType = input<'residential' | 'commercial' | 'plots' | 'lands'>(
    'residential'
  );
  readonly action = input<'rent' | 'sale'>('rent');

  // Local UI state
  ageOfPropertyAction = signal<'underconstruction' | 'noofyears'>(
    'underconstruction'
  );
  loading = signal(false);
  saveError = signal<SaveError | null>(null);

  // Upload previews/state
  imageUrls = signal<string[]>([]);

  private fb = inject(FormBuilder);
  private afs = inject(AngularFirestore); // compat
  private storage = inject(AngularFireStorage); // compat
  private modalController = inject(ModalController);

  floors = [
    '1st Floor',
    '2nd Floor',
    '3rd Floor',
    '4th Floor',
    '5th Floor',
    '6th Floor',
    '7th Floor',
    '8th Floor',
    '9th Floor',
    '10th Floor',
    '+10 Floor',
  ];

  // Simple numeric validators
  private gtZero = (c: AbstractControl): ValidationErrors | null => {
    const n = Number(c.value);
    return isNaN(n) || n <= 0 ? { gtZero: true } : null;
  };
  private gteZero = (c: AbstractControl): ValidationErrors | null => {
    const v = c.value;
    if (v === null || v === '' || v === undefined) return { required: true };
    const n = Number(v);
    return isNaN(n) || n < 0 ? { gteZero: true } : null;
  };

  postEntryForm = this.fb.group({
    title: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),

    houseType: this.fb.control<string | null>(null),
    bhkType: this.fb.control<string | null>(null),
    floor: this.fb.control<string | null>(null),

    propertySize: this.fb.control<number | null>(null, {
      validators: [this.gtZero],
    }),
    totalPropertyUnits: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),

    propertySizeBuildUp: this.fb.control<number | null>(null, {
      validators: [this.gtZero],
    }),
    propertyUnits: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),

    northFacing: this.fb.control<string | null>(null),
    northSize: this.fb.control<number | null>(null),
    southFacing: this.fb.control<string | null>(null),
    southSize: this.fb.control<number | null>(null),
    eastFacing: this.fb.control<string | null>(null),
    eastSize: this.fb.control<number | null>(null),
    westFacing: this.fb.control<string | null>(null),
    westSize: this.fb.control<number | null>(null),
    units: this.fb.control<string>('Ft', { nonNullable: true }),

    toilets: this.fb.control<number | null>(0, { validators: [this.gteZero] }),
    poojaRoom: this.fb.control<number | null>(0, {
      validators: [this.gteZero],
    }),
    livingDining: this.fb.control<number | null>(0, {
      validators: [this.gteZero],
    }),
    kitchen: this.fb.control<number | null>(0, { validators: [this.gteZero] }),

    noOfYears: this.fb.control<number | null>(null),

    rent: this.fb.control<number | null>(null),
    rentUnits: this.fb.control<string | null>(null),
    costOfProperty: this.fb.control<number | null>(null),

    addressOfProperty: this.fb.control<string | null>(null),
    description: this.fb.control<string | null>(null),

    // uploads
    logo: this.fb.control<string>('', { nonNullable: true }),
    images: this.fb.control<string[]>([], { nonNullable: true }),
    amenities: this.fb.control<string[]>([], { nonNullable: true }),
  });

  ctrl = (k: keyof typeof this.postEntryForm.controls) =>
    this.postEntryForm.controls[k] as AbstractControl;

  constructor() {
    addIcons({ add, cloudUploadOutline, trashOutline, caretDownOutline });

    // Reactive validation depending on signals
    effect(() => {
      // Residential-only required fields
      const isRes = this.actionType() === 'residential';
      this.setRequired(this.ctrl('houseType'), isRes);
      this.setRequired(this.ctrl('bhkType'), isRes);
      this.setRequired(this.ctrl('floor'), isRes);

      // Age-of-property: require noOfYears when needed
      const needYears = this.ageOfPropertyAction() === 'noofyears';
      this.ctrl('noOfYears').setValidators(needYears ? [this.gteZero] : []);
      this.ctrl('noOfYears').updateValueAndValidity({ emitEvent: false });

      // Rent vs Sale
      if (this.action() === 'rent') {
        this.ctrl('rent').setValidators([this.gtZero]);
        this.ctrl('rentUnits').setValidators([Validators.required]);
        this.ctrl('costOfProperty').clearValidators();
      } else {
        this.ctrl('rent').clearValidators();
        this.ctrl('rentUnits').clearValidators();
        this.ctrl('costOfProperty').setValidators([this.gtZero]);
      }
      this.ctrl('rent').updateValueAndValidity({ emitEvent: false });
      this.ctrl('rentUnits').updateValueAndValidity({ emitEvent: false });
      this.ctrl('costOfProperty').updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit(): void {}

  private setRequired(control: AbstractControl, required: boolean) {
    if (required) control.setValidators([Validators.required]);
    else control.clearValidators();
    control.updateValueAndValidity({ emitEvent: false });
  }

  // Segment change handler for age-of-property
  ageOfPropertyChanged(e: CustomEvent) {
    const val = (e as any)?.detail?.value as 'underconstruction' | 'noofyears';
    if (val) this.ageOfPropertyAction.set(val);
  }

  // ---------------------------
  // Uploads (Images multiple)
  // ---------------------------

  imgsBusy = signal(false);
  imgsPct = signal<number>(0); // average % for a batch

  selectVentureImages(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length === 0) return;

    this.imgsBusy.set(true);
    let completed = 0;
    const total = files.length;

    files.forEach((file) => {
      const path = `posts/${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}_${file.name}`;
      const task = this.storage.upload(path, file);
      const ref = this.storage.ref(path);

      task.percentageChanges().subscribe((p) => {
        // simple average
        const current = Math.round(p ?? 0);
        // not exact average, but lightweight: show latest file pct
        this.imgsPct.set(current);
      });

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe((url) => {
              const imgs = [...this.postEntryForm.controls.images.value, url];
              this.postEntryForm.controls.images.setValue(imgs);
              completed += 1;
              if (completed === total) {
                this.imgsBusy.set(false);
                this.imgsPct.set(100);
                setTimeout(() => this.imgsPct.set(0), 600);
              }
            });
          })
        )
        .subscribe();
    });
  }

  deleteImageByUrl(url: string) {
    const imgs = this.postEntryForm.controls.images.value.filter(
      (u) => u !== url
    );
    this.postEntryForm.controls.images.setValue(imgs);
    this.storage.refFromURL(url).delete();
  }

  // ---------------------------
  // Submit to Firestore (compat)
  // ---------------------------
  async submit() {
    console.log(this.postEntryForm.value);
    this.saveError.set(null);
    this.postEntryForm.updateValueAndValidity();
    if (this.postEntryForm.invalid) {
      this.postEntryForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    try {
      const v = this.postEntryForm.getRawValue();

      const payload = {
        title: (v.title ?? '').trim(),

        houseType: v.houseType ?? '',
        bhkType: v.bhkType ?? '',
        floor: v.floor ?? '',

        propertySize: v.propertySize ?? null,
        totalPropertyUnits: v.totalPropertyUnits ?? '',
        propertySizeBuildUp: v.propertySizeBuildUp ?? null,
        propertyUnits: v.propertyUnits ?? '',

        northFacing: v.northFacing ?? '',
        northSize: v.northSize ?? null,
        southFacing: v.southFacing ?? '',
        southSize: v.southSize ?? null,
        eastFacing: v.eastFacing ?? '',
        eastSize: v.eastSize ?? null,
        westFacing: v.westFacing ?? '',
        westSize: v.westSize ?? null,
        units: v.units ?? 'Ft',

        toilets: v.toilets ?? 0,
        poojaRoom: v.poojaRoom ?? 0,
        livingDining: v.livingDining ?? 0,
        kitchen: v.kitchen ?? 0,

        ageOfPropertyAction: this.ageOfPropertyAction(),
        noOfYears:
          this.ageOfPropertyAction() === 'noofyears' ? v.noOfYears ?? 0 : null,

        action: this.action(),
        actionType: this.actionType(),

        rent: this.action() === 'rent' ? v.rent ?? null : null,
        rentUnits: this.action() === 'rent' ? v.rentUnits ?? '' : '',
        costOfProperty:
          this.action() === 'sale' ? v.costOfProperty ?? null : null,

        addressOfProperty: v.addressOfProperty ?? '',
        description: v.description ?? '',

        images:
          (v.images && v.images.length ? v.images : this.imageUrls()) ?? [],
        amenities: v.amenities ?? [],

        // compact-ish metadata
        createdAt: new Date(),
        status: 'pending',
        sortDate: Date.now(),
      };

      await this.afs.collection('requests').add(payload);

      // Reset form & UI
      this.postEntryForm.reset({
        title: '',
        houseType: null,
        bhkType: null,
        floor: null,
        propertySize: null,
        totalPropertyUnits: null,
        propertySizeBuildUp: null,
        propertyUnits: null,
        northFacing: null,
        northSize: null,
        southFacing: null,
        southSize: null,
        eastFacing: null,
        eastSize: null,
        westFacing: null,
        westSize: null,
        units: 'Ft',
        toilets: 0,
        poojaRoom: 0,
        livingDining: 0,
        kitchen: 0,
        noOfYears: null,
        rent: null,
        rentUnits: null,
        costOfProperty: null,
        addressOfProperty: null,
        description: null,
        logo: '',
        images: [],
        amenities: [],
      });
      this.imageUrls.set([]);
    } catch (err: any) {
      this.saveError.set({
        message: err?.message ?? 'Failed to save the request',
      });
    } finally {
      this.loading.set(false);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  // Stubs for your existing modals (uncomment if you have them wired)
  async amenitiesList() {
    const modal = await this.modalController.create({
      component: AmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  async openLocation() {
    const modal = await this.modalController.create({
      component: LocationComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
}
