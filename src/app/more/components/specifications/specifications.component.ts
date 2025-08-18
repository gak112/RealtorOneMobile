import { Component, Input, computed, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { serverTimestamp } from '@angular/fire/firestore';

type ItemFG = FormGroup<{
  key: FormControl<string>;
  value: FormControl<string>;
}>;

type SectionFG = FormGroup<{
  title: FormControl<string>;
  items: FormArray<ItemFG>;
  newItem: FormGroup<{
    key: FormControl<string>;
    value: FormControl<string>;
  }>;
}>;

@Component({
  selector: 'app-specifications',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonFooter,
  ],
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss'],
})
export class SpecificationsComponent {
  private fb = inject(NonNullableFormBuilder);
  private afs = inject(AngularFirestore);
  private modal = inject(ModalController);

  /** Firestore collection path */
  @Input() path = 'ventureSpecifications';
  /** Optional user info; only uid used if present */
  @Input() user: { uid?: string } | null = null;

  // top input to add a new section title
  newTitle = this.fb.control('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  // main form with sections
  specificationsForm = this.fb.group({
    sections: this.fb.array<SectionFG>([]),
  });

  // UI state with signals
  activeIndex = signal<number>(-1);
  submitting = signal(false);
  canSubmit = computed(() => this.sections.length > 0 && !this.submitting());

  // convenience getters
  get sections(): FormArray<SectionFG> {
    return this.specificationsForm.controls.sections;
  }
  sectionAt = (i: number) => this.sections.at(i);

  private makeItem(key = '', value = ''): ItemFG {
    return this.fb.group({
      key: this.fb.control(key, [Validators.required]),
      value: this.fb.control(value, [Validators.required]),
    });
  }

  private makeSection(title: string): SectionFG {
    return this.fb.group({
      title: this.fb.control(title, [
        Validators.required,
        Validators.minLength(3),
      ]),
      items: this.fb.array<ItemFG>([]),
      newItem: this.fb.group({
        key: this.fb.control('', [Validators.required]),
        value: this.fb.control('', [Validators.required]),
      }),
    });
  }

  addSection(): void {
    const t = this.newTitle.value.trim();
    if (!t) return;
    this.sections.push(this.makeSection(t));
    this.activeIndex.set(this.sections.length - 1);
    this.newTitle.reset('');
  }

  addItem(sectionIndex: number): void {
    const sec = this.sectionAt(sectionIndex);
    const ni = sec.controls.newItem;
    if (ni.invalid) {
      ni.markAllAsTouched();
      return;
    }
    sec.controls.items.push(
      this.makeItem(ni.controls.key.value, ni.controls.value.value)
    );
    ni.reset({ key: '', value: '' });
  }

  removeItem(sectionIndex: number, itemIndex: number): void {
    this.sectionAt(sectionIndex).controls.items.removeAt(itemIndex);
  }

  removeSection(index: number): void {
    this.sections.removeAt(index);
    const len = this.sections.length;
    if (len === 0) this.activeIndex.set(-1);
    else if (this.activeIndex() >= len) this.activeIndex.set(len - 1);
  }

  

  async submit(): Promise<void> {
    console.log(1);
    this.submitting.set(true);

    const payload = this.sections.controls.map((sec) => ({
      title: sec.controls.title.value,
      specifications: sec.controls.items.controls.map((it) => ({
        key: it.controls.key.value,
        value: it.controls.value.value,
      })),
    }));

    console.log(2);

    await this.afs.collection(this.path).add({
      userId: this.user?.uid ?? null,
      sections: payload,
      createdAt: serverTimestamp(),
    });

    this.specificationsForm.setControl(
      'sections',
      this.fb.array<SectionFG>([])
    );
    this.activeIndex.set(-1);
    this.submitting.set(false);
  }

  // track helpers
  trackSection = (i: number) => i;
  trackItem = (i: number) => i;

  dismiss() {
    this.modal.dismiss();
  }
}
