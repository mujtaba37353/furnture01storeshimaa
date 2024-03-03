import { Schema } from "mongoose";
import { Quality } from "../interfaces/quality/quality.interface";

const QualitySchema = new Schema<Quality>({
  values: [
    {
      key_en: { type: String, required: true },
      key_ar: { type: String, required: true },
      value_en: { type: String, required: true },
      value_ar: { type: String, required: true },
      color: { type: String },
      _id : false
    },
  ],
  quantity: { type: Number, required: true },
  price: { type: Number ,default:0},
  image: [{ type: String }],
}, {_id : false });

export { QualitySchema };
