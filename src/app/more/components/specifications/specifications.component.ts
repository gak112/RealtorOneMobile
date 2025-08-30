import { Component, OnInit, computed, inject, input } from '@angular/core';
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


/** Public types used by parent */
export type SpecKV = { key: string; value: string };
export type SpecSection = { title: string; specifications: SpecKV[] };

/** Internal form types */
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
    IonFooter
],
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss'],
})
export class SpecificationsComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modal = inject(ModalController);

  /** Mode:
   *  - 'add'  -> open fresh (ignore incoming)
   *  - 'edit' -> prefill with given `sections` (usually one) and return only that edited one
   */
  readonly mode = input<'add' | 'edit'>('add');
  readonly index = input<number>(undefined);

  /** When mode === 'edit', parent passes one section in this array.
   *  When mode === 'add', parent passes [] to force a fresh form.
   */
  readonly sections = input<SpecSection[]>([]);

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
  submitting = false;
  canSubmit = computed(() => this.sectionsArray.length > 0 && !this.submitting);

  // convenience getters
  get sectionsArray(): FormArray<SectionFG> {
    return this.specificationsForm.controls.sections;
  }
  sectionAt = (i: number) => this.sectionsArray.at(i);

  ngOnInit(): void {
    const sections = this.sections();
    if (this.mode() === 'edit' && sections && sections.length) {
      // Prefill with provided section(s)
      for (const sec of sections) {
        const s = this.makeSection(sec.title);
        for (const kv of sec.specifications) {
          s.controls.items.push(this.makeItem(kv.key, kv.value));
        }
        this.sectionsArray.push(s);
      }
    } else {
      // Fresh (no prefill)
      this.sectionsArray.clear();
    }
  }

  /* Builders */
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

  /* Section ops */
  addSection(): void {
    const t = (this.newTitle.value ?? '').trim();
    if (!t) return;
    this.sectionsArray.push(this.makeSection(t));
    this.newTitle.reset('');
  }

  removeSection(index: number): void {
    this.sectionsArray.removeAt(index);
  }

  /* Item ops */
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

  /* Submit / Dismiss */
  async submit(): Promise<void> {
    this.submitting = true;

    const payload: SpecSection[] = this.sectionsArray.controls.map((sec) => ({
      title: sec.controls.title.value,
      specifications: sec.controls.items.controls.map((it) => ({
        key: it.controls.key.value,
        value: it.controls.value.value,
      })),
    }));

    await this.modal.dismiss(
      { sections: payload, mode: this.mode(), index: this.index() },
      'submit'
    );

    // Reset if the modal is re-used by framework
    this.submitting = false;
    this.newTitle.reset('');
    this.sectionsArray.clear();
  }

  dismiss(): void {
    this.modal.dismiss(null, 'cancel');
  }

  trackSection = (i: number) => i;
  trackItem = (i: number) => i;
}
