import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
// import { validate } from "../middlewares/validation.middleware";
// import {
//   putCategoryValidation,
//   postCategoryValidation,
// } from "../validations/category.validator";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  getAllCategoriesWithProducts,
  getAllCategoriesWithSubCategories,
  updateCategory,
  getAllCategoriesWithSubCategoriesWithSubSubCategories,
} from "../controllers/category.controller";
import { limitsMiddleware } from "../middlewares/limits.middleware";
import {
  createCategoryValidator,
  getCategoryByIdValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../validations/validations/category.validator";
const categoryRouter = Router();

categoryRouter
  .route("/getAllCategoriesWithProducts")
  .get(getAllCategoriesWithProducts); //all

categoryRouter
  .route("/getAllCategoriesWithSubCategories")
  .get(getAllCategoriesWithSubCategories); //all

categoryRouter
  .route("/getAllCategoriesWithSubCategoriesWithSubSubCategories")
  .get(getAllCategoriesWithSubCategoriesWithSubSubCategories); //all

categoryRouter.route("/Slug").get(getCategoryBySlug); //all

categoryRouter
  .route("/")
  .get(getAllCategories) //all
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    limitsMiddleware("Category"),
    // validate(postCategoryValidation),
    createCategoryValidator,
    createCategory
  ); //admin root admina adminb

categoryRouter
  .route("/:id")
  .get(getCategoryByIdValidator,getCategoryById) //all
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    updateCategoryValidator,
    updateCategory
  ) //admin root admina adminb
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteCategoryValidator,
    deleteCategory
  ); //admin root admina adminb

export default categoryRouter;

// done
