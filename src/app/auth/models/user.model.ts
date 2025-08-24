// export interface IUser {
//     uid: string;
//     fullName: string;
//     address: string;
//     city: string;
//     pincode: string;
//     state: string;
//     district: string;
//     lCountry: string;
//     phone: string;
//     loginEmail: string;
//     email: string;
//     photoURL: string;
//     secureData: string;
//     createdAt: any;
//     active: boolean;
//   }

export type CategoryKey = 'residential' | 'commercial' | 'plots' | 'lands';
export type SaleType = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'gated_villa' | 'individual_house';
export type AgentStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface IUser {
  uid: string;
  fullName: string;
  phone: string; // 10-digit
  loginEmail: string; // e.g. 9876543210@realtorone.app
  email?: string;
  photoURL?: string;

  role?: 'user' | 'agent' | 'admin';
  agent?: {
    status: AgentStatus; // 'none' by default
    requestedAt?: any;
    approvedAt?: any;
    approvedBy?: string;
    note?: string;
    termsVersionAccepted?: string;
    termsAcceptedAt?: any;
  };

  preferences?: {
    categories?: CategoryKey[];
    saleTypes?: SaleType[];
    propertyTypes?: PropertyType[];
    priceMin?: number | null;
    priceMax?: number | null;
    locations?: string[];
  };

  active: boolean;
  isDeleted: boolean;

  createdAt: any;
  updatedAt: any;
  lastLoginAt?: any;

  readableId?: string;

  // Optional profile fields
  address?: string;
  city?: string;
  pincode?: string;
  state?: string;
  district?: string;
  country?: string;
}
