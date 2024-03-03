import { Document, Types } from "mongoose";
import { ICategory } from "../category/category.interface";
import { IOffer } from "../offer/offer.interface";
import { IRepository } from "../repository/repository.interface";
import { ISubSubCategory } from "../subSubCategory/subSubCategory.interface";
import { ISubCategory } from "../subcategory/subcategory.interface";
import IUser from "../user/user.interface";
import { IBrand } from "../brand/brand.interface";
import { IGeneralQuality } from "../generalQuality/generalQuality.interface";

export interface IProduct extends Document {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  slug_en: string;
  slug_ar: string;
  priceBeforeDiscount: number;
  priceAfterDiscount: number;
  shippingPrice: number;
  quantity: number;
  images: string[];
  sales: number;
  paymentType: "online" | "cash" | "both";
  keywords: [string];
  attributes: [
    {
      key_ar: string;
      key_en: string;
      values: [{ value_ar: string; value_en: string }];
    }
  ];
  qualities: [
    {
      values: [{
        key_en: string;
        key_ar: string;
        value_en: string;
        value_ar: string;
        color?: string;
      }];
      quantity: number;
      price?: number;
      image?: string[];
    }
  ];
  category: ICategory["_id"] | ICategory;
  subCategory: Types.ObjectId | ISubCategory;
  subSubCategory: Types.ObjectId | ISubSubCategory;
  brand: Types.ObjectId | IBrand;
  generalQualities: [Types.ObjectId |IGeneralQuality];
  likes: [{ user: IUser["_id"] | IUser }];
  rating: number;
  weight: number;
  metaDataId?: string;
  title_meta?: string;
  desc_meta?: string;
  offer: Types.ObjectId | IOffer;
  title?: string;
  message?: string;
  receiver?: string;
  role?: string;
  link?: string;
  extention?: string;
  directDownloadLink?: string;
  repositoryId: Types.ObjectId | IRepository;
  coupons: [Types.ObjectId];
}
