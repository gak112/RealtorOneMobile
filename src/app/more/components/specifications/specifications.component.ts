import {
  Component,
  Input,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
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
import { CommonModule } from '@angular/common';

// Types for the data the parent will store
export type SpecKV = { key: string; value: string };
export type SpecSection = { title: string; specifications: SpecKV[] };

// Internal form types
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
    CommonModule,
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
export class SpecificationsComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modal = inject(ModalController);

  // Optional incoming sections (for editing)
  @Input() sections: SpecSection[] = [];

  // top input to add a new section title
  newTitle = this.fb.control('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  // main form with sections
  specificationsForm = this.fb.group({
    sections: this.fb.array<SectionFG>([]),
  });

  // UI state
  activeIndex = signal<number>(-1);
  submitting = signal(false);
  canSubmit = computed(
    () => this.sectionsArray.length > 0 && !this.submitting()
  );

  // convenience getters
  get sectionsArray(): FormArray<SectionFG> {
    return this.specificationsForm.controls.sections;
  }
  sectionAt = (i: number) => this.sectionsArray.at(i);

  ngOnInit(): void {
    // Seed existing sections (edit flow)
    if (this.sections && this.sections.length) {
      for (const sec of this.sections) {
        const s = this.makeSection(sec.title);
        for (const kv of sec.specifications) {
          s.controls.items.push(this.makeItem(kv.key, kv.value));
        }
        this.sectionsArray.push(s);
      }
      this.activeIndex.set(this.sectionsArray.length ? 0 : -1);
    }
  }

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
    this.sectionsArray.push(this.makeSection(t));
    this.activeIndex.set(this.sectionsArray.length - 1);
    this.newTitle.reset('');
  }

  addItem(sectionIndex: number): void {
    const sec = this.sectionAt(sectionIndex);
    const ni = sec.controls.newItem;
    if (ni.invalid) return;
    sec.controls.items.push(
      this.makeItem(ni.controls.key.value, ni.controls.value.value)
    );
    ni.reset({ key: '', value: '' });
  }

  removeItem(sectionIndex: number, itemIndex: number): void {
    this.sectionAt(sectionIndex).controls.items.removeAt(itemIndex);
  }

  removeSection(index: number): void {
    this.sectionsArray.removeAt(index);
    const len = this.sectionsArray.length;
    if (len === 0) this.activeIndex.set(-1);
    else if (this.activeIndex() >= len) this.activeIndex.set(len - 1);
  }

  async submit(): Promise<void> {
    this.submitting.set(true);

    const payload: SpecSection[] = this.sectionsArray.controls.map((sec) => ({
      title: sec.controls.title.value,
      specifications: sec.controls.items.controls.map((it) => ({
        key: it.controls.key.value,
        value: it.controls.value.value,
      })),
    }));

    // Return to parent & close
    await this.modal.dismiss({ sections: payload }, 'submit');
    this.submitting.set(false);
  }

  dismiss() {
    this.modal.dismiss(null, 'cancel');
  }

  trackSection = (i: number) => i;
  trackItem = (i: number) => i;
}
