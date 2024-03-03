import { Router } from "express";
//import { validate } from "../middlewares/validation.middleware";
import { protectedMiddleware } from "../middlewares/protected.middleware";

// import {

// } from "../validations/changeCurrency.validator";
import {
ExchangeRate,
getExchangeRate,
} from "../controllers/changeCurrency.controller";

const changeCurrencyRoute = Router();

changeCurrencyRoute
  .route("/")
  .post(protectedMiddleware,/*validate(userRegisterValidation),*/ ExchangeRate)
  .get(/*validate(userRegisterValidation),*/ getExchangeRate)
  
 
export default changeCurrencyRoute;
