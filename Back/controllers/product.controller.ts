import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { IQuery } from "../interfaces/factory/factory.interface";
import { IMeta } from "../interfaces/meta/meta.interface";
import { Status } from "../interfaces/status/status.enum";
import { Cart } from "../models/cart.model";
import { Category } from "../models/category.model";
import { Comment } from "../models/comment.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Review } from "../models/review.model";
import { SubCategory } from "../models/subCategory.model";
import ApiError from "../utils/ApiError";
import { ApiFeatures } from "../utils/ApiFeatures";
import { createMetaData, deleteMetaData } from "../utils/MetaData";
import { createNotificationAll } from "../utils/notification";
import {
  getAllItems,
  getOneItemById,
  getOneItemBySlug,
} from "./factory.controller";

// import { User } from "../models/user.model";
import { Types } from "mongoose";
import { ICategory } from "../interfaces/category/category.interface";
import { IProduct } from "../interfaces/product/product.interface";
import IUser from "../interfaces/user/user.interface";
import { Meta } from "../models/meta.model";
import { Offer } from "../models/offer.model";
import { Repository } from "../models/repository.model";
import { SubSubCategory } from "../models/subSubCategory.model";
import { Brand } from "../models/brand.model";
import { GeneralQuality } from "../models/generalQualities.model";
import { string } from "joi";

function areValuesDifferent(arr1: any, arr2: any) {
  // Check if the arrays are equal
  if (JSON.stringify(arr1) === JSON.stringify(arr2)) {
    return false;
  }
  // If no equal values are found, return true
  return true;
}

function areQualityValuesDifferent(array: any) {
  for (let i = 0; i < array.length; i++) {
    const currentItem = array[i];
    for (let j = i + 1; j < array.length; j++) {
      const nextItem = array[j];
      if (!areValuesDifferent(currentItem.values, nextItem.values)) {
        return false;
      }
    }
  }
  return true;
}

function createNestedStructure(data: any) {
  const result: any[] = [];

  for (const item of data) {
    const properties = item.values.map((value: any) => ({
      key_en: value.key_en,
      key_ar: value.key_ar,
      value_en: value.value_en,
      value_ar: value.value_ar,
    }));

    let currentItem = result;

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      let existingItem = currentItem.find(
        (x) => x.value_en === property.value_en
      );

      if (!existingItem) {
        existingItem = {
          ...property,
          color: "",
          child: [],
        };

        currentItem.push(existingItem);
      }

      currentItem = existingItem.child;

      if (i === properties.length - 1) {
        existingItem.quantity = item.quantity;
        existingItem.price = item.price;
        existingItem.image = item.image;
      }
    }
  }
  return result;
}

const countMatchingQualities = (qualities :any, prevQualities :any) => {
  return qualities.reduce((count : number, quality :any) => {
    return prevQualities.find((prevQuality:any) => prevQuality.toString() === quality.toString()) ? count + 1 : count;
  }, 0);
};

const populateDocument = async (query: any, populate: any) => {
  return populate?.length > 0 && populate[0] !== ""
    ? await query.populate(populate)
    : await query;
};

// @desc      Get all products
// @route     GET /api/v1/products
// @access    Public
export const getAllProducts = getAllItems(
  Product,
  [
    "attributes",
    "category",
    "subCategory",
    "subSubCategory",
    "metaDataId",
    "offer",
  ],
  "-__v -directDownloadLink -link"
);

