import Joi from "joi";

const subCategoryValidator = Joi.object({
    name_en: Joi.string().alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
    name_ar: Joi.string().alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
    image: Joi.string().allow("").optional(),
    category: Joi.string().alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
    title_meta: Joi.string().alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
    desc_meta: Joi.string().alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
});

export const postSubCategoryValidation = subCategoryValidator.tailor("post");

export const putSubCategoryValidation = subCategoryValidator.tailor("put");
