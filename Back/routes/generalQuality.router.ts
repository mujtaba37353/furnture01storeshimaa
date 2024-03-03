import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
getAllGeneralQualities,
getGeneralQualityById,
createGeneralQuality,
updateGeneralQuality,
deleteGeneralQuality,
} from "../controllers/generalQuality.controllers";
import {
  postGeneralQualityValidation,
  putGeneralQualityValidation,
} from "../validations/generalQuality.validator";

const generalQualityRouter = Router();

generalQualityRouter
  .route("/")
  .get(getAllGeneralQualities)
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(postGeneralQualityValidation),
    createGeneralQuality
  ); //admin root admina adminb

  generalQualityRouter
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
    getGeneralQualityById
  ) //admin root admina adminb adminc subadmin
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(putGeneralQualityValidation),
    updateGeneralQuality
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteGeneralQuality
  ); //admin root admina adminb

export default generalQualityRouter;