// @desc      Get product by id
// @route     GET /api/v1/products/:id
// @access    Public
export const getProductById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- get id of item from params
    const { id } = req.params;
    // 2- find document from mongooseDB
    const query = Product.findById(id).select("-directDownloadLink -link");
    const populate = [
      "attributes",
      "category",
      "subCategory",
      "subSubCategory",
      "metaDataId",
      "offer",
    ];
    // 3- get document
    const document = await populateDocument(query, populate);

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
    let transformedData: any = [];
    if (document instanceof Product) {
      const originalData = (document as IProduct).qualities;
      transformedData = createNestedStructure(originalData);
    }
    const mergedArray = [];

    // Create a Map to store unique color keys
    const colorMap = new Map();

    // Iterate through the inputArray
    for (const obj of transformedData) {
      const colorKey = obj.value_en;

      // If the color key is not in the Map, add it with the current object
      if (!colorMap.has(colorKey)) {
        colorMap.set(colorKey, { ...obj, child: [...new Set(obj.child)] });
      } else {
        // If the color key is already in the Map, merge child elements
        const existingObj = colorMap.get(colorKey);
        existingObj.child.push(
          ...obj.child.filter(
            (child: any) => !existingObj.child.includes(child)
          )
        );
      }
    }

    // Append the values from the Map to the mergedArray
    mergedArray.push(...colorMap.values());

    // 5- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      data: document,
      ...(mergedArray.length > 0 && { qualities: mergedArray }),
      success_en: "found successfully",
      success_ar: "تم العثور بنجاح",
    });
  }
);

// @desc      Get product by Slug
// @route     GET /api/v1/products/Slug
// @access    Public
export const getProductBySlug = getOneItemBySlug(
  Product,
  [
    "attributes",
    "category",
    "subCategory",
    "subSubCategory",
    "metaDataId",
    "offer",
    "repositoryId",
  ],
  "-directDownloadLink -link"
);

// @desc      Get product by id
// @route     GET /api/v1/products/:id
// @access    Public
export const getProductByIdDash = getOneItemById(
  Product,
  [
    "attributes",
    "category",
    "subCategory",
    "subSubCategory",
    "metaDataId",
    "offer",
    "repositoryId",
  ],
  "-directDownloadLink"
);

