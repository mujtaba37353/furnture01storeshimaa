import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { ICart } from "../interfaces/cart/cart.interface";
import { IQuery } from "../interfaces/factory/factory.interface";
import {
  IOrderStatus,
  StatusOrder,
  statusMapping,
} from "../interfaces/order/order.interface";
import { IRepository } from "../interfaces/repository/repository.interface";
import { Status } from "../interfaces/status/status.enum";
import IUser from "../interfaces/user/user.interface";
import { Cart } from "../models/cart.model";
import { Category } from "../models/category.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Repository } from "../models/repository.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { ApiFeatures } from "../utils/ApiFeatures";
import OTOShipping from "../utils/OTOShipping";
import Logex from "../utils/logex";
import { sendEmail } from "../utils/mailer/sendEmail";
import { createNotificationAll } from "../utils/notification";
import Tabby from "../utils/tabby";
import { calculateUserPoints } from "./pointsManagement.controller";

function decreaseQuantityQualityProduct(
  properties: any,
  qualities: any,
  quantity: number
) {
  const quality = findQuality(properties, qualities);
  if (!quality) {
    return false;
  }
  quality.quantity -= quantity;
  return true;
}

function findQuality(properties: any[], qualities: any[]) {
  if (!Array.isArray(properties)) {
    // Handle the case where properties is not an array (e.g., throw an error or return null)
    return null;
  }
  return qualities.find((quality: { values: any[] }) => {
    return properties.every((property) =>
      quality.values.some(
        (value: { key_en: any; key_ar: any; value_en: any; value_ar: any }) =>
          value.key_en === property.key_en &&
          value.key_ar === property.key_ar &&
          value.value_en === property.value_en &&
          value.value_ar === property.value_ar
      )
    );
  });
}

const getProductPrice = ({
  priceBeforeDiscount,
  priceAfterDiscount,
}: {
  priceBeforeDiscount: number;
  priceAfterDiscount: number;
}) => {
  if (priceAfterDiscount && priceAfterDiscount > 0) {
    return priceAfterDiscount;
  }
  return priceBeforeDiscount;
};

const generateItemsData = (items: ICart["cartItems"]) => {
  const itemsData = items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
    totalPrice: item.total,
    properties: item.properties,
  }));
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPriceWithoutShipping = items.reduce(
    (sum, item) => sum + item.totalWithoutShipping,
    0
  );
  const totalPrice = items.reduce((sum, item) => sum + item.total, 0);
  return { items: itemsData, quantity, totalPriceWithoutShipping, totalPrice };
};

const updateOrdersStatus = async () => {
  const logex = new Logex();
  const storeOrders = await logex.getOrders();
  if (!storeOrders.status) {
    return;
  }
  const bulkOption = storeOrders.data.map((item: any) => ({
    updateOne: {
      filter: { _id: item.order_id },
      update: { status: item.status },
    },
  }));
  await Order.bulkWrite(bulkOption, {});
};

interface addressInterface {
  city: string;
  area: string;
  address: string;
  postalCode: string;
}

