import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input
} from '@angular/core';

import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonFooter,
  IonButton,
  ToastController,
  ModalController,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs/operators';

import { AgentService } from 'src/app/more/services/agent.service';
import { agentDetails } from 'src/app/models/agent.model';

type AgentForm = {
  agentFullName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
  city: FormControl<string>;
  state: FormControl<string>;
  pincode: FormControl<string>;
};

@Component({
  selector: 'app-agent-basic-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agent-basic-details.component.html',
  styleUrls: ['./agent-basic-details.component.scss'],
  imports: [
    IonIcon,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonTextarea,
    IonFooter,
    IonButton
],
})
export class AgentBasicDetailsComponent {
  readonly uid = input.required<string>();
  readonly agentId = input<string | null>(null); // edit mode when present

  private fb = inject(NonNullableFormBuilder);
  private svc = inject(AgentService);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);

  loading = signal(false);
  pageError = signal<string | null>(null);
  editId = signal<string | null>(null);

  private static readonly RX_10 = /^\d{10}$/;
  private static readonly RX_6 = /^\d{6}$/;

  // IMPORTANT: validate instantly on change to avoid “stuck disabled” UX
  form = this.fb.group<AgentForm>(
    {
      agentFullName: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      phone: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.pattern(AgentBasicDetailsComponent.RX_10),
        ],
      }),
      address: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      city: this.fb.control('', { validators: [Validators.required] }),
      state: this.fb.control('', { validators: [Validators.required] }),
      pincode: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.pattern(AgentBasicDetailsComponent.RX_6),
        ],
      }),
    },
    { updateOn: 'change' } // 👈 validate as user types/changes
  );

  // Signals that react under OnPush
  private validSig = toSignal(
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      map((s) => s === 'VALID')
    ),
    { initialValue: this.form.valid }
  );

  private dirtySig = toSignal(
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),
      map(() => this.form.dirty)
    ),
    { initialValue: this.form.dirty }
  );

  isEdit = computed(() => this.editId() !== null);

  // The rule:
  // - create: enabled when valid
  // - edit:   enabled when valid AND dirty
  canSubmit = computed(() => {
    if (this.loading()) return false;
    if (!this.validSig()) return false;
    return this.isEdit() ? this.dirtySig() : true;
  });

  submitDisabled = computed(() => !this.canSubmit());

  constructor() {
    addIcons({ chevronBackOutline });
    const agentId = this.agentId();
    if (agentId) this.editId.set(agentId);
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'agent-basic-details-dismissed');
  }

  // template helpers
  ctrl = <K extends keyof AgentForm>(name: K) => this.form.controls[name];
  touchedInvalid = (name: keyof AgentForm) =>
    this.ctrl(name).touched && this.ctrl(name).invalid;
  hasError = (name: keyof AgentForm, key: string) =>
    !!this.ctrl(name).errors?.[key];

  trim(name: keyof AgentForm) {
    const c = this.ctrl(name);
    const v = (c.value ?? '').trim();
    if (v !== c.value) c.setValue(v as never, { emitEvent: false });
  }
  digits(name: keyof AgentForm, len: number) {
    const c = this.ctrl(name);
    const v = (c.value ?? '').replace(/\D+/g, '').slice(0, len);
    if (v !== c.value) c.setValue(v as never, { emitEvent: false });
  }

  private async toast(
    msg: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'
  ) {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 2200,
      color,
      position: 'top',
    });
    await t.present();
  }

  private focusFirstInvalid() {
    requestAnimationFrame(() => {
      const el = document.querySelector(
        'form .ng-invalid'
      ) as HTMLElement | null;
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as any)?.setFocus?.();
    });
  }

  // Call this after loading existing data (edit mode) to set a clean baseline
  setInitialForEdit(values: Partial<agentDetails>) {
    this.form.reset(
      {
        agentFullName: values.agentFullName ?? '',
        email: values.email ?? '',
        phone: values.phone ?? '',
        address: values.address ?? '',
        city: values.city ?? '',
        state: values.state ?? '',
        pincode: values.pincode ?? '',
      } as any,
      { emitEvent: false }
    );
    this.form.markAsPristine(); // 👈 baseline clean
    this.form.updateValueAndValidity({ emitEvent: true });
  }

  async submit() {
    if (this.submitDisabled()) return;

    this.pageError.set(null);
    this.form.markAllAsTouched();

    if (!this.validSig()) {
      await this.toast('Please fix the highlighted fields.', 'danger');
      this.focusFirstInvalid();
      return;
    }

    const uid = this.uid();
    if (!uid) {
      this.pageError.set('Missing user id (uid).');
      await this.toast(this.pageError()!, 'danger');
      return;
    }

    this.loading.set(true);
    const payload = this.form.getRawValue() as agentDetails;

    try {
      const id = this.editId();
      if (id) {
        await this.svc.updateAgent(id, payload);
        await this.toast('Agent updated successfully', 'success');
      } else {
        const newId = await this.svc.createAgent(uid, payload);
        this.editId.set(newId);
        await this.toast('Agent created successfully', 'success');
      }

      // After save: make button disabled again until next change
      this.form.markAsPristine();
      this.form.updateValueAndValidity({ emitEvent: true });

      // Close modal and notify parent (optional)
      const top = await this.modalCtrl.getTop();
      if (top) await top.dismiss(null, 'agent-created');
    } catch (e: any) {
      this.pageError.set(e?.message || 'Failed to save agent.');
      await this.toast(this.pageError()!, 'danger');
    } finally {
      this.loading.set(false);
    }
  }
}
