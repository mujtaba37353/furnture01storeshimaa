import Joi from "joi";

const commentSchemaValidator = Joi.object({
  comment: Joi.string().required(),
});

export const addCommentToProductValidator = commentSchemaValidator;
export const updateCommentToProductValidator = commentSchemaValidator;
