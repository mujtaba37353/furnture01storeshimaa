import { Types } from "mongoose";
import { IProduct } from "../product/product.interface";
import IUser from "../user/user.interface";

export interface ICart extends Document {
  user: IUser["_id"] | IUser;
  isPointsUsed:boolean,
  isFreezed:boolean,
  cartItems: [
    {
      product: IProduct["_id"] | IProduct;
      quantity: number;
      singlePrice: number;
      paymentType: "online" | "cash",
      totalWithoutShipping: number;
      totalShipping: number;
      total: number;
      properties?: [
        {
          key_en: string;
          key_ar: string;
          value_en: string;
          value_ar: string;
        }
      ];
    }
  ];
  coupon?: {
    couponReference: Types.ObjectId;
    used: boolean;
    commissionMarketer: number;
  };
  totalCartPriceWithoutShipping: number;
  totalCartPrice: number;
  totalUsedFromPoints: number;
}
