import Joi from "joi";

export const subscriberValidator = Joi.object({
  email: Joi.string().email().required(),
});


