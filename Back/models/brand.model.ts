import { Schema, Types, model } from "mongoose";
import { IBrand } from "../interfaces/brand/brand.interface";

// 1- Create Schema
const BrandSchema = new Schema<IBrand>(
  {
    name_en: {
      type: String,
      required: true,
    },
    name_ar: {
      type: String,
      required: true,
    },
    slug_en: {
      type: String,
    },
    slug_ar: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    productsCount: { type: Number, default: 0 },
    title_meta: { type: String, default: "" },
    desc_meta: { type: String, default: "" },
    metaDataId: { type: Types.ObjectId, ref: "Meta" },
  },
  { timestamps: true }
);

BrandSchema.virtual("imageUrl").get(function (this: IBrand) {
  if (this.image) {
    return `${process.env.APP_URL}/uploads/${this.image}`;
  }
  return ``;
});
// 2- Create Model
export const Brand = model<IBrand>("Brand", BrandSchema);
