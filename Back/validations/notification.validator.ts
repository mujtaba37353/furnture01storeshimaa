import Joi from "joi";
import INotification from "../interfaces/notification/notification.interface";

const notificationValidator = Joi.object<INotification>({
    title: Joi.string()
    .alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
    message: Joi.string()
    .alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
    read: Joi.boolean()
    .alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
    sender: Joi.string()
    .hex()
    .length(24)
    .alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
    receiver: Joi.string()
    .min(3)
    .alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
    link: Joi.string()
    .alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
});

export const postNotificationValidation = notificationValidator.tailor("post");
export const putNotificationValidation = notificationValidator.tailor("put");