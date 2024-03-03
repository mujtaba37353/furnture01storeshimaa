import { Document } from "mongoose";

export interface IBrand extends Document {
  name_en: string;
  name_ar: string;
  slug_en: string;
  slug_ar: string;
  image?: string;
  productsCount?: number;
  title_meta: string;
  desc_meta: string;
  metaDataId?: string;
}
 