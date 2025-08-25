import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface PostRequestForm {
  // ------- your form fields -------
  propertyTitle: string;
  houseType:
    | 'Apartment'
    | 'Individual House/Villa'
    | 'Independent / Builder Floor'
    | 'Farm House'
    | 'Service Apartment'
    | 'Other'
    | '';
  houseCondition: 'Old Houses' | 'New Houses' | null;
  rooms: number | null;
  bhkType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | '+5BHK' | null;
  facingUnits:
    | 'Sq Feet'
    | 'Sq Yard'
    | 'Sq Mtr'
    | 'Acre'
    | 'Feet'
    | 'Yard'
    | 'Mtr'
    | null;
  furnishingType: 'Fully-Furnished' | 'Semi-Furnished' | 'Unfurnished' | null;
  commercialType:
    | 'Retail'
    | 'Office'
    | 'Warehouse'
    | 'Factory'
    | 'Industriy'
    | 'Hospitality'
    | 'Land'
    | 'Other'
    | null;
  commercialSubType: 'complex' | 'individual';
  availabilityStatus: 'Ready to move' | 'Under construction' | null;
  securityDeposit: number | null;
  propertySize: number | null;
  totalPropertyUnits: string | null;
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
  priceOfSale: number | null;
  priceOfRent: number | null;
  priceOfRentType: 'Monthly' | 'Yearly' | null;
  addressOfProperty: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  negotiable: boolean;
  images: string[];
  videoResources: string[];
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
  // ------- extras you add on submit -------
  saleType: 'sale' | 'rent';
  category: 'residential' | 'commercial' | 'plots' | 'lands';

  // timestamps are set in service
}
