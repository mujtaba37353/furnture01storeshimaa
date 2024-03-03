import Joi from 'joi';
import { IRepository } from '../interfaces/repository/repository.interface';

  const repositoryValidator = Joi.object<IRepository>({
    type: Joi.string().valid("warehouse", "branch").default("branch").alter({
      create: (schema) => schema.optional(),
      update: (schema) => schema.optional(),
    }),
    name_en: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    name_ar: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    address: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    city: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    country: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    mobile: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    contactEmail: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    contactName: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    
  });
  
  export const postRepositoryValidation = repositoryValidator;
  export const putRepositoryValidation = repositoryValidator;