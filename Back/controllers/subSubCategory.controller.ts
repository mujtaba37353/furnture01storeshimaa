import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { IQuery } from "../interfaces/factory/factory.interface";
import { IProduct } from "../interfaces/product/product.interface";
import { Status } from "../interfaces/status/status.enum";
import { ISubSubCategory } from "../interfaces/subSubCategory/subSubCategory.interface";
import { Meta } from "../models/meta.model";
import { Product } from "../models/product.model";
import { SubCategory } from "../models/subCategory.model";
import { SubSubCategory } from "../models/subSubCategory.model";
import ApiError from "../utils/ApiError";
import { ApiFeatures } from "../utils/ApiFeatures";
import { createMetaData, deleteMetaData } from "../utils/MetaData";
import { getAllItems, getOneItemById, getOneItemBySlug } from "./factory.controller";

// @desc    Get All SubSubCategories
// @route   POST /api/v1/subSubCategories
// @access  Private (Admin)
export const getAllSubSubCategories = getAllItems(SubSubCategory);

// @desc     Get All SubSubCategories
// @route    GET/api/v1/subSubCategories/getAllSubSubCategoriesWithProducts
// @access   Public
export const getAllSubSubCategoriesWithProducts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let subSubCategory = await SubSubCategory.find();

    let result: {
      subSubCategory: ISubSubCategory;
      products: IProduct[];
    }[] = [];
    await Promise.all(
      subSubCategory.map(async (SubSub) => {
        const mongoQuery = Product.find({ subSubCategory: SubSub._id.toString() });
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
          subSubCategory: SubSub,
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

// @desc    Get Specific SubSubCategory By Id
// @route   POST /api/v1/subSubCategories/:id
// @access  Private (Admin)
export const getSubSubCategoryById = getOneItemById(SubSubCategory);

// @desc    Get Specific SubSubCategory By Slug
// @route   POST /api/v1/subSubCategories/Slug
// @access  Private (Admin)
export const getSubSubCategoryBySlug = getOneItemBySlug(SubSubCategory);

// @desc    Create New SubSubCategory
// @route   POST /api/v1/subSubCategories
// @access  Private (Admin)
export const createSubSubCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from body
    const { name_en, name_ar, desc_en, desc_ar, image, subCategory } = req.body;

    // 2- check if subCategory already exist and get number of SubSubCategories that exist in it subCategory
    const subCategoryExist = await SubCategory.findById(subCategory);
    if (!subCategoryExist) {
      return next(
        new ApiError(
          {
            en: `this subCategory not exist`,
            ar: `هذا التصنيف الفرعي غير موجود`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }


    // 3- check if SubSubCategory already exist
    const exist = await SubSubCategory.findOne({
      $or: [{ name_en }, { name_ar }] ,
    });
    
    if (exist) {
      return next(
        new ApiError(
          {
            en: `this SubSubCategory already exist`,
            ar: `هذا التصنيف الفرعي الفرعي موجود بالفعل`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    

    // 4- create SubSubCategory inside specific SubCategory in mongooseDB
    const newSubSubCategory = await SubSubCategory.create({
      name_en,
      name_ar,
      image,
      desc_en,
      desc_ar,
      subCategory,
      title_meta: req.body.title_meta,
      desc_meta: req.body.desc_meta,
    });

    // 5- create MetaData for subCategory
    const reference = newSubSubCategory._id;
    let dataRes = {
      newSubSubCategory,
      MetaData: {},
    };
    if (req.body.title_meta && req.body.desc_meta) {
      const MetaData = await createMetaData(req, reference);
      await newSubSubCategory.updateOne({ metaDataId: MetaData._id });
      dataRes = {
        newSubSubCategory,
        MetaData,
      };
    }

    // 6- increment subSubCategoriesCount in SubCategory
    await SubCategory.updateOne(
      { _id: subCategory },
      { $inc: { subSubCategoriesCount: 1 } }
    );

    // 7- send response
    res.status(StatusCodes.CREATED).json({
      status: Status.SUCCESS,
      data: dataRes,
      success_en: "Successfully",
      success_ar: "تم بنجاح",
    });
  }
);

// @desc    Update SubSubCategory By Id
// @route   POST /api/v1/subSubCategories/:id
// @access  Private (Admin)
export const updateSubSubCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id for item from params
    const { id } = req.params;
    req.body.slug_en = req.body.name_en.split(" ").join("_");
    req.body.slug_ar = req.body.name_ar.split(" ").join("_");

    // 2- find subSubCategory already exist in mongooseDB
    const subSubCategory = await SubSubCategory.findById(id);
    if (!subSubCategory) {
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

    const usedName = await SubSubCategory.findOne({
      $or: [{ name_en: req.body.name_en }, { name_ar: req.body.name_ar }],
    })

    if (usedName && usedName._id.toString() !== id) {
      return next(
        new ApiError(
          {
            en: `this subSubCategory name already exist`,
            ar: `هذا التصنيف الفرعي الفرعي موجود بالفعل`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- check if Meta already exist
    const exist = await Meta.findOne({ reference: id });
    const metaExist=req.body.title_meta && req.body.desc_meta
    if (!exist && metaExist) {
      const newMeta = await createMetaData(req, id);
      await SubSubCategory.findByIdAndUpdate(
        id,
        { metaDataId: newMeta._id, ...req.body },
        { new: true }
      );
    } else if (exist && metaExist) {
      await Meta.updateOne(
        { reference: id },
        { title_meta: req.body.title_meta, desc_meta: req.body.desc_meta }
      );
      await SubSubCategory.findByIdAndUpdate(id, { ...req.body }, { new: true });
    } else {
      await SubSubCategory.findByIdAndUpdate(id, { ...req.body }, { new: true });
    }

    // 4- get updated document and populate it
    const document = await SubSubCategory.findById(id).populate("metaDataId");
    // 5- increment subSubCategoriesCount in Subcategory
    if (req.body.subCategory && !subSubCategory.subCategory) {
      await SubCategory.updateOne(
        { _id: req.body.subCategory },
        { $inc: { subSubCategoriesCount: 1 } }
      );
    }
    // 5- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: document,
      success_en: "updated successfully",
      success_ar: "تم التعديل بنجاح",
    });
  }
);

// @desc    Delete SubSubCategory By Id
// @route   POST /api/v1/subSubCategories/:id
// @access  Private (Admin)
export const deleteSubSubCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id from params
    const { id } = req.params;

    // 2- check if subSubCategory contained any products
    const productCount = await Product.countDocuments({
      subSubCategory: Object(id),
    });
    if (productCount > 0) {
      return next(
        new ApiError(
          {
            en: `this subSubCategory can't be deleted because it's contained ${productCount} products`,
            ar: `لا يمكن حذف هذا التصنيف الفرعي الفرعي لأنه يحتوي علي ${productCount} منتج`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    const deleted = await deleteMetaData(id);
    if (deleted) {
      // 4- delete subcategory by id from mongooseDB
      const deletedSubSubCategory = await SubSubCategory.findByIdAndDelete(id);
      // 3- increment subCategoryCount in Category
      await SubCategory.updateOne(
        { _id: deletedSubSubCategory?.subCategory },
        { $inc: { subSubCategoriesCount: -1 } },
      );
    } else {
      return next(
        new ApiError(
          {
            en: `this subSubCategory can't be deleted because MetaData has not  deleted`,
            ar: `لا يمكن حذف هذا التصنيف الفرعي الفرعي لأنه لم يتم حذف البيانات الوصفية`,
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
