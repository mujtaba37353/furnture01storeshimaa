import { Document, Types } from "mongoose";
import { IProduct } from "../product/product.interface";
import IUser from "../user/user.interface";

export enum StatusOrder {
  initiated = "initiated",
  created = "created",
  pending = "pending",
  awaiting_pickup = "awaiting_pickup",
  currently_shipping = "currently_shipping",
  shipment_on_hold = "shipment_on_hold",
  delivered = "delivered",
  canceled = "canceled",
  returned = "returned",
}

export interface IOrder extends Document {
  user: IUser["_id"] | IUser;
  cartId: string;
  invoiceId?: string;
  paymentStatus: "payment_not_paid" | "payment_paid" | "payment_failed";
  totalPrice: number;
  totalQuantity: number;
  city: string;
  phone: string;
  active: boolean;
  tracking?: { path: string; orderNumberTracking: string }[];
  status: StatusOrder;
  name: string;
  area: string;
  address: string;
  country: string;
  postalCode: string;
  Longitude: string;
  Latitude: string;
  orderNotes?: string;
  email?: string;
  verificationCode: string;
  isVerified: boolean;
  verificationCodeExpiresAt: number; // 1 hour
  paymentType: "online" | "cash" | "both";
  sendToDelivery: boolean;
  payWith: {
    type: "creditcard" | "applepay" | "stcpay"| "tabby" | "none";
    source?: {
      type: string;
      company: string;
      name: string;
      number: string;
      gateway_id: string;
      reference_number: string | null;
      token: string | null;
      message: string | null;
      transaction_url: string;
    } & (
      | ({
          type: "creditcard";
        } & {
          company: string;
          name: string;
          number: string;
          message?: string;
          reference_number?: string;
        })
      | ({
          type: "applepay";
        } & {
          transaction: {};
        })
      | ({
          type: "stcpay";
        } & {
          transaction: {};
        })
    );
  };
  onlineItems: {
    items: {
      product: IProduct["_id"] | IProduct;
      quantity: number;
      totalPriceWithoutShipping: number;
      totalPrice: number;
      properties?: {
        key_en: string;
        key_ar: string;
        value_en: string;
        value_ar: string;
      }[];
      repositories: [
        {
          repository: Types.ObjectId;
          quantity: number;
        }
      ];
    }[];
    quantity: number;
    totalPrice: number;
  };
  cashItems: {
    items: {
      product: IProduct["_id"] | IProduct;
      quantity: number;
      totalPriceWithoutShipping: number;
      totalPrice: number;
      properties?: {
        key_en: string;
        key_ar: string;
        value_en: string;
        value_ar: string;
      }[];
      repositories: [
        {
          repository: Types.ObjectId;
          quantity: number;
        }
      ];
    }[];
    quantity: number;
    totalPrice: number;
    active: boolean;
  };
  ordersShipping: [
    {
      shippingId: String;
      repoId: Types.ObjectId;
      products: [Types.ObjectId];
      status: StatusOrder;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

export const IOrderStatus = {
  assignedToWarehouse: "pending",
  shipmentCanceled: "pending",
  branchAssigned: "pending ",
  new: "pending",
  pickupFromStore: "pending",
  addressConfirmed: "pending",
  latlonProcessStarted: "pending",
  waitingAddressConfirmation: "pending",
  cannotAssignToBranch: "pending",
  waitingAssignment: "pending",
  cannotAssign: "pending",
  interDepotTransfer: "pending",
  needConfirmation: "pending",
  paymentTypeConfirmed: "pending",
  codOrderConfirmed: "pending",
  /***************************/
  searchingDriver: "awaiting_pickup",
  goingToPickup: "awaiting_pickup",
  reverseGoingToPickup: "awaiting_pickup",
  arrivedPickup: "awaiting_pickup",
  shipmentCreated: "awaiting_pickup",
  readyForCollection: "awaiting_pickup",
  returnShipmentProcessing: "awaiting_pickup",
  reverseShipmentCreated: "awaiting_pickup",
  /****************************/
  outForDelivery: "currently_shipping",
  arrivedDestinationTerminal: "currently_shipping",
  arrivedOriginTerminal: "currently_shipping",
  pickedUp: "currently_shipping",
  arrivedDestination: "currently_shipping",
  shipmentInProgress: "currently_shipping",
  inTransit: "currently_shipping",
  returnProcessing: "currently_shipping",
  undeliveredAttempt: "currently_shipping",
  reverseOutForDelivery: "currently_shipping",
  reversePickedUp: "currently_shipping",
  /****************************/
  shipmentOnHoldWarehouse: "shipment_on_hold",
  shipmentOnHoldToCancel: "shipment_on_hold",
  shipmentOnHold: "shipment_on_hold",
  /***************************/
  delivered: "delivered",
  /***************************/
  canceled: "canceled",
  /***************************/
  returned: "returned",
  confirmedReturn: "returned",
  reverseReturned: "returned",
  reverseConfirmReturn: "returned",
};

export const statusMapping: Record<string, StatusOrder> = {
  "pending": StatusOrder.pending,
  "awaiting_pickup": StatusOrder.awaiting_pickup,
  "currently_shipping": StatusOrder.currently_shipping,
  "shipment_on_hold": StatusOrder.shipment_on_hold,
  "delivered": StatusOrder.delivered,
  "canceled": StatusOrder.canceled,
  "returned": StatusOrder.returned
};