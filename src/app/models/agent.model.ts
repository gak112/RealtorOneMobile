export interface agentDetails {
  id?: string;
  agentFullName: string;
  agentCode: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: any;
  updatedAt: any;
  code?: string; // optional agent code
  imageUrl?: string; // optional avatar
}
