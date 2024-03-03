import Joi from "joi";
import { IOffer } from "../interfaces/offer/offer.interface";

export const OfferCreateValidator = Joi.object<IOffer>({
  title: Joi.string().required(),
  percentage: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date()
    .required()
    .greater(Joi.ref("startDate", { adjust: (startDate) => startDate + 1 })),
  typeOfBanner: Joi.string().valid("vertical", "horizontal").required(),
  imageOfBanner: Joi.string().required(),
  discountDepartment: Joi.object({
    key: Joi.string()
      .valid("allProducts", "products", "categories", "subcategories")
      .required(),
    value: Joi.when("key", {
      is: Joi.string().valid("products", "categories", "subcategories"),
      then: Joi.array().items(Joi.string().required().min(1)),
      otherwise: Joi.array().items(Joi.string()),
    }).required(),
  }).required(),
});

export const OfferUpdateValidator = Joi.object<IOffer>({
  title: Joi.string().optional(),
  percentage: Joi.number().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  typeOfBanner: Joi.string().valid("vertical", "horizontal").optional(),
  imageOfBanner: Joi.string().optional(),
  discountDepartment: Joi.object({
    key: Joi.string()
      .valid("allProducts", "products", "categories", "subcategories")
      .optional(),
    value: Joi.array().items(Joi.string()),
  }).optional(),
});
