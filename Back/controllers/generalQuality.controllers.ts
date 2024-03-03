import {
    getAllItems,
    getOneItemById,
    updateOneItemById,
} from './factory.controller';
import { GeneralQuality } from '../models/generalQualities.model'; 
import expressAsyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../models/product.model';

// @desc    Get All GeneralQualities
// @route   POST /api/v1/generalQualities
// @access  Private (Admin)
export const getAllGeneralQualities = getAllItems(GeneralQuality);

// @desc    Get Specific GeneralQuality By Id
// @route   POST /api/v1/generalQualities/:id
// @access  Private (Admin)
export const getGeneralQualityById = getOneItemById(GeneralQuality);

// @desc    Create New GeneralQuality
// @route   POST /api/v1/generalQualities
// @access  Private (Admin)
export const createGeneralQuality = expressAsyncHandler(async(req:Request,res:Response,next:NextFunction):Promise<void> =>{
    const existQuality= await GeneralQuality.findOne({ $and: [{ key_en: req.body.key_en },{ key_ar: req.body.key_ar }] });
    if(existQuality){
        return next(
            new ApiError(
                {
                    en: 'This Quality already exists',
                    ar: 'هذه الجودة موجودة بالفعل'
                },
                StatusCodes.BAD_REQUEST
            )
        );
    } 
    const doc = await GeneralQuality.create(req.body);
    res.status(201).json({
        status: 'success',
        data: doc,
        success_en: 'Created Successfully',
        success_ar: 'تم الإنشاء بنجاح',
    });
});

// @desc    Update GeneralQuality By Id
// @route   POST /api/v1/generalQualities/:id
// @access  Private (Admin)
export const updateGeneralQuality= updateOneItemById(GeneralQuality);

// @desc    Delete GeneralQuality By Id
// @route   POST /api/v1/generalQualities/:id
// @access  Private (Admin)
export const deleteGeneralQuality = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1- get id from params
      const { id } = req.params;
      const generalQuality = await GeneralQuality.findById(id);
      // 2- check if generalQuality exists
      if (!generalQuality) {
        return next(
          new ApiError(
            {
              en: 'GeneralQuality not found',
              ar: 'الجودة غير موجودة',
            },
            StatusCodes.NOT_FOUND
          )
        );
      }
      // 2- check if generalQuality contained any products
      const productCount = await Product.countDocuments({
        generalQualities: { $in: [id] },
      });
      if (productCount > 0) {
        return next(
          new ApiError(
            {
              en: `this generalQuality can't be deleted because it's contained ${productCount} products`,
              ar: `لا يمكن حذف هذه الجودة لأنها تحتوي على ${productCount} منتج`,
            },
            StatusCodes.NOT_FOUND
          )
        );
      }

      await generalQuality.deleteOne(); 
      // 5- send response
      res.status(200).json({
        status: "success",
        success_en: "Deleted Successfully",
        success_ar: "تم الحذف بنجاح",
      });
    }
  );