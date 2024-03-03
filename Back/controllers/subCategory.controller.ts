import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { IQuery } from "../interfaces/factory/factory.interface";
import { Status } from "../interfaces/status/status.enum";
import { Category } from "../models/category.model";
import { Meta } from "../models/meta.model";
import { Product } from "../models/product.model";
import { SubCategory } from "../models/subCategory.model";
import { SubSubCategory } from "../models/subSubCategory.model";
import ApiError from "../utils/ApiError";
import { ApiFeatures } from "../utils/ApiFeatures";
import { createMetaData, deleteMetaData } from "../utils/MetaData";
import {
  getAllItems,
  getOneItemById,
  getOneItemBySlug,
} from "./factory.controller";

// @desc    Get All SubCategories
// @route   GET /api/v1/subCategories
// @access  Public
export const getAllSubCategories = getAllItems(SubCategory, ["metaDataId"]);

// @desc Get SubCategory By Id
// @route GET /api/v1/subCategories/:id
// @access Public
export const getSubCategoryById = getOneItemById(SubCategory, ["metaDataId"]);

// @desc Get SubCategory By Slug
// @route GET /api/v1/subCategories/Slug
// @access Public
export const getSubCategoryBySlug = getOneItemBySlug(SubCategory, [
  "metaDataId",
]);

// @desc Get SubCategory By SlugAr
// @route GET /api/v1/subCategories/SlugAr
// @access Public
// export const getSubCategoryBySlugAr = getOneItemBySlugAr(SubCategory, ["metaDataId"]);

// @desc Get All SubCategories belong to specific category
// @route GET /api/v1/subCategories/forSpecificCategory/:categoryId
// @access Public
export const getAllSubCategoriesByCategoryId = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id from params
    const { categoryId } = req.params;

    // 2- get all subcategories belong to specific category from mongooseDB
    const query = req.query as IQuery;
    const mongoQuery = SubCategory.find({ category: categoryId });

    // 3- create pagination
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
          {
            en: "not found",
            ar: "غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 5- send response
    res.status(200).json({
      status: Status.SUCCESS,
      length: data.length,
      paginationResult,
      data: data,
      success_en: "Successfully",
      success_ar: "تم بنجاح",
    });
  }
);

