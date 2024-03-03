import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  createAttribute,
  deleteAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
} from "../controllers/attribute.controller";
import {
  postAttributeValidation,
  putAttributeValidation,
} from "../validations/attribute.validator";

const attributeRouter = Router();

attributeRouter
  .route("/")
  .get(getAllAttributes)
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(postAttributeValidation),
    createAttribute
  ); //admin root admina adminb

  attributeRouter
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
    validate(putAttributeValidation),
    getAttributeById
  ) //admin root admina adminb adminc subadmin
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(putAttributeValidation),
    updateAttribute
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteAttribute
  ); //admin root admina adminb

export default attributeRouter;
