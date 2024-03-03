import Joi from "joi";

const reviewSchemaValidator = Joi.object({
  comment: Joi.string().optional(),
  rating: Joi.number()
    .min(1)
    .max(5)
    .alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
});

export const addReviewToProductValidator = reviewSchemaValidator.tailor("post");
export const updateReviewToProductValidator = reviewSchemaValidator.tailor("put");
