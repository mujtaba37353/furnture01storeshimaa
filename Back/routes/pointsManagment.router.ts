import { Router } from "express";

import {
  createPointsManagement,
  getAllPointsManagements,
  grantUserPointsBasedOnByAdminPermissionOrDynamic,
} from "../controllers/pointsManagement.controller";
import { validate } from "../middlewares/validation.middleware";
import { postPointsManagementValidation } from "../validations/PointsMangement.validator";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";

const PointsManagementsRouter = Router();

PointsManagementsRouter
  .route("/grantPoints")
  .post(
    protectedMiddleware,
    allowedTo(Role.USER),
    grantUserPointsBasedOnByAdminPermissionOrDynamic
  );

PointsManagementsRouter
  .route("/")
  .get(
    protectedMiddleware,
    getAllPointsManagements
  )
  .post(
    validate(postPointsManagementValidation), 
    createPointsManagement
  );

export default PointsManagementsRouter;
