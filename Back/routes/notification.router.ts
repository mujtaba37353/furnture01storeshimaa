import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import {
postNotificationValidation,
putNotificationValidation
} from "../validations/notification.validator";
import {
getAllNotifications,
createNotification,
deleteNotification,
markNotificationAsRead,
createNotificationAll,
getUnreadNotificationsByUser,
getAllNotificationsByUser,
updateNotification

} from "../controllers/notification.controller";

const notificationRoute = Router();

notificationRoute
  .route("/")
  .get(protectedMiddleware, getAllNotifications)
  .post(protectedMiddleware,validate(postNotificationValidation), createNotification);

notificationRoute
.route("/:id")
.put(protectedMiddleware,validate(putNotificationValidation), updateNotification)
.delete(protectedMiddleware, deleteNotification);

notificationRoute
.route("/read/:id")
.put(protectedMiddleware,validate(putNotificationValidation), markNotificationAsRead)

notificationRoute
.route("/all")
.post(protectedMiddleware, createNotificationAll)
.get(protectedMiddleware, getAllNotificationsByUser);


notificationRoute
.route("/unread")
.get(protectedMiddleware, getUnreadNotificationsByUser);






export default notificationRoute;
