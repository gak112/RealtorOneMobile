// src/app/models/profile.model.ts
export type Gender = 'male' | 'female' | 'other' | 'preferNotToDisclose';

export interface IUserProfile {
  uid: string;

  // Primary identity
  fullName: string | null;

  // Phone
  mobile: string | null; // 10-digit string, e.g. "9876543210"
  phoneVerified: boolean;

  // Email
  email: string | null;
  emailVerified: boolean;

  // Extras
  dob: string | null; // ISO date (YYYY-MM-DD) or null
  gender: Gender | null;
  photo: string | null; // CDN/Uploadcare url or null

  // App-specific
  role?: 'user' | 'agent' | 'admin';
  isAgent?: boolean;

  // Timestamps
  createdAt?: any;
  updatedAt?: any;
}

// Utility function for data URL to File conversion
export function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// OTP related interfaces
export interface IOtpPayLoad {
  mobileNumber?: string;
  email?: string;
  type: 'phone' | 'email';
}

export interface IVerifyOtpPayload {
  orderId: string;
  otp: string;
  type: 'phone' | 'email';
}

export interface IProfileDetails {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  dob?: string;
  gender?: Gender;
  photo?: string;
}