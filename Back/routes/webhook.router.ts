import { Router } from "express";

import { protectedMiddleware } from "../middlewares/protected.middleware";

import { moyasarWebhook, tabbyWebhook } from "../controllers/webhook.controller";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";

const webhookRouter = Router();

webhookRouter.route("/moyasar").post(protectedMiddleware, allowedTo(Role.USER), moyasarWebhook);
webhookRouter.route("/tabby").post(protectedMiddleware, allowedTo(Role.USER),  tabbyWebhook);

export default webhookRouter;