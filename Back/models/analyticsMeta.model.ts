import { Schema, Types, model } from "mongoose";
import Joi from "joi";
export interface IAnalyticsMeta{
    key:string,
    value:string

}
const analyticsMetaSchema = new Schema<IAnalyticsMeta>(
  {
    key:{type:String,enum:['google','snap','facebook','tiktok','tag']},
    value:String,
  }
    
);


export const AnalyticsMeta = model<IAnalyticsMeta>("AnalyticsMeta", analyticsMetaSchema);

 const AnaylticsMetaValidator = Joi.object<IAnalyticsMeta>({
  key:Joi.string().valid('google','snap','facebook','tiktok','tag').alter({
    post:schema=>schema.required(),
    put:schema=>schema.forbidden(),
  }),
  value:Joi.string().alter({
    post:schema=>schema.required(),
    put:schema=>schema.forbidden(),
  }),
});

export const postAnalyticsMetaValidator=AnaylticsMetaValidator.tailor('post')
