import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { Coupon } from "../models/coupon.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { Product } from "../models/product.model";
import { IProduct } from "../interfaces/product/product.interface";
import { Status } from "../interfaces/status/status.enum";

// @desc    Get All Marketers
// @route   GET /api/v1/marketers
// @access  Private/Admin
export const getAllMarketers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const marketers = await User.find({ role: "marketer" }).populate(
      "couponMarketer"
    );
    if (!marketers) {
      return next(
        new ApiError(
          {
            en: "Marketers Not Found",
            ar: "المسوقين غير موجودين",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // send response
    res.status(StatusCodes.OK).json({
      status: "success",
      results: marketers.length,
      data: {
        marketers,
      },
      success_en: "Get All Items Successfully",
      success_ar: "تم الحصول على جميع العناصر بنجاح",
    });
  }
);

// @desc    Get One Marketer By Id
// @route   GET /api/v1/marketers/:id
// @access  Private/Admin
export const getOneMarketer = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const marketer = await User.findOne({
      _id: req.params.id,
      role: "marketer",
    }).populate("couponMarketer");
    if (!marketer) {
      return next(
        new ApiError(
          {
            en: "Marketer Not Found",
            ar: "المسوق غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: {
        marketer,
      },
      success_en: "Get Item Successfully",
      success_ar: "تم الحصول على العنصر بنجاح",
    });
  }
);

// @desc    Create Marketer
// @route   POST /api/v1/marketers
// @access  Private/Admin
export const createMarketer = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- check if coupon code is already exist
    let email = req.body.email.toLowerCase();
    const existCoupon = await Coupon.findOne({ code: req.body.code });
    if (existCoupon) {
      return next(
        new ApiError(
          {
            en: "Coupon Code Already Exist",
            ar: "كود الكوبون موجود بالفعل",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 2- check if email or phone is already exist
    const existEmail = await User.findOne({ email: email });
    if (existEmail) {
      return next(
        new ApiError(
          {
            en: "Email Already Used",
            ar: "البريد الالكتروني مستخدم بالفعل",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- check if email or phone is already exist
    const existPhone = await User.findOne({ phone: req.body.phone });
    if (existPhone) {
      return next(
        new ApiError(
          {
            en: "Phone Already Used",
            ar: "رقم الهاتف مستخدم بالفعل",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 4- check if coupon with same code is exist
    let products: any = [];
    switch (req.body.discountDepartment.key) {
      case "allProducts":
        products = await Product.find({});
        break;
      case "products":
        products = req.body.discountDepartment.value;
        break;
      case "categories":
        products = await Product.find({
          category: [...req.body.discountDepartment.value],
        });
        break;
      case "subcategories":
        products = await Product.find({
          subCategory: [...req.body.discountDepartment.value],
        });
        break;
      default:
        break;
    }

    // 5- collect all products ids that coupon can be used on
    let productsCouponsIds: any = [];
    if (req.body.discountDepartment.key !== "products") {
      productsCouponsIds = products.map((product: IProduct) => {
        return product._id.toString();
      });
    } else {
      productsCouponsIds = products;
    }

    // 6- create coupon
    const coupon = await Coupon.create({
      type: "marketing",
      code: req.body.code,
      discount: req.body.discount,
      commissionMarketer: req.body.commissionMarketer,
      discountDepartment: req.body.discountDepartment,
      products: productsCouponsIds,
    });
    if (!coupon) {
      return next(
        new ApiError(
          {
            en: "Coupon Not Created",
            ar: "الكوبون لم يتم انشائه",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 7- create marketer

    const user = await User.create({
      name: req.body.name,
      email: email,
      phone: req.body.phone,
      password: req.body.password,
      role: "marketer",
      couponMarketer: coupon._id,
    });
    if (!user) {
      return next(
        new ApiError(
          {
            en: "Marketer Not Created",
            ar: "المسوق لم يتم انشائه",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 8- send response
    res.status(StatusCodes.CREATED).json({
      status: Status.SUCCESS,
      data: {
        user,
        coupon,
      },
      success_en: "created successfully",
      success_ar: "تم الانشاء بنجاح",
    });
  }
);

// @desc    Update Marketer
// @route   PUT /api/v1/marketers/:id
// @access  Private/Admin
export const updateMarketer = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- check if marketer is exist
    let email = req.body.email.toLowerCase();
    const marketer = await User.findById(req.params.id);
    if (!marketer) {
      return next(
        new ApiError(
          {
            en: "Marketer Not Found",
            ar: "المسوق غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 2- check if coupon is exist
    const coupon = await Coupon.findById(marketer.couponMarketer);
    if (!coupon) {
      return next(
        new ApiError(
          {
            en: "Coupon Not Found",
            ar: "الكوبون غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- check if coupon code is already exist
    const existCoupon = await Coupon.findOne({
      code: req.body.code,
      _id: { $ne: coupon._id },
    });
    if (existCoupon) {
      return next(
        new ApiError(
          {
            en: "Coupon Code Already Exist",
            ar: "كود الكوبون موجود بالفعل",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 4- check if email is already exist
    if (req.body.email !== "") {
      const existEmail = await User.findOne({
        email: email,
        _id: { $ne: marketer._id },
      });
      if (existEmail) {
        return next(
          new ApiError(
            {
              en: "Email Already Used",
              ar: "البريد الالكتروني مستخدم بالفعل",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }
    }

    // 5- check if phone is already exist
    if (req.body.phone !== "") {
      const existPhone = await User.findOne({
        phone: req.body.phone,
        _id: { $ne: marketer._id },
      });
      if (existPhone) {
        return next(
          new ApiError(
            {
              en: "Phone Already Used",
              ar: "رقم الهاتف مستخدم بالفعل",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }
    }

    // 6- update marketer
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: email,
        phone: req.body.phone,
        password: req.body.password,
      },
      { new: true }
    );
    if (!user) {
      return next(
        new ApiError(
          {
            en: "Marketer Not Updated",
            ar: "المسوق لم يتم تعديله",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 7- check if coupon with same code is exist
    let products: any = [];
    switch (req.body.discountDepartment.key) {
      case "allProducts":
        products = await Product.find({});
        break;
      case "products":
        products = req.body.discountDepartment.value;
        break;
      case "categories":
        products = await Product.find({
          category: [...req.body.discountDepartment.value],
        });
        break;
      case "subcategories":
        products = await Product.find({
          subCategory: [...req.body.discountDepartment.value],
        });
        break;
      default:
        break;
    }

    // 8- collect all products ids that coupon can be used on
    let productsCouponsIds: any = [];
    if (req.body.discountDepartment.key !== "products") {
      productsCouponsIds = products.map((product: IProduct) => {
        return product._id.toString();
      });
    } else {
      productsCouponsIds = products;
    }

    // 9- update coupon
    const couponUpdate = await Coupon.findByIdAndUpdate(
      { _id: marketer.couponMarketer?.toString() },
      {
        code: req.body.code,
        discount: req.body.discount,
        commissionMarketer: req.body.commissionMarketer,
        discountDepartment: req.body.discountDepartment,
        products: productsCouponsIds,
      },
      { new: true }
    );

    if (!couponUpdate) {
      return next(
        new ApiError(
          {
            en: "Coupon Not Updated",
            ar: "الكوبون لم يتم تعديله",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 10- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: {
        user,
      },
      success_en: "updated successfully",
      success_ar: "تم التعديل بنجاح",
    });
  }
);

// @desc    Delete Marketer
// @route   DELETE /api/v1/marketers/:id
// @access  Private/Admin
export const deleteMarketer = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const marketer = await User.findById(req.params.id);
    if (!marketer) {
      return next(
        new ApiError(
          {
            en: "Marketer Not Found",
            ar: "المسوق غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // delete marketer
    await User.findByIdAndDelete(req.params.id);

    // delete coupon
    await Coupon.findByIdAndDelete(marketer.couponMarketer);

    // send response
    res.status(StatusCodes.OK).json({
      status: "success",
      success_en: "Marketer Deleted Successfully",
      success_ar: "تم حذف المسوق بنجاح",
    });
  }
);
