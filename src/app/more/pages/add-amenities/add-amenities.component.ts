
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  inject,
  signal,
  computed,
  input
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  cloudUploadOutline,
  trashOutline,
  informationCircle,
} from 'ionicons/icons';

// ---- Firebase MODULAR imports
import {
  Firestore,
  addDoc,
  collection,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';

type Uploaded = {
  name: string;
  type: string;
  size: number;
  path: string;
  url: string;
};

type Amenity = {
  amenityName: string;
  description?: string;
  logo?: Uploaded | null;
  createdAt: number;
  updatedAt?: number;
};

@Component({
  selector: 'app-add-amenities',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonFooter,
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea
],
  templateUrl: './add-amenities.component.html',
  styleUrls: ['./add-amenities.component.scss'],
})
export class AddAmenitiesComponent implements OnInit {
  async submitV2($event: SubmitEvent) {
    $event.preventDefault();

    if (this.loading() || this.uploading()) return;

    // const formValid =
    //   this.amenityForm.valid &&
    //   (this.isEdit() ? !!this.logoURL() : !!(this.logoFile() && this.logoURL()));
    // if (!formValid) return;

    this.loading.set(true);

    const { amenityName, description } = this.amenityForm.getRawValue();

    let uploadedLogo: Uploaded | null = null;
    // if (this.logoFile()) {
    //   const f = this.logoFile()!;
    //   uploadedLogo = await this.uploadOne(`amenities/${Date.now()}_${f.name}`, f);
    // }

    if (!this.isEdit()) {
      // CREATE
      const payload: Amenity = {
        amenityName,
        description,
        logo: uploadedLogo,
        createdAt: Date.now(),
      };
      const col = collection(this.db, 'amenities');
      const ref = await addDoc(col, payload);
      this.saved.emit({ id: ref.id });
    } else {
      // UPDATE
      const update: Partial<Amenity> = {
        amenityName,
        description,
        updatedAt: Date.now(),
      };
      if (uploadedLogo) update.logo = uploadedLogo;

      const ref = doc(this.db, 'amenities', this.docId()!);
      await updateDoc(ref, update);
      this.saved.emit({ id: this.docId()! });
    }

    if (this.logoURL()?.startsWith('blob:'))
      URL.revokeObjectURL(this.logoURL()!);
    this.amenityForm.reset();
    this.logoFile.set(null);
    this.logoURL.set(null);
    this.loading.set(false);

    console.log('submitted');
    this.modalController.dismiss();
  }

  private fb = inject(FormBuilder);
  private db = inject(Firestore); // <-- modular Firestore
  // private storage = inject(Storage);   // <-- modular Storage
  private modalController = inject(ModalController);

  constructor() {
    addIcons({
      chevronBackOutline,
      cloudUploadOutline,
      trashOutline,
      informationCircle,
    });
  }

  readonly docId = input<string>(undefined); // if present => Edit mode
  readonly initial = input<Partial<Amenity>>(undefined); // prefilled values for Edit
  @Output() saved = new EventEmitter<{ id: string }>();

  // Form
  amenityForm = this.fb.nonNullable.group({
    amenityName: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
  });

  // State + Signals
  private logoFile = signal<File | null>(null);
  logoURL = signal<string | null>(null);
  loading = signal(false);
  uploading = signal(false);
  isEdit = computed<boolean>(() => !!this.docId());

  private readonly maxBytes = 2 * 1024 * 1024; // 2MB
  private readonly allowed = new Set(['image/jpeg', 'image/png', 'image/jpg']);

  ngOnInit() {
    const initial = this.initial();
    if (initial) {
      const { amenityName, description } = initial;
      this.amenityForm.patchValue({
        amenityName: amenityName ?? '',
        description: description ?? '',
      });
      if (initial.logo?.url) {
        this.logoURL.set(initial.logo.url);
      }
    }
  }

  // Drag helpers
  onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  // Logo handlers
  onLogoChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;
    if (!this.allowed.has(f.type) || f.size > this.maxBytes) {
      input.value = '';
      return;
    }
    if (this.logoURL()?.startsWith('blob:'))
      URL.revokeObjectURL(this.logoURL()!);
    this.logoFile.set(f);
    this.logoURL.set(URL.createObjectURL(f));
    input.value = '';
  }

  onDropLogo(e: DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (!f || !this.allowed.has(f.type) || f.size > this.maxBytes) return;
    if (this.logoURL()?.startsWith('blob:'))
      URL.revokeObjectURL(this.logoURL()!);
    this.logoFile.set(f);
    this.logoURL.set(URL.createObjectURL(f));
  }

  removeLogo() {
    if (this.logoURL()?.startsWith('blob:'))
      URL.revokeObjectURL(this.logoURL()!);
    this.logoFile.set(null);
    this.logoURL.set(null);
  }

  // Upload (modular)
  private async uploadOne(path: string, file: File) {
    // this.uploading.set(true);
    // const storageRef = ref(this.storage, path);
    // await uploadBytes(storageRef, file, { contentType: file.type });
    // const url = await getDownloadURL(storageRef);
    // this.uploading.set(false);
    // return { name: file.name, type: file.type, size: file.size, path, url };
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