// @desc    Create Order
// @route   POST /api/v1/orders
// @access  Private (User)
export const createOrder = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get user
    const { _id } = req.user! as any;
    const {
      city,
      orderNotes,
      phone,
      email,
      name,
      area,
      address,
      postalCode,
      Longitude,
      Latitude,
    } = req.body;

    // 2- add address in database for user
    const newAddress = { city, area, address, postalCode } as addressInterface;
    const addresses = await User.findById((req.user! as any).id).select(
      "addressesList"
    );
    let resultAddresses = [{}];
    if (addresses) {
      resultAddresses = addresses.addressesList.filter((item) => {
        if (
          item.city === city &&
          item.area === area &&
          item.address === address &&
          item.postalCode === postalCode
        ) {
          return true;
        }
        return false;
      });
    }

    if (resultAddresses.length === 0) {
      if (newAddress) {
        const userLogged = await User.findByIdAndUpdate(
          (req.user! as any)._id,
          {
            $addToSet: { addressesList: newAddress },
          },
          {
            new: true,
          }
        );
        if (userLogged) {
          // if length equal 5 delete oldest address in arry
          if (userLogged.addressesList.length > 5) {
            const res = await User.findByIdAndUpdate(
              (req.user! as any)._id,
              {
                $pull: {
                  addressesList: { _id: userLogged.addressesList[0]._id },
                },
              },
              {
                new: true,
              }
            );
          }
        }
      }
    }

    // 3- check if user has cart
    const cart = await Cart.findOne({ user: _id }).populate([
      { path: "user", model: "User", select: "name email phone image" },
      {
        path: "cartItems.product",
        model: "Product",
        select:
          "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType sendToDelivery",
      },
    ]);

    if (!cart) {
      return next(
        new ApiError(
          {
            en: "Cart is Empty",
            ar: "عربة التسوق فارغة",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    if (cart.cartItems.length < 1) {
      return next(
        new ApiError(
          {
            en: "Cart is Empty",
            ar: "عربة التسوق فارغة",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 4- check if user have order with same cart id

    const hasOrder = await Order.findOne({
      cartId: cart._id,
      $or: [
        { isVerified: false },
        {
          isVerified: true,
          status: "initiated",
          $or: [{ paymentType: "online" }, { paymentType: "both" }],
        },
      ],
    });

    if (hasOrder) {
      // delete order
      await Order.findByIdAndDelete(hasOrder._id);
    }

    // 5- get user info and send a verification code to the user phone number
    // const verificationCode = Math.floor(
    //   100000 + Math.random() * 900000
    // ).toString();
    const verificationCode = "123456";
    const verificationCodeExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    const hashVerificationCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    // 3) send the reset code via email
    // try {
    //   await sendSMSTaqnyat({
    //     recipient: parseInt(req.body.phone),
    //     message: `${process.env.MessageSMS} : ${verificationCode}`,
    //   });
    // } catch (err) {
    //   return next(
    //     new ApiError(
    //       {
    //         en: "There Is An Error In Sending SMS",
    //         ar: "هناك خطأ في إرسال الرسالة القصيرة",
    //       },
    //       StatusCodes.INTERNAL_SERVER_ERROR
    //     )
    //   );
    // }

    // 6- calculate total price and quantity

    const totalPrice = cart.cartItems.reduce(
      (sum, item) => sum + item.total,
      0
    );
    const totalQuantity = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const isOnline = cart.cartItems.some(
      (item) =>
        item.product.paymentType === "online" ||
        (item.product.paymentType === "both" && item.paymentType === "online")
    );
    const isCash = cart.cartItems.some(
      (item) =>
        item.product.paymentType === "cash" ||
        (item.product.paymentType === "both" && item.paymentType === "cash")
    );

    // const isBoth = cart.cartItems.some(
    //   (item) => item.product.paymentType === "both"
    // );

    const paymentType =
      isCash && isOnline ? "both" : isOnline ? "online" : "cash";

    const cashData = cart.cartItems.filter(
      (item) =>
        item.product.paymentType === "cash" ||
        (item.product.paymentType === "both" && item.paymentType === "cash")
    ) as ICart["cartItems"];

    const onlineData = cart.cartItems.filter(
      (item) =>
        item.product.paymentType === "online" ||
        (item.product.paymentType === "both" && item.paymentType === "online")
    ) as ICart["cartItems"];

    const onlineItems = generateItemsData(onlineData);
    const cashItems = generateItemsData(cashData);

    if (cart.isPointsUsed && cart.totalUsedFromPoints) {
      const applyPoints = (items: any) => {
        const diff = Math.abs(
          items.totalPriceWithoutShipping - cart.totalUsedFromPoints
        );
        items.totalPriceWithoutShipping = diff;
        items.totalPrice -= cart.totalUsedFromPoints;
      };

      switch (paymentType) {
        case "online":
          applyPoints(onlineItems);
          break;
        case "cash":
          applyPoints(cashItems);
          break;
        case "both":
          if (cart.totalUsedFromPoints <= cashItems.totalPriceWithoutShipping) {
            applyPoints(cashItems);
          } else {
            const temp = Math.abs(
              cart.totalUsedFromPoints - cashItems.totalPriceWithoutShipping
            );
            cashItems.totalPriceWithoutShipping -=
              cart.totalUsedFromPoints - temp;
            cashItems.totalPrice -= cart.totalUsedFromPoints - temp;
            onlineItems.totalPriceWithoutShipping -= temp;
            onlineItems.totalPrice -= temp;
          }
          break;
      }
    }

    // 7- check quantity
    cart.cartItems.map(async (cart) => {
      const id = cart.product;
      const product = await Product.findById(id);
      if (product) {
        if (cart.product.quantity > product.quantity) {
          return next(
            new ApiError(
              {
                en: `Product Quantity is not enough ${product.title_en}`,
                ar: `كمية المنتج غير كافية ${product.title_ar}`,
              },
              StatusCodes.NOT_FOUND
            )
          );
        }
      }
    });

    const emailLowercase = email?.toLowerCase();
    // 8- create order
    const order = await Order.create({
      user: _id,
      cartId: cart._id,
      totalPrice,
      totalQuantity,
      city,
      phone,
      email: emailLowercase,
      name,
      area,
      address,
      postalCode,
      Longitude,
      Latitude,
      orderNotes,
      verificationCode: hashVerificationCode,
      verificationCodeExpiresAt,
      paymentType,
      payWith: {
        source: {},
      },
      onlineItems: onlineItems,
      cashItems: cashItems,
    });
    let {
      verificationCode: _,
      verificationCodeExpiresAt: __,
      payWith,
      ...orderResponse
    } = order.toObject();

    // send notification to all users
    const sender = ((req.user as IUser)?._id).toString(); // add type guard to check if req.user exists
    const title = `New Order Created By ${name}`;
    const message = `New Order Created By ${name} With Email ${email}`;
    const link = `${process.env.Dash_APP_URL}/orders/${order._id}`;

    let notification = {};
    if (title && message && sender && link) {
      notification = await createNotificationAll(
        title,
        message,
        sender,
        ["rootAdmin", "adminA", "adminB", "adminC", "subAdmin"],
        link
      );
      if (notification === -1) {
        return next(
          new ApiError(
            {
              en: "notification not created",
              ar: "لم يتم إنشاء الإشعار",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }
    }

    res.status(StatusCodes.CREATED).json({
      status: Status.SUCCESS,
      data: orderResponse,
      success_en: "Order Initiated Successfully",
      success_ar: "تم إنشاء الطلب بنجاح",
    });
  }
);

// @desc    Verify Order
// @route   POST /api/v1/orders/verifyOrder
// @access  Private (User)
export const verifyOrder = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user! as any;
    const { code, phone } = req.body;
    const hashVerificationCode = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");
    const order = await Order.findOne({
      user: _id,
      verificationCode: hashVerificationCode,
      verificationCodeExpiresAt: { $gt: Date.now() },
      phone: phone,
    }).populate([
      { path: "onlineItems.items.product" },
      { path: "cashItems.items.product" },
    ]);

    if (!order) {
      return next(
        new ApiError(
          {
            en: "Invalid Code",
            ar: "كود غير صحيح",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // verify order
    order.isVerified = true;
    order.verificationCodeExpiresAt = 0;

    //  online , cash , both
    switch (order.paymentType) {
      case "cash":
        // create cash payment
        // update products sales
        const bulkOption = order.cashItems.items.map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: { sales: +item.quantity, quantity: -item.quantity },
            },
          },
        }));
        await Product.bulkWrite(bulkOption, {});
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // decrement the value of quality quantity for each item
        order.cashItems.items.forEach(async (item) => {
          const product = item.product;
          if (product) {
            const checkQuality =
              product.qualities && product.qualities.length > 0;
            const checkProperties =
              item.properties && item.properties.length > 0;
            if (checkProperties && checkQuality) {
              const decQuantity = decreaseQuantityQualityProduct(
                item.properties,
                product.qualities,
                item.quantity
              );

              if (!decQuantity) {
                return next(
                  new ApiError(
                    {
                      en: "Quantity not found",
                      ar: "الكمية غير موجودة",
                    },
                    StatusCodes.NOT_FOUND
                  )
                );
              }
            }
            // save the updated product back to the database
            await product.save();
          }
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        await sendEmail(order);
        // delete cart
        const userPoints = await calculateUserPoints(order);

        // STEPS FOR DELETING THE CART
        const cart = await Cart.findByIdAndDelete(order.cartId);
        if (!cart) {
          return next(
            new ApiError(
              {
                en: "Cart Not Found",
                ar: "عربة التسوق غير موجودة",
              },
              StatusCodes.NOT_FOUND
            )
          );
        }

        // find marketer and update points
        if (
          cart?.coupon?.couponReference &&
          cart?.coupon?.used &&
          cart?.coupon?.commissionMarketer
        ) {
          await User.findOneAndUpdate(
            { couponMarketer: cart?.coupon?.couponReference.toString() },
            {
              $inc: {
                totalCommission: Math.floor(cart?.coupon?.commissionMarketer!),
              },
              $push: {
                pointsMarketer: {
                  order: order._id,
                  commission: Math.floor(cart?.coupon?.commissionMarketer!),
                },
              },
            },
            { new: true }
          );
        }

        await User.updateOne(
          { _id: _id },
          { $inc: { revinue: order.cashItems.totalPrice, points: userPoints } }
        );

        await Promise.all(
          order.cashItems.items.map(async (item) => {
            const product = await Product.findOne({ _id: item.product });
            await Category.updateOne(
              { _id: product?.category },
              { $inc: { revinue: item.totalPrice } }
            );
          })
        );

        // change status to created and payWith to none
        order.status = StatusOrder.created;
        order.payWith.type = "none";
        await order.save();

        res.status(StatusCodes.OK).json({
          status: Status.SUCCESS,
          data: order,
          paymentType: order.paymentType,
          success_en: "Order Created Successfully",
          success_ar: "تم إنشاء الطلب بنجاح",
        });
        break;
      default:
        const { city, orderNotes, phone, email } = order;

        await order.save();
        res.status(StatusCodes.CREATED).json({
          status: Status.SUCCESS,
          data: order,
          metadata: {
            cart_id: order.cartId,
            user_id: _id,
            order_id: order._id,
            total_quantity: order.totalQuantity,
            total_price: order.onlineItems.totalPrice,
            city,
            orderNotes,
            description: `Payment for order: ${phone}, ${email}, ${city}, pay ${order.onlineItems.totalPrice} from the total price ${order.totalPrice}`,
            phone,
            email,
            paymentType: "online",
          },
          paymentType: order.paymentType,
          success_en: "Order Verified Successfully",
          success_ar: "تم التحقق من الطلب بنجاح",
        });
        break;
    }
  }
);

// @desc    Get My Orders
// @route   GET /api/v1/orders/myOrders
// @access  Private (User)
export const getMyOrders = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user! as any;

    const orders = await Order.find({
      user: _id,
      active: true,
      status: "created",
    }).populate([
      { path: "user", model: "User", select: "name email phone image" },
      {
        path: "onlineItems.items.product",
        model: "Product",
        select:
          "directDownloadLink title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType sendToDelivery",
      },
      {
        path: "cashItems.items.product",
        model: "Product",
        select:
          "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType sendToDelivery",
      },
    ]);

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: orders,
      success_en: "Orders Fetched Successfully",
      success_ar: "تم جلب الطلبات بنجاح",
    });
  }
);

// @desc    Get Order By Id
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order = await Order.findById({ _id: id, active: true }).populate([
      { path: "user", model: "User", select: "name email phone image" },
      {
        path: "onlineItems.items.product",
        model: "Product",
        select:
          "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType deliveryType sendToDelivery",
      },
      {
        path: "cashItems.items.product",
        model: "Product",
        select:
          "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType deliveryType sendToDelivery",
      },
      // {
      //   path: "onlineItems.items.repositories.repository",
      //   model: "Repository",
      //   select: "name_en name_ar",
      // },
      // {
      //   path: "cashItems.items.repositories.repository",
      //   model: "Repository",
      //   select: "name_en name_ar",
      // },
    ]);

    if (!order) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: order,
      success_en: "Order Fetched Successfully",
      success_ar: "تم جلب الطلب بنجاح",
    });
  }
);

