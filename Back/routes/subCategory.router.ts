import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
// import { validate } from "../middlewares/validation.middleware";
// import {
//   postSubCategoryValidation,
//   putSubCategoryValidation,
// } from "../validations/subCategory.validator";
import {
  getSubCategoryByIdValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  getAllSubCategoriesByCategoryIdValidator,
} from "../validations/validations/subCategory.validator";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  getAllSubCategories,
  getAllSubCategoriesByCategoryId,
  getSubCategoryById,
  getSubCategoryBySlug,
  createSubCategory,
  updateSubCategoryById,
  deleteSubCategoryById,
} from "../controllers/subCategory.controller";
import { limitsMiddleware } from "../middlewares/limits.middleware";
// import {
//   getSubCategoryByIdValidator,
//   createSubCategoryValidator,
//   updateSubCategoryValidator
// } from "../validations/validations/subCategory.validator";

const subCategoriesRouter = Router();

subCategoriesRouter
  .route("/Slug")
  .get(getSubCategoryBySlug) //all



subCategoriesRouter
  .route("/")
  .get(getAllSubCategories) //all
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    limitsMiddleware("SubCategory"),
    createSubCategoryValidator,
    createSubCategory
  ); //admin root admina adminb

subCategoriesRouter
  .route("/:id")
  .get(getSubCategoryByIdValidator,getSubCategoryById) //all
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    updateSubCategoryValidator,
    updateSubCategoryById
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteSubCategoryValidator,
    deleteSubCategoryById
  ); //admin root admina adminb

subCategoriesRouter
  .route("/forSpecificCategory/:categoryId")
  .get(getAllSubCategoriesByCategoryIdValidator,getAllSubCategoriesByCategoryId); //all

export default subCategoriesRouter;
