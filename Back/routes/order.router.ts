
import { Router } from "express";
import { protectedMiddleware } from "../middlewares/protected.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { validate } from "../middlewares/validation.middleware";
import { Role } from "../interfaces/user/user.interface";
import {
  createOrder,
  createShippingOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  trackOrder,
  verifyOrder,
  createItemRepository,
  deleteGroupOfOrders,
  createShippingOrderStatus,
  cancelShippingOrder,
  checkoutTabby,
  retrievePaymentTabby
} from "../controllers/order.controller";
import {
  createOrderValidation,
  verifyOrderValidation,
  deleteGroupOfOrdersValidation
} from "../validations/order.validator";

const orderRouter = Router();

orderRouter
  .route("/checkoutTabby")
  .get(
    protectedMiddleware,
    checkoutTabby
  );

orderRouter
  .route("/retrievePaymentTabby/:id")
  .get(
    retrievePaymentTabby
  );
orderRouter
  .route("/createItemRepository")
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    createItemRepository
  );
  
orderRouter
  .route("/")
  .post(
    protectedMiddleware,
    allowedTo(Role.USER),
    validate(createOrderValidation),
    createOrder
  )
  .get(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin
    ),
    getAllOrders
  );
orderRouter
  .route("/trackOrder/:id")
  .post(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin,
      Role.USER
    ),
    trackOrder
  );

orderRouter
  .route("/verifyOrder")
  .post(
    protectedMiddleware,
    allowedTo(Role.USER),
    validate(verifyOrderValidation),
    verifyOrder
  );
orderRouter
  .route("/shipping/:id")
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    createShippingOrder
  );

orderRouter
    .route("/createShippingOrderStatus/:id")
    .post(
        protectedMiddleware,
        allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
        createShippingOrderStatus
    );

orderRouter
  .route("/cancelShippingOrder/:id")
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    cancelShippingOrder
  );

orderRouter
  .route("/myOrders")
  .get(protectedMiddleware, allowedTo(Role.USER), getMyOrders);

  orderRouter
  .route("/deleteMany")
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    validate(deleteGroupOfOrdersValidation),
    deleteGroupOfOrders
  );

orderRouter
  .route("/:id")
  .get(
    protectedMiddleware,
    allowedTo(
      Role.USER,
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin
    ),
    getOrderById
  )
  // .put(
  //   protectedMiddleware,
  //   validate(changeOrderStatusValidation),
  //   allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
  //   updateOrderStatus
  // )
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA, Role.AdminB),
    deleteOrder
  );

export default orderRouter;
