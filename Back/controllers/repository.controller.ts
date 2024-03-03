import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Repository } from "../models/repository.model";

import { IQuery } from "../interfaces/factory/factory.interface";
import { Status } from "../interfaces/status/status.enum";

import ApiError from "../utils/ApiError";
import { ApiFeatures } from "../utils/ApiFeatures";
import OTOShipping from "../utils/OTOShipping";

// @desc    Get All Repositories
// @route   POST /api/v1/repositories
// @access  Private (Admin)
export const getAllRepositories = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as IQuery;

    const Repositories = Repository.find({ active: true });

    const { data, paginationResult } = await new ApiFeatures(
      Repositories,
      query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .populate()
      .paginate();

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      results: data.length,
      paginationResult,
      data,
      success_en: "Found Successfully",
      success_ar: "تم العثور بنجاح",
    });
  }
);

// @desc    Get Specific Repository By Id
// @route   Get /api/v1/repositories/:id
// @access  Private (Admin)
export const getRepositoryById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const repository = await Repository.find({
      _id: req.params.id,
      active: true,
    });

    if (!repository) {
      return next(
        new ApiError(
          {
            en: "Not Found",
            ar: "لا يوجد اي نتيجة",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      repository,
      success_en: "Found Successfully",
      success_ar: "تم العثور بنجاح",
    });
  }
);

// @desc    Create a new repository
// @route   POST /api/v1/repositories
// @access  Private (Admin)
export const createRepository = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from body
    const date = new Date().getTime();

    // 2- generate code
    req.body.code = `code-${date}`;
    !req.body.type ? (req.body.type = "branch") : req.body.type;

    // 4- create the warehouse in the OTO
    const OTO = new OTOShipping();
    let repoId: string = "";
    try {
      const repo = await OTO.createPickupLocation({
        type: req.body.type,
        name_en: req.body.name_en,
        code: req.body.code,
        mobile: req.body.mobile,
        city: req.body.city,
        country: req.body.country,
        address: req.body.address,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
      });

      repoId = req.body.type === "branch" ? repo.branchId : repo.warhouseId;
    } catch (err) {
      throw err;
    }

    // 3- create a new repository
    const repository = await Repository.create({ ...req.body, repoId });

    // 5- send response
    res.status(StatusCodes.CREATED).json({
      status: Status.SUCCESS,
      data: repository,
      success_en: "Repository created successfully",
      success_ar: "تم إنشاء المستودع بنجاح",
    });
  }
);

// @desc    Adding the repository in OTO
// @route   POST /api/v1/repositories
// @access  Private (Admin)
export const addingRepositoryToOTO = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = await Repository.findById(id);

    if (!repository) {
      return next(
        new ApiError(
          {
            en: "Not Found",
            ar: "لا يوجد اي نتيجة",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    if (repository.repoId) {
      return next(
        new ApiError(
          {
            en: "Repository already exists in OTO",
            ar: "المستودع موجود بالفعل في OTO",
          },
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const OTO = new OTOShipping();
    try {
      const repo = await OTO.createPickupLocation({
        type: repository.type,
        name_en: repository.name_en,
        code: repository.code,
        mobile: repository.mobile,
        city: repository.city,
        country: repository.country,
        address: repository.address,
        contactName: repository.contactName,
        contactEmail: repository.contactEmail,
      });

      const repoId =
        repository.type === "branch" ? repo.branchId : repo.warhouseId;

      await Repository.findByIdAndUpdate(id, { repoId: repoId }, { new: true });
    } catch (err) {
      throw err;
    }

    res.status(StatusCodes.CREATED).json({
      status: Status.SUCCESS,
      success_en: "Repository created successfully In OTO",
      success_ar: "تم إنشاء المستودع بنجاح في OTO",
    });
  }
);

// @desc    Update Repository By Id
// @route   PUT /api/v1/repositories/:id
// @access  Private (Admin)
export const updateRepository = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from params
    const { id } = req.params;

    // 2- check if the repository exists
    const repo = await Repository.findById(id);
    if (!repo) {
      return next(
        new ApiError(
          {
            en: "Repository not found",
            ar: "المستودع غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- create the warehouse in the OTO
    const OTO = new OTOShipping();
    try {
      await OTO.updatePickupLocation({
        type: repo.type,
        code: repo.code,
        name_en: req.body.name_en,
        mobile: req.body.mobile,
        city: req.body.city,
        country: req.body.country,
        address: req.body.address,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
      });
    } catch (err) {
      throw err;
    }

    // 2- Find the repository and update that
    const repository = await Repository.findByIdAndUpdate(
      id,
      {
        name_en: req.body.name_en,
        name_ar: req.body.name_ar,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        mobile: req.body.mobile,
        contactEmail: req.body.contactEmail,
        contactName: req.body.contactName,
      },
      { new: true }
    );

    if (!repository) {
      return next(
        new ApiError(
          {
            en: "Repository not found",
            ar: "المستودع غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 4- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: repository,
      success_en: "Repository updated successfully",
      success_ar: "تم تحديث المستودع بنجاح",
    });
  }
);

// @desc    DELETE Repository By Id
// @route   DELETE /api/v1/repositories/:id
// @access  Private (Admin)
export const deleteRepository = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from params
    const { id } = req.params;

    // TODO check if exist product first
    // 2- find the repository and check if contains on products
    const repository = await Repository.findById(id);
    if (!repository) {
      return next(
        new ApiError(
          {
            en: "Repository not found",
            ar: "المستودع غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    const productCount = await Product.countDocuments({
      repositoryId: Object(req.params.id),
    });
    console.log(productCount);

    if (productCount > 0) {
      return next(
        new ApiError(
          {
            en: "this repository can't be deleted because it has products",
            ar: "لا يمكن حذف هذا المستودع لأنه يحتوي على منتجات",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 2- Find the repository to be deleted
    await Repository.findByIdAndUpdate(id, { active: false }, { new: true });

    // 3- Delete the repository
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Repository deleted successfully",
      success_ar: "تم حذف المستودع بنجاح",
    });
  }
);

// @desc    GET All Repositories For All Products
// @route   DELETE /api/v1/repositories/getAllRepositoriesForAllProducts
// @access  Private (Admin)
export const getAllRepositoriesForAllProducts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id for order from params
    const { id } = req.params;

    // 2- find order by id
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

    // 3- collect all ids of products from cash and online items
    let products: string[] = [];
    order.onlineItems.items.forEach((item: any) => {
      products.push(item.product.toString());
    });
    order.cashItems.items.forEach((item: any) => {
      products.push(item.product.toString());
    });

    // 4- find all products by id
    const productsDetails = await Product.find({ _id: { $in: products } });

    // 5- collect all repositories ids
    const groupedProducts = productsDetails.reduce(
      (result: Record<string, (typeof product)[]>, product) => {
        const { repositoryId } = product;
        const repoIdStr = String(repositoryId);

        // Create an array for the repoId if it doesn't exist
        if (!result[repoIdStr]) {
          result[repoIdStr] = [];
        }

        // Add the product to the array corresponding to its repoId
        result[repoIdStr].push(product);

        return result;
      },
      {}
    );

    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: groupedProducts,
      success_en: "Repositories retrieved successfully",
      success_ar: "تم استرجاع المستودعات بنجاح",
    });
  }
);
