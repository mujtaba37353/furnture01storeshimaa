import { Schema, Types, model } from "mongoose";
import { IProduct } from "../interfaces/product/product.interface";
import { QualitySchema } from "./quality.model";

const productSchema = new Schema<IProduct>(
  {
    title_en: {
      type: String,
      required: true,
    },
    title_ar: {
      type: String,
      required: true,
    },
    description_en: {
      type: String,
      required: true,
    },
    description_ar: {
      type: String,
      required: true,
    },
    slug_en: {
      type: String,
    },
    slug_ar: {
      type: String,
    },
    priceBeforeDiscount: {
      type: Number,
      required: true,
    },
    priceAfterDiscount: {
      type: Number,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 100_000_000,
    },
    images: [
      {
        type: String,
        default: "",
      },
    ],
    sales: {
      type: Number,
      default: 0,
    },
    paymentType: {
      type: String,
      enum: ["online", "cash", "both"],
      required: true,
    },
    keywords: [
      {
        type: String,
      },
    ],
    attributes: {
      type: [
        {
          key_ar: { type: String, required: true },
          key_en: { type: String, required: true },
          values: {
            type: [
              {
                value_ar: { type: String, required: true },
                value_en: { type: String, required: true },
              },
            ],
            required: true,
            validate: {
              validator: (v: any) => Array.isArray(v) && v.length > 0,
            },
          },
        },
      ],
      default: [],
      required: false,
    },
    qualities: [QualitySchema],
    category: {
      type: Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: Types.ObjectId,
      ref: "SubCategory",
    },
    subSubCategory: {
      type: Types.ObjectId,
      ref: "SubSubCategory",
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
    },
    generalQualities: [
      {
        type: Types.ObjectId,
        ref: "GeneralQuality",
      },
    ],
    likes: {
      type: [{ user: { type: Types.ObjectId, ref: "User" } }],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      required: true,
    },
    title_meta: {
      type: String,
    },
    desc_meta: {
      type: String,
    },
    metaDataId: {
      type: Types.ObjectId,
      ref: "Meta",
    },
    offer: {
      type: Types.ObjectId,
      ref: "Offer",
    },
    link: {
      type: String,
    },
    extention: {
      type: String,
    },
    directDownloadLink: {
      type: String,
    },

    repositoryId: {
      type: Types.ObjectId,
      ref: "Repository"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("imagesUrl").get(function (this: IProduct) {
  return this.images.map((image) => `${process.env.APP_URL}/uploads/${image}`);
});

productSchema.pre("save", function (next) {
  if (this.link && this.isModified("link")) {
    const shareableLink = this.link || "";
    const fileIdMatch = shareableLink.match(/\/d\/(.+?)\//);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      this.directDownloadLink = `https://drive.google.com/uc?id=${fileId}&export=download`;
    } else {
      this.directDownloadLink = ""; // Handle if pattern is not matched
      // return next(new ApiError(
      //   {
      //     en: "Link not valid",
      //     ar: "الرابط غير صالح",
      //   },
      //   StatusCodes.EXPECTATION_FAILED
      // ));
    }
  }
  next();
});


productSchema.virtual("finalPrice").get(function (this: IProduct) {
  return this.priceAfterDiscount || this.priceBeforeDiscount;
});

export const Product = model<IProduct>("Product", productSchema);
