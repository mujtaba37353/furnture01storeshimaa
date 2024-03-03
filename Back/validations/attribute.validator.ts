import Joi from "joi";
import { IAttribute } from "../interfaces/attribute/attribute.interface";

const attributeValidator = Joi.object<IAttribute>({
  key_ar: Joi.string().required(),
  key_en: Joi.string().required(),
  values: Joi.array()
    .min(1)
    .items(
      Joi.object({
        value_ar: Joi.string().required(),
        value_en: Joi.string().required(),
      })
    )
    .required(),
});

export const postAttributeValidation = attributeValidator;
export const putAttributeValidation = attributeValidator;