// @desc    Get Order By Id
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderByCartId = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.params.id;
    const { _id } = req.user! as any;
    const order = await Order.findById({
      cartId,
      userId: _id,
      active: true,
    }).populate([
      { path: "user", model: "User", select: "name email phone image" },
      {
        path: "onlineItems.items.product",
        model: "Product",
        select:
          "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType deliveryType sendToDelivery",
      },
      {
        path: "cashItems.items.product",
        model: "Product",
        select:
          "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType deliveryType sendToDelivery",
      },
      {
        path: "onlineItems.items.repositories.repository",
        model: "Repository",
        select: "name_en name_ar",
      },
      {
        path: "cashItems.items.repositories.repository",
        model: "Repository",
        select: "name_en name_ar",
      },
    ]);

    if (!order) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: order,
      success_en: "Order Fetched Successfully",
      success_ar: "تم جلب الطلب بنجاح",
    });
  }
);

// @desc    Get All Orders
// @route   GET /api/v1/orders
// @access  Private (Admin)
export const getAllOrders = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // add pagination

    // await updateOrdersStatus();

    const ordersCount = await Order.countDocuments({});

    const query = req.query as IQuery;
    const mongoQuery = Order.find({ active: true });
    const orders = await Order.find({ active: true }).populate([
      {
        path: "onlineItems.items.product",
        model: "Product",
        select: "title_en title_ar images quantity",
      },
      {
        path: "cashItems.items.product",
        model: "Product",
        select: "title_en title_ar images quantity ",
      },
    ]);
    const { data, paginationResult } = await new ApiFeatures(mongoQuery, query)
      .populate()
      .filter()
      .limitFields()
      .search()
      .sort()
      .paginate();
    if (data.length === 0) {
      return next(
        new ApiError(
          { en: "not found", ar: "غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // const orders = await mongooseQuery.populate([
    //   { path: "user", model: "User", select: "name email phone image" },
    //   {
    //     path: "onlineItems.items.product",
    //     model: "Product",
    //     select:
    //       "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType deliveryType sendToDelivery",
    //   },
    //   {
    //     path: "cashItems.items.product",
    //     model: "Product",
    //     select:
    //       "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType deliveryType sendToDelivery",
    //   },
    // ]);

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      results: data.length,
      paginationResult,
      data: data,
      orders,
      success_en: "Orders Fetched Successfully",
      success_ar: "تم جلب الطلبات بنجاح",
    });
  }
);

