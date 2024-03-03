import Joi from "joi";

const subSubCategoryValidator = Joi.object({
    name_en: Joi.string().alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
    name_ar: Joi.string().alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
    image: Joi.string().allow("").optional(),
    subCategory: Joi.string().alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
    desc_en: Joi.string().alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
    desc_ar: Joi.string().alter({
      post: (schema) => schema.optional(),
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

export const postSubSubCategoryValidation = subSubCategoryValidator.tailor("post");

export const putSubSubCategoryValidation = subSubCategoryValidator.tailor("put");
