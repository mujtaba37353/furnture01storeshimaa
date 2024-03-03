import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  addToCart,
  deleteCart,
  deleteCartItem,
  getAllCarts,
  getCart,
  deleteGroupOfCartsById,
} from "../controllers/cart.controller";
import { addToCartValidation,DeleteGroupeOfCartsValidation } from "../validations/cart.validator";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import { verifyCoupon } from "../controllers/cart.controller";

const cartRouter = Router();

cartRouter
  .route("/")
  .get(protectedMiddleware, allowedTo(Role.USER, Role.Guest), getCart); // user

cartRouter
  .route("/deleteByAdmin/:id")
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteCart
  ); // Admin

cartRouter
  .route("/deleteMany")
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(DeleteGroupeOfCartsValidation),
    deleteGroupOfCartsById
  );

cartRouter.route("/getAllCarts").get(
  protectedMiddleware,
  // allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB, Role.AdminC, Role.SubAdmin),
  getAllCarts
); // user

cartRouter
  .route("/verify")
  .post(protectedMiddleware, allowedTo(Role.USER), verifyCoupon);

cartRouter
  .route("/:productId")
  .post(
    protectedMiddleware,
    allowedTo(Role.USER, Role.Guest),
    // validate(addToCartValidation),
    addToCart
  ) // user
  .delete(
    protectedMiddleware,
    allowedTo(Role.USER, Role.Guest),
    deleteCartItem
  ); //user

export default cartRouter;