// @desc    update order status
// @route   PUT /api/v1/orders/:id
// @access  Private (Admin)
export const updateOrderStatus = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!order) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: order,
      success_en: "Order Status Updated Successfully",
      success_ar: "تم تحديث حالة الطلب بنجاح",
    });
  }
);

// @desc    delete order
// @route   DELETE /api/v1/orders/:id
// @access  Private (Admin)
// export const deleteOrder = deleteOneItemById(Order);
export const deleteOrder = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id for item from params
    const { id } = req.params;

    const order = await Order.findById({ _id: id });
    if (!order) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    const updatedActiveItem = await Order.findByIdAndUpdate(
      { _id: id },
      { active: false },
      { new: true }
    );

    if (!updatedActiveItem) {
      return next(
        new ApiError(
          {
            en: "An error occurred while updating",
            ar: "حدث خطأ أثناء التحديث",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 4- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "deleted successfully",
      success_ar: "تم الحذف بنجاح",
    });
  }
);

// @desc    delete order
// @route   DELETE /api/v1/orders/deleteMany
// @access  Private (Admin)
export const deleteGroupOfOrders = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id for item from body
    const { ids } = req.body;
    const updatedActiveItem = await Order.updateMany(
      { _id: ids },
      { active: false },
      { new: true }
    );

    if (!updatedActiveItem) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 4- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Order deleted successfully",
      success_ar: "تم الحذف الطلبات بنجاح",
    });
  }
);

