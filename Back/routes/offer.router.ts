import { Router } from "express";
import { getAllOffers, getOneOfferById, createOffer, updateOffer, deleteOffer } from "../controllers/offer.controller";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";
import { OfferCreateValidator, OfferUpdateValidator } from "../validations/offer.validator";
import { validate } from "../middlewares/validation.middleware";


const offerRouter = Router();

offerRouter.route("/").get(getAllOffers);

offerRouter.route("/:id").get(getOneOfferById);

offerRouter.route("/").post(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), validate(OfferCreateValidator), createOffer);

offerRouter.route("/:id").put(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), validate(OfferUpdateValidator), updateOffer);

offerRouter.route("/:id").delete(protectedMiddleware, allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB), deleteOffer);

export default offerRouter;
