import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import {
  getAllAnalyticsMeta,
  getAnalyticsMeta,
  deleteAnalyticsMeta,
  createAnalyticsMeta,
} from "../controllers/analyticsMeta.controller";
import { postAnalyticsMetaValidator } from "../models/analyticsMeta.model";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
const AnalyticsMetaRouter = Router();

AnalyticsMetaRouter.route("/")
  .get(getAllAnalyticsMeta)
  .post(
    protectedMiddleware,
    allowedTo(
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.RootAdmin,
      Role.SubAdmin
    ),
    validate(postAnalyticsMetaValidator),
    createAnalyticsMeta
  );

AnalyticsMetaRouter.route("/:id")
  .get(getAnalyticsMeta)
  .delete(
    protectedMiddleware,
    allowedTo(
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.RootAdmin,
      Role.SubAdmin
    ),
    deleteAnalyticsMeta
  ); //admin root admina adminb adminc subadmin

export default AnalyticsMetaRouter;