// @desc Create subcategory inside specific category
// @route POST /api/v1/subCategories/:categoryId
// @access Private (Admin)
export const createSubCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get data from body
    const { name_en, name_ar, slug_en, slug_ar, image, category } = req.body;
    console.log("category", category);
    

    // // 2- check if category already exist and get number of subcategory that exist in it category
    // const categoryExist = await Category.findById(category);
    // if (!categoryExist) {
    //   return next(
    //     new ApiError(
    //       {
    //         en: `this category not exist`,
    //         ar: `هذا التصنيف غير موجود`,
    //       },
    //       StatusCodes.NOT_FOUND
    //     )
    //   );
    // }

    // // 3- check if subcategory already exist
    // const exist = await SubCategory.findOne({
    //   $or: [{ name_en }, { name_ar }],
    // });
    // if (exist) {
    //   return next(
    //     new ApiError(
    //       {
    //         en: `this subcategory already exist`,
    //         ar: `هذا التصنيف الفرعي موجود بالفعل`,
    //       },
    //       StatusCodes.NOT_FOUND
    //     )
    //   );
    // }

    // 4- create subcategory inside specific category in mongooseDB
    const newSubCategory = await SubCategory.create({
      name_en,
      name_ar,
      slug_en,
      slug_ar,
      image,
      category,
      title_meta: req.body.title_meta,
      desc_meta: req.body.desc_meta,
    });

    // 5- create MetaData for subCategory
    const reference = newSubCategory._id;
    let dataRes = {
      newSubCategory,
      MetaData: {},
    };
    if (req.body.title_meta && req.body.desc_meta) {
      const MetaData = await createMetaData(req, reference);
      await newSubCategory.updateOne({ metaDataId: MetaData._id });
      dataRes = {
        newSubCategory,
        MetaData,
      };
    }

    // 6- increment subCategoryCount in Category
    await Category.updateOne(
      { _id: category },
      { $inc: { subCategoriesCount: 1 } }
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

// @desc Update specific subcategory using id
// @route PUT /api/v1/subCategories/:id
// @access Private (Admin)
export const updateSubCategoryById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id for item from params
    const { id } = req.params;
    req.body.slug_en = req.body.name_en.split(" ").join("_");
    req.body.slug_ar = req.body.name_ar.split(" ").join("_");

    // 2- find SubCategory already exist in mongooseDB
    const subcategory = await SubCategory.findById(id);
    if (!subcategory) {
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

    const usedNames = await SubCategory.findOne({
      $or: [{ name_en: req.body.name_en }, { name_ar: req.body.name_ar }],
    });

    if (usedNames && usedNames._id.toString() !== id) {
      return next(
        new ApiError(
          {
            en: `this name already used`,
            ar: `هذا الاسم مستخدم بالفعل`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- check if Meta already exist
    const exist = await Meta.findOne({ reference: id });
    if (!exist && req.body.title_meta && req.body.desc_meta) {
      const newMeta = await createMetaData(req, id);
      await SubCategory.findByIdAndUpdate(
        id,
        { metaDataId: newMeta._id, ...req.body },
        { new: true }
      );
    } else if (exist && req.body.title_meta && req.body.desc_meta) {
      await Meta.updateOne(
        { reference: id },
        { title_meta: req.body.title_meta, desc_meta: req.body.desc_meta }
      );
      await SubCategory.findByIdAndUpdate(id, { ...req.body }, { new: true });
    } else {
      await SubCategory.findByIdAndUpdate(id, { ...req.body }, { new: true });
    }

    // 4- get updated document and populate it
    const document = await SubCategory.findById(id).populate("metaDataId");

    // 5- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: document,
      success_en: "updated successfully",
      success_ar: "تم التعديل بنجاح",
    });
  }
);

// @desc Delete specific subcategory By Id
// @route DELETE /api/v1/subCategories/:id
// @access Private (Admin)
export const deleteSubCategoryById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id from params
    const { id } = req.params;

    // 2- check if subcategory contained any subSubCategories
    const subSubCategoryCount = await SubSubCategory.countDocuments({
      subCategory: Object(id),
    });
    if (subSubCategoryCount > 0) {
      return next(
        new ApiError(
          {
            en: `this subcategory can't be deleted because it's contained ${subSubCategoryCount} subSubCategory`,
            ar: `لا يمكن حذف هذا التصنيف الفرعي لأنه يحتوي على ${subSubCategoryCount} تصنيف فرعي فرعي`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 3- check if subcategory contained any products
    const productCount = await Product.countDocuments({
      subCategory: Object(id),
    });
    if (productCount > 0) {
      return next(
        new ApiError(
          {
            en: `this subcategory can't be deleted because it's contained ${productCount} products`,
            ar: `لا يمكن حذف هذا التصنيف الفرعي لأنه يحتوي على ${productCount} منتج`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    const deleted = await deleteMetaData(id);
    if (deleted) {
      // 4- delete subcategory by id from mongooseDB
      const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

      // 3- increment subCategoryCount in Category
      await Category.updateOne(
        { _id: deletedSubCategory?.category },
        { $inc: { subCategoriesCount: -1 } }
      );
    } else {
      return next(
        new ApiError(
          {
            en: `this subcategory can't be deleted because MetaData has not  deleted`,
            ar: ` لا يمكن حذف هذا التصنيف الفرعي لأن البيانات الوصفية لم يتم حذفها`,
          },
          StatusCodes.FAILED_DEPENDENCY
        )
      );
    }

    // 5- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Deleted Successfully",
      success_ar: "تم الحذف بنجاح",
    });
  }
);
