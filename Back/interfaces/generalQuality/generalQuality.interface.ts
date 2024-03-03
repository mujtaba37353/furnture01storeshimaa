import { Document } from "mongoose";

// Define interfaces for inner schemas
export interface IGeneralQuality extends Document {
  key_en: string;
  key_ar: string;
  values: [
    {
      value_en: string;
      value_ar: string;
      color?: string;
    }
  ];
  productsCount?: number;
}
