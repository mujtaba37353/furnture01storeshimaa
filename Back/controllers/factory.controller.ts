import { NextFunction, Response, Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { Model, Types } from "mongoose";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { Status } from "../interfaces/status/status.enum";
import { ApiFeatures } from "../utils/ApiFeatures";
import { IQuery } from "../interfaces/factory/factory.interface";
import { Meta } from "../models/meta.model";

// @desc    Get All Items
// @route   GET /api/v1/......
// @access  Public
export const getAllItems = <T>(
  Model: Model<T>,
  populate: string[] = [""],
  fields: string = "-__v"
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //  1- find all data
      const query = req.query as IQuery;
      const mongoQuery = Model.find({}).select(fields);

      if (populate.length > 0 && populate[0] !== "") {
        query.populate =
          query?.populate && query?.populate?.length > 0
            ? query.populate?.concat(populate.join(","))
            : populate.join(",");
      }

      // 2- get features
      const { data, paginationResult } = await new ApiFeatures(
        mongoQuery,
        query
      )
        .populate()
        .filter()
        .limitFields()
        .search()
        .sort()
        .paginate();

      // 3- get features
      if (data.length === 0) {
        return next(
          new ApiError(
            {
              en: "not found",
              ar: "لا يوجد اي نتيجة",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }

      let categoryMeta;
      let subcategoryMeta;
      if (query && (query.category || query.subcategory)) {
        categoryMeta = await Meta.findOne({ reference: query.category });
        subcategoryMeta = await Meta.findOne({ reference: query.subcategory });
      }
      let MetaData = {
        categoryMeta,
        subcategoryMeta,
      };

      // 5- send response
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        results: data.length,
        paginationResult,
        data: data,
        MetaData,
        success_en: "found successfully",
        success_ar: "تم العثور بنجاح",
      });
    }
  );

// @desc    Get Specific Item By Id
// @route   GET /api/v1/......
// @access  Public
export const getOneItemById = <T>(
  Model: Model<T>,
  populate: string[] = [""],
  fields: string = "-__v"
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1- get id of item from params
      const { id } = req.params;
      // 2- find document from mongooseDB
      const query = Model.findById(id).select(fields);
      // 3- get document
      const document =
        populate?.length > 0 && populate[0] !== ""
          ? await query.populate(populate)
          : await query;

      // 4- check if document not found
      if (!document) {
        return next(
          new ApiError(
            {
              en: `Not Found Any Result For This Id: ${id}`,
              ar: `${id} : id لا يوجد اي نتيجة بهذا باستخدم`,
            },
            StatusCodes.NOT_FOUND
          )
        );
      }

      // 5- send response
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        data: document,
        success_en: "found successfully",
        success_ar: "تم العثور بنجاح",
      });
    }
  );

// @desc    Get Specific Item By Slug
// @route   GET /api/v1/......
// @access  Public
export const getOneItemBySlug = <T>(
  Model: Model<T>,
  populate: string[] = [""],
  fields: string = "-__v"
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { slug } = req.params;

      console.log("slug    :::::: ", slug);

      const key = slug.split("=")[0];
      const value = slug.split("=")[1];

      // 1- find document from mongooseDB
      let query = Model.findOne({ key: value }).select(fields);

      // 2- get document
      const document =
        populate?.length > 0 && populate[0] !== ""
          ? await query.populate(populate)
          : await query;

      // 3- check if document not found
      if (!document) {
        return next(
          new ApiError(
            {
              en: `Not Found Any Result For This req.body`,
              ar: `req.body لا يوجد اي نتيجة بهذا باستخدم`,
            },
            StatusCodes.NOT_FOUND
          )
        );
      }

      // 4- send response
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        data: document,
        success_en: "found successfully",
        success_ar: "تم العثور بنجاح",
      });
    }
  );

// @desc    Get Specific Item By SlugAr
// @route   GET /api/v1/......
// @access  Public
export const getOneItemBySlugAr = <T>(
  Model: Model<T>,
  populate: string[] = [""],
  fields: string = "-__v"
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1- get id of item from params
      const { slug_ar } = req.body;

      // 2- find document from mongooseDB
      let query = Model.findOne({ slug_ar: slug_ar }).select(fields);

      // 3- get document
      const document =
        populate?.length > 0 && populate[0] !== ""
          ? await query.populate(populate)
          : await query;

      // 4- check if document not found
      if (!document) {
        return next(
          new ApiError(
            {
              en: `Not Found Any Result For This slug_ar : ${slug_ar}`,
              ar: `${slug_ar} : slug_ar لا يوجد اي نتيجة بهذا باستخدم`,
            },
            StatusCodes.NOT_FOUND
          )
        );
      }

      // 5- send response
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        data: document,
        success_en: "found successfully",
        success_ar: "تم العثور بنجاح",
      });
    }
  );

// @desc    Create New Item
// @route   POST /api/v1/......
// @access  Private
export const createNewItem = <T>(Model: Model<T>) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1- take data from request body
      const data = req.body;

      // 2- create new document in mongooseDB
      const document = await Model.create(data);

      // 3- send response
      res.status(StatusCodes.CREATED).json({
        status: Status.SUCCESS,
        data: document,
        success_en: "created successfully",
        success_ar: "تم الانشاء بنجاح",
      });
    }
  );

// @desc    Update Specific Item
// @route   PUT    /api/v1/.....
// @access  Private
export const updateOneItemById = <T>(
  Model: Model<T>,
  populate: string[] = [""]
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1- get id for item from params
      const { id } = req.params;

      // 2- find item and update in mongooseDB
      const query = Model.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      // 3- get document
      const document =
        populate?.length > 0 && populate[0] !== ""
          ? await query.populate(populate)
          : await query;

      // 3- check if document not found
      if (!document) {
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

      // 4- save update
      document.save();

      // 5- send response
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        data: document,
        success_en: "updated successfully",
        success_ar: "تم التعديل بنجاح",
      });
    }
  );

// @desc    Delete Specific Item
// @route   DELETE    /api/v1/.....
// @access  Private
export const deleteOneItemById = <T>(Model: Model<T>) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1- get id for item from params
      const { id } = req.params;

      // 2- find item and delete in mongooseDB
      const document = await Model.findByIdAndDelete(id);

      // 3- check if item deleted
      if (!document) {
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

      // 4- send response
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        success_en: "deleted successfully",
        success_ar: "تم الحذف بنجاح",
      });
    }
  );
