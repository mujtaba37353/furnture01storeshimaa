import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { getAllItems, getOneItemById } from "./factory.controller";
import { Brand } from "../models/brand.model";
import ApiError from "../utils/ApiError";
import { createMetaData, deleteMetaData } from "../utils/MetaData";
import { Meta } from "../models/meta.model";
import { Status } from "../interfaces/status/status.enum";
import { Product } from "../models/product.model";
import { IBrand } from "../interfaces/brand/brand.interface";
import { IProduct } from "../interfaces/product/product.interface";
import { IQuery } from "../interfaces/factory/factory.interface";
import { ApiFeatures } from "../utils/ApiFeatures";

// @desc    Get All Brands
// @route   POST /api/v1/brands
// @access  Private (Admin)
export const getAllBrands = getAllItems(Brand);

// @desc     Get All Brands
// @route    GET/api/v1/brands/getAllBrandsWithProducts
// @access   Public
export const getAllBrandsWithProducts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let brand = await Brand.find();

    // Brand => products => [{Brand: ba, products}]

    let result: {
      brand: IBrand;
      products: IProduct[];
    }[] = [];
    await Promise.all(
      brand.map(async (ba) => {
        const mongoQuery = Product.find({ brand: ba._id.toString() });
        const query = req.query as IQuery;


        const { data } = await new ApiFeatures(mongoQuery, query)
          .populate()
          .filter()
          .limitFields()
          .search()
          .sort()
          .paginate();


        // 3- get features
        if (data.length === 0) {
          return
        }
        result.push({
          brand: ba,
          products: data,
        });
      })
    );

    result = result.sort((a, b) =>
      a.products.length < b.products.length ? 1 : -1
    );

    res.status(200).json({
      status: "success",
      data: result,
      success_en: "Successfully",
      success_ar: "تم بنجاح",
    });
  }
);

// @desc    Get Specific Brand By Id
// @route   POST /api/v1/brands/:id
// @access  Private (Admin)
export const getBrandById = getOneItemById(Brand);

// @desc    Create New Brand
// @route   POST /api/v1/brands
// @access  Private (Admin)
export const createBrand = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from body
    const { name_en, name_ar, image } = req.body;

    // 2- check if Brand already exist
    const exist = await Brand.findOne({
      $or: [{ name_en }, { name_ar }],
    });
    if (exist) {
      return next(
        new ApiError(
          {
            en: `this Brand already exist`,
            ar: `هذة العلامة التجارية موجودة بالفعل`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- create Brand inside specific SubCategory in mongooseDB
    const newBrand = await Brand.create({
      name_en,
      name_ar,
      slug_en: name_en.replace(/\s+/g, "_"),
      slug_ar: name_ar.replace(/\s+/g, "_"),
      image,
      title_meta: req.body.title_meta,
      desc_meta: req.body.desc_meta,
    });

    // 4- create MetaData for subCategory
    const reference = newBrand._id;
    let dataRes = {
      newBrand,
      MetaData: {},
    };
    if (req.body.title_meta && req.body.desc_meta) {
      const MetaData = await createMetaData(req, reference);
      await newBrand.updateOne({ metaDataId: MetaData._id });
      dataRes = {
        newBrand,
        MetaData,
      };
    }

    // 5- send response
    res.status(StatusCodes.CREATED).json({
      status: Status.SUCCESS,
      data: dataRes,
      success_en: "Successfully",
      success_ar: "تم بنجاح",
    });
  }
);

// @desc    Update Brand By Id
// @route   POST /api/v1/brands/:id
// @access  Private (Admin)
export const updateBrand = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id for item from params
    const { id } = req.params;
    req.body.slug_en = req.body.name_en.replace(/\s+/g, "_");
    req.body.slug_ar = req.body.name_ar.replace(/\s+/g, "_");

    // 2- find Brand already exist in mongooseDB
    const brand = await Brand.findById(id);
    if (!brand) {
      return next(
        new ApiError(
          {
            en: `Not Found Any Result For This Id ${id}`,
            ar: `${id}لا يوجداي نتيجة لهذا`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- check if Meta already exist
    const exist = await Meta.findOne({ reference: id });
    if (!exist && req.body.title_meta && req.body.desc_meta) {
      const newMeta = await createMetaData(req, id);
      await Brand.findByIdAndUpdate(
        id,
        { metaDataId: newMeta._id, ...req.body },
        { new: true }
      );
    } else if (exist && req.body.title_meta && req.body.desc_meta) {
      await Meta.updateOne(
        { reference: id },
        { title_meta: req.body.title_meta, desc_meta: req.body.desc_meta }
      );
      await Brand.findByIdAndUpdate(id, { ...req.body }, { new: true });
    } else {
      await Brand.findByIdAndUpdate(id, { ...req.body }, { new: true });
    }

    // 4- get updated document and populate it
    const document = await Brand.findById(id).populate("metaDataId");
    // 5- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: document,
      success_en: "updated successfully",
      success_ar: "تم التعديل بنجاح",
    });
  }
);

// @desc    Delete Brand By Id
// @route   POST /api/v1/brands/:id
// @access  Private (Admin)
export const deleteBrand = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id from params
    const { id } = req.params;

    // 2- check if brand contained any products
    const productCount = await Product.countDocuments({
      brand: Object(id),
    });
    if (productCount > 0) {
      return next(
        new ApiError(
          {
            en: `this Brand can't be deleted because it's contained ${productCount} products`,
            ar: `لا يمكن حذف هذة الماركة لأنها تحتوي على ${productCount} منتج`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    const deleted = await deleteMetaData(id);
    if (deleted) {
      // 4- delete subcategory by id from mongooseDB
      await Brand.findByIdAndDelete(id);
    } else {
      return next(
        new ApiError(
          {
            en: `this Brand can't be deleted because MetaData has not  deleted`,
            ar: `لا يمكن حذف هذة الماركة لأنها لم تحذف معلوماتها الوصفية`,
          },
          StatusCodes.FAILED_DEPENDENCY
        )
      );
    }

    // 5- send response
    res.status(200).json({
      status: "success",
      success_en: "Deleted Successfully",
      success_ar: "تم الحذف بنجاح",
    });
  }
);