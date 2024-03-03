// Packages NPM Import
import { body, param } from "express-validator";
// Middleware Import
import { validate } from "../../middlewares/validation-express-validator";
// Model Import
import { SubCategory } from "../../models/subCategory.model";
import { Product } from "../../models/product.model";
import { SubSubCategory } from "../../models/subSubCategory.model";

export const getSubSubCategoryByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage({
      en: "SubCategory id is required",
      ar: "معرف الفئة الفرعية مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "SubCategory id is not valid",
      ar: "معرف الفئة الفرعية غير صالح",
    }),
  validate,
];

export const createSubSubCategoryValidator = [
  //#region *Start name_en and name_ar*
  body("name_en")
    .notEmpty()
    .withMessage({
      en: "Name in english is required",
      ar: "الاسم باللغة الإنجليزية مطلوب",
    })
    .isString()
    .withMessage({
      en: "Name in english Must be string",
      ar: "يجب أن يكون الاسم باللغة الإنجليزية حروف",
    })
    .isLength({ min: 3, max: 50 })
    .withMessage({
      en: "Must be between 3 to 50 characters",
      ar: "يجب أن يكون بين 3 إلى 50 حرفا",
    })
    .trim()
    .custom(async (val, { req }) => {
      req.body.slug_en = val.replace(/\s/g, "_");
      const subSubcategory = await SubSubCategory.findOne({
        name_en: req.body.name_en,
      });
      if (subSubcategory) {
        return Promise.reject({
          en: "Name in english already Used Before",
          ar: "الاسم باللغة الإنجليزية مستخدم بالفعل",
        });
      }
      return Promise.resolve();
    }),
  body("slug_en").isString(),
  body("name_ar")
    .notEmpty()
    .withMessage({
      en: "Name in arabic is required",
      ar: "الاسم باللغة العربية مطلوب",
    })
    .isString()
    .withMessage({ en: "Must be string", ar: "يجب أن يكون سلسلة" })
    .isLength({ min: 3, max: 50 })
    .withMessage({
      en: "Must be between 3 to 50 characters",
      ar: "يجب أن يكون بين 3 إلى 50 حرفا",
    })
    .trim()
    .custom(async (val, { req }) => {
      req.body.slug_ar = val.replace(/\s/g, "_");
      const subSubcategory = await SubSubCategory.findOne({
        name_ar: req.body.name_ar,
      });
      if (subSubcategory) {
        return Promise.reject({
          en: "Name in arabic already Used Before",
          ar: "الاسم باللغة العربية مستخدم بالفعل",
        });
      }
      return Promise.resolve();
    }),
  body("slug_ar").isString(),
  //#endregion *End name_en and name_ar*

  //#region *Start desc_en and desc_ar*
  body("desc_en")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Description in english is required",
      ar: "الوصف باللغة الإنجليزية مطلوب",
    })
    .isString()
    .withMessage({ en: "Must be string", ar: "يجب أن يكون سلسلة" }),
  body("desc_ar")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Description in arabic is required",
      ar: "الوصف باللغة العربية مطلوب",
    })
    .isString()
    .withMessage({ en: "Must be string", ar: "يجب أن يكون سلسلة" }),
  //#endregion *End desc_en and desc_ar*

  //#region *Start image*
  body("image")
    .optional()
    .isArray()
    .withMessage({ en: "Must be array", ar: "يجب أن يكون مصفوفة" })
    .isLength({ min: 0 }),
  //#endregion *End image*

  //#region *Start subCategory*
  body("subCategory")
    .notEmpty()
    .withMessage({
      en: "SubCategory id is required",
      ar: "معرف الفئة الفرعية مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "SubCategory id is not valid",
      ar: "معرف الفئة الفرعية غير صالح",
    })
    .custom(async (val) => {
      const subCategory = await SubCategory.findOne({ _id: val });
      if (!subCategory) {
        return Promise.reject({
          en: "this subcategory not exist",
          ar: "هذا التصنيف الفرعي غير موجود",
        });
      }
    }),
  //#endregion *End category*

  //#region *Start meta*
  body("title_meta")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Title meta must not be empty",
      ar: "عنوان الوصف لا يجب أن يكون فارغًا",
    })
    .isString()
    .withMessage({ en: "Must be string", ar: "يجب أن يكون سلسلة" }),

  body("desc_meta")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Description meta must not be empty",
      ar: "وصف الوصف لا يجب أن يكون فارغًا",
    })
    .isString()
    .withMessage({ en: "Must be string", ar: "يجب أن يكون سلسلة" }),
  //#endregion *End meta*
  validate,
];

