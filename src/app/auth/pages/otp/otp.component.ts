// otp.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  signal,
  computed,
  effect,
  inject,
  NgZone,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonLabel,
  IonButton,
  IonInput,
  IonSpinner,
  IonImg,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OtpService } from '../../services/otp.service';
import { OtpSessionService } from '../../services/otp-session.service';
import { LoginService } from '../../services/login.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, closeOutline, reloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-otp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  imports: [
    IonIcon,
    IonImg,
    IonContent,
    IonLabel,
    IonButton,
    IonInput,
    IonSpinner
],
})
export class OtpComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly otpSvc = inject(OtpService);
  private readonly session = inject(OtpSessionService);
  private readonly login = inject(LoginService);
  private readonly zone = inject(NgZone);
  private readonly toast = inject(ToastController);

  @ViewChildren(IonInput) inputs!: QueryList<IonInput>;

  // ---- State ----
  phone = signal('');
  fullName = signal('');
  digits = signal<string[]>(['', '', '', '', '', '']);

  loadingSend = signal(false);
  loadingVerify = signal(false);
  errorMsg = signal<string | null>(null);

  secondsLeft = signal(60);
  canResend = signal(false);
  remainingResends = signal(0);

  /** Set to true after a successful resend;
   *  used to prefer "expired" message for a mismatch right after resend. */
  resendSinceLastIssue = signal(false);

  private timerId: any = null;

  maskedPhone = computed(() =>
    this.phone() ? `+91 ******${this.phone().slice(-4)}` : ''
  );

  isValidOtp = computed(
    () => this.digits().length === 6 && this.digits().every((d) => d !== '')
  );

  constructor() {
    addIcons({ reloadOutline, closeOutline, arrowBackOutline });

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((pm) => {
      const ph = (pm.get('phone') ?? '').replace(/\D+/g, '');
      const sessPhone = this.session.phone();
      const final = ph || sessPhone || '';
      this.phone.set(final);
      this.fullName.set(this.session.fullName() ?? '');
      this.resetDigitsAndFocus();
      this.startTimer();
      this.resendSinceLastIssue.set(false);
      try {
        this.remainingResends.set(this.otpSvc.getRemainingResends(final));
      } catch (e: any) {
        this.errorMsg.set(e?.message || 'Cannot check resend quota.');
      }
    });

    // Auto focus first box when cleared
    effect(() => {
      if (this.digits().every((v) => v === '') && this.inputs?.first) {
        queueMicrotask(() => this.inputs.first.setFocus());
      }
    });
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  close() {
    this.router.navigateByUrl('/login', { replaceUrl: true }).catch(() => {});
  }

  // ---- Timer ----
  private startTimer() {
    this.clearTimer();
    this.secondsLeft.set(60);
    this.canResend.set(false);

    this.zone.runOutsideAngular(() => {
      this.timerId = setInterval(() => {
        const n = this.secondsLeft() - 1;
        if (n <= 0) {
          this.clearTimer();
          this.zone.run(() => {
            this.secondsLeft.set(0);
            this.canResend.set(true);
          });
        } else {
          this.zone.run(() => this.secondsLeft.set(n));
        }
      }, 1000);
    });
  }
  private clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
  private resetDigitsAndFocus() {
    this.digits.set(['', '', '', '', '', '']);
    queueMicrotask(() => this.inputs?.first?.setFocus());
  }

  // ---- Resend ----
  async onResend() {
    if (!this.canResend() || this.loadingSend()) return;
    this.loadingSend.set(true);
    this.errorMsg.set(null);
    try {
      await this.otpSvc.sendOtp(this.phone());
      this.remainingResends.set(this.otpSvc.getRemainingResends(this.phone()));
      this.resendSinceLastIssue.set(true);
      this.startTimer();
      this.resetDigitsAndFocus();
      await this.presentToast('A new OTP has been sent.', 'medium');
    } catch (e: any) {
      this.errorMsg.set(e?.message || 'Failed to resend OTP.');
      await this.presentToast(this.errorMsg()!, 'danger');
    } finally {
      this.loadingSend.set(false);
    }
  }

  // ---- Input (immediate feedback) ----
  onInput(i: number, ev: CustomEvent) {
    const raw = String((ev as any)?.detail?.value ?? '');
    const only = raw.replace(/\D/g, '');

    const arr = this.digits().slice();
    let idx = i;

    if (only.length <= 1) {
      arr[i] = only || '';
      this.digits.set(arr);
      if (only && i < arr.length - 1) {
        queueMicrotask(() => this.inputs.get(i + 1)?.setFocus());
      }
    } else {
      // pasted multiple digits
      for (const ch of only) {
        if (idx >= arr.length) break;
        arr[idx++] = ch;
      }
      this.digits.set(arr);
      queueMicrotask(() =>
        this.inputs.get(Math.min(idx, arr.length - 1))?.setFocus()
      );
    }

    // If we now have 6 digits → soft-validate immediately
    if (this.isValidOtp()) {
      this.softValidateAndToast();
    }
  }

  onKeyDown(i: number, ev: KeyboardEvent) {
    const key = ev.key;

    if (key === 'Backspace') {
      const arr = this.digits().slice();
      if (arr[i]) {
        arr[i] = '';
        this.digits.set(arr);
      } else if (i > 0) {
        arr[i - 1] = '';
        this.digits.set(arr);
        ev.preventDefault();
        queueMicrotask(() => this.inputs.get(i - 1)?.setFocus());
      }
      return;
    }
    if (key === 'ArrowLeft' && i > 0) {
      ev.preventDefault();
      queueMicrotask(() => this.inputs.get(i - 1)?.setFocus());
      return;
    }
    if (key === 'ArrowRight' && i < this.digits().length - 1) {
      ev.preventDefault();
      queueMicrotask(() => this.inputs.get(i + 1)?.setFocus());
      return;
    }
  }

  onPaste(i: number, ev: ClipboardEvent) {
    const text = ev.clipboardData?.getData('text') ?? '';
    const only = text.replace(/\D/g, '');
    if (!only) return;
    ev.preventDefault();

    const arr = this.digits().slice();
    let idx = i;
    for (const ch of only) {
      if (idx >= arr.length) break;
      arr[idx++] = ch;
    }
    this.digits.set(arr);
    queueMicrotask(() =>
      this.inputs.get(Math.min(idx, arr.length - 1))?.setFocus()
    );

    if (this.isValidOtp()) {
      this.softValidateAndToast();
    }
  }

  /** Try a soft validation to give instant feedback */
  private async softValidateAndToast() {
    const code = this.digits().join('');

    // If timer ran out, tell them it's expired
    if (this.canResend()) {
      await this.presentToast(
        'OTP expired. Please tap Resend and enter the new code.',
        'danger'
      );
      return;
    }

    const res = this.otpSvc.validate(this.phone(), code, /*soft*/ true);

    if (res === 'ok') {
      // Optional: you could auto-verify here; we keep it manual to respect your flow.
      return;
    }

    if (res === 'expired') {
      await this.presentToast(
        'OTP expired. Please tap Resend and enter the new code.',
        'danger'
      );
      return;
    }

    // mismatch → choose message depending on whether a resend occurred
    if (this.resendSinceLastIssue()) {
      await this.presentToast(
        'Expired OTP. Please enter the latest OTP just sent.',
        'danger'
      );
      // After educating once, treat further mismatches as generic invalid
      this.resendSinceLastIssue.set(false);
    } else {
      await this.presentToast('Invalid OTP. Please try again.', 'danger');
    }

    // Clear inputs for a fresh try
    this.resetDigitsAndFocus();
  }

  // ---- Hard verify (button) ----
  async onVerify() {
    if (!this.isValidOtp() || this.loadingVerify()) return;
    this.loadingVerify.set(true);
    this.errorMsg.set(null);

    try {
      const code = this.digits().join('');
      const result = this.otpSvc.validate(this.phone(), code, /*soft*/ false);
      console.log(result);

      if (result !== 'ok') {
        const msg =
          result === 'expired'
            ? 'OTP expired. Please tap Resend and enter the new code.'
            : 'Invalid OTP. Please try again.';
        this.errorMsg.set(msg);
        await this.presentToast(msg, 'danger');
        if (result !== 'expired') this.resetDigitsAndFocus();
        return;
      }

      // success → login
      (document.activeElement as HTMLElement)?.blur?.();
      await this.login.verifyAndLogin(this.phone(), this.fullName());
      this.session.clear();
      console.log('navigating to home');
      await this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } catch (e: any) {
      const msg = e?.message || 'Verification failed. Please try again.';
      console.log(e, e.message);
      this.errorMsg.set(msg);
      await this.presentToast(msg, 'danger');
    } finally {
      this.loadingVerify.set(false);
    }
  }

  private async presentToast(
    message: string,
    color: 'success' | 'medium' | 'danger' = 'medium'
  ) {
    const t = await this.toast.create({
      message,
      duration: 1600,
      position: 'top',
      color,
    });
    await t.present();
  }
}
