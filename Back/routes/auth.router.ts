import { Request, Response, Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { protectedMiddleware } from "../middlewares/protected.middleware";

import {
  userRegisterValidation,
  userLoginValidation,
  changedPasswordValidation,
  verifyCodeValidation,
  forgetPasswordValidation,
  verifyPasswordResetCodeValidation,
  resetPasswordValidation,
} from "../validations/auth.validator";
import {
  login,
  register,
  verifyCode,
  changePassword,
  createGuestUser,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} from "../controllers/auth.controller";
import { authenticateWithGoogle } from "../middlewares/passportAuth.middleware";
import { googlePassport } from "../utils/googleAuth";
import expressAsyncHandler from "express-async-handler";
import { ipAddressMiddleware } from "../middlewares/ipAddress.middleware";

const authRoute = Router();

authRoute.route("/register").post(validate(userRegisterValidation), register);

authRoute.route("/login").post(validate(userLoginValidation), login);

authRoute.route("/verifyCode").post(validate(verifyCodeValidation), verifyCode);

authRoute.route("/createGuestUser").post(createGuestUser);

authRoute
  .route("/changePassword")
  .put(
    protectedMiddleware,
    validate(changedPasswordValidation),
    changePassword
  );

authRoute
  .route("/forgetPassword")
  .post(validate(forgetPasswordValidation), forgetPassword);

authRoute
  .route("/verifyPasswordResetCode")
  .post(validate(verifyPasswordResetCodeValidation), verifyPasswordResetCode);

authRoute
  .route("/resetPassword")
  .put(validate(resetPasswordValidation), resetPassword);

authRoute.get('/google', authenticateWithGoogle);

authRoute.get(
  '/google/callback',
  googlePassport.authenticate('google',
    {
      session: false,

    }),
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.json({ data: req.user });
  })
);

export default authRoute;
