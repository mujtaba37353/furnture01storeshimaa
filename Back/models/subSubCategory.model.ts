import { Schema, Types, model } from 'mongoose';
import { ISubSubCategory } from '../interfaces/subSubCategory/subSubCategory.interface';

// 1- Create Schema
const SubSubCategorySchema = new Schema<ISubSubCategory>(
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
    desc_en: {
      type: String,
    },
    desc_ar: {
      type: String,
    },
    subCategory: {
      type: Types.ObjectId,
      ref: "SubCategory",
    },
    image: [
      {
        type: String,
        default: "",
      },
    ],
    productsCount: { type: Number, default: 0 },
    title_meta: { type: String, default: "" },
    desc_meta: { type: String, default: "" },
    metaDataId: { type: Types.ObjectId, ref: "Meta" },
  },
  { timestamps: true }
);


SubSubCategorySchema.virtual("imageUrl").get(function (this: ISubSubCategory) {
  if (this.image) {
    return `${process.env.APP_URL}/uploads/${this.image}`;
  }
  return ``;
});
// 2- Create Model
export const SubSubCategory = model<ISubSubCategory>('SubSubCategory', SubSubCategorySchema);
