import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  input
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, firstValueFrom, timeout } from 'rxjs';

import { Geolocation } from '@capacitor/geolocation';
import { CameraSource } from '@capacitor/camera';
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
  ActionSheetController,
  IonProgressBar,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  add,
  arrowForwardOutline,
  caretDownOutline,
  caretUpOutline,
  chevronBackOutline,
  close,
  cloudUploadOutline,
  trashOutline,
  camera,
  images,
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

import { UcWidgetComponent, UcWidgetModule } from 'ngx-uploadcare-widget';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import { CameraService } from 'src/app/services/camera.service';

// ------------------- CONFIG: your backend API base -------------------
const MUX_API_BASE = '/api/mux'; // change if needed
// Expect your backend to expose:
// POST   `${MUX_API_BASE}/create-upload` -> { uploadUrl: string, uploadId: string }
// GET    `${MUX_API_BASE}/upload-status?uploadId=...` -> { status: 'waiting'|'asset_created'|'ready'|'errored', assetId?: string, playbackId?: string, error?: string }

declare global {
  interface Window {
    uploadcare?: any;
  }
}

/* ================= Types & constants ================= */
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
type HouseFacingType =
  | 'North Facing'
  | 'South Facing'
  | 'East Facing'
  | 'West Facing'
  | 'North-East Facing'
  | 'North-West Facing'
  | 'South-East Facing'
  | 'South-West Facing';
type CommercialType =
  | 'Retail'
  | 'Office'
  | 'Warehouse'
  | 'Factory'
  | 'Industriy'
  | 'Hospitality'
  | 'Land'
  | 'Other';
type CommercialSubType = 'Shopping Mall' | 'Individual';
type AvailabilityStatus = 'Ready to move' | 'Under construction' | null;

const DEFAULT_UNITS: Units = 'Sq Feet';

// Firestore form type
type PostEntryForm = {
  propertyTitle: FormControl<string | null>;

  houseType: FormControl<HouseType | null>;
  houseFacingType: FormControl<HouseFacingType | null>;
  houseCondition: FormControl<'Old Houses' | 'New Houses' | null>;
  rooms: FormControl<number | null>;
  bhkType: FormControl<BHKType | null>;
  furnishingType: FormControl<FurnishingType | null>;

  commercialType: FormControl<CommercialType | null>;
  commercialSubType: FormControl<CommercialSubType | null>;
  availabilityStatus: FormControl<AvailabilityStatus | null>;
  securityDeposit: FormControl<number | null>;

  plotAreaUnits: FormControl<Units | null>;
  PlotArea: FormControl<number | null>;
  builtUpArea: FormControl<number | null>;
  builtUpAreaUnits: FormControl<Units | null>;

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

  images: FormControl<string[] | null>;

  // Mux fields we will store
  muxUploadId: FormControl<string | null>;
  muxAssetId: FormControl<string | null>;
  muxPlaybackId: FormControl<string | null>;
  muxStatus: FormControl<
    | 'idle'
    | 'uploading'
    | 'uploaded'
    | 'processing'
    | 'ready'
    | 'errored'
    | null
  >;

  videoResources: FormControl<string[] | null>;
};

