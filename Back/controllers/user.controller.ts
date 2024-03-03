import expressAsyncHandler from "express-async-handler";
import { User } from "../models/user.model";
import { Role } from "../interfaces/user/user.interface";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { Status } from "../interfaces/status/status.enum";
import { IQuery } from "../interfaces/factory/factory.interface";
import { ApiFeatures } from "../utils/ApiFeatures";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import geoip from "geoip-lite";
import path from "path";

// @desc     Get All Users
// @route    GET/api/v1/users
// @access   Private (Root) TODO: add the rest of the roles
export const getAllUsers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //  1- find all data
    const query = req.query as IQuery;
    const mongoQuery = User.find({ role: "user", active: true }).select(
      "-password"
    );

    // 2- create pagination
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

    // 3- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      results: data.length,
      paginationResult,
      data: data,
      success_en: "found successfully",
      success_ar: "تم العثور بنجاح",
    });
  }
);

// @desc     Get All Users
// @route    GET/api/v1/users/getAllAdmins
// @access   Private
export const getAllAdmins = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //  1- find all data
    const query = req.query as IQuery;
    const users = User.find({
      role: {
        $in: [Role.AdminA, Role.AdminB, Role.AdminC, Role.SubAdmin],
      },
      active: true,
    }).select("-password");

    // 2- create pagination
    const { data, paginationResult } = await new ApiFeatures(users, query)
      .populate()
      .filter()
      .limitFields()
      .search()
      .sort()
      .paginate();

    // 5- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      results: data.length,
      paginationResult,
      data: data,
      success_en: "found successfully",
      success_ar: "تم العثور بنجاح",
    });
  }
);

// @desc     Get User By Id
// @route    GET/api/v1/users/:id
// @access   Private (Root) TODO: add the rest of the roles
export const getUserById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findOne({
      _id: id,
      role: {
        $ne: Role.RootAdmin,
      },
      active: true,
    }).select("-password -changePasswordAt");

    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: user,
      success_en: "User found successfully",
      success_ar: "تم العثور على المستخدم بنجاح",
    });
  }
);

// @desc     Update Logged User
// @route    PUT/api/v1/users/:id
// @access   Private (Logged)
export const updateLoggedUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) check on password
    if (req.body.password)
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
    else if (!req.body.password) delete req.body.password;

    // 2) check on email
    if (req.body.email && !(req.user! as any).email) {
      const userExists = await User.findOne({
        email: req.body.email.toLowerCase(),
      });
      if (userExists) {
        return next(
          new ApiError(
            {
              en: "This email used in another account",
              ar: "هذا البريد الإلكتروني مستخدم في حساب آخر",
            },
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    // 3) check on phone
    if (req.body.phone && !(req.user! as any).phone) {
      const userExists = await User.findOne({
        phone: req.body.phone,
      });
      if (userExists) {
        return next(
          new ApiError(
            {
              en: "This phone used in another account",
              ar: "هذا الهاتف مستخدم في حساب آخر",
            },
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    const user = await User.findOneAndUpdate(
      { _id: (req.user! as any)._id },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: user,
      success_en: "User updated successfully",
      success_ar: "تم تحديث المستخدم بنجاح",
    });
  }
);

// @desc     add admin with role
// @route    POST/api/v1/users/addAdmin
// @access   Private (Root)
export const addAdmin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get all data from body
    const { name, email, phone, password, role } = req.body;

    // 2- check if user exists
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
      active: true,
    });
    if (userExists) {
      return next(
        new ApiError(
          {
            en: "User already exists",
            ar: "المستخدم موجود بالفعل",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // 3- create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,
    });

    // 4- send response
    const { password: pass, changePasswordAt, ...rest } = user.toObject();
    res.status(StatusCodes.CREATED).json({
      status: Status.SUCCESS,
      data: {
        ...rest,
      },
      success_en: "Admin added successfully",
      success_ar: "تم إضافة المشرف بنجاح",
    });
  }
);

// @desc     Add Role To User
// @route    PUT/api/v1/users/:id/addRole
// @access   Private (Root)
export const addRole = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role } = req.body;

    if (role === Role.RootAdmin) {
      return next(
        new ApiError(
          {
            en: "You can't add RootAdmin role",
            ar: "لا يمكنك إضافة دور RootAdmin",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const user = await User.findOne({
      _id: id,
      role: {
        $ne: Role.RootAdmin,
      },
      active: true,
    });

    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    user.role = role;
    await user.save();

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: user,
      success_en: "Role added successfully",
      success_ar: "تم إضافة الدور بنجاح",
    });
  }
);

// @desc     Delete User By Id
// @route    DELETE/api/v1/users/:id
// @access   Private (Root) TODO: add the rest of the roles
export const deleteUserById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const loggedRole = (req.user! as any).role;
    const wantDelete = await User.findById({ _id: id });
    if (wantDelete?.role === "adminA" && loggedRole === "adminB") {
      return next(
        new ApiError(
          {
            en: "You can't delete this user",
            ar: "لا يمكنك حذف هذا المستخدم",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    // const user = await User.findOneAndDelete({
    //   _id: id,
    //   role: {
    //     $ne: Role.RootAdmin,
    //   },
    // });
    // const user = await User.findOneAndUpdate(
    //   {
    //     _id: id,
    //     role: {
    //       $ne: Role.RootAdmin,
    //     },
    //   },
    //   { 
    //     active: false,
    //    }
    // );

    // if (!user) {
    //   return next(
    //     new ApiError(
    //       { en: "User not found", ar: "المستخدم غير موجود" },
    //       StatusCodes.NOT_FOUND
    //     )
    //   );
    // }

    // res.status(StatusCodes.OK).json({
    //   status: Status.SUCCESS,
    //   data: null,
    //   success_en: "User deleted successfully",
    //   success_ar: "تم حذف المستخدم بنجاح",
    // });

    User.findOne({
      _id: id,
      role: {$ne: Role.RootAdmin},
    })
    .then((user) => {
      if (user) {
        user.phone = `${user.phone}-${Date.now()}`;
        user.email = `${user.email}-${Date.now()}`;
        user.active = false;
        return user.save();
      }
    })
    .then(() => {
      // User has been updated
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        success_en: "User deleted successfully",
        success_ar: "تم حذف المستخدم بنجاح",
      });
    })
    .catch((err) => {
      // Handle error
      return next(
        new ApiError(
          { 
            en: "Error updating user", 
            ar: "خطأ في تحديث المستخدم" 
          },
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    });

  }
);

// @desc     Get Logged User
// @route    GET/api/v1/users/me
// @access   Private (User/Admins)
export const getLoggedUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ _id: (req.user! as any)._id }).populate([
      {
        path: "pointsMarketer.order",
        model: "Order",
        select:
          "onlineItems cashItems totalPrice totalQuantity name email phone",
      },
    ]);
    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }
    //   const clientIP =
    //   (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);
    //   const ip =clientIP.split(',')[0];
    //  const clientIpData = geoip.lookup(ip);
    //  //const clientCountry = getCountryFromIP(clientIP);
    //  if (!clientIpData) {
    //   return next(
    //     new ApiError(
    //       { en: "clientIpData not found", ar: "بلد المستخدم غير موجودة" },
    //       StatusCodes.NOT_FOUND
    //     )
    //   );
    //   }
    //   console.log('Client Ip Data:', clientIpData);

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      // ip:" "+ clientIP + " ",
      // clientCountry:clientIpData?.country ||"not found",
      data: user,
      success_en: "User found successfully",
      success_ar: "تم العثور على المستخدم بنجاح",
    });
  }
);

