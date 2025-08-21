import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface PostRequest {
  // ------- your form fields -------
  propertyTitle: string;
  houseType:
    | 'Apartment'
    | 'Individual House/Villa'
    | 'Gated Community Villa'
    | '';
  houseCondition: 'Old Houses' | 'New Houses' | null;
  rooms: number | null;
  bhkType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | '+5BHK' | null;
  totalPropertyUnits:
    | 'Sq Feet'
    | 'Sq Yard'
    | 'Sq Mtr'
    | 'Acre'
    | 'Feet'
    | 'Yard'
    | 'Mtr'
    | null;
  furnishingType: 'Fully-Furnished' | 'Semi-Furnished' | 'Unfurnished' | null;
  propertyType:
    | 'Shop'
    | 'Office'
    | 'Warehouse'
    | 'Factory'
    | 'Showroom'
    | 'Land'
    | 'Other'
    | null;
  subType:
    | 'Shopping Mall'
    | 'Co-Working Space'
    | 'IT Park'
    | 'Showroom'
    | 'Other'
    | null;
  securityDeposit: number | null;
  propertySize: number | null;
  propertySizeBuildUp: number | null;
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
  noOfYears: number | null;
  rentPrice: number | null;
  rentUnits: 'Monthly' | 'Yearly' | null;
  costOfProperty: number | null;
  addressOfProperty: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  negotiable: boolean;
  images: string[];
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
  videoResources: IResources[] | any;

  // ------- extras you add on submit -------
  saleType: 'sale' | 'rent';
  category: 'residential' | 'commercial' | 'plots' | 'lands';

  // timestamps are set in service
}

export interface IResources {
  resourceName: string;
  resourceUrl: string;
  resourceType: string;
}
