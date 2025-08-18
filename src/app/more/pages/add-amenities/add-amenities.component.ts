import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
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
} from 'ionicons/icons';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { addDoc, collection } from '@angular/fire/firestore';

type Uploaded = {
  name: string;
  type: string;
  size: number;
  path: string;
  url: string;
};

@Component({
  selector: 'app-add-amenities',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonFooter,
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonLabel,
    IonImg,
  ],
  templateUrl: './add-amenities.component.html',
  styleUrls: ['./add-amenities.component.scss'],
})
export class AddAmenitiesComponent {
  private fb = inject(FormBuilder);
  private afs = inject(AngularFirestore);
  private storage = inject(AngularFireStorage);
  private modal = inject(ModalController);

  constructor() {
    addIcons({ chevronBackOutline, cloudUploadOutline, trashOutline });
  }

  @Output() saved = new EventEmitter<void>();

  amenityForm = this.fb.nonNullable.group({
    amenityName: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    
  });

  // Logo (single)
  private logoFile = signal<File | null>(null);
  logoURL = signal<string | null>(null);

  private readonly maxBytes = 2 * 1024 * 1024; // 2MB
  private readonly allowed = new Set(['image/jpeg', 'image/png', 'image/jpg']);

  isValid = computed(
    () =>
      this.amenityForm.valid &&
      this.logoFile() !== null &&
      this.logoURL() !== null
  );

  // --- Drag helpers
  onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  // --- Logo
  onLogoChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const f = input.files[0];
    if (!this.allowed.has(f.type) || f.size > this.maxBytes) return;
    if (this.logoURL()) URL.revokeObjectURL(this.logoURL()!);
    this.logoFile.set(f);
    this.logoURL.set(URL.createObjectURL(f));
    input.value = '';
  }
  onDropLogo(e: DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (!f || !this.allowed.has(f.type) || f.size > this.maxBytes) return;
    if (this.logoURL()) URL.revokeObjectURL(this.logoURL()!);
    this.logoFile.set(f);
    this.logoURL.set(URL.createObjectURL(f));
  }
  removeLogo() {
    if (this.logoURL()) URL.revokeObjectURL(this.logoURL()!);
    this.logoFile.set(null);
    this.logoURL.set(null);
  }

  // --- Upload helpers (modular Storage returns Promises)
  private async uploadOne(path: string, file: File): Promise<Uploaded> {
    const ref = this.storage.ref(path);
    const snap = await ref.put(file);
    const url = await snap.ref.getDownloadURL();
    return { name: file.name, type: file.type, size: file.size, path, url };
  }

  async submit() {
    console.log(this.amenityForm.value, this.logoFile());
    console.log(this.isValid());
    if (!this.isValid()) return;

    const { amenityName, description } = this.amenityForm.getRawValue();

    // Upload logo
    const logo = this.logoFile()!;
    const logoUploaded = await this.uploadOne(
      `amenities/${Date.now()}_logo_${logo.name}`,
      logo
    );

    // Save Firestore doc with real URLs
    await addDoc(collection(this.afs.firestore as any, 'amenities'), {
      amenityName,
      description,
      logo: logoUploaded, // { name, type, size, path, url }
      createdAt: Date.now(),
    });

    // Clean up previews and form
    if (this.logoURL()) URL.revokeObjectURL(this.logoURL()!);
    this.amenityForm.reset();
    this.logoFile.set(null);
    this.logoURL.set(null);
  }

  dismiss() {
    this.modal.dismiss();
  }
}
