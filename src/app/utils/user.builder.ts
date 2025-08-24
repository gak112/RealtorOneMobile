import { IUser } from '../auth/models/user.model';

export function buildRealtorUser(params: {
  uid: string;
  fullName: string;
  phone: string; // 10-digit
  loginEmail?: string; // default: `${phone}@realtorone.app`
  createdAt?: any;
  readableId?: string;
}): IUser {
  const now = params.createdAt ?? new Date();
  const loginEmail = params.loginEmail ?? `${params.phone}@realtorone.app`;

  return {
    uid: params.uid,
    fullName: (params.fullName ?? '').trim(),
    phone: normalizePhone(params.phone),
    loginEmail,
    email: loginEmail,
    photoURL: '',

    role: 'user' as const,
    agent: { status: 'none' as const },

    preferences: {
      categories: [],
      saleTypes: [],
      propertyTypes: [],
      priceMin: null,
      priceMax: null,
      locations: [],
    },

    active: true,
    isDeleted: false,

    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,

    readableId: params.readableId,
  };
}

function normalizePhone(p: string) {
  return String(p).replace(/\D+/g, '').slice(-10);
}
