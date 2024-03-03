import { Meta } from "../models/meta.model";
import { Request} from "express";
export const createMetaData= async (req:Request,reference:string)=>{
    const{title_meta,desc_meta}=req.body;
    console.log("A7a ::::: ",req.body);
    
    return await Meta.create({
      title_meta,
      desc_meta,
      reference,
    });
}

export const deleteMetaData= async (reference:string)=>{
     await Meta.findOneAndDelete({reference:reference});
     return 1;
}

