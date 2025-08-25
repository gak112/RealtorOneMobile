// src/app/models/profile.model.ts
export type Gender = 'male' | 'female' | 'other' | 'preferNotToDisclose';

export interface IUserProfile {
  uid: string;

  // Primary identity
  fullName: string | null;

  // Phone
  mobile: string | null;           // 10-digit string, e.g. "9876543210"
  phoneVerified: boolean;

  // Email
  email: string | null;
  emailVerified: boolean;

  // Extras
  dob: string | null;              // ISO date (YYYY-MM-DD) or null
  gender: Gender | null;
  photo: string | null;            // CDN/Uploadcare url or null

  // App-specific
  role?: 'user' | 'agent' | 'admin';
  isAgent?: boolean;

  // Timestamps
  createdAt?: any;
  updatedAt?: any;
}