// @desc    create item from order to specific repository
// @route   POST /api/v1/orders/createItemRepository
// @access  Private (Admin)
export const createItemRepository = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, itemId, typeOfItem, repos } = req.body;
    let flag: boolean[] = [];
    const order = await Order.findById(id);
    if (!order) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    if (typeOfItem === "online") {
      const item = order.onlineItems.items.find(
        (item) => item.product.toString() === itemId
      );
      if (!item) {
        return next(
          new ApiError(
            {
              en: "Product Not Found",
              ar: "المنتج غير موجود",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }
      item.repositories = repos;
    } else {
      const item = order.cashItems.items.find(
        (item) => item.product.toString() === itemId
      );
      if (!item) {
        return next(
          new ApiError(
            {
              en: "Product Not Found",
              ar: "المنتج غير موجود",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }
      item.repositories = repos;
    }

    let Repositories: IRepository[] = [];
    let decQuantity = 0;
    const prod = await Product.findById(itemId);
    if (!prod) {
      return next(
        new ApiError(
          {
            en: "Product Not Found",
            ar: "المنتج غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    // update quantity of product from array in repository
    // await Promise.all(
    //   repos.map(async (repo: any) => {
    //     const Repos = await Repository.findOne({ _id: repo.repository });

    //     if (Repos) {
    //       Repositories.push(Repos);
    //       const product = Repos.products.find(
    //         (item) => item.productId.toString() === itemId
    //       );

    //       if (product) {
    //         if (product.quantity >= repo.quantity) {
    //           product.quantity -= repo.quantity;
    //           Repos.quantity -= repo.quantity;

    //           flag.push(true);
    //         } else {
    //           flag.push(false);
    //           return next(
    //             new ApiError(
    //               {
    //                 en: "Insufficient Quantity in Repository",
    //                 ar: "الكمية غير كافية في المستودع",
    //               },
    //               StatusCodes.BAD_REQUEST
    //             )
    //           );
    //         }
    //       }
    //       //await Repos.save();
    //       // Update the repoQuantity in the product schema
    //         prod.repoQuantity -= repo.quantity;
    //     }

    //     if (!Repos) {
    //       return next(
    //         new ApiError(
    //           {
    //             en: "Repository Not Found",
    //             ar: "المستودع غير موجود",
    //           },
    //           StatusCodes.NOT_FOUND
    //         )
    //       );
    //     }
    //   })
    // );

    if (flag.every((item) => item === true)) {
      await order.save();
      await prod.save();
      Promise.all(
        Repositories.map(async (item) => {
          await item.save();
        })
      );
    } else {
      return next(
        new ApiError(
          {
            en: "Insufficient Quantity in Repository",
            ar: "الكمية غير كافية في المستودع",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Item Created Successfully",
      success_ar: "تم إنشاء العنصر بنجاح",
    });
  }
);

// @desc    create shipping order
// @route   POST /api/v1/orders/shipping/:id
// @access  Private (Admin)
export const createShippingOrder = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from body and params
    const { id } = req.params;
    const { repoId } = req.body;
    const { products } = req.body;

    // 2- get order
    const order = await Order.findById(id).populate([
      { path: "user", model: "User", select: "name email phone image" },
      {
        path: "onlineItems.items.product",
        model: "Product",
        select:
          "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType deliveryType sendToDelivery weight ",
      },
      {
        path: "cashItems.items.product",
        model: "Product",
        select:
          "title_en title_ar priceBeforeDiscount priceAfterDiscount images quantity paymentType deliveryType sendToDelivery weight ",
      },
    ]);
    if (!order) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- check if order is already sent to delivery
    if (order.sendToDelivery) {
      return next(
        new ApiError(
          {
            en: "Order Already Sent To Delivery",
            ar: "تم إرسال الطلب بالفعل للتوصيل",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // 4- check if order is verified
    if (!order.isVerified) {
      return next(
        new ApiError(
          {
            en: "Order Not Verified",
            ar: "الطلب غير موثق",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // 5- check if order is online
    const repository = await Repository.findById(repoId);
    if (!repository) {
      return next(
        new ApiError(
          {
            en: "Repository Not Found",
            ar: "المستودع غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 6- prepare data code from repository
    const pickupLocationCode = repository.code;

    // 7- prepare data (onlineItems and cashItems) for order
    const cashItems: any = [];
    const onlineItems: any = [];
    for (const product of products) {
      order?.cashItems.items.find((item) => {
        if (item.product._id.toString() === product) {
          cashItems.push(item);
        }
      });

      order?.onlineItems.items.find((item) => {
        if (item.product._id.toString() === product) {
          onlineItems.push(item);
        }
      });
    }

    const orderId = uuidv4();
    const shippingData = {
      shippingId: orderId,
      repoId: repoId,
      products: products,
    };

    // 8- create order
    const OTO = new OTOShipping();
    let response: any = {};
    try {
      response = await OTO.createOrder(
        order,
        cashItems,
        onlineItems,
        orderId,
        pickupLocationCode
      );
    } catch (err) {
      throw err;
    }

    // 9- update order sendToDelivery to true
    const responseOrder = await Order.findByIdAndUpdate(
      id,
      { $push: { ordersShipping: shippingData } },
      { new: true }
    );
    if (!responseOrder) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 10- check if all items are shipped
    let length: number = 0;
    for (let index = 0; index < responseOrder.ordersShipping.length; index++) {
      length += responseOrder.ordersShipping[index].products.length;
    }


    if (
      length ===
      responseOrder.cashItems.items.length +
        responseOrder.onlineItems.items.length
    ) {
      responseOrder.sendToDelivery = true;
      await responseOrder.save();
    }

    // 11- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: response,
      success_en: "Order Created Successfully",
      success_ar: "تم إنشاء الطلب بنجاح",
    });
  }
);

// @desc    create shipping order
// @route   POST /api/v1/orders/createShippingOrderStatus/:id
// @access  Private (Admin)
export const createShippingOrderStatus = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from body and params
    const { id } = req.params;

    // 2- check if order is already sent to delivery
    const order = await Order.findByIdAndUpdate(
      id,
      { sendToDelivery: true },
      { new: true }
    );

    // 3- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: order,
      success_en: "Order Status Updated Successfully",
      success_ar: "تم تحديث حالة الطلب بنجاح",
    });
  }
);

// @desc    cancel shipping order
// @route   POST /api/v1/orders/cancelShipping/:id
// @access  Private (Admin)
export const cancelShippingOrder = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from body and params
    const { id } = req.params;

    // 2- check if order is already sent to delivery
    const OTO = new OTOShipping();
    let response: any = {};
    try {
      response = await OTO.cancelOrder(id);
    } catch (err) {
      throw err;
    }

    // 3- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: response,
      success_en: "Order Canceled Successfully",
      success_ar: "تم إلغاء الطلب بنجاح",
    });
  }
);

// @desc    track Order
// @route   GET /api/v1/orders/trackOrder/:id
// @access  Private (Admin)
export const trackOrder = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { orderId } = req.body;

    const OTO = new OTOShipping();
    let response: any = {};
    try {
      response = await OTO.orderStatus(orderId);
    } catch (err) {
      throw err;
    }

    const order = await Order.findById(id);
    if (!order) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    for (const shipping of order.ordersShipping) {
      if (shipping.shippingId === orderId) {
        const status =
          IOrderStatus[response.status as keyof typeof IOrderStatus];
        if (status in statusMapping) {
          shipping.status = statusMapping[status];
        }
      }
    }

    await order.save();

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: {
        success: response.success,
        date: response.date,
        customerAddress: response.customerAddress,
        totalValue: response.totalValue,
        orderId: response.orderId,
        shipmentId: response.shipmentId,
        deliveryCompany: response.deliveryCompany,
        customerName: response.customerName,
        statusDetails: response.status,
        status: IOrderStatus[response.status as keyof typeof IOrderStatus],
      },
      success_en: "Order Tracked Successfully",
      success_ar: "تم تتبع الطلب بنجاح",
    });
  }
);

// @desc    CheckOut Tabby
// @route   POST /api/v1/orders/checkoutTabby
// @access  Public
export const checkoutTabby = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req.user! as IUser);
        
    
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return next(
        new ApiError(
          {
            en: "Cart Not Found",
            ar: "العربة غير موجودة",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    const order = await Order.findOne({ cartId: cart._id }).populate([
      { path: "onlineItems.items.product" },
      { path: "cashItems.items.product" },
    ]);;
    if (!order) {
      return next(
        new ApiError(
          {
            en: "Order Not Found",
            ar: "الطلب غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    
    const items = order.onlineItems.items.map((item) => {
      return {
        title: item.product.title_en,
        description: item.product.title_en,
        quantity: item.quantity,
        unit_price: (item.totalPrice/item.quantity).toString(),
        reference_id: item.product._id.toString(),
        image_url: item.product.images[0],
        category: "string",
      };
    });
    const phone = order.phone.slice(4);
    const email = order.email;
    

    const data = {
      payment: {
        amount: order.onlineItems.totalPrice.toString(),
        currency: "SAR",
        buyer: {
          phone: phone,
          email: email,
          name: order.name,
        },
        buyer_history: {
          registered_since: user.createdAt,
          loyalty_level: user.orders.length,
          wishlist_count: user.favourite.length,
          is_social_networks_connected: true,
          is_phone_number_verified: true,
          is_email_verified: false,
        },
        order: {
          tax_amount: "0.00",
          shipping_amount: "0.00",
          discount_amount: "0.00",
          updated_at: order.createdAt,
          reference_id: order.id.toString(),
          items: items,
        },
        shipping_address: {
          city: order.city,
          address: order.address,
          zip: order.postalCode,
        },
        meta: {
          order_id: order._id.toString(),
          customer: user._id.toString(),
        },
        attachment: {
          body: '{"flight_reservation_details": {"pnr": "TR9088999","itinerary": [...],"insurance": [...],"passengers": [...],"affiliate_name": "some affiliate"}}',
          content_type: "application/vnd.tabby.v1+json",
        },
      },
      lang: "en",
      merchant_code: `${process.env.TABBY_MERCHANT_CODE}`,
      merchant_urls: {
        success: `${process.env.TABBY_MERCHANT_URL}success`,
        cancel: `${process.env.TABBY_MERCHANT_URL}cancel`,
        failure: `${process.env.TABBY_MERCHANT_URL}failure`,
      },
    };
    
    const tabbyCheckout = new Tabby();
    try {
      const response = await tabbyCheckout.checkout(data);
      if (response.status === "created") {
        res.status(StatusCodes.OK).json({
          status: Status.SUCCESS,
          data: {
            url: response.configuration.available_products.installments[0].web_url
          },
          success_en: "Retrieve Tabby URL Checkout Successfully",
          success_ar: "استرجاع لينك تابي بنجاح",
        });
      } else {
        return next(
          new ApiError(
            {
              en: "Sorry, Tabby is unable to approve this purchase, please use an alternative payment method for your order",
              ar: "نأسف، تابي غير قادرة على الموافقة على هذه العملية. الرجاء استخدام طريقة دفع أخرى",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }
    } catch (err) {
      throw err;
    }
    
  }
);

// @desc    Retrieve Payment Tabby
// @route   GET /api/v1/orders/retrievePaymentTabby
// @access  Public
export const retrievePaymentTabby = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tabbyCheckout = new Tabby();
    try{
      const response = await tabbyCheckout.retrievePayment(req.params.id as string);
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        data: response,
        success_en: "Retrieve Payment Tabby Successfully",
        success_ar: "استرجاع دفع تابي بنجاح",
      });
    }
    catch(err){
      throw err;
    }
  }
);
