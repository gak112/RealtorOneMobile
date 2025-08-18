import { Component, OnInit, inject, signal } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  caretDownOutline,
  caretUpOutline,
  cloudUploadOutline,
  informationCircle,
  trashOutline,
} from 'ionicons/icons';

import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { SpecificationsComponent } from 'src/app/more/components/specifications/specifications.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { SpecviewComponent } from '../../../more/components/specview/specview.component';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import { VentureTowerComponent } from '../venture-tower/venture-tower.component';
import { VentureHousevillaComponent } from '../venture-housevilla/venture-housevilla.component';

// ---- AngularFire COMPAT (requested) ----
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { serverTimestamp } from '@angular/fire/firestore';

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
  return Number.isFinite(n) && n >= 0 && n <= 100 ? null : { percentRange: true };
}
function numberOrEmpty(ctrl: AbstractControl): ValidationErrors | null {
  const v = (ctrl.value ?? '').toString().trim();
  if (!v) return null;
  return isNaN(Number(v)) ? { number: true } : null;
}

@Component({
  selector: 'app-venture-step1',
  templateUrl: './venture-step1.component.html',
  styleUrls: ['./venture-step1.component.scss'],
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
    IonSelectOption,
    SpecviewComponent,
    IonImg,
    IonSelect,
    VentureTowerComponent,
    VentureHousevillaComponent,
    ReactiveFormsModule,
  ],
  providers: [ModalController],
})
export class VentureStep1Component implements OnInit {
  private modalController = inject(ModalController);
  private fb = inject(NonNullableFormBuilder);
  private afs = inject(AngularFirestore);

  // -------- UI State (signals) --------
  actionTab = signal<'towerAPT' | 'houseVilla'>('towerAPT');
  isTowerDataOpen = signal(false);
  saving = signal(false);
  savedId = signal<string | null>(null);
  submitted = signal(false);

  constructor() {
    addIcons({
      informationCircle,
      trashOutline,
      add,
      caretDownOutline,
      caretUpOutline,
      cloudUploadOutline,
    });
  }

  ngOnInit() {
    // Make Units required only when corresponding value is filled
    this.ventureForm.controls.landArea.valueChanges.subscribe(v => {
      const unitsCtrl = this.ventureForm.controls.landAreaUnits;
      if ((v ?? '').toString().trim()) {
        unitsCtrl.addValidators(Validators.required);
      } else {
        unitsCtrl.removeValidators(Validators.required);
      }
      unitsCtrl.updateValueAndValidity({ emitEvent: false });
    });

    this.ventureForm.controls.propertySizeBuildUp.valueChanges.subscribe(v => {
      const unitsCtrl = this.ventureForm.controls.propertySizeUnits;
      if ((v ?? '').toString().trim()) {
        unitsCtrl.addValidators(Validators.required);
      } else {
        unitsCtrl.removeValidators(Validators.required);
      }
      unitsCtrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  openTower() {
    this.isTowerDataOpen.set(!this.isTowerDataOpen());
  }

  // -------- Form Model --------
  ventureForm: FormGroup<VentureForm> = this.fb.group({
    ventureName: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(80)],
    }),
    description: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(2000)],
    }),
    ventureLocation: this.fb.control('', {
      validators: [Validators.required, Validators.maxLength(160)],
    }),
    ventureWebsite: this.fb.control('', { validators: [urlValidator] }),
    logo: this.fb.control(''),
    ventureImages: this.fb.control<string[]>([]),
    amenities: this.fb.control<string[]>([]),
    directors: this.fb.control('', { validators: [Validators.maxLength(2000)] }),
    companyName: this.fb.control('', { validators: [Validators.maxLength(120)] }),
    companyWebsite: this.fb.control('', { validators: [urlValidator] }),
    facebookLink: this.fb.control('', { validators: [urlValidator] }),
    instagramLink: this.fb.control('', { validators: [urlValidator] }),
    twitterLink: this.fb.control('', { validators: [urlValidator] }),
    brochure: this.fb.control(''),
    landArea: this.fb.control('', { validators: [numberOrEmpty, Validators.maxLength(12)] }),
    landAreaUnits: this.fb.control<'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre' | ''>(''),
    propertySizeBuildUp: this.fb.control('', { validators: [numberOrEmpty, Validators.maxLength(12)] }),
    propertySizeUnits: this.fb.control<'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre' | ''>(''),
    openArea: this.fb.control('', { validators: [percentValidator] }),
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

  addAmenity() {
    const next = [...this.ventureForm.controls.amenities.value];
    next.push('');
    this.ventureForm.controls.amenities.setValue(next);
    this.ventureForm.controls.amenities.markAsDirty();
  }
  removeAmenity(i: number) {
    const next = [...this.ventureForm.controls.amenities.value];
    next.splice(i, 1);
    this.ventureForm.controls.amenities.setValue(next);
    this.ventureForm.controls.amenities.markAsDirty();
  }
  addImage(urlOrId: string) {
    const imgs = [...this.ventureForm.controls.ventureImages.value, urlOrId];
    this.ventureForm.controls.ventureImages.setValue(imgs);
    this.ventureForm.controls.ventureImages.markAsDirty();
  }
  removeImage(i: number) {
    const imgs = [...this.ventureForm.controls.ventureImages.value];
    imgs.splice(i, 1);
    this.ventureForm.controls.ventureImages.setValue(imgs);
    this.ventureForm.controls.ventureImages.markAsDirty();
  }

  async amenitiesList() {
    const modal = await this.modalController.create({
      component: AmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss<string[]>();
    if (role === 'ok' && Array.isArray(data)) {
      this.ventureForm.controls.amenities.setValue(data);
      this.ventureForm.controls.amenities.markAsDirty();
    }
  }

  async openSpecifications() {
    const modal = await this.modalController.create({
      component: SpecificationsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  // -------- Submit (AngularFire COMPAT save with signals) --------
  async submit() {
    console.log(1);
    this.submitted.set(true);
    // business rule: at least one amenity
    if (this.ventureForm.controls.amenities.value.length === 0) {
      this.ventureForm.controls.amenities.setErrors({ minLen: true });
    }
    console.log(2);
    if (this.ventureForm.invalid) {
      this.ventureForm.markAllAsTouched();
      return;
    }
    console.log(3);
    const payload = {
      ...this.ventureForm.getRawValue(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: this.user?.uid ?? null,
    };
    console.log(4);

    this.saving.set(true);
    const docRef = await this.afs.collection('ventures').add(payload);
    this.savedId.set(docRef.id);
    this.saving.set(false);
  }

  // Upload stubs (wire your uploader here)
  onLogoComplete(_e: Event) {}
  uploadLogoValid(_e: Event) {}
  ventureImagesComplete(_e: Event) {}
  deleteImage(_e: any) {}
  onBrochureComplete(_e: Event) {}

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
  propertySizeUnits: FormControl<'Sq Feet' | 'Sq Yard' | 'Sq Mtr' | 'Acre' | ''>;
  openArea: FormControl<string>;
  towerAPT: FormControl<string>;
  houseVilla: FormControl<string>;
};
