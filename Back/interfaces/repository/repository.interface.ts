import { Document, Types } from "mongoose";

export interface IRepository extends Document {
  type: string;
  repoId: string
  name_en: string;
  name_ar: string;
  quantity: number;
  products: [Types.ObjectId];
  address: string;
  code: string;
  city: string;
  country: string;
  mobile: string;
  contactEmail: string;
  contactName: string;
  active: boolean;
}
