import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface IProperty {
  id: string;
  propertyTitle: string;
  houseType: string;
  houseCondition: string;
  rooms: number | null;
  bhkType: string;
  furnishingType: string;
  commercialType: string;
  commercialSubType: string;
  availabilityStatus: string;
  securityDeposit: number | null;
  propertySize: number | null;
  totalPropertyUnits: string | null;
  facingUnits: string;
  propertySizeBuiltup: number | null;
  sizeBuiltupUnits: string | null;
  northFacing: string | null;
  northSize: number | null;
  southFacing: string | null;
  southSize: number | null;
  eastFacing: string | null;
  eastSize: number | null;
  westFacing: string | null;
  westSize: number | null;
  toilets: number | null;
  poojaRoom: number | null;
  livingDining: number | null;
  kitchen: number | null;
  floor: string | null;
  amenities: string[];
  ageOfProperty: string | null;
  priceOfSale: number | null | undefined;
  priceOfRent: number | null | undefined;
  priceOfRentType: string;
  addressOfProperty: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  negotiable: boolean;
  images: IPropertyImage[];
  videoResources: IPropertyVideo[];
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  createdBy: string;
  updatedBy: string;
  sortDate: number;
  isDeleted: boolean;
  deletedBy: string | null;
  deletedAt: Timestamp | FieldValue | null;
  status: string;
  fullSearchText: string[];
  agentName: string;
  propertyId: string;
  // ------- extras you add on submit -------
  saleType: 'sale' | 'rent';
  category: 'residential' | 'commercial' | 'plots' | 'lands';

  propertyImages: IPropertyImage[];

  propertyStatus: string;
}

export interface IPropertyImage {
  id: string;
  image: string;
}

export interface IPropertyVideo {
  id: string;
  video: string;
}
