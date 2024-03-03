import Joi from "joi";

const contactValidator = Joi.object({
    name: Joi.string().alter({
      post: (schema: any) => schema.required(),
      put: (schema: any) => schema.optional(),
    }),
    message: Joi.string().alter({
      post: (schema: any) => schema.required(),
      put: (schema: any) => schema.optional(),
    }),
    email: Joi.string().alter({
      post: (schema: any) => schema.required(),
      put: (schema: any) => schema.optional(),
    }),
    phone: Joi.string().alter({
      post: (schema: any) => schema.required(),
      put: (schema: any) => schema.optional(),
    }),
    isOpened: Joi.boolean().optional(),
    contactType: Joi.string()
      .valid("complaints", "suggestions", "customerService")
      .alter({
        post: (schema: any) => schema.required(),
        put: (schema: any) => schema.optional(),
      }),
  });
  

export const postContactValidation = contactValidator.tailor("post");
