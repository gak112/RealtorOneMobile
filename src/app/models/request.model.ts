export interface IRequest {
  title: string | any;
  houseType: string | any;
  bhkType: string | any;
  toilets: number | any;
  poojaRoom: number | any;
  livingDining: number | any;
  kitchen: number | any;
  propertySizeBuildUp: number | any;
  northFacing: string | any;
  northSize: number | any;
  units: string | any;
  propertyUnits: string | any;
  totalPropertyUnits: string | any;
  southFacing: string | any;
  southSize: number | any;
  eastFacing: string | any;
  eastSize: number | any;
  westFacing: string | any;
  westSize: number | any;
  amenities: string[] | any;
  propertySize: number | any;
  floor: string | any;
  noOfYears: number | any;
  // ownership: string | any;
  rent: number | any;
  rentUnits: string | any;
  costOfProperty: number | any;
  addressOfProperty: string | any;
  description: string | any;
  resources: IResources[] | any;
  videoResources: IResources[] | any;
  saleType: 'sale' | 'rent' | any;
  category: 'residential' | 'commercial' | 'plots' | 'lands' | any;
  ageOfPropertyAction: string | any;
  negotiable: boolean | any;
  paymentAction: string | any;
  planCost: number | any;
  uid: string | any;
  createdAt: any;
  createdBy?: string | any;
  sortDate: any;
  sortDate2: any;
  displayDate: any;
  sortTime: any;
  status: string | any;
}

export interface IResources {
  resourceName: string;
  resourceUrl: string;
  resourceType: string;
}
