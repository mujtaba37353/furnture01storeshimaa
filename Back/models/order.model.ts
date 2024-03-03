import { Schema, Types, model } from "mongoose";
import { IOrder, StatusOrder } from "../interfaces/order/order.interface";

const orderSchema = new Schema<IOrder>(
  {
    invoiceId: { type: String },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(StatusOrder),
      default: StatusOrder.initiated,
    },
    tracking: {
      type: [
        {
          path: { type: String },
          orderNumberTracking: { type: String },
        },
      ],
      required: false,
      default: [],
    },
    orderNotes: {
      type: String,
    },
    email: {
      type: String
    },
    verificationCode: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCodeExpiresAt: {
      type: Number,
      required: true,
    },
    sendToDelivery: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["payment_not_paid", "payment_paid", "payment_failed"],
      default: "payment_not_paid",
    },
    paymentType: {
      type: String,
      enum: ["online", "cash", "both"],
      required: true,
    },
    payWith: {
      type: {
        type: String,
        enum: ["creditcard", "applepay", "stcpay", "tabby", "none"],
        // required: true,
        default: "none",
      },
      source: {
        type: Object,
      },
    },
    onlineItems: {
      items: [
        {
          product: {
            type: Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            // required: true,
          },
          totalPriceWithoutShipping: {
            type: Number,
            // required: true,
          },
          totalPrice: {
            type: Number,
            // required: true,
          },
          properties: {
            type: [
              {
                key_ar: { type: String, required: true },
                key_en: { type: String, required: true },
                value_ar: { type: String, required: true },
                value_en: { type: String, required: true },
              },
            ],
            required: false,
            default: [],
          },
          // repositories: [
          //   {
          //     repository: { type: Types.ObjectId, ref: "Repository"},
          //     quantity: { type: Number },
          //   },
          // ],
        },
      ],
      quantity: {
        type: Number,
        // required: true,
      },
      totalPrice: {
        type: Number,
        // required: true,
      },
    },
    cashItems: {
      items: [
        {
          product: {
            type: Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            // required: true,
          },
          totalPriceWithoutShipping: {
            type: Number,
            // required: true,
          },
          totalPrice: {
            type: Number,
            // required: true,
          },
          properties: {
            type: [
              {
                key_ar: { type: String, required: true },
                key_en: { type: String, required: true },
                value_ar: { type: String, required: true },
                value_en: { type: String, required: true },
              },
            ],
            required: false,
            default: [],
          },
          // repositories: [
          //   {
          //     repository: { type: Types.ObjectId, ref: "Repository"},
          //     quantity: { type: Number },
          //   },
          // ],
        },
      ],
      quantity: {
        type: Number,
        // required: true,
      },
      totalPrice: {
        type: Number,
        // required: true,
      },
    },
    ordersShipping: [
      {
        shippingId: {
          type: String,
        },
        repoId: {
          type: Types.ObjectId,
          ref: "Repository",
        },
        products: [
          {
            type: Types.ObjectId,
            ref: "Product",
          },
        ],
        status: {
          type: String,
          enum: Object.values(StatusOrder),
          default: StatusOrder.pending,
        },
      },
    ],
    name: {
      type: String,
    },
    area: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
      default: "SA",
    },
    postalCode: {
      type: String,
    },
    Longitude: {
      type: String,
      default: "29.888211",
    },
    Latitude: {
      type: String,
      default: "40.706333",
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    // timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Order = model<IOrder>("Order", orderSchema);
