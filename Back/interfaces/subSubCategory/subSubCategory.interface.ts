import { Document } from "mongoose";

export interface ISubSubCategory extends Document {
  name_en: string;
  name_ar: string;
  slug_en?: string;
  slug_ar?: string;
  desc_en?: string;
  desc_ar?: string;
  subCategory?: string;
  image?: string;
  productsCount?: number;
  title_meta: string;
  desc_meta: string;
  metaDataId?: string;
}
 