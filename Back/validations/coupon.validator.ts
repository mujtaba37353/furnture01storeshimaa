import Joi from "joi";
import { ICoupon } from "../interfaces/coupon/coupon.interface";

export const CouponCreateValidator = Joi.object<ICoupon>({
  title: Joi.string().required(),
  code: Joi.string().required(),
  limit: Joi.number().required(),
  discount: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref('startDate', {"adjust": startDate =>  startDate + 1})),
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
});

export const CouponUpdateValidator = Joi.object<ICoupon>({
  title: Joi.string().optional(),
  code: Joi.string().optional(),
  limit: Joi.number().optional(),
  discount: Joi.number().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().required().greater(Joi.ref('startDate', {"adjust": startDate =>  startDate + 1})),
  discountDepartment: Joi.object({
    key: Joi.string()
      .valid("allProducts", "products", "categories", "subcategories")
      .optional(),
    value: Joi.array().items(Joi.string()),
  }).optional(),
});

