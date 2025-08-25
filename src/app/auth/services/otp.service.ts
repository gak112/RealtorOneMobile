



// otp.service.ts
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

type ValidateResult = 'ok' | 'mismatch' | 'expired';

@Injectable({ providedIn: 'root' })
export class OtpService {
  private http = inject(HttpClient);

  private store = new Map<string, Store>(); // phone -> data
  private readonly EXPIRY_MS = 2 * 60 * 1000; // 2 minutes
  private readonly MAX_ATTEMPTS = 5;
  private readonly MAX_RESENDS = 3;

  private smsUrl = 'https://asia-south1-arhaapps.cloudfunctions.net/sendFXSMS'; // replace with your SMS endpoint

  async sendOtp(phone: string): Promise<void> {
    const code = this.generate6Digit();
    const now = Date.now();
    const old = this.store.get(phone);
    const resends = old ? old.resends + 1 : 0;

    this.store.set(phone, {
      code,
      expiresAt: now + this.EXPIRY_MS,
      attempts: 0,
      resends,
    });

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      await firstValueFrom(
        this.http.post(this.smsUrl,getOTPMessage(code, phone), { headers })
      );
    } catch {
      console.warn('[DEV] OTP for', phone, 'is', code);
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

  /** Soft/hard validation:
   *  soft=true -> does NOT increment attempts / clear store
   *  soft=false -> behaves like final verification (increments attempts; clears on success)
   */
  validate(phone: string, input: string, soft = true): ValidateResult {
    const e = this.store.get(phone);
    if (!e) return 'expired';
    if (Date.now() > e.expiresAt || e.attempts >= this.MAX_ATTEMPTS) return 'expired';

    const ok = e.code === input;
    if (soft) return ok ? 'ok' : 'mismatch';

    // hard verify (consume attempt)
    e.attempts += 1;
    if (ok) {
      this.store.delete(phone);
      return 'ok';
    }
    this.store.set(phone, e);
    return 'mismatch';
  }

  /** Backward compatibility for existing callers */
  async verifyOtp(phone: string, input: string): Promise<boolean> {
    const res = this.validate(phone, input, /*soft*/ false);
    return res === 'ok';
  }

  private generate6Digit() {
    const n = Math.floor(Math.random() * 1_000_000);
    return n.toString().padStart(6, '0');
  }
}






