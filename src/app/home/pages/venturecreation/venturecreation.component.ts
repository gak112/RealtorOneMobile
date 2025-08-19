import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  ModalController,
  IonFooter,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  caretDownOutline,
  caretUpOutline,
  chevronBackOutline,
  close,
  cloudUploadOutline,
  informationCircle,
  trashOutline,
} from 'ionicons/icons';

import { UcWidgetModule } from 'ngx-uploadcare-widget';
import {
  SpecificationsComponent,
  SpecSection,
} from 'src/app/more/components/specifications/specifications.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { SpecviewComponent } from '../../../more/components/specview/specview.component';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';

// ---- AngularFire COMPAT (requested) ----
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { serverTimestamp } from '@angular/fire/firestore';
import { VentureTowerComponent } from '../../components/venture-tower/venture-tower.component';
import { VentureHousevillaComponent } from '../../components/venture-housevilla/venture-housevilla.component';
import { LocationComponent } from '../location/location.component';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

// ---------- Validators ----------
function urlValidator(ctrl: AbstractControl): ValidationErrors | null {
  const v = (ctrl.value ?? '').toString().trim();
  if (!v) return null; // allow empty unless required
  const ok = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v);
  return ok ? null : { url: true };
}
function percentValidator(ctrl: AbstractControl): ValidationErrors | null {
  const v = (ctrl.value ?? '').toString().trim();
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && n <= 100
    ? null
    : { percentRange: true };
}
function numberOrEmpty(ctrl: AbstractControl): ValidationErrors | null {
  const v = (ctrl.value ?? '').toString().trim();
  if (!v) return null;
  return isNaN(Number(v)) ? { number: true } : null;
}

@Component({
  selector: 'app-venturecreation',
  templateUrl: './venturecreation.component.html',
  styleUrls: ['./venturecreation.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonIcon,
    IonTextarea,
    IonBadge,
    FormsModule,
    UcWidgetModule,
    IonLabel,
    IonButton,
    IonFooter,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    IonSelectOption,
    SpecviewComponent,
    IonImg,
    IonSelect,
    VentureTowerComponent,
    VentureHousevillaComponent,
    ReactiveFormsModule,
  ],
})
export class VenturecreationComponent implements OnInit {
  dismiss() {
    this.modalController.dismiss();
  }

  async openLocation() {
    const modal = await this.modalController.create({
      component: LocationComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });

    await modal.present();
  }

  private modalController = inject(ModalController);
  private fb = inject(NonNullableFormBuilder);
  private afs = inject(AngularFirestore);

  // -------- UI State (signals) --------
  actionTab = signal<'towerAPT' | 'houseVilla'>('towerAPT');
  isTowerDataOpen = signal(false);
  saving = signal(false);
  savedId = signal<string | null>(null);
  submitted = signal(false);

  // Upload progress signals
  logoPct = signal<number | null>(null); // 0..100
  imgsBusy = signal(false);
  imgsPct = signal<number>(0); // average % for a batch
  brochurePct = signal<number | null>(null);

  constructor() {
    addIcons({
      informationCircle,
      trashOutline,
      add,
      caretDownOutline,
      caretUpOutline,
      cloudUploadOutline,
      chevronBackOutline,
      close,
    });
  }

  ngOnInit() {
    // Units required only when respective numeric value present
    this.ventureForm.controls.landArea.valueChanges.subscribe((v) => {
      const unitsCtrl = this.ventureForm.controls.landAreaUnits;
      if ((v ?? '').toString().trim()) {
        unitsCtrl.addValidators(Validators.required);
      } else {
        unitsCtrl.removeValidators(Validators.required);
      }
      unitsCtrl.updateValueAndValidity({ emitEvent: false });
    });

    this.ventureForm.controls.propertySizeBuildUp.valueChanges.subscribe(
      (v) => {
        const unitsCtrl = this.ventureForm.controls.propertySizeUnits;
        if ((v ?? '').toString().trim()) {
          unitsCtrl.addValidators(Validators.required);
        } else {
          unitsCtrl.removeValidators(Validators.required);
        }
        unitsCtrl.updateValueAndValidity({ emitEvent: false });
      }
    );
  }

  openTower() {
    this.isTowerDataOpen.set(!this.isTowerDataOpen());
  }

