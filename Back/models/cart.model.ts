import { Schema, model } from "mongoose";
import { ICart } from "../interfaces/cart/cart.interface";

const cartSchema = new Schema<ICart>(
  {
    isPointsUsed: { type: Boolean, default: false },
    isFreezed: { type: Boolean, default: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        singlePrice: {
          type: Number,
        },
        quantity: {
          type: Number,
          required: true,
        },
        paymentType: {
          type: String,
          enum: ["online", "cash"],
        },
        totalWithoutShipping: {
          type: Number,
        },
        totalShipping: {
          type: Number,
        },
        total: {
          type: Number,
          required: true,
        },
        properties: {
          type: [
            {
              key_en: { type: String, required: true },
              key_ar: { type: String, required: true },
              value_en: { type: String, required: true },
              value_ar: { type: String, required: true },
              _id: false,
            },
          ],
          required: false,
          default: [],
          _id: false,
        },
      },
    ],
    coupon: {
      couponReference: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
      },
      used: {
        type: Boolean,
        default: false,
      },
      commissionMarketer: {
        type: Number,
        default: 0,
      },
    },
    totalCartPriceWithoutShipping: {
      type: Number,
      default: 0,
    },
    totalCartPrice: {
      type: Number,
      default: 0,
    },
    totalUsedFromPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICart>("Cart", cartSchema);
