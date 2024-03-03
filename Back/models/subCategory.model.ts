import { Schema, Types, model } from "mongoose";
import { ISubCategory } from '../interfaces/subcategory/subcategory.interface'

const subCategorySchema = new Schema(
  {
    name_en: { type: String, required: true },
    name_ar: { type: String, required: true },
    slug_en: { type: String },
    slug_ar: { type: String },
    image: { type: String, default: "" },
    productsCount: { type: Number, default: 0 },
    subSubCategoriesCount: { type: Number, default: 0 },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory Must Be Belong To Parent Category"],
    },
    title_meta: { type: String, default: "" },
    desc_meta: { type: String, default: "" },
    metaDataId: { type: Types.ObjectId, ref: "Meta" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

subCategorySchema.virtual("imageUrl").get(function (this: ISubCategory) {
  if(this.image){
    return `${process.env.APP_URL}/uploads/${this.image}`;
  }
  return ``;
});

export const SubCategory = model<ISubCategory>("SubCategory", subCategorySchema);

