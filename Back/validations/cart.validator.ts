import Joi from "joi";

interface AddToCartValidation {
  quantity: number;
  paymentType: "online" | "cash";
  properties?: [
    {
      key_en: string;
      key_ar: string;
      value_en: string;
      value_ar: string;
    }
  ];
  ids:string[]
}

export const addToCartValidation = Joi.object<AddToCartValidation>({
  quantity: Joi.number().min(1).required(),
  paymentType: Joi.string().required().valid("online", "cash"),
  properties: Joi.array()
    .min(1)
    .items(
      Joi.object({
        key_en: Joi.string().required(),
        key_ar: Joi.string().required(),
        value_en: Joi.string().required(),
        value_ar: Joi.string().required(),
      })
    )
    .optional(),
});

export const DeleteGroupeOfCartsValidation = Joi.object<AddToCartValidation>({
  ids: Joi.array().items(Joi.string().hex().required()).required(),
});