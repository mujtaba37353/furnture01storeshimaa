import { Model, Schema, model } from "mongoose";
import { IRepository } from "../interfaces/repository/repository.interface";

const repositorySchema = new Schema<IRepository>(
  {
    type: {
      type: String,
      enum: ["warehouse", "branch"],
      default: "branch",
    },
    repoId: {
      type: String,
      default: "",
    },
    name_en: {
      type: String,
      required: true,
    },
    name_ar: {
      type: String,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    address: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Repository: Model<IRepository> = model<IRepository>(
  "Repository",
  repositorySchema
);
