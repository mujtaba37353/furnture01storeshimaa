import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  createVisitorHistory,
  deleteVisitorHistory,
  getAllVisitorsHistory,
  getVisitorHistoryById,
  updateVisitorHistory,
} from "../controllers/visitorHistory.controller";
import {
  postVisitorHistoryValidation,
  putVisitorHistoryValidation,
} from "../validations/visitorHistory.validator";

const visitorHistoryRouter = Router();

visitorHistoryRouter
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
    getAllVisitorsHistory
  )
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(postVisitorHistoryValidation),
    createVisitorHistory
  ); //admin root admina adminb

visitorHistoryRouter
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
    validate(putVisitorHistoryValidation),
    getVisitorHistoryById
  ) //admin root admina adminb adminc subadmin
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(putVisitorHistoryValidation),
    updateVisitorHistory
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteVisitorHistory
  ); //admin root admina adminb

export default visitorHistoryRouter;
