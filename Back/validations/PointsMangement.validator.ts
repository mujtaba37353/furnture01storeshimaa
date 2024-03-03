import Joi from "joi";

 const PointsManagementValidation=Joi.object({
  noOfPointsInOneUnit:Joi.number().alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.required(),
      }),
      totalPointConversionForOneUnit:Joi.number().alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.required(),
      }),
    min:Joi.number().alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.required(),
      }),
    max:Joi.number().alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.required(),
      }),
      status:Joi.string().valid('static','dynamic'),
})
export const postPointsManagementValidation=PointsManagementValidation.tailor('post')
