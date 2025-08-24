import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OtpSessionService {
  phone = signal<string | null>(null);
  fullName = signal<string | null>(null);

  set(phone: string, fullName: string) {
    this.phone.set(phone);
    this.fullName.set(fullName);
  }

  clear() {
    this.phone.set(null);
    this.fullName.set(null);
  }
}
