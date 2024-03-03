//@ts-nocheck
import { NextFunction, Request, Response } from "express";
import PointsManagement, {
  IPointsManagement,
} from "../models/pointsManagement";
import axios from "axios";
import { User } from "../models/user.model";
import expressAsyncHandler from "express-async-handler";
import { ICart } from "../interfaces/cart/cart.interface";
import IUser from "../interfaces/user/user.interface";
import { Cart } from "../models/cart.model";
import { StaticPoints } from "../models/staticPointRequest.model";
import { IOrder } from "../interfaces/order/order.interface";
import { Order } from "../models/order.model";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { Status } from "../interfaces/status/status.enum";

export const getAllPointsManagements = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pointsMangement = await PointsManagement.findOne();
    if (!pointsMangement) {
      // const points = await User.find({ email: { $regex: "user" } })
      return next(
        new ApiError(
          {
            en: `Points Not Found`,
            ar: `لا يوجد  اي نقاط`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
  
    res.status(StatusCodes.CREATED).json({
      status: Status.SUCCESS,
      data: pointsMangement,
      success_en: "Points Retrieve Successfully",
      success_ar: "استرداد النقاط بنجاح",
    });
  }
)

export const createPointsManagement = async (req: Request, res: Response) => {
  // check if the same given meta is been created before then update it or else create it
  // await InsertAllDumyUsers();
  const PointsManagementExist = await PointsManagement.findOne();

  if (PointsManagementExist) {
    const other = await PointsManagement.findOneAndUpdate(
      {},
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({ data: other });
  } else {
    const newOther = new PointsManagement({ ...req.body });
    await newOther.save();
    return res
      .status(200)
      .send({ message_en: "success", message_ar: "نجاح", data: newOther });
  }
};

export const getPoinst = async (): Promise<IPointsManagement | null> => {
  let pointsManagement;
  // get the
  if (!pointsManagement) {
    pointsManagement = await PointsManagement.findOne({});
    // return pointsManagement;
  }

  return pointsManagement;
};

export const processUserPointAndTurnintoCurrency = (
  userPoints: number,
  totalPointConversionForOneUnit: number
) => {
  const THE_TOTAL_MONEY_GRANTED = Math.floor(
    userPoints / totalPointConversionForOneUnit
  );
  return THE_TOTAL_MONEY_GRANTED;
};
// TODO: Check this logic
const assure_order_is_not_100Percent_free = (
  total_money_deducted,
  totalCartPriceWithoutShipping
) => {
  // it should not be calculated in all cases only if the order would be granted For free
  // so i think i should have also the value of
  const THE_AMOUNT_THAT_IS_NOT_FREE = 0.2;
  const THE_TOTAL_AFTER_DEDUCTION = Math.abs(
    total_money_deducted - total_money_deducted * THE_AMOUNT_THAT_IS_NOT_FREE
  );
  const temp =
    total_money_deducted == totalCartPriceWithoutShipping
      ? Math.floor(THE_TOTAL_AFTER_DEDUCTION)
      : Math.floor(total_money_deducted);
  return Number(temp);
};

const dynamicallyApplyPointsForSpecificUser = async (
  user: IUser,
  pointsManagement: IPointsManagement
) => {
  let isDone = false;
  const userCart = await Cart.findOne({ user: user?._id }).sort("-createdAt");
  if (userCart?.isPointsUsed) {
    // TODO: Refactor this error message to use ApiError
    throw new Error(
      JSON.stringify({
        error_en: "You Cant Make more than one Request Per Order",
        error_ar: "لا يمكنك تقديم أكثر من طلب واحد لكل طلب",
      })
    );
  }

  const { max, totalPointConversionForOneUnit } = pointsManagement;
  let tempTotalDedeuctionInCurrency: number;
  let tempTotalDeductionInPoints: number;

  tempTotalDedeuctionInCurrency = processUserPointAndTurnintoCurrency(
    Math.min(user?.points, max),
    totalPointConversionForOneUnit
  );
  tempTotalDeductionInPoints = Math.floor(
    Math.abs(user?.points - Math.min(user?.points, max))
  );

  const no_free_perncentage = assure_order_is_not_100Percent_free(
    tempTotalDedeuctionInCurrency,
    userCart?.totalCartPriceWithoutShipping
  );
  if (tempTotalDedeuctionInCurrency >= userCart?.totalCartPriceWithoutShipping) {
    throw new Error(
      JSON.stringify({
        error_en: "This Order is To Low to Request Points For",
        error_ar: "هذا الطلب منخفض جدًا لطلب النقاط.",
      })
    );
  }
  if (userCart?.totalCartPriceWithoutShipping - no_free_perncentage <= 0)
    throw new Error(
      JSON.stringify({
        error_en: "This Order is To Low to Request Points For",
        error_ar: "هذا الطلب منخفض جدًا لطلب النقاط.",
      })
    );

  Cart.findByIdAndUpdate(
    userCart?._id,
    {
      // $inc: { totalCartPriceWithoutShipping: -no_free_perncentage },
      $set: { isPointsUsed: true },
      totalUsedFromPoints: no_free_perncentage,
    },
    { new: true }
  )
    .then((res) => {
      console.log(`the Cart Should Be Updated: why is not updated: `.bgCyan);
      User.findByIdAndUpdate(
        user?._id,
        { $set: { points: tempTotalDeductionInPoints } },
        { new: true }
      ).then((data) => {
        isDone = true;
      });
    })
    .catch((e) => {
      isDone = false;
      console.log(`What is the CArt PRobolem: `.bgRed, e.message);
    });

  return isDone;
};

const staticallyApplyPointsForSpecificUser = async (
  user: IUser,
  pointsManagement: IPointsManagement
) => {
  // this will make call the other Route that we have
  const userCart = await Cart.findOne({ user: user?._id }).sort("-createdAt");

  const { totalPointConversionForOneUnit, max } = pointsManagement;
  const totalAllowed = processUserPointAndTurnintoCurrency(
    max,
    totalPointConversionForOneUnit
  );
  console.log("what is the total Allowed : ", totalAllowed);
  if (totalAllowed >= userCart?.totalCartPriceWithoutShipping) {
    throw new Error(
      JSON.stringify({
        error_en: "This Order is To Low to Request Points For",
        error_ar: "هذا الطلب منخفض جدًا لطلب النقاط",
      })
    );
  } else {
    const isExist = await StaticPoints.findOne({ name: user?.name });
    if (isExist) {
      // return res.status(400).send({error_en:'You Have Already Sent Request That is not Been Processed'})
      throw new Error(
        JSON.stringify({
          error_en:
            "You Already have sent Request that is been processed Before",
          error_ar: "لقد أرسلت بالفعل طلبًا تم معالجته من قبل",
        })
      );
    }
    const { data } = await axios.post(
      `${process.env.APP_URL}/api/v1/static-point-request`,
      {
        user,
        pointsManagement,
      }
    );
    return data;
  }
};

export const grantUserPointsBasedOnByAdminPermissionOrDynamic = async (
  req: Request,
  res: Response
) => {
  let user: any = req?.user;
  const pointsMangement = await getPoinst();

  if (user?.points < pointsMangement?.min)
    return res.status(400).send({
      error_en: "Dont Have Enough Points",
      error_ar: "لا تملك نقاط كافية لاسترداد هذه القسيمة",
    });
  console.log(
    "What is the type of the point Request: ",
    pointsMangement?.status
  );
  if (pointsMangement?.status == "dynamic") {
    if (user?.points >= pointsMangement.min) {
      dynamicallyApplyPointsForSpecificUser(user, pointsMangement)
        .then((data) => {
          res.status(200).send({
            message_en: "Your Request is been Granted",
            message_ar: "تم قبول طلبك لاستخدام نقاطك",
            data,
          });
        })
        .catch((e) => {
          return res
            .status(400)
            .send(
              JSON.parse(
                e.message ||
                  `{error_en:"Some Thing Went Wrong",error_ar:"حدث خطأ ما"}`
              )
            );
        });
    }
  } else {
    staticallyApplyPointsForSpecificUser(user, pointsMangement)
      .then((data) => {
        return res.status(200).send(JSON.stringify(data));
      })
      .catch((e) => {
        return res.status(400).send(JSON.parse(e.message));
      });
  }
};

// calculate user point from the order i will get the order then i will extract the total price of each product (product_price*quantity) accumulation

export const calculateUserPoints = async (order: IOrder) => {
  // get the points first to calculate how many point the user should have on that order
  const points = await getPoinst();
  console.log(`'What the Order Contains: ',${order}`);
  console.log("What is the point have: ", points);
  console.log(
    "What is the total point on that order: ",
    (Number(points?.noOfPointsInOneUnit) || 0) * order?.totalPrice
  );
  let tempPoints =
    (Number(points?.noOfPointsInOneUnit) || 0) * order?.totalPrice;
  return Math.floor(tempPoints);
};
