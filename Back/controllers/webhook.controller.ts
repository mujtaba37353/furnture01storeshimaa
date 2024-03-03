import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Cart } from "../models/cart.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { Category } from "../models/category.model";
import Moyasar from "../utils/moyasar";
import { sendEmail } from "../utils/mailer/sendEmail";
import { calculateUserPoints } from "./pointsManagement.controller";
import { StatusOrder } from "../interfaces/order/order.interface";
import Tabby from "../utils/tabby";

function decreaseQuantityQualityProduct(
  properties: any,
  qualities: any,
  quantity: number
) {
  const quality = findQuality(properties, qualities);
  if (!quality) {
    console.log("Quality not found");
    return false;
  }
  console.log(quality);
  quality.quantity -= quantity;
  return true;
}

function findQuality(properties: any[], qualities: any[]) {
  if (!Array.isArray(properties)) {
    // Handle the case where properties is not an array (e.g., throw an error or return null)
    console.log("Properties is not an array");
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

export const moyasarWebhook = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("PaymentId ::: ", req.body);
    const { id } = req.body;

    const moyasar = new Moyasar();
    const paymentResult = await moyasar.getPayment(id);

    console.log("PaymentResult ::: ", paymentResult);

    if (paymentResult?.status !== "paid") {
      return next(
        new ApiError(
          {
            en: "the payment is not paid",
            ar: "الدفع لم يتم",
          },
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const order = await Order.findOne({
      cartId: paymentResult?.metadata?.cart_id,
    }).populate([
      { path: "onlineItems.items.product" },
      { path: "cashItems.items.product" },
    ]);

    if (!order) {
      return next(
        new ApiError(
          {
            en: "cart not found",
            ar: "السلة غير موجودة",
          },
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (
      Math.floor(paymentResult.amount / 100) !==
      Math.floor(order?.onlineItems.totalPrice)
    ) {
      return next(
        new ApiError(
          {
            en: "the payment amount is not equal to the order amount",
            ar: "مبلغ الدفع غير مساوي لمبلغ الطلب",
          },
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (!order || !order.isVerified) {
      return next(
        new ApiError(
          {
            en: "Order not found or not verified",
            ar: "الطلب غير موجود او غير مفعل",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // change order status to created
    switch (paymentResult?.status) {
      case "paid":
        order.status = StatusOrder.created;
        order.payWith.source = paymentResult?.source as any;
        order.payWith.type = paymentResult?.source?.type as any;
        order.paymentStatus = "payment_paid";
        order.invoiceId = paymentResult?.id;

        // update product quantity
        const bulkOption = [
          ...order.onlineItems.items,
          ...order.cashItems.items,
        ].map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: { sales: +item.quantity, quantity: -item.quantity },
            },
          },
        }));
        await Product.bulkWrite(bulkOption, {});
        const revenue =
          order.onlineItems.totalPrice + (order?.cashItems?.totalPrice || 0);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // decrement the value of quality quantity for each item
        order.onlineItems.items.forEach(async (item) => {
          const product = await Product.findById(item.product);
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
              console.log("decQuantity", decQuantity);

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
        // tODO :: before the User Update
        const userPoints: number = await calculateUserPoints(order);
        await User.updateOne(
          { _id: order.user },

          { $inc: { revinue: revenue, points: userPoints } }
        );

        await Promise.all(
          [...order.onlineItems.items, ...order.cashItems.items].map(
            async (item) => {
              const product = await Product.findOne({ _id: item.product });
              await Category.updateOne(
                { _id: product?.category },
                { $inc: { revinue: item.totalPrice } }
              );
            }
          )
        );
        await sendEmail(order);
        // delete cart
        // THIS WAS DELETE CART ROLES BUT I STOPED IT
        const cart = await Cart.findByIdAndDelete(order.cartId);
        if (!cart) {
          return next(
            new ApiError(
              {
                en: "cart not found",
                ar: "السلة غير موجودة",
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

        break;

      default:
        // update order paymentStatus
        order.paymentStatus = "payment_failed";
        break;
    }

    await order.save();

    res.status(StatusCodes.OK).json({ received: true });
  }
);

export const tabbyWebhook = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("PaymentId ::: ", req.body);
    const { id } = req.body;

    const tabbyCheckout = new Tabby();
    const paymentResult = await tabbyCheckout.retrievePayment(id as string);

    console.log("PaymentResult.status ::: ", paymentResult.status);
    
    if (paymentResult?.status !== "CLOSED") {
      return next(
        new ApiError(
          {
            en: "the payment is not paid",
            ar: "الدفع لم يتم",
          },
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    console.log("PaymentResult.meta.order_id ::: ", paymentResult.meta.order_id);
    
    const order = await Order.findById(
      paymentResult?.meta?.order_id,
    ).populate([
      { path: "onlineItems.items.product" },
      { path: "cashItems.items.product" },
    ]);
    console.log("Order ::: ", order);
    

    if (!order) {
      return next(
        new ApiError(
          {
            en: "cart not found",
            ar: "السلة غير موجودة",
          },
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (!order || !order.isVerified) {
      return next(
        new ApiError(
          {
            en: "Order not found or not verified",
            ar: "الطلب غير موجود او غير مفعل",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    console.log("PaymentResult.id ::: ", paymentResult.id);
    
    // change order status to created
    switch (paymentResult?.status) {
      case "CLOSED":
        order.status = StatusOrder.created;
        order.payWith.type = "tabby";
        order.paymentStatus = "payment_paid";
        order.invoiceId = paymentResult?.id;

        // update product quantity
        const bulkOption = [
          ...order.onlineItems.items,
          ...order.cashItems.items,
        ].map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: { sales: +item.quantity, quantity: -item.quantity },
            },
          },
        }));
        await Product.bulkWrite(bulkOption, {});
        const revenue =
          order.onlineItems.totalPrice + (order?.cashItems?.totalPrice || 0);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // decrement the value of quality quantity for each item
        order.onlineItems.items.forEach(async (item) => {
          const product = await Product.findById(item.product);
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
              console.log("decQuantity", decQuantity);

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
        // tODO :: before the User Update
        const userPoints: number = await calculateUserPoints(order);
        await User.updateOne(
          { _id: order.user },

          { $inc: { revinue: revenue, points: userPoints } }
        );

        await Promise.all(
          [...order.onlineItems.items, ...order.cashItems.items].map(
            async (item) => {
              const product = await Product.findOne({ _id: item.product });
              await Category.updateOne(
                { _id: product?.category },
                { $inc: { revinue: item.totalPrice } }
              );
            }
          )
        );
        await sendEmail(order);
        // delete cart
        // THIS WAS DELETE CART ROLES BUT I STOPED IT
        const cart = await Cart.findByIdAndDelete(order.cartId);
        if (!cart) {
          return next(
            new ApiError(
              {
                en: "cart not found",
                ar: "السلة غير موجودة",
              },
              StatusCodes.NOT_FOUND
            )
          );
        }
        console.log("cart deleted::: ");
        
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

        break;

      default:
        // update order paymentStatus
        order.paymentStatus = "payment_failed";
        break;
    }

    await order.save();

    res.status(StatusCodes.OK).json({ received: true });
  }
);

//  {
//      id: '2520c6e9-f34b-4e8d-b125-779f091183a0',
//      status: 'paid',
//      amount: 32000,
//      fee: 0,
//      currency: 'SAR',
//      refunded: 0,
//      refunded_at: null,
//      captured: 0,
//      captured_at: null,
//      voided_at: null,
//      description: ' pay 320',
//      amount_format: '320.00 SAR',
//      fee_format: '0.00 SAR',
//      refunded_format: '0.00 SAR',
//      captured_format: '0.00 SAR',
//      invoice_id: null,
//      ip: '197.39.244.226',
//      callback_url: 'http://localhost:3000/thankYou?cart_id=65d1e7b22e7408579aa6d8fb',
//      created_at: '2024-02-20T12:09:20.537Z',
//      updated_at: '2024-02-20T12:09:34.257Z',
//      metadata: {
//        cart_id: '65d1e7b22e7408579aa6d8fb',
//        user_id: '65d1e5662e7408579aa6d87f',
//        total_quantity: 4
//      },
//      source: {
//        type: 'creditcard',
//        company: 'visa',
//        name: 'islam galal',
//        number: '4111-11XX-XXXX-1111',
//        gateway_id: 'moyasar_cc_qSfXFcnNFrvq8bf1EZEeJv7',
//        reference_number: null,
//        token: null,
//        message: 'APPROVED',
//        transaction_url: 'https://api.moyasar.com/v1/transaction_auths/28fa75c5-be80-4fca-90da-59906fcb480a/form'
//      }
//    }



// {
//      id: '23f9ebbe-7f2b-4d41-a610-169991527029',
//      created_at: '2024-02-20T12:47:10Z',
//      expires_at: '2025-02-19T12:47:46Z',
//      status: 'CLOSED',
//      is_test: true,
//      product: {
//        type: 'installments',
//        installments_count: 3,
//        installment_period: 'P1M'
//      },
//      amount: '320',
//      currency: 'SAR',
//      description: '',
//      buyer: {
//        id: '',
//        name: 'Islam Sayed Galal',
//        email: 'card.success@tabby.ai',
//        phone: '+966500000001',
//        dob: null
//      },
//      shipping_address: { city: 'Cairo', address: 'cairo', zip: '12345' },
//      order: {
//        reference_id: '65d49f35d26a62123bd9f712',
//        updated_at: '2024-02-20T12:45:50.747Z',
//        tax_amount: '0',
//        shipping_amount: '0',
//        discount_amount: '0',
//        items: [ [Object], [Object] ]
//      },
//      captures: [
//        {
//          id: '2e1bfb14-91f6-45b1-a600-fcdfcc044d83',
//          created_at: '2024-02-20T12:47:46Z',
//          amount: '320',
//          tax_amount: '0',
//          shipping_amount: '0',
//          discount_amount: '0',
//          items: [],
//          reference_id: ''
//        }
//      ],
//      refunds: [],
//      buyer_history: {
//        registered_since: '2024-02-18T11:09:26.332Z',
//        loyalty_level: 0,
//        wishlist_count: 0,
//        is_social_networks_connected: true,
//        is_phone_number_verified: true,
//        is_email_verified: false
//      },
//      order_history: [],
//      meta: {
//        customer: '65d1e5662e7408579aa6d87f',
//        order_id: '65d49f35d26a62123bd9f712'
//      },
//      cancelable: false,
//      attachment: {
//        body: '{"flight_reservation_details": {"pnr": "TR9088999","itinerary": [...],"insurance": [...],"passengers": [...],"affiliate_name": "some affiliate"}}',
//        content_type: 'application/vnd.tabby.v1+json'
//      }
//    }