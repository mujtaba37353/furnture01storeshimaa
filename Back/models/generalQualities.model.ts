import { Schema,model } from "mongoose";
import { IGeneralQuality } from "../interfaces/generalQuality/generalQuality.interface";

const GeneralQualitySchema = new Schema<IGeneralQuality>({
  key_en: { type: String, required: true },
  key_ar: { type: String, required: true },
  values: [
    {
      value_en: { type: String, required: true },
      value_ar: { type: String, required: true },
      color: { type: String},
    },
  ],
  productsCount: { type: Number, default: 0 },
});

export const GeneralQuality = model<IGeneralQuality>("GeneralQuality", GeneralQualitySchema);
