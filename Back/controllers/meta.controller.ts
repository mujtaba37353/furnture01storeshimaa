import {
  getAllItems,
  getOneItemById,
  updateOneItemById,
} from "./factory.controller";
import { Meta } from "../models/meta.model";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { Category } from "../models/category.model";
import { SubCategory } from "../models/subCategory.model";
import { SubSubCategory } from "../models/subSubCategory.model";
import { Brand } from "../models/brand.model";
import { Section } from "../models/section.model";
import { Product } from "../models/product.model";

// @desc    Get All Meta
// @route   POST /api/v1/meta
// @access  public (Admin)
export const getAllMetas = getAllItems(Meta);

// export const getAllMetas = expressAsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const category = await Category.find(
//       {
//         $and: [
//           { title_meta: { $exists: true, $ne: "" } },
//           { desc_meta: { $exists: true, $ne: "" } },
//         ],
//       },
//       { title_meta: 1, desc_meta: 1, _id: 0 }
//     );

//     const subCategory = await SubCategory.find(
//       {
//         $and: [
//           { title_meta: { $exists: true, $ne: "" } },
//           { desc_meta: { $exists: true, $ne: "" } },
//         ],
//       },
//       { title_meta: 1, desc_meta: 1, _id: 0 }
//     );

//     const subSubCategory = await SubSubCategory.find(
//       {
//         $and: [
//           { title_meta: { $exists: true, $ne: "" } },
//           { desc_meta: { $exists: true, $ne: "" } },
//         ],
//       },
//       { title_meta: 1, desc_meta: 1, _id: 0 }
//     );

//     const brand = await Brand.find(
//       {
//         $and: [
//           { title_meta: { $exists: true, $ne: "" } },
//           { desc_meta: { $exists: true, $ne: "" } },
//         ],
//       },
//       { title_meta: 1, desc_meta: 1, _id: 0 }
//     );

//     let Data = [...category, ...subCategory, ...subSubCategory, ...brand];

//     console.log("metaData : ", Data);

//     res.status(200).json({
//       message_en: "meta Fetched Successfully",
//       message_ar: "تمت جلب البيانات  بنجاح",
//       data: Data,
//     });
//   }
// );

// @desc    Get Specific Meta By Id
// @route   POST /api/v1/meta/:id
// @access  Private (Admin)
export const getMetaById = getOneItemById(Meta);

// @desc    Update Meta By Id
// @route   POST /api/v1/meta/:id
// @access  Private (Admin)
export const updateMeta = updateOneItemById(Meta);

// @desc    Get Meta By Reference
// @route   POST /api/v1/meta/:id
// @access  public (Admin)
export const getMetaByReference = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await Meta.findOne({ reference: req.params.id });
    if (!data) {
      return next(
        new ApiError(
          {
            en: "Meta Not Found",
            ar: "لم يتم العثور على الميتا",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    res.status(200).json({
      message_en: "meta Fetched Successfully",
      message_ar: "تمت جلب البيانات  بنجاح",
      data,
    });
  }
);

// export const getMetaByReference = expressAsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     let data = null;

//     console.log("req.params.type : ", req.params.type);
//     console.log("req.params.id : ", req.params.id);
    
    
//     switch (req.params.type) {
//       case "category":
//         data = await Category.findById(req.params.id);
//         break;
//       case "subCategory":
//         data = await SubCategory.findById(req.params.id);
//         break;
//       case "subSubCategory":
//         data = await SubSubCategory.findById(req.params.id);
//         break;
//       case "brand":
//         data = await Brand.findById(req.params.id);
//         break;
//       case "section":
//         data = await Section.findById(req.params.id);
//         break;
//       case "product":
//         data = await Product.findById(req.params.id);
//         break;
//       default:
//         break;
//     }

//     if (!data) {
//       return next(
//         new ApiError(
//           {
//             en: "Meta Not Found",
//             ar: "لم يتم العثور على الميتا",
//           },
//           StatusCodes.NOT_FOUND
//         )
//       );
//     }

//     res.status(200).json({
//       message_en: "meta Fetched Successfully",
//       message_ar: "تمت جلب البيانات  بنجاح",
//       data,
//     });
//   }
// );
