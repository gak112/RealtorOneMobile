import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { getOTPMessage } from 'src/app/utils/otp.util';

type Store = {
  code: string;
  expiresAt: number;
  attempts: number;
  resends: number;
};

@Injectable({ providedIn: 'root' })
export class OtpService {
  private http = inject(HttpClient);
  private store = new Map<string, Store>(); // key = phone
  private readonly EXPIRY_MS = 2 * 60 * 1000; // 2 minutes
  private readonly MAX_ATTEMPTS = 5;
  private readonly MAX_RESENDS = 3;

  // Optional: your SMS cloud function (set in env)
  private smsUrl = 'https://asia-south1-arhaapps.cloudfunctions.net/sendFXSMS'; // replace with your CF url

  /** Generate a 6-digit unique OTP for a given phone and send it */
  async sendOtp(phone: string): Promise<void> {
    const code = this.generate6Digit();
    const now = Date.now();
    const entry = this.store.get(phone);

    if (entry && entry.resends >= this.MAX_RESENDS) {
      throw new Error('Maximum resend attempts reached.');
    }

    const resends = entry ? entry.resends + 1 : 0;
    this.store.set(phone, {
      code,
      expiresAt: now + this.EXPIRY_MS,
      attempts: 0,
      resends,
    });
    const headers = {
        'Content-Type': 'application/json',
      };

    // Send via SMS (replace with your endpoint body)
    try {
      await firstValueFrom(
        this.http.post(this.smsUrl,getOTPMessage(code, phone), { headers })
      );
    } catch {
      // For dev: still log OTP to console so you can test without SMS
      console.warn('[OTP dev] OTP for', phone, 'is', code);
    }
  }

  canResend(phone: string) {
    const e = this.store.get(phone);
    return !e || e.resends < this.MAX_RESENDS;
  }

  getRemainingResends(phone: string) {
    const e = this.store.get(phone);
    return e ? Math.max(0, this.MAX_RESENDS - e.resends) : this.MAX_RESENDS;
  }

  /** Verify code; on success clears entry */
  async verifyOtp(phone: string, input: string): Promise<boolean> {
    const e = this.store.get(phone);
    if (!e) return false;
    if (Date.now() > e.expiresAt) return false;

    if (e.attempts >= this.MAX_ATTEMPTS) return false;

    const ok = e.code === input;
    e.attempts += 1;

    if (ok) {
      this.store.delete(phone);
      return true;
    }
    this.store.set(phone, e);
    return false;
  }

  private generate6Digit() {
    // 000000 to 999999, keep leading zeros
    const n = Math.floor(1000000 * Math.random());
    return n.toString().padStart(6, '0');
  }
}