export const updateSubSubCategoryValidator = [
  //#region *Start id*
  param("id")
    .notEmpty()
    .withMessage({
      en: "Sub SubCategory id is required",
      ar: "معرف الفئة الفرعية مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Sub SubCategory id is not valid",
      ar: "معرف الفئة الفرعية غير صالح",
    })
    .custom(async (val, { req }) => {
      const subSubcategory = await SubSubCategory.findById(req.params?.id);
      if (!subSubcategory) {
        return Promise.reject({
          en: "this subSubcategory not exist",
          ar: "هذا التصنيف فرع الفرعي غير موجود",
        });
      }
    }),
  //#endregion *End id*

  //#region *Start name_en and name_ar*
  body("name_en")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Name in english is required",
      ar: "الاسم باللغة الإنجليزية مطلوب",
    })
    .isString()
    .withMessage({
      en: "Name in english Must be string",
      ar: "يجب أن يكون الاسم باللغة الإنجليزية حروف",
    })
    .isLength({ min: 3, max: 50 })
    .withMessage({
      en: "Must be between 3 to 50 characters",
      ar: "يجب أن يكون بين 3 إلى 50 حرفا",
    })
    .trim()
    .custom(async (val, { req }) => {
      req.body.slug_en = val.replace(/\s/g, "_");
      const subSubcategory = await SubSubCategory.findOne({ name_en: val });
      if (subSubcategory && subSubcategory._id.toString() !== req?.params?.id) {
        return Promise.reject({
          en: "Name in english already Used Before",
          ar: "الاسم باللغة الإنجليزية مستخدم بالفعل",
        });
      }
      return Promise.resolve();
    }),
  body("slug_en").optional().isString(),
  body("name_ar")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Name in arabic is required",
      ar: "الاسم باللغة العربية مطلوب",
    })
    .isString()
    .withMessage({
      en: "Name in arabic Must be string",
      ar: "يجب أن يكون الاسم باللغة العربية حروف",
    })
    .isLength({ min: 3, max: 50 })
    .withMessage({
      en: "Must be between 3 to 50 characters",
      ar: "يجب أن يكون بين 3 إلى 50 حرفا",
    })
    .trim()
    .custom(async (val, { req }) => {
      req.body.slug_ar = val.replace(/\s/g, "_");
      const subSubcategory = await SubSubCategory.findOne({ name_ar: val });
      if (subSubcategory && subSubcategory._id.toString() !== req?.params?.id) {
        return Promise.reject({
          en: "Name in arabic already Used Before",
          ar: "الاسم باللغة العربية مستخدم بالفعل",
        });
      }
      return Promise.resolve();
    }),
  body("slug_ar").optional().isString(),
  //#endregion *End name_en and name_ar*

    //#region *Start desc_en and desc_ar*
    body("desc_en")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Description in english is required",
      ar: "الوصف باللغة الإنجليزية مطلوب",
    })
    .isString()
    .withMessage({ en: "Must be string", ar: "يجب أن يكون سلسلة" }),
  body("desc_ar")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Description in arabic is required",
      ar: "الوصف باللغة العربية مطلوب",
    })
    .isString()
    .withMessage({ en: "Must be string", ar: "يجب أن يكون سلسلة" }),
  //#endregion *End desc_en and desc_ar*


  //#region *Start image*
  body("image")
    .optional()
    .isArray()
    .withMessage({ en: "Must be array", ar: "يجب أن يكون مصفوفة" })
    .isLength({ min: 0 }),
  //#endregion *End image*

  //#region *Start subCategory*
  body("subCategory")
    .optional()
    .notEmpty()
    .withMessage({
      en: "subCategory id is required",
      ar: "معرف الفئة مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "subCategory id is not valid",
      ar: "معرف الفئة غير صالح",
    }),
  //#endregion *End subCategory*

  //#region *Start meta*
  body("title_meta")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Title meta must not be empty",
      ar: "عنوان الوصف لا يجب أن يكون فارغًا",
    })
    .isString()
    .withMessage({ en: "Must be string", ar: "يجب أن يكون سلسلة" }),

  body("desc_meta")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Description meta must not be empty",
      ar: "وصف الوصف لا يجب أن يكون فارغًا",
    })
    .isString()
    .withMessage({ en: "Must be string", ar: "يجب أن يكون سلسلة" }),
  //#endregion *End meta*
  validate,
];

export const deleteSubSubCategoryValidator = [
  param("id")
    .notEmpty()
    .withMessage({
      en: "Category id is required",
      ar: "معرف الفئة مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Category id is not valid",
      ar: "معرف الفئة غير صالح",
    })
    .custom(async (val, { req }) => {
      const productCount = await Product.countDocuments({
        subSubCategory: Object(req.params?.id),
      });
      if (productCount > 0) {
        return Promise.reject({
          en: `this subcategory can't be deleted because it's contained ${productCount} products`,
          ar: `لا يمكن حذف هذا التصنيف الفرعي لأنه يحتوي على ${productCount} منتج`,
        });
      }
    }),
  validate,
];
