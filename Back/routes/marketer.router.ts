import { Router } from "express";
import { createMarketer, deleteMarketer, getAllMarketers, getOneMarketer, updateMarketer } from "../controllers/marketer.controller";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import { validate } from "../middlewares/validation.middleware";
import { MarketerCreateValidator } from "../validations/marketer.validator";


const marketerRouter = Router();

marketerRouter.route("/").get(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), getAllMarketers);

marketerRouter.route("/:id").get(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), getOneMarketer);

marketerRouter.route("/").post(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), validate(MarketerCreateValidator), createMarketer);

marketerRouter.route("/:id").put(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), updateMarketer);

marketerRouter.route("/:id").delete(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), deleteMarketer);
export default marketerRouter;
