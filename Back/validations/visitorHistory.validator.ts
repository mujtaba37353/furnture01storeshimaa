import Joi from "joi";
import { IVisitorHistory } from "../interfaces/visitorHistory/visitorHistory.interface";

const visitorHistoryValidator = Joi.object<IVisitorHistory>({
  count: Joi.string().optional(),
  country: Joi.string().alter({
    post: (schema) => schema.required(),
    put: (schema) => schema.optional(),
    }),
  ip: Joi.array()
    .min(1)
    .items(
      Joi.object({
        ip: Joi.string().required(),
      })
    )
    .required(),
});

export const postVisitorHistoryValidation = visitorHistoryValidator;
export const putVisitorHistoryValidation = visitorHistoryValidator;
