import { object, string, number, array } from "yup";
export const productErrors = (lang, totalQualityQty) => {
  return object({
    title_en: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    title_ar: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    description_en: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    description_ar: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    images: array()
      .min(1, lang === "en" ? "Add Image" : "أضف صورة")
      .required(lang === "en" ? "Required!" : "مطلوب!"),
    priceBeforeDiscount: number()
      .min(1, lang === "en" ? "add number greater then 0" : "أضف رقم أكبر من 0")
      .required(lang === "en" ? "Required!" : "مطلوب!"),
    quantity: number()
      .integer(lang === "en" ? "Enter integer number" : "أدخل رقم صحيح")
      .required(lang === "en" ? "Required!" : "مطلوب!"),
    weight: number()
      .min(
        1,
        lang === "en"
          ? "Weight must be equl 1 or more"
          : "الوزن يجب ان يساوي 1 او اكثر"
      )
      .required(lang === "en" ? "Required!" : "مطلوب!"),
    category: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    subCategory: string(),
    paymentType: string()
      .oneOf(["online", "cash", "both"])
      .required(lang === "en" ? "Required!" : "مطلوب!"),
    keywords: array(),
    attributes: array(),
    qualities: array(),
    repositoryId: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    link: string().matches(
      /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=))([a-zA-Z0-9_-]+)/,
      lang === "en"
        ? "Invalid link format for Google Drive"
        : "تنسيق رابط غير صالح ل Google Drive"
    ),
    // .matches(
    //   /^(?!.*&export=download).*/,
    //   lang === "en"
    //     ? "The link musn't end with &export=download"
    //     : "الرابط لا يجب أن ينتهى ب &export=download"
    // ),
  });
};
export const productQualityError = (lang) => {
  return object({
    key_en: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    key_ar: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    values: array().min(1, lang === "en" ? "Add value" : "أضف قيمة"),
  });
};
