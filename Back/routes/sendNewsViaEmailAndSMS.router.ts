import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
    sendNewsViaEmail,
    sendNewsViaSMS,
} from "../controllers/sendNewsViaEmailAndSMS.controller";
import {
  sendNewsViaEmailValidator,
  sendNewsViaSMSValidator,
} from "../validations/sendNewsViaEmailAndSMS.validator";

const sendNewsViaEmailAndSMSRouter = Router();

sendNewsViaEmailAndSMSRouter
    .route("/viaEmail")
    .post(
        protectedMiddleware,
        validate(sendNewsViaEmailValidator),
        allowedTo(
            Role.RootAdmin,
            Role.AdminA,
            Role.AdminB,
            Role.AdminC,
            Role.SubAdmin
            ),
        sendNewsViaEmail
    );

sendNewsViaEmailAndSMSRouter
    .route("/viaSMS")
    .post(
        protectedMiddleware,
        validate(sendNewsViaSMSValidator),
        allowedTo(
            Role.RootAdmin,
            Role.AdminA,
            Role.AdminB,
            Role.AdminC,
            Role.SubAdmin
            ),
        sendNewsViaSMS
    );



export default sendNewsViaEmailAndSMSRouter;