// @desc      Get all products by category id
// @route     GET /api/v1/products/forSpecificCategory/:categoryId?page=1&limit=10
// @access    Public
export const getAllProductsByCategoryId = expressAsyncHandler(
  async (req, res, next) => {
    // 1- get id form params
    const { categoryId } = req.params;
    let category: ICategory | null = null;
    if (Types.ObjectId.isValid(categoryId)) {
      category = await Category.findById(categoryId);
    } else {
      category = await Category.findOne({
        $or: [{ name_en: categoryId }, { name_ar: categoryId }],
      });
    }
    if (category === null) {
      return next(
        new ApiError(
          {
            en: "Category not found",
            ar: "القسم غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    // 2- get all products belong to specific category from MongooseDB
    const query = req.query as IQuery;
    const mongoQuery = Product.find({ category: category.id });

    // 4- get features
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

    // 6- send response
    res.status(200).json({
      status: "success",
      results: data.length,
      paginationResult,
      category,
      data: data,
      success_en: "Successfully",
      success_ar: "تم بنجاح",
    });
  }
);

// @desc      create new product
// @route     POST /api/v1/products
// @access    Private
export const createProduct = expressAsyncHandler(async (req, res, next) => {
  const { category } = req.body;
  //////////////////////////////////////////////////////////////////////////////////////////////
  // check all values in the array are different
  console.log("A7a 1 :::::");

  if (req.body.qualities && req.body.qualities.length > 0) {
    console.log(req.body.qualities.length);
    if (!areQualityValuesDifferent(req.body.qualities)) {
      return next(
        new ApiError(
          {
            en: "The values in the qualities array are not different",
            ar: "القيم في مصفوفة الجودات غير مختلفة",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    console.log("A7a 2 :::::");

    if (!req.body.generalQualities && req.body.generalQualities.length <= 0) {
      return next(
        new ApiError(
          {
            en: "General Qualities is required",
            ar: "الجودات العامة مطلوبة",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
  const qualities = req.body.qualities;
  const generalQualities = req.body.generalQualities;
  if (qualities && qualities.length > 0) {
    for (const quality of qualities) {
      if (quality.values.length !== generalQualities.length) {
        return next(
          new ApiError(
            {
              en: "The number of values in the quality is not equal to the number of general qualities",
              ar: "عدد القيم في الجودة ليس متساويًا مع عدد الجودات العامة",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }

      for (let index = 0; index < generalQualities.length; index++) {
        const element = await GeneralQuality.findById(generalQualities[index]);
        if (element) {
          console.log(element.key_en);
          console.log(quality.values[index].key_en);

          if (quality.values[index].key_en !== element.key_en) {
            return next(
              new ApiError(
                {
                  en: `The key of the value in the quality : ${quality.values[index].key_en} is not equal to the key of the general quality : ${element.key_en}`,
                  ar: `اسم القيمة في الجودة: ${quality.values[index].key_en} غير متساوي مع اسم الجودة العامة: ${element.key_en}`,
                },
                StatusCodes.NOT_FOUND
              )
            );
          }
        }
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  // 3- create new product
  const { quantity } = req.body;
  if (quantity === 0 || !quantity) {
    // delete req.body.quantity
    delete req.body.quantity;
  }
  req.body.priceAfterDiscount = 0;

  const product = await Product.create(req.body);
  const reference = product._id;

  let MetaData = {};

  // Check if title_meta and desc_meta exist in the request body
  if (req.body.title_meta && req.body.desc_meta) {
    // Assuming createMetaData is an asynchronous function that creates metadata
    MetaData = await createMetaData(req, reference);
    await product.updateOne({ metaDataId: (MetaData as IMeta)._id });
  }

  // send notification to all users
  const { title, message } = req.body;
  const sender = ((req.user as IUser)?._id).toString(); // add type guard to check if req.user exists
  const link = `${process.env.APP_URL1}/products/${
    product._id
  }/${product.title_en.replace(/\s/g, "-")}`;

  let notification = {};
  if (title && message && sender) {
    // if (receiver === "all") {
    notification = await createNotificationAll(
      title,
      message,
      sender,
      ["user"],
      link
    );
    // } else {
    //   notification = await createNotification(title, message, sender, receiver);
    // }
    if (notification === -1) {
      return next(
        new ApiError(
          {
            en: "notification not created",
            ar: "لم يتم إنشاء الإشعار",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
  }

  ////////////////////////////////

  // 4- increment subCategoryCount in Category
  await Category.updateOne({ _id: category }, { $inc: { productsCount: 1 } });

  // 5- increment productsCount in SubCategory
  if (req.body.subCategory) {
    await SubCategory.updateOne(
      { _id: req.body.subCategory },
      { $inc: { productsCount: 1 } }
    );
  }
  // 5- increment productsCount in SubSubCategory
  if (req.body.subSubCategory) {
    await SubSubCategory.updateOne(
      { _id: req.body.subSubCategory },
      { $inc: { productsCount: 1 } }
    );
  }
  // 6- increment productscount in Brand
  if (req.body.brand) {
    await Brand.updateOne(
      { _id: req.body.brand },
      { $inc: { productsCount: 1 } }
    );
  }

  //////////////////////////////////
  // 7- increment productscount in GeneralQuality
  if (req.body.generalQualities && req.body.generalQualities.length > 0) {
    for (const generalQuality of req.body.generalQualities) {
      await GeneralQuality.updateOne(
        { _id: generalQuality },
        { $inc: { productsCount: 1 } }
      );
    }
  }
  //////////////////////////////////
  // 6- send response
  res.status(StatusCodes.CREATED).json({
    status: Status.SUCCESS,
    data: {
      product,
      MetaData,
      notification,
    },
    success_en: "Product created successfully",
    success_ar: "تم إنشاء المنتج بنجاح",
  });
});

// @desc      update product
// @route     PUT /api/v1/products/:id
// @access    Private
export const updateProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { category } = req.body;
  // 3- check if meta already exist
  const exist = await Meta.findOne({ reference: id });
  const checkMetaExist = req.body.title_meta && req.body.desc_meta;
  if (!exist && checkMetaExist) {
    const newMeta = await createMetaData(req, id);
    await Product.findByIdAndUpdate(
      id,
      { metaDataId: newMeta._id },
      { new: true }
    );
  } else if (exist && checkMetaExist) {
    await Meta.updateOne(
      { reference: id },
      { title_meta: req.body.title_meta, desc_meta: req.body.desc_meta }
    );
  }

  // 2- update product
  const prevProduct = await Product.findById(id);
  if (!prevProduct) {
    return next(
      new ApiError(
        {
          en: "Product not found",
          ar: "المنتج غير موجود",
        },
        StatusCodes.NOT_FOUND
      )
    );
  }

  let priceAfterDisc = 0;
  if (prevProduct.offer) {
    const offerUsed = await Offer.findOne({ _id: prevProduct.offer });
    if (offerUsed) {
      priceAfterDisc =
        req.body.priceBeforeDiscount -
        (req.body.priceBeforeDiscount * offerUsed?.percentage) / 100;
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // check all values in the array are different
  // check if the prev general qualities equal or not equal to the current general quality coming from body
  const hasGeneralQualities = req.body.generalQualities && req.body.generalQualities.length > 0;
  const hasNoQualities = !req.body.qualities || req.body.qualities.length <= 0;
  const hasQualities = req.body.qualities && req.body.qualities.length > 0;
  

  
  if (hasGeneralQualities) {
    const count = countMatchingQualities(req.body.generalQualities, prevProduct.generalQualities);
    
    if (hasNoQualities && req.body.generalQualities.length !== count) {
      return next(new ApiError({ en: "You must provide qualities if you want to update General Qualities", ar: "يجب ادخال الجودات عند تعديل الجودات العامة" }, StatusCodes.NOT_FOUND));
    }
  
    if (hasQualities && prevProduct.generalQualities.length !== count) {
      return next(new ApiError({ en: "You must provide number of General Qualities equal to each quality", ar: "يجب ان يكون عدد قيم الجودات مساوي لعدد الجودات العامه" }, StatusCodes.NOT_FOUND));
    }
  }
  if (req.body.qualities && req.body.qualities.length > 0) {
    console.log(req.body.qualities.length);
    if (!areQualityValuesDifferent(req.body.qualities)) {
      return next(
        new ApiError(
          {
            en: "The values in the qualities array are not different",
            ar: "القيم في مصفوفة الجودات غير مختلفة",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
 
    if (req.body.generalQualities && req.body.generalQualities.length <= 0) {
      return next(
        new ApiError(
          {
            en: "General Qualities must have one value at least",
            ar: "الجودات العامة يجب أن تحتوي على قيمة واحدة على الأقل",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
  //////////////////////////////////////
  if (req.body.qualities && !req.body.generalQualities) {
    req.body.generalQualities = prevProduct && prevProduct.generalQualities;
    console.log("prevProduct.generalQualities",prevProduct.generalQualities);
    if (!req.body.generalQualities || req.body.generalQualities.length <= 0) {
      return next(
        new ApiError(
          {
            en: "General Qualities must have one value at least",
            ar: "الجودات العامة يجب أن تحتوي على قيمة واحدة على الأقل",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
    console.log("req.body.generalQualities.length",req.body.generalQualities.length);
    
    for (let index = 0; index < req.body.generalQualities.length; index++) {
      const generalQualities = await GeneralQuality.findById(req.body.generalQualities[index]);
      if (generalQualities) {
        for (const quality of req.body.qualities) {
          if (quality.values.length != req.body.generalQualities.length ) {
            return next(
              new ApiError(
                {
                  en: "You must provide number of General Qualities equal to each quality",
                  ar: "يجب ان يكون عدد قيم الجودات مساوي لعدد الجودات العامه"
                },
                StatusCodes.NOT_FOUND
              )
            );
          }
          if ((quality.values[index].key_en !== generalQualities.key_en) || (quality.values[index].key_ar !== generalQualities.key_ar)) {
            return next(
              new ApiError(
                {
                  en: `The key of the value in the quality : ${quality.values[index].key_en} is not equal to the key of the general quality : ${generalQualities.key_en}`,
                  ar: `اسم القيمة في الجودة: ${quality.values[index].key_en} غير متساوي مع اسم الجودة العامة: ${generalQualities.key_en}`,
                },
                StatusCodes.NOT_FOUND
              )
            );
          }
        }
      } else {
        return next(
          new ApiError(
            {
              en: "General Quality not found",
              ar: "الجودة العامة غير موجودة",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }
    }
  }
  else if (hasQualities && hasGeneralQualities){
    // if (req.body.generalQualities.length <= 0) {
    //   return next(
    //     new ApiError(
    //       {
    //         en: "General Qualities must have one value at least",
    //         ar: "الجودات العامة يجب أن تحتوي على قيمة واحدة على الأقل",
    //       },
    //       StatusCodes.NOT_FOUND
    //     )
    //   );
    // }
    for (let index = 0; index < req.body.generalQualities.length; index++) {
      const generalQualities = await GeneralQuality.findById(req.body.generalQualities[index]);
      if (generalQualities) {
        for (const quality of req.body.qualities) {
          if (quality.values.length != req.body.generalQualities.length ) {
            return next(
              new ApiError(
                {
                  en: "You must provide number of General Qualities equal to each quality",
                  ar: "يجب ان يكون عدد قيم الجودات مساوي لعدد الجودات العامه"
                },
                StatusCodes.NOT_FOUND
              )
            );
          }
          if ((quality.values[index].key_en !== generalQualities.key_en) || (quality.values[index].key_ar !== generalQualities.key_ar)) {
            return next(
              new ApiError(
                {
                  en: `The key of the value in the quality : ${quality.values[index].key_en} is not equal to the key of the general quality : ${generalQualities.key_en}`,
                  ar: `اسم القيمة في الجودة: ${quality.values[index].key_en} غير متساوي مع اسم الجودة العامة: ${generalQualities.key_en}`,
                },
                StatusCodes.NOT_FOUND
              )
            );
          }
        }
      } else {
        return next(
          new ApiError(
            {
              en: "General Quality not found",
              ar: "الجودة العامة غير موجودة",
            },
            StatusCodes.NOT_FOUND
          )
        );
      }
    }
  }
    
  

  /////////////////////////////////////
  ////////////////////////////////////////////////
  const product = await Product.findByIdAndUpdate(
    id,
    {
      ...req.body,
      priceAfterDiscount: priceAfterDisc,
    },
    { new: true }
  );
  ////////////////////////////////
  /////////////////////////////////////
  // 4- increment productsCount in Category
  const checkCategoryChanged = req.body.category !== prevProduct.category;
  const checkCategoryExist = req.body.category && prevProduct.category;
  if (req.body.category && !prevProduct.category) {
    await Category.updateOne({ _id: category }, { $inc: { productsCount: 1 } });
  } else if (checkCategoryExist && checkCategoryChanged) {
    await Category.updateOne(
      { _id: req.body.category },
      { $inc: { productsCount: 1 } }
    );
    await Category.updateOne(
      { _id: prevProduct.category },
      { $inc: { productsCount: -1 } }
    );
  }

  // 5- increment productsCount in SubCategory
  const checkSubCategoryChanged =
    req.body.subCategory !== prevProduct.subCategory;
  const checkSubCategoryExist = req.body.subCategory && prevProduct.subCategory;
  if (req.body.subCategory && !prevProduct.subCategory) {
    await SubCategory.updateOne(
      { _id: req.body.subCategory },
      { $inc: { productsCount: 1 } }
    );
  } else if (checkSubCategoryExist && checkSubCategoryChanged) {
    await SubCategory.updateOne(
      { _id: req.body.subCategory },
      { $inc: { productsCount: 1 } }
    );
    await SubCategory.updateOne(
      { _id: prevProduct.subCategory },
      { $inc: { productsCount: -1 } }
    );
  }

  // 6- increment productsCount in SubSubCategory
  const checkSubSubCategoryChanged =
    req.body.subSubCategory !== prevProduct.subSubCategory;
  const checkSubSubCategoryExist =
    req.body.subSubCategory && prevProduct.subSubCategory;
  if (req.body.subSubCategory && !prevProduct.subSubCategory) {
    await SubSubCategory.updateOne(
      { _id: req.body.subSubCategory },
      { $inc: { productsCount: 1 } }
    );
  } else if (checkSubSubCategoryExist && checkSubSubCategoryChanged) {
    await SubSubCategory.updateOne(
      { _id: req.body.subSubCategory },
      { $inc: { productsCount: 1 } }
    );
    await SubSubCategory.updateOne(
      { _id: prevProduct.subSubCategory },
      { $inc: { productsCount: -1 } }
    );
  }

  // 7- increment productsCount in Brand
  const checkBrandChanged = req.body.brand !== prevProduct.brand;
  const checkBrandExist = req.body.brand && prevProduct.brand;
  if (req.body.brand && !prevProduct.brand) {
    await Brand.updateOne(
      { _id: req.body.brand },
      { $inc: { productsCount: 1 } }
    );
  } else if (checkBrandExist && checkBrandChanged) {
    await Brand.updateOne(
      { _id: req.body.brand },
      { $inc: { productsCount: 1 } }
    );
    await Brand.updateOne(
      { _id: prevProduct.brand },
      { $inc: { productsCount: -1 } }
    );
  }
  // 8- increment productsCount in GeneralQuality
  const checkNewGeneralQualitiesExist =
    req.body.generalQualities && req.body.generalQualities.length > 0;
  const checkOldGeneralQualitiesExist =
    prevProduct.generalQualities && prevProduct.generalQualities.length > 0;

  if (checkNewGeneralQualitiesExist && !checkOldGeneralQualitiesExist) {
    for (const generalQuality of req.body.generalQualities) {
      await GeneralQuality.updateOne(
        { _id: generalQuality },
        { $inc: { productsCount: 1 } }
      );
    }
  } else if (checkNewGeneralQualitiesExist && checkOldGeneralQualitiesExist) {
    for (const generalQuality of req.body.generalQualities) {
      prevProduct.generalQualities.findIndex(
        (item: any) => item === generalQuality
      ) === -1
        ? await GeneralQuality.updateOne(
            { _id: generalQuality },
            { $inc: { productsCount: 1 } }
          )
        : null;
    }
    const removedId = prevProduct.generalQualities.filter(
      (item: any) =>
        req.body.generalQualities.findIndex((id: any) => id === item) === -1
    );
    for (const generalQuality of removedId) {
      await GeneralQuality.updateOne(
        { _id: generalQuality },
        { $inc: { productsCount: -1 } }
      );
    }
  }
  ///////////////////////////////////////////////////////////////////////////

  // 9- send response
  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    data: product,
    success_en: "Product updated successfully",
    success_ar: "تم تحديث المنتج بنجاح",
  });
});

// @desc      delete product
// @route     DELETE /api/v1/products/:id
// @access    Private
export const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  // 1- check if product exist
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ApiError(
        {
          en: "Product not found",
          ar: "المنتج غير موجود",
        },
        StatusCodes.NOT_FOUND
      )
    );
  }
  // 2- check if product in order
  const order = await Order.findOne({ "orderItems.product": req.params.id });
  if (order) {
    return next(
      new ApiError(
        {
          en: "Product in order",
          ar: "المنتج موجود في طلب",
        },
        StatusCodes.BAD_REQUEST
      )
    );
  }
  // 3- check if product in cart and delete it
  await Cart.updateMany(
    { "cartItems.product": req.params.id },
    { $pull: { cartItems: { product: req.params.id } } }
  );

  // 4- delete cart if cartItems is empty
  await Cart.deleteMany({ cartItems: { $size: 0 } });

  // 5- delete all reviews and comments for this product
  await Comment.findOneAndDelete({ product: req.params.id });
  await Review.findOneAndDelete({ product: req.params.id });

  const deleted = await deleteMetaData(req.params.id);
  if (deleted) {
    // 6- delete product
    await product.deleteOne();
  } else {
    return next(
      new ApiError(
        {
          en: `this Product can't be deleted because MetaData has not  deleted`,
          ar: ` لا يمكن حذف هذا المنتج لأن البيانات الوصفية لم يتم حذفها`,
        },
        StatusCodes.FAILED_DEPENDENCY
      )
    );
  }

  // 7- increment subCategoryCount in Category
  await Category.updateOne(
    { _id: product.category },
    { $inc: { productsCount: -1 } }
  );

  // 8- increment productsCount in SubCategory
  await SubCategory.updateOne(
    { _id: product.subCategory },
    { $inc: { productsCount: -1 } }
  );

  // 8- increment productsCount in SubSubCategory
  await SubSubCategory.updateOne(
    { _id: product.subSubCategory },
    { $inc: { productsCount: -1 } }
  );

  // 9- increment productsCount in Brand
  await Brand.updateOne(
    { _id: product.brand },
    { $inc: { productsCount: -1 } }
  );
  // 10- increment productsCount in GeneralQuality
  if (product.generalQualities && product.generalQualities.length > 0) {
    for (const generalQuality of product.generalQualities) {
      await GeneralQuality.updateOne(
        { _id: generalQuality },
        { $inc: { productsCount: -1 } }
      );
    }
  }
  // 11- remove product from repository
  if (product.repositoryId) {
    const updatedRepository = await Repository.findByIdAndUpdate(
      product.repositoryId,
      { $pull: { products: product._id } },
      { new: true }
    );
    if (!updatedRepository) {
      return next(
        new ApiError(
          {
            en: `Product not found in repository`,
            ar: `المنتج غير موجود في المستودع`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }
  } 

  // 12- send response
  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    success_en: "Product deleted successfully",
    success_ar: "تم حذف المنتج بنجاح",
  });
});

// @desc      toggle Like By someOne By Id
// @route     POST /api/v1/products/toggleLike
// @access    Private
export const toggleLikeBySomeOneById = expressAsyncHandler(
  async (req, res, next) => {
    // 1- get user id from req.user
    const { _id } = (req.user as any)!;

    // 2- get product from mongooseDB
    const product = await Product.findById(req.params.productId);

    // 3- check if product not found
    if (!product) {
      return next(
        new ApiError(
          {
            en: `Not Found Any Product By This Id: ${req.body.id}`,
            ar: `${req.body.id} : id لا يوجد منتج بهذا ال`,
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    // 4- check if user already liked this product
    const isUserAlreadyLiked = await Product.findOne({
      likes: {
        $elemMatch: {
          $eq: _id,
        },
      },
    });

    // 5- if user already liked this product => unlike it
    if (isUserAlreadyLiked) {
      await Product.findOneAndUpdate(
        { _id: req.params.productId },
        {
          $pull: { likes: _id },
        },
        { new: true }
      );
      res.status(StatusCodes.OK).json({
        status: Status.SUCCESS,
        success_en: "Product unliked successfully",
        success_ar: "تم إلغاء الإعجاب بالمنتج بنجاح",
      });
      return;
    }

    // 6- if user not liked this product => like it

    await Product.findOneAndUpdate(
      { _id: req.params.productId },
      {
        $push: { likes: _id },
      },
      { new: true }
    );

    // 7- send response
    res.status(StatusCodes.OK).json({
      status: Status.SUCCESS,
      success_en: "Product liked successfully",
      success_ar: "تم الإعجاب بالمنتج بنجاح",
    });
  }
);

// @desc      Get product by ID or Name
// @route     GET /api/v1/products/getByName/:name
// @access    Public
export const getProductByName = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name } = req.params;
    const populateArgs = [
      { path: "attributes" },
      { path: "category" },
      { path: "subCategory" },
      { path: "subSubCategory" },
      { path: "metaDataId" },
      { path: "offer" },
    ];
    const selectArgs = "-directDownloadLink -link";

    let product: IProduct | null = null;
    if (Types.ObjectId.isValid(name)) {
      product = (await Product.findById(name)
        .select(selectArgs)
        .populate(populateArgs)) as IProduct;
    } else {
      product = (await Product.findOne({
        $or: [{ title_en: name }, { title_ar: name }],
      })
        .select(selectArgs)
        .populate(populateArgs)) as IProduct;
    }

    if (product === null) {
      return next(
        new ApiError(
          {
            en: "Product not found",
            ar: "المنتج غير موجود",
          },
          StatusCodes.NOT_FOUND
        )
      );
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      data: product,
      success_en: "Successfully fetched product",
      success_ar: "تم جلب المنتج بنجاح",
    });
  }
);
