import { Component, computed, inject, signal } from '@angular/core';
import {
  IonContent,
  IonInput,
  IonLabel,
  IonButton,
  IonIcon,
  IonImg,
  IonSpinner,
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { OtpSessionService } from '../../services/otp-session.service';
import { OtpService } from '../../services/otp.service';
import { addIcons } from 'ionicons';
import { informationCircle, logInOutline } from 'ionicons/icons';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    IonContent,
    IonInput,
    IonLabel,
    IonButton,
    IonIcon,
    IonImg,
    IonSpinner
],
})
export default class LoginComponent {
  private router = inject(Router);
  private otp = inject(OtpService);
  private otpSession = inject(OtpSessionService);
  #message = inject(MessageService);

  phone = signal(''); // raw phone
  fullName = signal('');
  loading = signal(false);

  fullNameError = signal<string | null>(null);
  phoneError = signal<string | null>(null);

  digits = computed(() => this.phone().replace(/\D+/g, ''));
  isValidPhone = computed(() => /^\d{10}$/.test(this.digits()));
  isValidName = computed(() => this.fullName().trim().length >= 2);
  canContinue = computed(() => this.isValidPhone() && this.isValidName());

  constructor() {
    addIcons({ logInOutline, informationCircle });
  }

  onFullNameInput(ev: Event) {
    const v = (ev as CustomEvent).detail?.value ?? '';
    const s = String(v);
    this.fullName.set(s);
    this.fullNameError.set(
      s.trim().length >= 2 ? null : 'Please enter your full name.'
    );
  }

  onPhoneInput(ev: Event) {
    const v = (ev as CustomEvent).detail?.value ?? '';
    const s = String(v);
    this.phone.set(s);
    this.phoneError.set(
      /^\d{10}$/.test(s.replace(/\D+/g, ''))
        ? null
        : 'Enter a valid 10-digit number.'
    );
  }

  async onContinue() {
    if (!this.canContinue() || this.loading()) return;
    this.loading.set(true);
    try {
      const phone = this.digits();
      const fullName = this.fullName().trim();

      this.otpSession.set(phone, fullName);
      await this.otp.sendOtp(phone);

      await this.router.navigate(['/otp'], { queryParams: { phone } });
    } catch (e: any) {
      this.phoneError.set(e?.message || 'Could not send OTP. Try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
