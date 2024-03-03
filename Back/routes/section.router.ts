import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { validate } from "../middlewares/validation.middleware";
import {sectionValidator} from "../validations/section.validator";
import {
  //getSectionByIdValidator,
  //createSectionValidator,
 // updateSectionValidator,
 //deleteSectionValidator
} from "../validations/validations/section.validator";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  createSection,
  deleteSection,
  getAllSections,
  getSectionById,
  getSectionByName,
  updateSection,
} from "./../controllers/section.controller";

const sectionRouter = Router();

sectionRouter
  .route("/")
  .get(getAllSections)  
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    //createSectionValidator,
    validate(sectionValidator),
    createSection
  );  
sectionRouter.route('/sectionName/:sectionName').get(getSectionByName)
sectionRouter
  .route("/:id")
  .get(
    //getSectionByIdValidator,
    getSectionById)  
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    //updateSectionValidator,
    validate(sectionValidator),
    updateSection
  )  
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    //deleteSectionValidator,
    deleteSection
  );  

export default sectionRouter;
