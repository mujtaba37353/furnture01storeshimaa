import Joi from "joi";

const brandValidator = Joi.object({
    name_en: Joi.string().alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
    name_ar: Joi.string().alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
    image: Joi.string().allow("").optional(),
    title_meta: Joi.string().alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
    desc_meta: Joi.string().alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
});

export const postBrandValidation = brandValidator.tailor("post");

export const putBrandValidation = brandValidator.tailor("put");
