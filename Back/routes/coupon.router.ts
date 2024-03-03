import { Router } from "express";
import { getAllCoupons, getOneCouponById, createCoupon, updateCoupon, deleteCoupon, getCouponByNameAndProducts } from "../controllers/coupon.controller";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import { CouponCreateValidator, CouponUpdateValidator } from "../validations/coupon.validator"
import { validate } from "../middlewares/validation.middleware";

const couponRouter = Router();
couponRouter.route("/getCouponByNameAndProducts").post(protectedMiddleware, getCouponByNameAndProducts);

couponRouter.route("/").get(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB, Role.AdminC, Role.SubAdmin), getAllCoupons);

couponRouter.route("/:id").get(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB, Role.AdminC, Role.SubAdmin), getOneCouponById);

couponRouter.route("/").post(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), validate(CouponCreateValidator), createCoupon);

couponRouter.route("/:id").put(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), validate(CouponUpdateValidator), updateCoupon);

couponRouter.route("/:id").delete(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), deleteCoupon);

export default couponRouter;
