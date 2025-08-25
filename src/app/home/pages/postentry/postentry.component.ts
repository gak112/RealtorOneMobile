import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Input,
  OnInit,
  signal,
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

import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

type HouseType =
  | 'Apartment'
  | 'Individual House/Villa'
  | 'Independent / Builder Floor'
  | 'Farm House'
  | 'Service Apartment'
  | 'Other'
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
  | 'Retail'
  | 'Office'
  | 'Warehouse'
  | 'Factory'
  | 'Industriy'
  | 'Hospitality'
  | 'Land'
  | 'Other';
type CommercialSubType = 'Complex' | 'Individual';
type AvailabilityStatus = 'Ready to move' | 'Under construction' | null;
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
  availabilityStatus: FormControl<AvailabilityStatus | null>;
  securityDeposit: FormControl<number | null>;

  totalPropertyUnits: FormControl<Units | null>;
  propertySize: FormControl<number | null>;
  propertySizeBuiltup: FormControl<number | null>;
  sizeBuiltupUnits: FormControl<Units | null>;

  facingUnits: FormControl<Units | null>;
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

  amenities: FormControl<string[] | null>;
  ageOfProperty: FormControl<string | null>;

  priceOfSale: FormControl<number | null>;
  priceOfRent: FormControl<number | null>;
  priceOfRentType: FormControl<RentType | null>;

  addressOfProperty: FormControl<string | null>;
  lat: FormControl<number | null>;
  lng: FormControl<number | null>;

  description: FormControl<string | null>;
  negotiable: FormControl<boolean | null>;

  images: FormControl<string[] | null>; // previews (data URLs / remote URLs)
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
  private afs = inject(Firestore);
  private storage = inject(Storage);

  // Inputs
  @Input() saleType: 'sale' | 'rent' = 'sale';
  @Input() category: 'residential' | 'commercial' | 'plots' | 'lands' =
    'residential';
  @Input() editId: string | null = null;

  // Signals/UI
  readonly saleTypeSig = signal<'sale' | 'rent'>(this.saleType);
  readonly categorySig = signal<
    'residential' | 'commercial' | 'plots' | 'lands'
  >(this.category);
  readonly loading = signal(false);
  readonly pageError = signal<string | null>(null);

  readonly isEdit = computed(() => !!this.editId);
  readonly headerTitle = computed(() =>
    this.isEdit() ? 'Edit Property Details' : 'Property Details Entry'
  );
  readonly actionLabel = computed(() => (this.isEdit() ? 'Update' : 'Submit'));
  readonly floors = [
    'Ground',
    ...Array.from({ length: 40 }, (_, i) => `${i + 1}`),
  ];

  // Form
  postEntryForm = this.fb.group<PostEntryForm>({
    propertyTitle: this.fb.control<string | null>(''),

    houseType: this.fb.control<HouseType | null>(null),
    houseCondition: this.fb.control<'Old Houses' | 'New Houses' | null>(null),
    rooms: this.fb.control<number | null>(null),
    bhkType: this.fb.control<BHKType | null>(null),
    furnishingType: this.fb.control<FurnishingType | null>(null),

    commercialType: this.fb.control<CommercialType | null>(null),
    commercialSubType: this.fb.control<CommercialSubType | null>(null),
    availabilityStatus: this.fb.control<AvailabilityStatus | null>(null),
    securityDeposit: this.fb.control<number | null>(null),

    totalPropertyUnits: this.fb.control<Units | null>(DEFAULT_UNITS),
    propertySize: this.fb.control<number | null>(null),
    propertySizeBuiltup: this.fb.control<number | null>(null),
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

  ctrl = (n: keyof PostEntryForm) => this.postEntryForm.controls[n];

  // Convert any control’s valueChanges to a signal (reactive to form updates)
  private sel<T>(name: keyof PostEntryForm) {
    const c = this.postEntryForm.controls[name];
    return toSignal(c.valueChanges as unknown as Observable<T>, {
      initialValue: c.value as T,
    });
  }

  // Facing units short label
  readonly facingUnitsSig = this.sel<Units | null>('facingUnits');
  readonly unitShort = computed(() => {
    switch (this.facingUnitsSig() || DEFAULT_UNITS) {
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

  // Amenities chip view (signal mirrors the control via a reactive signal)
  amenities = signal<string[]>([]);
  private readonly amenitiesCtrlSig = this.sel<string[] | null>('amenities');
  // ✅ This effect now reacts because it reads a SIGNAL (amenitiesCtrlSig)
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

    effect(() => {
      this.amenities.set(this.amenitiesCtrlSig() ?? []);
    });
  }

  hasAmenities = computed(() => this.amenities().length > 0);

  // Media limits/types
  static readonly MAX_IMAGES = 3;
  static readonly MAX_IMAGE_BYTES = 6 * 1024 * 1024;
  static readonly ACCEPTED_IMAGES = new Set([
    'image/jpeg',
    'image/png',
    'image/jpg',
  ]);

  static readonly ACCEPTED_VIDEOS = new Set([
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ]);
  static readonly MAX_VIDEO_SECS = 20;
  static readonly MAX_VIDEO_BYTES = 40 * 1024 * 1024;

  readonly MAX_FILES = PostentryComponent.MAX_IMAGES;

  // New selections
  private newImageFiles: File[] = [];
  private newImagePreviews = signal<string[]>([]);
  private newVideoFile: File | null = null;
  private newVideoPreview = signal<string | null>(null);

  // Existing media (edit mode)
  private existingImageUrls = signal<string[]>([]);
  private existingVideoUrl = signal<string | null>(null);

  // Previews for UI
  allImagePreviews = computed(() => [
    ...this.existingImageUrls(),
    ...this.newImagePreviews(),
  ]);
  videoPreview = computed(
    () => this.newVideoPreview() || this.existingVideoUrl()
  );

  // State
  imgsBusy = signal(false);
  imgsPct = signal(0);

  // Draft key
  private static readonly DRAFT_IMG_KEY =
    'realtorone.postentry.draft.v1.images';

  // Persist draft previews of new images
  ngOnInit(): void {
    // init segments
    this.saleTypeSig.set(this.saleType);
    this.categorySig.set(this.category);

    if (!this.editId) {
      try {
        const raw = localStorage.getItem(PostentryComponent.DRAFT_IMG_KEY);
        const arr = raw ? (JSON.parse(raw) as string[]) : [];
        if (Array.isArray(arr) && arr.length)
          this.newImagePreviews.set(
            arr.slice(0, PostentryComponent.MAX_IMAGES)
          );
      } catch {
        /* ignore */
      }
    } else {
      this.hydrateEdit(this.editId).catch((e) => {
        this.pageError.set(this.mapError(e));
      });
    }

    // save draft when previews change
    effect(() => {
      try {
        localStorage.setItem(
          PostentryComponent.DRAFT_IMG_KEY,
          JSON.stringify(this.newImagePreviews())
        );
      } catch {
        /* ignore */
      }
    });
  }

  // ====================== UI helpers
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
  dismiss() {
    this.modalCtrl
      .getTop()
      .then((m) => (m ? m.dismiss() : this.nav.back()) as void);
  }

  // ====================== Amenities
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
  removeAmenity(i: number) {
    const list = [...this.amenities()];
    list.splice(i, 1);
    this.amenities.set(list);
    this.ctrl('amenities').setValue(list as never);
  }

  // ====================== Location
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

  // ====================== Images (max 3)
  async selectImages(evt: Event) {
    const input = evt.target as HTMLInputElement | null;
    const files = Array.from(input?.files ?? []);
    if (!files.length) return;

    const already = this.existingImageUrls().length + this.newImageFiles.length;
    if (already + files.length > PostentryComponent.MAX_IMAGES) {
      this.toast(
        `Only ${PostentryComponent.MAX_IMAGES} images allowed total.`,
        'danger'
      );
      if (input) input.value = '';
      return;
    }

    this.imgsBusy.set(true);
    this.pageError.set(null);

    try {
      let accepted = 0;
      const newPreviews = [...this.newImagePreviews()];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!PostentryComponent.ACCEPTED_IMAGES.has(f.type)) {
          await this.toast(`${f.name}: unsupported type.`, 'danger');
          continue;
        }
        if (f.size > PostentryComponent.MAX_IMAGE_BYTES) {
          await this.toast(`${f.name}: too large (>6MB).`, 'danger');
          continue;
        }

        const dataUrl = await this.fileToDataUrl(f);
        this.newImageFiles.push(f);
        newPreviews.push(dataUrl);
        accepted++;
        this.imgsPct.set(Math.round(((i + 1) / files.length) * 100));
        await new Promise((r) => setTimeout(r, 6));
      }
      this.newImagePreviews.set(newPreviews);
      if (accepted)
        this.toast(
          `Added ${accepted} image${accepted === 1 ? '' : 's'}`,
          'success'
        );
    } catch (e) {
      this.pageError.set('Failed to add images.');
      this.toast(this.mapError(e), 'danger');
    } finally {
      this.imgsBusy.set(false);
      this.imgsPct.set(0);
      if (input) input.value = '';
    }
  }

  deleteImageAt(index: number) {
    const exLen = this.existingImageUrls().length;
    if (index < exLen) {
      const next = [...this.existingImageUrls()];
      next.splice(index, 1);
      this.existingImageUrls.set(next);
    } else {
      const i = index - exLen;
      const nextPrev = [...this.newImagePreviews()];
      const nextFiles = [...this.newImageFiles];
      nextPrev.splice(i, 1);
      nextFiles.splice(i, 1);
      this.newImagePreviews.set(nextPrev);
      this.newImageFiles = nextFiles;
    }
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = () => reject(new Error('read failed'));
      fr.onload = () => resolve(String(fr.result || ''));
      fr.readAsDataURL(file);
    });
  }

  // ====================== Video (≤ 20s)
  async selectVideo(evt: Event) {
    const input = evt.target as HTMLInputElement | null;
    const file = (input?.files && input.files[0]) || null;
    if (!file) return;

    if (!PostentryComponent.ACCEPTED_VIDEOS.has(file.type)) {
      this.toast('Unsupported video type. Use mp4/webm/mov.', 'danger');
      if (input) input.value = '';
      return;
    }
    if (file.size > PostentryComponent.MAX_VIDEO_BYTES) {
      this.toast('Video too large.', 'danger');
      if (input) input.value = '';
      return;
    }

    try {
      const duration = await this.getVideoDuration(file);
      if (duration > PostentryComponent.MAX_VIDEO_SECS) {
        this.toast(
          `Video longer than ${PostentryComponent.MAX_VIDEO_SECS}s not allowed.`,
          'danger'
        );
        if (input) input.value = '';
        return;
      }
      this.newVideoFile = file;
      const url = URL.createObjectURL(file);
      this.newVideoPreview.set(url);
      await this.toast('Video added', 'success');
    } catch (e) {
      this.toast(this.mapError(e), 'danger');
    } finally {
      if (input) input.value = '';
    }
  }

  deleteVideo() {
    try {
      if (this.newVideoPreview()) URL.revokeObjectURL(this.newVideoPreview()!);
    } catch {}
    this.newVideoFile = null;
    this.newVideoPreview.set(null);
    this.existingVideoUrl.set(null);
  }

  private getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(file);
        const v = document.createElement('video');
        v.preload = 'metadata';
        v.onloadedmetadata = () => {
          URL.revokeObjectURL(url);
          resolve(Number(v.duration || 0));
        };
        v.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Unable to read video metadata.'));
        };
        v.src = url;
      } catch (e) {
        reject(e);
      }
    });
  }

  // ====================== Submit (Create / Update)
  async submit() {
    this.pageError.set(null);

    if (!navigator.onLine) {
      const msg = 'You appear to be offline. Please check your connection.';
      this.pageError.set(msg);
      return this.toast(msg, 'danger');
    }

    if (this.allImagePreviews().length > PostentryComponent.MAX_IMAGES) {
      return this.toast(
        `Only ${PostentryComponent.MAX_IMAGES} images allowed.`,
        'danger'
      );
    }

    this.loading.set(true);
    try {
      const raw = this.postEntryForm.getRawValue();
      const basePayload: any = {
        ...raw,
        images: [],
        videoUrl: null,
        amenities: raw.amenities ?? [],
        totalPropertyUnits: raw.totalPropertyUnits || DEFAULT_UNITS,
        sizeBuiltupUnits: raw.sizeBuiltupUnits || DEFAULT_UNITS,
        facingUnits: raw.facingUnits || DEFAULT_UNITS,
        saleType: this.saleTypeSig(),
        category: this.categorySig(),
        updatedAt: serverTimestamp(),
      };

      let postId = this.editId;

      if (!this.isEdit()) {
        const colRef = collection(this.afs, 'posts');
        const docRef = await addDoc(colRef, {
          ...basePayload,
          createdAt: serverTimestamp(),
        });
        postId = docRef.id;
      } else {
        const ref = doc(this.afs, 'posts', postId!);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error('Post not found.');
      }

      // Upload media
      const uploadedImageUrls = await this.uploadImages(
        postId!,
        this.newImageFiles
      );
      const videoUrl = await this.uploadVideo(postId!, this.newVideoFile);

      const finalImageUrls = [
        ...this.existingImageUrls(),
        ...uploadedImageUrls,
      ].slice(0, PostentryComponent.MAX_IMAGES);

      const finalVideoUrl = this.existingVideoUrl() ?? videoUrl ?? null;

      const ref = doc(this.afs, 'posts', postId!);
      await updateDoc(ref, {
        ...basePayload,
        images: finalImageUrls,
        videoUrl: finalVideoUrl,
      });

      await this.toast(
        this.isEdit() ? 'Property updated' : 'Property saved',
        'success'
      );

      if (!this.isEdit()) this.resetFormAndUI();
    } catch (e) {
      const msg = this.mapError(e);
      this.pageError.set(msg);
      await this.toast(msg, 'danger');
    } finally {
      this.loading.set(false);
    }
  }

  private async uploadImages(postId: string, files: File[]): Promise<string[]> {
    if (!files.length) return [];
    const urls: string[] = [];
    await Promise.all(
      files.map(async (f, i) => {
        const ext = this.extOf(f.name) || this.extFromType(f.type) || 'jpg';
        const path = `posts/${postId}/images/${Date.now()}_${i}.${ext}`;
        const storageRef = ref(this.storage, path);
        await uploadBytes(storageRef, f);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      })
    );
    return urls;
  }

  private async uploadVideo(
    postId: string,
    file: File | null
  ): Promise<string | null> {
    if (!file) return null;
    const ext = this.extOf(file.name) || this.extFromType(file.type) || 'mp4';
    const path = `posts/${postId}/video/${Date.now()}.${ext}`;
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  private extOf(name: string): string | '' {
    const m = /\.([a-zA-Z0-9]+)$/.exec(name || '');
    return (m?.[1] || '').toLowerCase();
  }
  private extFromType(type: string): string | '' {
    if (type === 'image/jpeg') return 'jpg';
    if (type === 'image/png') return 'png';
    if (type === 'video/mp4') return 'mp4';
    if (type === 'video/webm') return 'webm';
    if (type === 'video/quicktime') return 'mov';
    return '';
  }

  // =============== Edit hydrate
  private async hydrateEdit(id: string) {
    const ref = doc(this.afs, 'posts', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Post not found.');

    const data: any = snap.data();
    this.saleTypeSig.set((data.saleType as 'sale' | 'rent') || 'sale');
    this.categorySig.set((data.category as any) || 'residential');

    const imgs = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
    this.existingImageUrls.set(imgs.slice(0, PostentryComponent.MAX_IMAGES));
    this.existingVideoUrl.set((data.videoUrl as string) || null);

    this.postEntryForm.patchValue(this.normalizeDocForForm(data), {
      emitEvent: false,
    });
    this.amenities.set((this.ctrl('amenities').value as string[]) ?? []);
  }

  private normalizeDocForForm(doc: any) {
    const out: any = { ...doc };
    out.totalPropertyUnits = (out.totalPropertyUnits as Units) || DEFAULT_UNITS;
    out.sizeBuiltupUnits =
      (out.sizeBuiltupUnits as Units) ||
      out.totalPropertyUnits ||
      DEFAULT_UNITS;

    const candidateFacingUnit =
      out.facingUnits ||
      out.northSizeUnit ||
      out.southSizeUnit ||
      out.eastSizeUnit ||
      out.westSizeUnit;
    out.facingUnits = (candidateFacingUnit as Units) || DEFAULT_UNITS;

    out.images = Array.isArray(out.images) ? out.images.filter(Boolean) : [];
    out.amenities = Array.isArray(out.amenities)
      ? out.amenities.filter(Boolean)
      : [];
    return out;
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
        availabilityStatus: null,
        securityDeposit: null,

        totalPropertyUnits: DEFAULT_UNITS,
        propertySize: null,
        propertySizeBuiltup: null,
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

    // Clear local media state
    this.newImageFiles = [];
    this.newImagePreviews.set([]);
    this.existingImageUrls.set([]);
    this.newVideoFile = null;
    if (this.newVideoPreview()) {
      try {
        URL.revokeObjectURL(this.newVideoPreview()!);
      } catch {}
    }
    this.newVideoPreview.set(null);
    this.existingVideoUrl.set(null);

    // Reset segments
    this.saleTypeSig.set('sale');
    this.categorySig.set('residential');

    try {
      localStorage.removeItem(PostentryComponent.DRAFT_IMG_KEY);
    } catch {}
  }

  // Optional: if you add segment UI later
  saleTypeChanged(ev: CustomEvent) {
    this.saleTypeSig.set((ev.detail as any)?.value as 'sale' | 'rent');
  }
  categoryChanged(ev: CustomEvent) {
    this.categorySig.set(
      (ev.detail as any)?.value as
        | 'residential'
        | 'commercial'
        | 'plots'
        | 'lands'
    );
  }

  private mapError(err: unknown): string {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'permission-denied':
          return 'Permission denied. Check Firestore rules.';
        case 'unauthenticated':
          return 'You must be signed in.';
        case 'unavailable':
          return 'Service unavailable. Try again.';
        default:
          return `Firebase error: ${err.code}`;
      }
    }
    const any = err as any;
    const msg = any?.error?.message || any?.message || 'Unexpected error.';
    if (!navigator.onLine)
      return 'You appear to be offline. Please check your connection.';
    return msg;
  }
}