@Component({
  selector: 'app-postentry',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
    IonProgressBar,
    UcWidgetModule
],
  templateUrl: './postentry.component.html',
  styleUrls: ['./postentry.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostentryComponent implements OnInit {
  /* ---------------- DI ---------------- */
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  private nav = inject(NavController);
  private toastCtrl = inject(ToastController);
  private afs = inject(Firestore);
  private cameraService = inject(CameraService);
  private actionSheetCtrl = inject(ActionSheetController);

  /* ---------------- Inputs ---------------- */
  readonly saleType = input<'sale' | 'rent'>('sale');
  readonly category = input<'residential' | 'commercial' | 'plots' | 'agriculturalLands'>('residential');
  readonly editId = input<string | null>(null);

  /* ---------------- Signals/UI ---------------- */
  readonly saleTypeSig = signal<'sale' | 'rent'>(this.saleType());
  readonly categorySig = signal<
    'residential' | 'commercial' | 'plots' | 'agriculturalLands'
  >(this.category());
  readonly loading = signal(false);
  readonly pageError = signal<string | null>(null);

  readonly isEdit = computed(() => !!this.editId());
  readonly headerTitle = computed(() =>
    this.isEdit() ? 'Edit Property Details' : 'Property Details Entry'
  );
  readonly actionLabel = computed(() => (this.isEdit() ? 'Update' : 'Submit'));
  readonly floors = [
    'Ground',
    ...Array.from({ length: 40 }, (_, i) => `${i + 1}`),
  ];

  /* ---------------- Form ---------------- */
  postEntryForm = this.fb.group<PostEntryForm>({
    propertyTitle: this.fb.control<string | null>(null),

    houseType: this.fb.control<HouseType | null>(null),
    houseFacingType: this.fb.control<HouseFacingType | null>(null),
    houseCondition: this.fb.control<'Old Houses' | 'New Houses' | null>(null),
    rooms: this.fb.control<number | null>(null),
    bhkType: this.fb.control<BHKType | null>(null),
    furnishingType: this.fb.control<FurnishingType | null>(null),

    commercialType: this.fb.control<CommercialType | null>(null),
    commercialSubType: this.fb.control<CommercialSubType | null>(null),
    availabilityStatus: this.fb.control<AvailabilityStatus | null>(null),
    securityDeposit: this.fb.control<number | null>(null),

    plotAreaUnits: this.fb.control<Units | null>(DEFAULT_UNITS),
    PlotArea: this.fb.control<number | null>(null),
    builtUpArea: this.fb.control<number | null>(null),
    builtUpAreaUnits: this.fb.control<Units | null>(DEFAULT_UNITS),

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

    // Mux
    muxUploadId: this.fb.control<string | null>(null),
    muxAssetId: this.fb.control<string | null>(null),
    muxPlaybackId: this.fb.control<string | null>(null),
    muxStatus: this.fb.control<
      | 'idle'
      | 'uploading'
      | 'uploaded'
      | 'processing'
      | 'ready'
      | 'errored'
      | null
    >('idle'),

    videoResources: this.fb.control<string[] | null>([]),
  });

  ctrl = (n: keyof PostEntryForm) => this.postEntryForm.controls[n];
  private sel<T>(name: keyof PostEntryForm) {
    const c = this.postEntryForm.controls[name];
    return toSignal(c.valueChanges as unknown as Observable<T>, {
      initialValue: c.value as T,
    });
  }

  // Facing unit short label
  private facingUnitsSig = this.sel<Units | null>('facingUnits');
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

  // Amenities view
  amenities = signal<string[]>([]);
  private amenitiesCtrlSig = this.sel<string[] | null>('amenities');

  // Images
  readonly images = signal<string[]>([]);
  static readonly MAX_IMAGES = 3;
  readonly remainingSlots = computed(() =>
    Math.max(0, PostentryComponent.MAX_IMAGES - this.images().length)
  );
  readonly ucBusy = signal(false);

  // Mux Player values
  private muxIdSig = this.sel<string | null>('muxPlaybackId');
  readonly muxPlaybackId = computed(() => (this.muxIdSig() || '').trim());
  readonly muxPosterUrl = computed(() =>
    this.muxPlaybackId()
      ? `https://image.mux.com/${this.muxPlaybackId()}/thumbnail.png?time=1`
      : null
  );

  // Uploadcare remnant (images only)
  UC_PUBLIC_KEY = 'af593dad582ebef4ed5f' as const;
  readonly ucare = viewChild<UcWidgetComponent>('uc');

  constructor() {
    addIcons({
      chevronBackOutline,
      cloudUploadOutline,
      trashOutline,
      add,
      caretDownOutline,
      caretUpOutline,
      close,
      arrowForwardOutline,
      camera,
      images,
    });

    effect(() => this.amenities.set(this.amenitiesCtrlSig() ?? []));
    effect(() => {
      const arr = this.images();
      this.ctrl('images').setValue(arr as never, { emitEvent: false });
      this.ctrl('images').markAsDirty({ onlySelf: true });
    });
  }

  /* ---------------- Lifecycle ---------------- */
  async ngOnInit() {
    this.saleTypeSig.set(this.saleType());
    this.categorySig.set(this.category());

    const editId = this.editId();
    if (editId) {
      try {
        await this.hydrateEdit(editId);
      } catch (e) {
        this.pageError.set(this.mapError(e));
      }
    }
  }

  /* ---------------- UI helpers ---------------- */
  dismiss() {
    this.modalCtrl
      .getTop()
      .then((m) => (m ? m.dismiss() : this.nav.back()) as void);
  }

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

  /* ---------------- Amenities ---------------- */
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

  /* ---------------- Location ---------------- */
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

  /* ---------------- Images: camera/gallery ---------------- */
  async openImageSource() {
    if (this.remainingSlots() <= 0) {
      this.toast('You can upload up to 3 images.', 'warning');
      return;
    }
    const sheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          role: 'destructive',
          handler: () => this.takePhoto(CameraSource.Camera),
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => this.takePhoto(CameraSource.Photos),
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await sheet.present();
  }
  async takePhoto(sourceType: CameraSource) {
    try {
      this.ucBusy.set(true);
      await this.cameraService.setupPermissions();
      const imageUrl = await this.cameraService.takePropertyPhoto(sourceType);
      const next = [...this.images(), imageUrl].slice(
        0,
        PostentryComponent.MAX_IMAGES
      );
      this.images.set(Array.from(new Set(next)));
      await this.toast('Image added.', 'success');
    } catch (e) {
      await this.toast(this.mapError(e), 'danger');
    } finally {
      this.ucBusy.set(false);
    }
  }
  removeImageAt(idx: number) {
    const arr = [...this.images()];
    if (idx >= 0 && idx < arr.length) {
      arr.splice(idx, 1);
      this.images.set(arr);
    }
  }

  /* ---------------- VIDEO: Mux-only flow ---------------- */

  // Limits
  // ---- Config (keep/adjust as needed) ----
  private static readonly ACCEPTED_VIDEOS = new Set([
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ]);
  private static readonly MAX_VIDEO_BYTES = 40 * 1024 * 1024; // 40MB
  private static readonly MAX_VIDEO_SECS = 20; // 20s
  private static readonly MUX_API_BASE = '/api/mux'; // your backend prefix

  private uploadAbort: AbortController | null = null;

  // If you don't already have these signals/properties, add them:
  readonly videoBusy = signal(false);
  readonly videoProgress = signal(0); // 0..1
  readonly videoStatus = signal('Idle');

  // ============ MAIN HANDLERS ============

  async handleMuxVideoSelect(evt: Event) {
    const input = evt.target as HTMLInputElement | null;
    const file = (input?.files && input.files[0]) || null;
    if (input) input.value = ''; // allow same file reselect
    if (!file) return;

    // Cancel any previous upload
    this.uploadAbort?.abort();
    this.uploadAbort = new AbortController();

    // Reset Mux fields in form
    this.ctrl('muxUploadId').setValue(null as never);
    this.ctrl('muxAssetId').setValue(null as never);
    this.ctrl('muxPlaybackId').setValue(null as never);
    this.ctrl('muxStatus').setValue('idle' as never);

    // Reset UI
    this.videoProgress.set(0);
    this.videoBusy.set(true);
    this.videoStatus.set('Validating video…');

    try {
      // ---- Validate file ----
      if (!this.isAcceptedVideo(file))
        throw new Error('Unsupported video type. Use mp4/webm/mov.');
      if (file.size > PostentryComponent.MAX_VIDEO_BYTES)
        throw new Error('Video too large.');
      const duration = await this.getVideoDuration(file);
      if (duration > PostentryComponent.MAX_VIDEO_SECS) {
        throw new Error(
          `Video longer than ${PostentryComponent.MAX_VIDEO_SECS}s not allowed.`
        );
      }

      // ---- 1) Ask backend to create a Mux Direct Upload (multipart) ----
      this.videoStatus.set('Creating Mux upload…');
      const create = await this.postJson(
        `${PostentryComponent.MUX_API_BASE}/create-upload`,
        { type: 'multipart' }
      );
      const uploadUrl: string | undefined = create?.uploadUrl;
      const uploadId: string | undefined = create?.uploadId;
      if (!uploadUrl || !uploadId)
        throw new Error('Failed to create Mux upload.');

      this.ctrl('muxUploadId').setValue(uploadId as never);
      this.ctrl('muxStatus').setValue('uploading' as never);

      // ---- 2) Upload file to the returned uploadUrl ----
      this.videoStatus.set('Uploading to Mux…');
      await this.multipartUpload(
        uploadUrl,
        file,
        (p) => this.videoProgress.set(p),
        this.uploadAbort.signal
      );

      this.ctrl('muxStatus').setValue('uploaded' as never);
      this.videoProgress.set(1);
      this.videoStatus.set('Uploaded. Processing on Mux…');

      // ---- 3) Poll your backend until asset/playbackId is ready ----
      const { assetId, playbackId } = await this.pollMuxUntilReady(
        uploadId,
        90_000,
        3_000
      );
      if (!assetId || !playbackId) throw new Error('Mux asset not ready.');

      this.ctrl('muxAssetId').setValue(assetId as never);
      this.ctrl('muxPlaybackId').setValue(playbackId as never);
      this.ctrl('muxStatus').setValue('ready' as never);

      this.videoStatus.set('Ready.');
      await this.toast('Video uploaded to Mux and ready to play.', 'success');
    } catch (e) {
      const msg = this.mapError(e);
      this.ctrl('muxStatus').setValue('errored' as never);
      this.videoStatus.set(`Error: ${msg}`);
      await this.toast(msg, 'danger');
    } finally {
      this.videoBusy.set(false);
    }
  }

  clearMuxVideo() {
    try {
      this.uploadAbort?.abort();
    } catch {}
    this.uploadAbort = null;

    // Clear form mux fields
    this.ctrl('muxUploadId').setValue(null as never);
    this.ctrl('muxAssetId').setValue(null as never);
    this.ctrl('muxPlaybackId').setValue(null as never);
    this.ctrl('muxStatus').setValue('idle' as never);

    // Reset UI
    this.videoProgress.set(0);
    this.videoStatus.set('Idle');
  }

  // ============ HELPERS ============

  // Some iOS browsers attach no MIME type; fall back to file extension.
  private isAcceptedVideo(file: File): boolean {
    if (PostentryComponent.ACCEPTED_VIDEOS.has(file.type)) return true;
    const name = (file.name || '').toLowerCase();
    return /\.(mp4|webm|mov)$/i.test(name);
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

  // Use XHR for progress + abort support
  private async multipartUpload(
    uploadUrl: string,
    file: File,
    onProgress: (p: number) => void,
    signal: AbortSignal
  ) {
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded / (e.total || 1));
      };
      xhr.onerror = () =>
        reject(new Error('Network error while uploading to Mux.'));
      xhr.onabort = () => reject(new Error('Upload canceled.'));
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Mux upload failed (${xhr.status}).`));
      };
      signal.addEventListener('abort', () => {
        try {
          xhr.abort();
        } catch {}
      });
      const form = new FormData();
      form.append('file', file);
      xhr.send(form);
    });
  }

  private async pollMuxUntilReady(
    uploadId: string,
    timeoutMs = 90_000,
    intervalMs = 3_000
  ) {
    const start = Date.now();
    // loop with simple backoff
    while (true) {
      if (Date.now() - start > timeoutMs)
        throw new Error('Mux processing timeout. Try again later.');
      const s = await this.getJson(
        `${
          PostentryComponent.MUX_API_BASE
        }/upload-status?uploadId=${encodeURIComponent(uploadId)}`
      );
      const status = s?.status as string | undefined;

      if (status === 'ready' && s?.playbackId && s?.assetId) {
        return { playbackId: String(s.playbackId), assetId: String(s.assetId) };
      }
      if (status === 'errored') {
        throw new Error(s?.error || 'Mux processing error.');
      }

      // still processing / waiting
      this.ctrl('muxStatus').setValue('processing' as never);
      this.videoStatus.set('Processing on Mux…');
      await this.sleep(intervalMs);
    }
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /* ---------------- Submit ---------------- */
  async submit() {
    this.pageError.set(null);

    if (!navigator.onLine) {
      const msg = 'You appear to be offline. Please check your connection.';
      this.pageError.set(msg);
      return this.toast(msg, 'danger');
    }

    if ((this.images()?.length || 0) > PostentryComponent.MAX_IMAGES) {
      return this.toast(
        `Only ${PostentryComponent.MAX_IMAGES} images allowed.`,
        'danger'
      );
    }

    // Warn if video not ready
    if (
      this.ctrl('muxStatus').value &&
      this.ctrl('muxStatus').value !== 'ready'
    ) {
      await this.toast(
        'Video is not ready on Mux yet. You can still save; it will play once ready.',
        'medium'
      );
    }

    this.loading.set(true);
    try {
      const raw = this.postEntryForm.getRawValue();

      const basePayload: any = {
        // Basic
        propertyTitle: raw.propertyTitle,
        description: raw.description,
        addressOfProperty: raw.addressOfProperty,
        lat: raw.lat,
        lng: raw.lng,

        // Types
        houseType: raw.houseType,
        houseFacingType: raw.houseFacingType,
        houseCondition: raw.houseCondition,
        commercialType: raw.commercialType,
        commercialSubType: raw.commercialSubType,
        availabilityStatus: raw.availabilityStatus,

        // Details
        rooms: raw.rooms,
        bhkType: raw.bhkType,
        furnishingType: raw.furnishingType,
        toilets: raw.toilets,
        poojaRoom: raw.poojaRoom,
        livingDining: raw.livingDining,
        kitchen: raw.kitchen,
        floor: raw.floor,

        // Areas
        plotAreaUnits: raw.plotAreaUnits || DEFAULT_UNITS,
        PlotArea: raw.PlotArea,
        builtUpArea: raw.builtUpArea,
        builtUpAreaUnits: raw.builtUpAreaUnits || DEFAULT_UNITS,

        // Facing
        facingUnits: raw.facingUnits || DEFAULT_UNITS,
        northFacing: raw.northFacing,
        northSize: raw.northSize,
        southFacing: raw.southFacing,
        southSize: raw.southSize,
        eastFacing: raw.eastFacing,
        eastSize: raw.eastSize,
        westFacing: raw.westFacing,
        westSize: raw.westSize,

        // Features
        amenities: raw.amenities ?? [],
        ageOfProperty: raw.ageOfProperty,
        negotiable: raw.negotiable,
        securityDeposit: raw.securityDeposit,

        // Pricing
        priceOfSale: raw.priceOfSale,
        priceOfRent: raw.priceOfRent,
        priceOfRentType: raw.priceOfRentType,

        // Media (images + mux)
        images: this.images(),
        muxUploadId: raw.muxUploadId || null,
        muxAssetId: raw.muxAssetId || null,
        muxPlaybackId: raw.muxPlaybackId || null,
        muxStatus: raw.muxStatus || 'idle',
        videoResources: raw.videoResources,

        // Meta
        saleType: this.saleTypeSig(),
        category: this.categorySig(),
        updatedAt: serverTimestamp(),
        isDeleted: false,
      };

      let postId = this.editId();

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
        await updateDoc(ref, basePayload);
      }

      await this.toast(
        this.isEdit() ? 'Property updated' : 'Property saved',
        'success'
      );
      if (!this.isEdit()) await this.resetFormAndUI();
    } catch (e) {
      const msg = this.mapError(e);
      this.pageError.set(msg);
      await this.toast(msg, 'danger');
    } finally {
      this.loading.set(false);
    }
  }

  /* ---------------- Edit hydrate ---------------- */
  private async hydrateEdit(id: string) {
    const ref = doc(this.afs, 'posts', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Post not found.');

    const data: any = snap.data();

    this.saleTypeSig.set((data.saleType as 'sale' | 'rent') || 'sale');
    this.categorySig.set((data.category as any) || 'residential');

    const imgs = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
    this.images.set(imgs.slice(0, PostentryComponent.MAX_IMAGES));

    this.postEntryForm.patchValue(this.normalizeDocForForm(data), {
      emitEvent: false,
    });
    this.amenities.set((this.ctrl('amenities').value as string[]) ?? []);
  }

  private normalizeDocForForm(doc: any) {
    const out: any = { ...doc };
    out.plotAreaUnits = (out.plotAreaUnits as Units) || DEFAULT_UNITS;
    out.builtUpAreaUnits =
      (out.builtUpAreaUnits as Units) || out.plotAreaUnits || DEFAULT_UNITS;

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

    // Mux fields normalize
    out.muxUploadId =
      typeof out.muxUploadId === 'string' ? out.muxUploadId : null;
    out.muxAssetId = typeof out.muxAssetId === 'string' ? out.muxAssetId : null;
    out.muxPlaybackId =
      typeof out.muxPlaybackId === 'string' ? out.muxPlaybackId : null;
    out.muxStatus = out.muxStatus || (out.muxPlaybackId ? 'ready' : 'idle');

    return out;
  }

  private async resetFormAndUI() {
    this.postEntryForm.reset(
      {
        propertyTitle: null,
        houseType: null,
        houseFacingType: null,
        houseCondition: null,
        rooms: null,
        bhkType: null,
        furnishingType: null,

        commercialType: null,
        commercialSubType: null,
        availabilityStatus: null,
        securityDeposit: null,

        plotAreaUnits: DEFAULT_UNITS,
        PlotArea: null,
        builtUpArea: null,
        builtUpAreaUnits: DEFAULT_UNITS,

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

        muxUploadId: null,
        muxAssetId: null,
        muxPlaybackId: null,
        muxStatus: 'idle',

        videoResources: [],
      } as any,
      { emitEvent: false }
    );

    this.images.set([]);
    this.videoProgress.set(0);
    this.videoBusy.set(false);
    this.videoStatus.set('Idle');
  }

  /* ---------------- HTTP helpers ---------------- */
  private async postJson(url: string, body: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json().catch(() => ({}));
  }
  private async getJson(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json().catch(() => ({}));
  }

  /* ---------------- Errors ---------------- */
  private mapError(err: unknown): string {
    const any = err as any;
    const msg = any?.error?.message || any?.message || 'Unexpected error.';
    if (!navigator.onLine)
      return 'You appear to be offline. Please check your connection.';
    return msg;
  }
}
