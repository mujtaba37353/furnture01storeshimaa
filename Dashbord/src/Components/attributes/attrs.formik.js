import { object, string, array } from "yup";
export const attribute_values = {
  key_en: "",
  key_ar: "",
  values: [],
};

export const attribute_errors = (lang) => {
  return object({
    key_en: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    key_ar: string().required(lang === "en" ? "Required!" : "مطلوب!"),
    values: array().min(1, lang === "en" ? "Add value" : "أضف قيمة"),
  });
};
