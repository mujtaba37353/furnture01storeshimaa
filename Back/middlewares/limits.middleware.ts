import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import expressAsyncHandler from "express-async-handler";

import ApiError from "../utils/ApiError";
import { limitedForProduct } from "../utils/limits/limitsProduct";
import { limitedForBrand } from "../utils/limits/limitsBrand";
import { limitedForCategory } from "../utils/limits/limitsCategory";
import { limitedForSubCategory } from "../utils/limits/limitsSubCategory";
import { limitedForSubSubCategory } from "../utils/limits/limitsSubSubCategory";
import { limitedForAdmin } from "../utils/limits/limitsUser";
import { IRole } from "../interfaces/user/user.interface";
import { Product } from "../models/product.model";
import { Brand } from "../models/brand.model";
import { Category } from "../models/category.model";
import { SubCategory } from "../models/subCategory.model";
import { User } from "../models/user.model";

const Roles: IRole = {
  rootAdmin: "مدير عام",
  adminA: "مدير عام",
  adminB: "مدير",
  adminC: "محاسب",
  subAdmin: "مسؤول خدمة عملاء",
  user: "مستخدم",
  guest: "زائر",
  marketer: "مسوق",
};

let Count: number;
export const limitsMiddleware = (Model: string): RequestHandler =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      switch (Model) {
        case "Product":
          {
            Count = await Product.countDocuments({});
            const limitProduct = limitedForProduct();
            if (Count >= limitProduct) {
              return next(
                new ApiError(
                  {
                    en: `you can't add more than ${limitProduct} products`,
                    ar: `لا يمكنك إضافة أكثر من ${limitProduct} منتجات`,
                  },
                  StatusCodes.NOT_FOUND
                )
              );
            }
          }
          break;
        case "Brand":
          {
            Count = await Brand.countDocuments({});
            const limitBrand = limitedForBrand();
            if (Count >= limitBrand) {
              return next(
                new ApiError(
                  {
                    en: `you can't add more than ${limitBrand} Brands`,
                    ar: `لا يمكنك إضافة أكثر من ${limitBrand} علامات تجارية`,
                  },
                  StatusCodes.NOT_FOUND
                )
              );
            }
          }
          break;
        case "Category":
          {
            Count = await Category.countDocuments({});
            const limitCategory = limitedForCategory();
            if (Count === limitCategory) {
              return next(
                new ApiError(
                  {
                    en: `you can't add more than ${limitCategory} categories`,
                    ar: `لا يمكنك إضافة أكثر من ${limitCategory} تصنيفات`,
                  },
                  StatusCodes.NOT_FOUND
                )
              );
            }
          }
          break;
        case "SubCategory":
          {
            const category = await Category.findById(req.body.category);
            if (!category) {
              return next(
                new ApiError(
                  {
                    en: `this category not exist`,
                    ar: `هذا التصنيف غير موجود`,
                  },
                  StatusCodes.NOT_FOUND
                )
              );
            }
            const limitSubCategory = limitedForSubCategory();
            if ((category.subCategoriesCount || 0) >= limitSubCategory) {
              return next(
                new ApiError(
                  {
                    en: `you can't add more than ${limitSubCategory} subcategories in each category`,
                    ar: `لا يمكنك إضافة أكثر من ${limitSubCategory} تصنيفات فرعية في كل تصنيف`,
                  },
                  StatusCodes.NOT_FOUND
                )
              );
            }
          }
          break;
        case "SubSubCategory":
          {
            const subCategory = await SubCategory.findById(
              req.body.subCategory
            );
            if (!subCategory) {
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
            const limitSubSubCategory = limitedForSubSubCategory();
            if ((subCategory?.subSubCategoriesCount || 0) >= limitSubSubCategory) {
              return next(
                new ApiError(
                  {
                    en: `you can't add more than ${limitSubSubCategory} subSubCategories in each subCategory`,
                    ar: `لا يمكنك إضافة أكثر من ${limitSubSubCategory} تصنيفات فرعية فرعية في كل تصنيف فرعية`,
                  },
                  StatusCodes.NOT_FOUND
                )
              );
            }
          }
          break;
        case "User":
          {
            Count = await User.countDocuments({ role: req.body.role });
            const limitAdmin = limitedForAdmin(req.body.role);
            if (Count >= limitAdmin) {
              return next(
                new ApiError(
                  {
                    en: `you can't add more than ${limitAdmin} of ${req.body.role}`,
                    ar: `لا يمكنك إضافة أكثر من ${limitAdmin} من ${
                      Roles[req.body.role as keyof IRole]
                    }`,
                  },
                  StatusCodes.NOT_FOUND
                )
              );
            }
          }
          break;
        default:
          break;
      }
      next();
    }
  );
