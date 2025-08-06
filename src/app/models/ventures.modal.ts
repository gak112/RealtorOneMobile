export interface IVentures {
  ventureName: string;
  description: string;
  location: string;
  ventureWebsite: string;
  logo: string;
  amenities: string[];
  ventureImages: string[];
  surveyNos: string;
  directors: string;
  companyName: string;
  companyWebsite: string;
  facebookLink: string;
  instagramLink: string;
  twitterLink: string;
  brochure: string;
  approvals: boolean;
  specifications: ISpecifications[];
  towerAPT: number;
  villaName: string;
  houseVilla: number;
  villaResources: string[];
  landArea: string;
  landAreaUnits: string;
  propertySizeBuildUp: string;
  propertyUnits: string;
  openArea: number;
  uid: string;
  createdAt: any;
  createdBy?: string;
}


export interface IVentureTowers {
  ventureId: string;
  towerName: string;
  towerNumber: number;
  floors: number;
  flats: number;
  resources: string[];
  lifts: number;
  createdAt: any;
  createdBy?: string;
  sortDate: any;
  sortDate2: any;
  displayDate: any;
  sortTime: any;
  configured: boolean;
}

export interface IVentureTowerFloors {
  ventureId: string;
  towerId: string;
  floorName: string;
  floorNumber: number;
  flats: number;
  resources: string[];
  layout: string[];
  videos: string[];
  carpetArea: string | any;
  balconyArea: string | any;
  commonArea: string | any;
  saleableArea: string | any;
  createdAt: any;
  createdBy?: string;
  sortDate: any;
  sortDate2: any;
  displayDate: any;
  sortTime: any;
  configured: boolean;

}

export interface IVentureTowerFlats {
  ventureId: string;
  towerId: string;
  floorId: string;
  flatName: string;
  flatNumber: number;
  bhkType: string;
  resources: string[];
  layout: string[];
  videos: string[];
  toilets: number | any;
  poojaRoom: number | any;
  livingDining: number | any;
  kitchen: number | any;
  northFacing: string | any;
  northSize: number | any;
  units: string | any;
  southFacing: string | any;
  southSize: number | any;
  eastFacing: string | any;
  eastSize: number | any;
  westFacing: string | any;
  westSize: number | any;
  carpetArea: string | any;
  balconyArea: string | any;
  commonArea: string | any;
  saleableArea: string | any;
  amenities: string[] | any;
  costOfProperty: number | any;
  createdAt: any;
  createdBy?: string;
  sortDate: any;
  sortDate2: any;
  displayDate: any;
  sortTime: any;
  configured: boolean;
}


export interface IVentureHouses {
  ventureId: string;
  houseName: string;
  houseNumber: number;
  bhkType: string;
  floors: number;
  lifts: number;
  type: string; // simplex, duplex, triplex or anything..
  resources: string[];
  layout: string[];
  videos: string[];
  toilets: number;
  poojaRoom: number;
  livingDining: number;
  kitchen: number;
  northFacing: string;
  northSize: number;
  units: string;
  southFacing: string;
  southSize: number;
  eastFacing: string;
  eastSize: number;
  westFacing: string;
  westSize: number;
  carpetArea: string;
  balconyArea: string;
  commonArea: string;
  saleableArea: string;
  amenities: string[];
  costOfProperty: number;
  createdAt: any;
  createdBy?: string;
  sortDate: any;
  sortDate2: any;
  displayDate: any;
  sortTime: any;
  configured: boolean;
}





export interface ISpecifications {
  title: string;
  specifications: ISpecificationDetails[];
}

export interface ISpecificationDetails {
  key: string | any;
  value: string | any;
}