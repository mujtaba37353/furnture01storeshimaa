import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import { limitsMiddleware } from "../middlewares/limits.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import {
  postBrandValidation,
  putBrandValidation,
} from "../validations/brand.validator";
import { Role } from "../interfaces/user/user.interface";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  getAllBrandsWithProducts,
} from "../controllers/brand.controller";

const brandsRouter = Router();

brandsRouter
  .route("/")
  .get(getAllBrands) //all
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    limitsMiddleware('Brand'),
    validate(postBrandValidation),
    createBrand
  ); //admin root admina adminb

brandsRouter
  .route("/getAllBrandsWithProducts")
  .get(getAllBrandsWithProducts); //all

brandsRouter
  .route("/:id")
  .get(getBrandById) //all
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(putBrandValidation),
    updateBrand
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteBrand
  ); //admin root admina adminb

export default brandsRouter;
