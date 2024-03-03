import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  getMessageById,
  toggleMessage,
} from "../controllers/contact.controller";
import { Role } from "../interfaces/user/user.interface";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import { postContactValidation } from "../validations/contact.validator";
const contactRouter = Router();

contactRouter
  .route("/")
  .get(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin
    ),
    getAllMessages
  ) //admin root admina adminb adminc subadmin
  .post(
    protectedMiddleware,
    allowedTo(Role.USER),
    validate(postContactValidation),
    createMessage
  ); //user

contactRouter
  .route("/:id")
  .get(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin
    ),
    getMessageById
  ) //admin root admina adminb adminc subadmin
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteMessage
  ); //admin root admina adminb subadmin

contactRouter
  .route("/OpendMessage/:id")
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA,Role.AdminB, Role.SubAdmin),
    toggleMessage
  ); // subadmin
export default contactRouter;
