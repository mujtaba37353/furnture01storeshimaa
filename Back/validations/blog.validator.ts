import Joi from "joi";
import { IBlog } from "../interfaces/blog/blog.interface";

export const BlogCreateValidator = Joi.object<IBlog>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
});


export const BlogUpdateValidator = Joi.object<IBlog>({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
});