  // ---------- Validators ----------
  private urlValidator(ctrl: AbstractControl): ValidationErrors | null {
    const v = (ctrl.value ?? '').toString().trim();
    if (!v) return null;
    const ok = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v);
    return ok ? null : { url: true };
  }
  private percentValidator(ctrl: AbstractControl): ValidationErrors | null {
    const v = (ctrl.value ?? '').toString().trim();
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 && n <= 100
      ? null
      : { percentRange: true };
  }
  private numberOrEmpty(ctrl: AbstractControl): ValidationErrors | null {
    const v = (ctrl.value ?? '').toString().trim();
    if (!v) return null;
    return isNaN(Number(v)) ? { number: true } : null;
  }

  // -------- Form Model --------
  ventureForm: FormGroup<VentureForm> = this.fb.group({
    ventureName: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80),
      ],
    }),
    description: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000),
      ],
    }),
    ventureLocation: this.fb.control('', {
      validators: [Validators.required, Validators.maxLength(160)],
    }),
    ventureWebsite: this.fb.control('', {
      validators: [this.urlValidator.bind(this)],
    }),
    logo: this.fb.control(''),
    ventureImages: this.fb.control<string[]>([]),
    amenities: this.fb.control<string[]>([]),
    directors: this.fb.control('', {
      validators: [Validators.maxLength(2000)],
    }),
    companyName: this.fb.control('', {
      validators: [Validators.maxLength(120)],
    }),
    companyWebsite: this.fb.control('', {
      validators: [this.urlValidator.bind(this)],
    }),
    facebookLink: this.fb.control('', {
      validators: [this.urlValidator.bind(this)],
    }),
    instagramLink: this.fb.control('', {
      validators: [this.urlValidator.bind(this)],
    }),
    twitterLink: this.fb.control('', {
      validators: [this.urlValidator.bind(this)],
    }),
    brochure: this.fb.control(''),
    landArea: this.fb.control('', {
      validators: [this.numberOrEmpty.bind(this), Validators.maxLength(12)],
    }),
    landAreaUnits: this.fb.control<
      'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre' | ''
    >(''),
    propertySizeBuildUp: this.fb.control('', {
      validators: [this.numberOrEmpty.bind(this), Validators.maxLength(12)],
    }),
    propertySizeUnits: this.fb.control<
      'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre' | ''
    >(''),
    openArea: this.fb.control('', {
      validators: [this.percentValidator.bind(this)],
    }),
    towerAPT: this.fb.control(''),
    houseVilla: this.fb.control(''),
  });

  // -------- Helpers for HTML --------
  isInvalid<K extends keyof VentureForm>(key: K): boolean {
    const c = this.ventureForm.controls[key] as unknown as AbstractControl;
    return !!c.invalid && (!!c.touched || this.submitted());
  }
  hasError<K extends keyof VentureForm>(key: K, error: string): boolean {
    const c = this.ventureForm.controls[key] as unknown as AbstractControl;
    return c.hasError(error);
  }

  // ---------- Uploads (AngularFire Storage compat) ----------
  private storage = inject(AngularFireStorage);
  selectLogo(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const path = `posts/${Date.now()}_${file.name}`;
    const task = this.storage.upload(path, file);
    const ref = this.storage.ref(path);

    task
      .percentageChanges()
      .subscribe((p) => this.logoPct.set(Math.round(p ?? 0)));
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe((url) => {
            this.ventureForm.controls.logo.setValue(url);
            this.logoPct.set(null);
          });
        })
      )
      .subscribe();
  }

  clearLogo() {
    const url = this.ventureForm.controls.logo.value;
    if (url) {
      this.storage.refFromURL(url).delete();
      this.ventureForm.controls.logo.setValue('');
    }
  }

  selectBrochure(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const path = `posts/${Date.now()}_${file.name}`;
    const task = this.storage.upload(path, file);
    const ref = this.storage.ref(path);

    task
      .percentageChanges()
      .subscribe((p) => this.brochurePct.set(Math.round(p ?? 0)));
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe((url) => {
            this.ventureForm.controls.brochure.setValue(url);
            this.brochurePct.set(null);
          });
        })
      )
      .subscribe();
  }

  clearBrochure() {
    const url = this.ventureForm.controls.brochure.value;
    if (url) {
      this.storage.refFromURL(url).delete();
      this.ventureForm.controls.brochure.setValue('');
    }
  }

  selectVentureImages(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length === 0) return;

    this.imgsBusy.set(true);
    let completed = 0;
    const total = files.length;

    files.forEach((file) => {
      const path = `ventures/images/${Date.now()}_${Math.random()
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
              const imgs = [
                ...this.ventureForm.controls.ventureImages.value,
                url,
              ];
              this.ventureForm.controls.ventureImages.setValue(imgs);
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
    const imgs = this.ventureForm.controls.ventureImages.value.filter(
      (u) => u !== url
    );
    this.ventureForm.controls.ventureImages.setValue(imgs);
    this.storage.refFromURL(url).delete();
  }

  // async amenitiesList() {
  //   const modal = await this.modalController.create({
  //     component: AmenitiesComponent,
  //     enterAnimation: forwardEnterAnimation,
  //     leaveAnimation: backwardEnterAnimation,
  //   });
  //   await modal.present();
  //   const { data, role } = await modal.onDidDismiss<string[]>();
  //   if (role === 'ok' && Array.isArray(data)) {
  //     this.ventureForm.controls.amenities.setValue(data);
  //     this.ventureForm.controls.amenities.markAsDirty();
  //   }
  // }

  // Save selected amenities here (names only to keep it simple)
  amenities = signal<string[]>([]);

  // Optional: chip view
  hasAmenities = computed(() => this.amenities().length > 0);

  async openAmenities() {
    const modal = await this.modalController.create({
      component: AmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: {
        selectedAmenities: this.amenities(),
      },
      // presentInPopover: false, // optional
    });
    await modal.present();

    const { data } = await modal.onWillDismiss<string[]>();
    if (data) {
      // Overwrite with the selection returned from the picker
      this.amenities.set(data);
    }
  }

  // Example: consume amenities when saving venture
  saveVenture() {
    const payload = {
      // ... other venture fields ...
      amenities: this.amenities(),
    };
    console.log('Venture payload:', payload);
    // Save to Firestore / API here
  }

  removeAmenity(index: number) {
    const list = [...this.amenities()];
    list.splice(index, 1);
    this.amenities.set(list);
  }

  // async openSpecifications() {
  //   const modal = await this.modalController.create({
  //     component: SpecificationsComponent,
  //     enterAnimation: forwardEnterAnimation,
  //     leaveAnimation: backwardEnterAnimation,
  //   });
  //   await modal.present();
  // }

  // The Venture page holds the specs in a signal
  specifications = signal<SpecSection[]>([]);

  hasSpecs = computed(() => this.specifications().length > 0);

  async openSpecifications() {
    const modal = await this.modalController.create({
      component: SpecificationsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: {
        // Pass existing specs for editing if needed
        sections: this.specifications(),
      },
      canDismiss: true,
      showBackdrop: true,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'submit' && data?.sections) {
      // Save returned specs to the Venture page list (signal)
      this.specifications.set(data.sections as SpecSection[]);
    }
  }

  // optional: clear
  clearSpecs() {
    this.specifications.set([]);
  }

  // -------- Submit (Firestore compat) --------
  async submit() {
    this.submitted.set(true);

    // ensure at least one amenity (business rule)
    if (this.ventureForm.controls.amenities.value.length === 0) {
      this.ventureForm.controls.amenities.setErrors({ minLen: true });
    }
    if (this.ventureForm.invalid) {
      this.ventureForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.ventureForm.getRawValue(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: this.user?.uid ?? null,
    };

    this.saving.set(true);
    const ref = await this.afs.collection('ventures').add(payload);
    this.savedId.set(ref.id);
    this.saving.set(false);
  }

  user: any;
}

// -------- Types --------
type VentureForm = {
  ventureName: FormControl<string>;
  description: FormControl<string>;
  ventureLocation: FormControl<string>;
  ventureWebsite: FormControl<string>;
  logo: FormControl<string>;
  ventureImages: FormControl<string[]>;
  amenities: FormControl<string[]>;
  directors: FormControl<string>;
  companyName: FormControl<string>;
  companyWebsite: FormControl<string>;
  facebookLink: FormControl<string>;
  instagramLink: FormControl<string>;
  twitterLink: FormControl<string>;
  brochure: FormControl<string>;
  landArea: FormControl<string>;
  landAreaUnits: FormControl<'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre' | ''>;
  propertySizeBuildUp: FormControl<string>;
  propertySizeUnits: FormControl<
    'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre' | ''
  >;
  openArea: FormControl<string>;
  towerAPT: FormControl<string>;
  houseVilla: FormControl<string>;
};
