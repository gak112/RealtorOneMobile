import {
  Component,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonLabel,
  IonButton,
  IonInput,
  IonSpinner,
  IonImg,
  IonIcon,
} from '@ionic/angular/standalone';
import { NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OtpService } from '../../services/otp.service';
import { OtpSessionService } from '../../services/otp-session.service';
import { LoginService } from '../../services/login.service';
import { addIcons } from 'ionicons';
import { closeOutline, reloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-otp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  imports: [
    IonIcon,
    IonImg,
    CommonModule,
    IonContent,
    IonLabel,
    IonButton,
    IonInput,
    IonSpinner,
  ],
})
export class OtpComponent {
  // ✅ DI only in field initializers (valid injection context)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly otpSvc = inject(OtpService);
  private readonly session = inject(OtpSessionService);
  private readonly login = inject(LoginService);
  private readonly zone = inject(NgZone);

  // Query all IonInputs by type (no template refs needed)
  @ViewChildren(IonInput) inputs!: QueryList<IonInput>;

  // ---- State (signals) ----
  phone = signal('');
  fullName = signal('');
  digits = signal<string[]>(['', '', '', '', '', '']);
  loadingSend = signal(false);
  loadingVerify = signal(false);
  errorMsg = signal<string | null>(null);

  secondsLeft = signal(60);
  canResend = signal(false);
  remainingResends = signal(0);

  private timerId: any = null;

  maskedPhone = computed(() =>
    this.phone() ? `+91 ******${this.phone().slice(-4)}` : ''
  );

  isValidOtp = computed(
    () => this.digits().length === 6 && this.digits().every((d) => d !== '')
  );

  // Better UX label
  timerLabel = computed(() =>
    this.canResend() ? 'Resend OTP' : `Resend in ${this.secondsLeft()}s`
  );

  constructor() {
    addIcons({
      reloadOutline,
      closeOutline,
    });

    // Initialize from query/session (auto-unsubscribe)
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((pm) => {
    const ph = (pm.get('phone') ?? '').replace(/\D+/g, '');
      const sessPhone = this.session.phone();
      const final = ph || sessPhone || '';
      this.phone.set(final);
      this.fullName.set(this.session.fullName() ?? '');
      this.resetDigitsAndFocus();
      this.startTimer();
      try {
        this.remainingResends.set(this.otpSvc.getRemainingResends(final));
      } catch (e: any) {
        // Service-level error handling remains inside the service
        this.errorMsg.set(e?.message || 'Cannot check resend quota.');
      }
    });

    // Focus first input when all digits cleared
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
    // mobile-friendly: just navigate back
    this.router.navigateByUrl('/login', { replaceUrl: true }).catch(() => {});
  }

  // ---- Timer (perf: outside Angular) ----
  private startTimer() {
    this.clearTimer();
    this.secondsLeft.set(60);
    this.canResend.set(false);

    this.zone.runOutsideAngular(() => {
      this.timerId = setInterval(() => {
        const n = this.secondsLeft() - 1;
        if (n <= 0) {
          this.clearTimer();
          // jump back into Angular to update signals
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
      this.startTimer();
      this.resetDigitsAndFocus();
    } catch (e: any) {
      this.errorMsg.set(e?.message || 'Failed to resend OTP.');
    } finally {
      this.loadingSend.set(false);
    }
  }

  // ---- Input handlers (no skipping) ----
  onInput(i: number, ev: CustomEvent) {
    const raw = String((ev as any)?.detail?.value ?? '');
    const onlyDigits = raw.replace(/\D/g, '');

    const arr = this.digits().slice();
    let idx = i;

    if (onlyDigits.length <= 1) {
      arr[i] = onlyDigits || '';
      this.digits.set(arr);
      if (onlyDigits && i < arr.length - 1) {
        queueMicrotask(() => this.inputs.get(i + 1)?.setFocus());
      }
    } else {
      // Paste: spread forward
      for (const ch of onlyDigits) {
        if (idx >= arr.length) break;
        arr[idx++] = ch;
      }
      this.digits.set(arr);
      queueMicrotask(() =>
        this.inputs.get(Math.min(idx, arr.length - 1))?.setFocus()
      );
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
    // Do not auto-advance here; advancing is handled in onInput
  }

  onPaste(i: number, ev: ClipboardEvent) {
    const text = ev.clipboardData?.getData('text') ?? '';
    const onlyDigits = text.replace(/\D/g, '');
    if (!onlyDigits) return;
    ev.preventDefault();

    const arr = this.digits().slice();
    let idx = i;
    for (const ch of onlyDigits) {
      if (idx >= arr.length) break;
      arr[idx++] = ch;
    }
    this.digits.set(arr);
    queueMicrotask(() =>
      this.inputs.get(Math.min(idx, arr.length - 1))?.setFocus()
    );
  }

  // ---- Verify ----
  async onVerify() {
    if (!this.isValidOtp() || this.loadingVerify()) return;
    this.loadingVerify.set(true);
    this.errorMsg.set(null);

    try {
      const code = this.digits().join('');
      const ok = await this.otpSvc.verifyOtp(this.phone(), code);
      if (!ok) {
        this.errorMsg.set(
          'Invalid or expired OTP. Please resend and try again.'
        );
        return;
      }

      // Optional: hide keyboard on mobile
      (document.activeElement as HTMLElement)?.blur?.();

      await this.login.verifyAndLogin(this.phone(), this.fullName());
      this.session.clear();
      await this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } catch (e: any) {
      console.log(e);
      this.errorMsg.set(e?.message || 'Verification failed. Please try again.');
    } finally {
      this.loadingVerify.set(false);
    }
  }
}
