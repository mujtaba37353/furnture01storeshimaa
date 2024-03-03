import Joi from "joi";
import { IGeneralQuality } from "../interfaces/generalQuality/generalQuality.interface";

const generalQualityValidator = Joi.object<IGeneralQuality>({
    key_ar: Joi.string().required(),
    key_en: Joi.string().required(),
    values: Joi.array()
        .min(1)
        .items(
        Joi.object({
            value_ar: Joi.string().required(),
            value_en: Joi.string().required(),
            color: Joi.string().optional(),  
        })
        )
        .required(),
});

export const postGeneralQualityValidation = generalQualityValidator;
export const putGeneralQualityValidation = generalQualityValidator;