// @desc     Get All Addresses For Logged User
// @route    GET/api/v1/users/getAllAddressesForLoggedUser
// @access   Private (User/Admins)
export const getAllAddressesForLoggedUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const addresses = await User.findById((req!.user! as any)._id);
    if (!addresses) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    if (addresses.addressesList.length < 1) {
      return next(
        new ApiError(
          { en: "Addresses not found", ar: "العناوين غير موجودة" },
          StatusCodes.NOT_FOUND
        )
      );
    }
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: addresses.addressesList,
      success_en: "User found successfully",
      success_ar: "تم العثور على المستخدم بنجاح",
    });
  }
);

// @desc     Delete Address For Logged User By Id
// @route    DELETE/api/v1/users/deleteAddressForLoggedUser/:id
// @access   Private (User/Admins)
export const deleteAddressForLoggedUserById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: (req.user! as any)._id },
      {
        $pull: { addressesList: { _id: id } },
      },
      { new: true }
    );

    if (!user) {
      return next(
        new ApiError(
          { en: "User not found", ar: "المستخدم غير موجود" },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Address Delete Successfully",
      success_ar: "تم حذف العنوان بنجاح",
    });
  }
);

// @desc     Delete User By Id
// @route    DELETE/api/v1/users/deleteMany
// @access   Private (Root) TODO: add the rest of the roles
export const deleteGroupOfUsersById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ids } = req.body;
    // const user = await User.deleteMany({
    //   _id: ids,
    //   role: {
    //     $ne: Role.RootAdmin,
    //   },
    // });

    // const user = await User.updateMany(
    //   {
    //     _id: { $in: ids },
    //     role: Role.USER,
    //   },
    //   {
    //     $set: {
    //       active: false
    //     }
    //   }
    // );

    // if (!user) {
    //   return next(
    //     new ApiError(
    //       { en: "User not found", ar: "المستخدم غير موجود" },
    //       StatusCodes.NOT_FOUND
    //     )
    //   );
    // }
    const promises = ids.map(async (id: string) => {
      return await User.findOne({
        _id: id,
        role: Role.USER,
      }).then((user) => {
        if (user) {
          user.phone = `${user.phone}-${Date.now()}`;
          user.email = `${user.email}-${Date.now()}`;
          user.active = false;
          return user.save();
        }
      });
    });

    Promise.all(promises)
      .then(() => {
        // All users have been updated
        res.status(StatusCodes.OK).json({
          status: Status.SUCCESS,
          success_en: "Users deleted successfully",
          success_ar: "تم حذف المستخدمين بنجاح",
        });
      })
      .catch((err) => {
        // Handle error
        return next(
          new ApiError(
            { en: "Error updating users", ar: "خطأ في تحديث المستخدمين" },
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        );
      });
  }
);
