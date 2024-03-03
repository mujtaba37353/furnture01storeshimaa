import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  getAllMetas,
  getMetaById,
  getMetaByReference,
  updateMeta,
} from "../controllers/meta.controller";
import { MetaValidation } from "../validations/meta.validator";

const metaRouter = Router();

metaRouter
  .route("/")
  .get(
    getAllMetas
  );

metaRouter
  .route("/:id")
  .get(    
    validate(MetaValidation),
    getMetaById
  ) //admin root admina adminb adminc subadmin
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(MetaValidation),
    updateMeta
  ); //admin root admina adminb

metaRouter.route('/getByReference/:id').get(getMetaByReference)
export default metaRouter;
