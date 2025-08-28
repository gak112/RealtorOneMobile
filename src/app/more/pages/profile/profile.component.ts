import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
  ToastController,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  createOutline,
  informationCircle,
} from 'ionicons/icons';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { serverTimestamp } from '@angular/fire/firestore';
import { IUser } from '../../../auth/models/user.model';

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  map,
  of,
  switchMap,
  take,
  timeout,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    IonSpinner,
    IonImg,
    IonLabel,
    IonIcon,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonFooter,
    ReactiveFormsModule,
  ],
})
export class ProfileComponent implements OnInit {
  // --- DI ---
  private readonly modalController = inject(ModalController);
  private readonly toastCtrl = inject(ToastController);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly afs = inject(AngularFirestore); // compat
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  // --- UI state (signals) ---
  saving = signal(false);
  loadingProfile = signal(true);
  mobileChecking = signal(false);
  mobileTaken = signal(false);
  emailChecking = signal(false);
  emailTaken = signal(false);

  // --- current user id ---
  private uid: string | null = null;

  // --- form ---
  profileForm = this.fb.group({
    fullName: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),

    mobileNoVerified: this.fb.control<boolean>(false),
    phone: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(/^\d{10}$/)],
    }),
    emailVerified: this.fb.control<boolean>(false),
    email: this.fb.control('', { validators: [Validators.email] }),
    gender: this.fb.control<
      'male' | 'female' | 'other' | 'preferNotToDisclose' | ''
    >(''),
    photo: this.fb.control(''),
    dob: this.fb.control(''),
  });

  constructor() {
    addIcons({ createOutline, arrowBackOutline, informationCircle });
  }

  async ngOnInit() {
    try {
      // 1) load auth user (first emission)
      const user = await firstValueFrom<IUser | null>(
        this.auth.user$.pipe(
          filter((u): u is IUser => !!u), // wait until we have a real user
          timeout({ first: 10000 }), // bail out if nothing after 10s
          catchError(() => of(null)) // convert timeout/other errors to null
        )
      );
      this.uid = (user as any)?.Uid ?? (user as any)?.uid ?? null;

      // 2) preload profile
      if (this.uid) {
        const docSnap = await firstValueFrom(
          this.afs.doc(`users/${this.uid}`).valueChanges().pipe(take(1))
        ).catch(() => null);

        if (docSnap) {
          const doc: any = docSnap;
          this.profileForm.patchValue({
            fullName: doc.fullName ?? '',
            mobileNoVerified: !!doc.mobileNoVerified,
            phone: doc.phone ?? '',
            emailVerified: !!doc.emailVerified,
            email: doc.email ?? '',
            gender: doc.gender ?? '',
            photo: doc.photo ?? '',
            dob: doc.dob ?? '',
          });
        }
      }
    } catch (err) {
      console.error('[Profile] load error:', err);
      this.presentToast('Failed to load profile. Please try again.', 'danger');
    } finally {
      this.loadingProfile.set(false);
    }

    // 3) async “already taken” checks (exclude current uid)

    // Mobile
    this.profileForm.controls.phone.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((phone) => {
          this.mobileTaken.set(false);
          if (!phone || !/^\d{10}$/.test(phone)) {
            this.mobileChecking.set(false);
            return of([]);
          }
          this.mobileChecking.set(true);
          return this.afs
            .collection('users', (ref) =>
              ref.where('phone', '==', phone)
            )
            .valueChanges({ idField: 'id' })
            .pipe(take(1));
        }),
        map((list: any[]) => {
          this.mobileChecking.set(false);
          if (!Array.isArray(list)) return false;
          return list.some((u: any) => (u.id ?? u.uid) !== this.uid);
        })
      )
      .subscribe((taken) => this.mobileTaken.set(!!taken));

    // Email
    this.profileForm.controls.email.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((email) => {
          this.emailTaken.set(false);
          if (!email || this.profileForm.controls.email.invalid) {
            this.emailChecking.set(false);
            return of([]);
          }
          this.emailChecking.set(true);
          return this.afs
            .collection('users', (ref) => ref.where('email', '==', email))
            .valueChanges({ idField: 'id' })
            .pipe(take(1));
        }),
        map((list: any[]) => {
          this.emailChecking.set(false);
          if (!Array.isArray(list)) return false;
          return list.some((u: any) => (u.id ?? u.uid) !== this.uid);
        })
      )
      .subscribe((taken) => this.emailTaken.set(!!taken));
  }

  showError(key: keyof typeof this.profileForm.controls, err: string): boolean {
    const c = this.profileForm.controls[key];
    return !!(c && c.touched && c.invalid && c.errors?.[err]);
  }

  async updateProfile() {
    // basic validation
    if (this.profileForm.invalid) {
      const firstInvalid = Object.values(this.profileForm.controls).find(
        (c) => c.invalid
      );
      firstInvalid?.markAsTouched();
      this.presentToast('Please fix highlighted fields.', 'warning');
      return;
    }
    if (this.mobileTaken() || this.emailTaken()) {
      Object.values(this.profileForm.controls).forEach((c) =>
        c.markAsTouched()
      );
      this.presentToast('Email or phone already in use.', 'danger');
      return;
    }
    if (!this.uid) {
      this.presentToast('No authenticated user.', 'danger');
      return;
    }
    if (this.saving()) return;

    this.saving.set(true);
    this.profileForm.disable({ emitEvent: false });

    try {
      const v = this.profileForm.getRawValue();

      const payload: IProfile = {
        fullName: v.fullName!.trim(),
        mobileNoVerified: !!v.mobileNoVerified,
        phone: v.phone!.trim(),
        emailVerified: !!v.emailVerified,
        email: (v.email || '').trim(),
        gender: (v.gender as any) || '',
        photo: (v.photo || '').trim(),
        dob: v.dob || '',
      };

      const writeObj: any = {
        ...payload,
        updatedAt: serverTimestamp(),
      };

      await this.afs.doc(`users/${this.uid}`).set(writeObj, { merge: true });

      this.profileForm.markAsPristine();
      this.presentToast('Profile updated successfully.', 'success');
    } catch (err) {
      console.error('[Profile] update error:', err);
      this.presentToast(
        'Failed to update profile. Please try again.',
        'danger'
      );
    } finally {
      this.saving.set(false);
      this.profileForm.enable({ emitEvent: false });
    }
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  // --- helpers ---
  private async presentToast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'
  ) {
    const t = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'top',
      color,
    });
    await t.present();
  }
}

// DB payload typing
export interface IProfile {
  fullName: string;
  mobileNoVerified: boolean;
  phone: string;
  emailVerified: boolean;
  email: string;
  gender: 'male' | 'female' | 'other' | 'preferNotToDisclose' | '';
  photo: string;
  dob: string;
  // Optionally on the doc:
  // updatedAt?: Timestamp | FieldValue;
}
