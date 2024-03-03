import Joi from "joi";
import { IMarketer } from "../interfaces/marketer/marketer.interface";

export const MarketerCreateValidator = Joi.object<IMarketer>({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  code: Joi.string().required(),
  discount: Joi.number().required(),
  commissionMarketer: Joi.number().required(),
  discountDepartment: Joi.object({
    key: Joi.string()
      .valid("allProducts", "products", "categories", "subcategories")
      .required(),
    value: Joi.when('key', {
      is: Joi.string().valid("products", "categories", "subcategories"),
      then: Joi.array().items(Joi.string().required().min(1)),
      otherwise: Joi.array().items(Joi.string())
    }).required()
  }).required(),
  url: Joi.string().required(),
});
