import { Document, Types } from "mongoose";

export interface ISubCategory extends Document {
    name_en: string;
    name_ar: string;
    slug_en: string;
    slug_ar: string;
    image?: string;
    productsCount?: number;
    subSubCategoriesCount?: number;
    category: Types.ObjectId;
    title_meta: string;
    desc_meta: string;
    metaDataId?: string;
  }
  