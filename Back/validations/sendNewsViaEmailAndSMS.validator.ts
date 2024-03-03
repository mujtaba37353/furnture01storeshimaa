 import joi from 'joi';
import { 
  SendNewsViaEmailInterface,
  SendNewsViaSMSInterface,
} from '../interfaces/sendNewsViaEmailAndSMS/sendNewsViaEmailAndSMS.interface';
export const sendNewsViaSMSValidator = joi.object<SendNewsViaSMSInterface>({
    phone: joi.array().items(joi.string()).required(),
    message: joi.string().required(),
});

export const sendNewsViaEmailValidator = joi.object<SendNewsViaEmailInterface>({
    email: joi.array().items(joi.string()).required(),
    message: joi.string().required(),
    subject: joi.string().required(),
    subSubject: joi.string().required(),
});

