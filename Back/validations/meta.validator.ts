import Joi from "joi";
import { IMeta } from "../interfaces/meta/meta.interface";

const MetaValidator = Joi.object<IMeta>({
  title_meta: Joi.string().optional(),
  desc_meta: Joi.string().optional(),
});

export const MetaValidation = MetaValidator;

