import { Injectable, computed, signal } from '@angular/core';

export type Session = {
  id: string;
  token: string;
  expiresAt: string; // ISO
};

export type UserProfile = {
  id: string;           // simple demo id
  fullName: string;
  phone: string;        // 10-digit
  role: 'normal' | 'admin';
};

type PersistShape = {
  user: UserProfile | null;
  session: Session | null;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private LS_KEY = 'realtorone_auth_v1';

  private _user = signal<UserProfile | null>(null);
  private _session = signal<Session | null>(null);

  /** pending (pre-otp) info */
  private _pendingPhone = signal<string | null>(null);
  private _pendingName = signal<string | null>(null);

  /** public signals */
  currentUser = computed(() => this._user());
  currentSession = computed(() => this._session());
  isAuthenticated = computed(() => !!this._user() && !!this._session());
  user$: any;

  constructor() {
    this.hydrateFromStorage();
  }

  /** Before OTP, remember phone/name so you can prefill or analytics */
  setPendingPhone(phone10: string, fullName: string) {
    this._pendingPhone.set(this.normalizePhone(phone10));
    this._pendingName.set(fullName.trim());
  }

  /** Call right after OTP modal returns success */
  finalizeLogin(opts: { phone: string; fullName: string; session: Session }) {
    const phone = this.normalizePhone(opts.phone);
    const user: UserProfile = {
      id: `user_${phone.slice(-6)}`,
      fullName: opts.fullName.trim(),
      phone,
      role: 'normal',
    };
    this._user.set(user);
    this._session.set(opts.session);
    this._pendingPhone.set(null);
    this._pendingName.set(null);
    this.persist();
  }

  signOut() {
    this._user.set(null);
    this._session.set(null);
    this._pendingPhone.set(null);
    this._pendingName.set(null);
    try { localStorage.removeItem(this.LS_KEY); } catch {}
  }

  /** Helpers */
  private hydrateFromStorage() {
    try {
      const raw = localStorage.getItem(this.LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistShape;

      // basic sanity checks
      if (parsed?.user && parsed?.session) {
        this._user.set(parsed.user);
        this._session.set(parsed.session);

        // auto signout if expired
        const exp = Date.parse(parsed.session.expiresAt);
        if (Number.isFinite(exp) && Date.now() > exp) {
          this.signOut();
        }
      }
    } catch {
      // ignore corrupt storage
    }
  }

  private persist() {
    const data: PersistShape = { user: this._user(), session: this._session() };
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(data));
    } catch {
      // storage might be full/blocked; ignore for demo
    }
  }

  private normalizePhone(p: string) {
    return String(p).replace(/\D+/g, '').slice(-10);
  }
}
