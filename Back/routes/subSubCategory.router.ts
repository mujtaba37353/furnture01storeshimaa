import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { 
  postSubSubCategoryValidation ,
  putSubSubCategoryValidation
 } from "../validations/subSubCategory.validator";
// Middleware Import
import { validate } from "../middlewares/validation.middleware";
// import {
//   getSubSubCategoryByIdValidator,
//   createSubSubCategoryValidator,
//   updateSubSubCategoryValidator,
//   deleteSubSubCategoryValidator,
// } from "../validations/validations/subSubCategory.validator";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  createSubSubCategory,
  deleteSubSubCategory,
  getAllSubSubCategories,
  getSubSubCategoryById,
  getSubSubCategoryBySlug,
  updateSubSubCategory,
  getAllSubSubCategoriesWithProducts,
} from "../controllers/subSubCategory.controller";
import { limitsMiddleware } from "../middlewares/limits.middleware";

const subSubCategoryRouter = Router();


subSubCategoryRouter
  .route("/")
  .get(getAllSubSubCategories) //all
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    limitsMiddleware("SubSubCategory"),
    //createSubSubCategoryValidator,
    validate(postSubSubCategoryValidation),
    createSubSubCategory
  ); //admin root admina adminb

  subSubCategoryRouter
  .route("/Slug/:slug")
  .get(getSubSubCategoryBySlug); //all

subSubCategoryRouter
  .route("/getAllSubSubCategoriesWithProducts")
  .get(getAllSubSubCategoriesWithProducts); //all

subSubCategoryRouter
  .route("/:id")
  .get(
    //getSubSubCategoryByIdValidator,
    getSubSubCategoryById
    ) //all
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    //updateSubSubCategoryValidator,
    validate(putSubSubCategoryValidation),
    updateSubSubCategory
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    //deleteSubSubCategoryValidator,
    deleteSubSubCategory
  ); //admin root admina adminb

export default subSubCategoryRouter;
