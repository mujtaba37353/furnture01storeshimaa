// import Joi from "joi";
// export const sectionValidator = Joi.object({
//   type: Joi.string().valid(
//     "slider",
//     "banner",
//     "aboutus",
//     "privacy",
//     "usage",
//     "retrieval",
//     "public"
//   ),
//   alignment: Joi.when(Joi.ref("type"), [
//     {
//       is: "banner",
//       then: Joi.string().required(),
//       otherwise: Joi.forbidden(),
//     },
//   ]).valid("horizontal", "vertical"),
//   title_en: Joi.alternatives().conditional("type", [
//     { is: "slider", then: Joi.string().required() },
//     { is: "banner", then: Joi.forbidden() },
//     { is: "aboutus", then: Joi.string().required() },
//     { is: "privacy", then: Joi.string().required() },
//     { is: "usage", then: Joi.string().required() },
//     { is: "retrieval", then: Joi.string().required() },
//     { is: "public", then: Joi.string().required() },
//   ]),
//   title_ar: Joi.alternatives().conditional("type", [
//     { is: "slider", then: Joi.string().required() },
//     { is: "banner", then: Joi.forbidden() },
//     { is: "aboutus", then: Joi.string().required() },
//     { is: "privacy", then: Joi.string().required() },
//     { is: "usage", then: Joi.string().required() },
//     { is: "retrieval", then: Joi.string().required() },
//     { is: "public", then: Joi.string().required() },
//   ]),
//   description_en: Joi.alternatives().conditional("type", [
//     { is: "slider", then: Joi.string().required() },
//     { is: "banner", then: Joi.forbidden() },
//     { is: "aboutus", then: Joi.string().required() },
//     { is: "privacy", then: Joi.string().required() },
//     { is: "usage", then: Joi.string().required() },
//     { is: "retrieval", then: Joi.string().required() },
//     { is: "public", then: Joi.string().required() },
//   ]),
//   description_ar: Joi.alternatives().conditional("type", [
//     { is: "slider", then: Joi.string().required() },
//     { is: "banner", then: Joi.forbidden() },
//     { is: "aboutus", then: Joi.string().required() },
//     { is: "privacy", then: Joi.string().required() },
//     { is: "usage", then: Joi.string().required() },
//     { is: "retrieval", then: Joi.string().required() },
//     { is: "public", then: Joi.string().required() },
//   ]),
//   image: Joi.alternatives().conditional("type", [
//     { is: "slider", then: Joi.string().required() },
//     { is: "banner", then: Joi.string().required() },
//     { is: "aboutus", then: Joi.string().required() },
//     { is: "privacy", then: Joi.forbidden() },
//     { is: "usage", then: Joi.forbidden() },
//     { is: "retrieval", then: Joi.forbidden() },
//     { is: "public", then: Joi.forbidden() },
//   ]),
// });

import Joi, { Reference } from "joi";

export const sectionValidator = Joi.object({
  type: Joi.string().required().valid(
    "slider",
    "banner",
    "aboutus",
    "privacy",
    "usage",
    "retrieval",
    "public"
  ),
  alignment: Joi.when(Joi.ref("type"), {
    is: "banner",
    then: Joi.valid("horizontal", "vertical").required(),
    otherwise: Joi.forbidden(),
  }),
  title_en: customTitleValidation(Joi.ref("type")),
  title_ar: customTitleValidation(Joi.ref("type")),
  description_en: customDescriptionValidation(Joi.ref("type")),
  description_ar: customDescriptionValidation(Joi.ref("type")),
  image: customImageValidation(Joi.ref("type")),
  title_meta: Joi.string().optional(),
  desc_meta: Joi.string().optional(),
});

function customTitleValidation(allowedType: Reference) {
  return Joi.when(allowedType, {
    is: "slider",
    then: Joi.string().optional(),
    otherwise: Joi.when(allowedType,{
      is: "banner",
      then: Joi.string().forbidden(),
      otherwise: Joi.string().required(),
    }),
  });
}

function customDescriptionValidation(allowedType: Reference) {
  return Joi.when(allowedType, {
    is: "slider",
    then: Joi.string().optional(),
    otherwise: Joi.when(allowedType,{
      is: "banner",
      then: Joi.string().forbidden(),
      otherwise: Joi.string().required(),
    }),
  });
}

function customImageValidation(allowedType: Reference) {
  return Joi.when(allowedType, {
    is: "slider",
    then: Joi.string().required(),
    otherwise: Joi.when(allowedType,{
      is: "aboutus",
      then: Joi.string().required(),
      otherwise: Joi.when(allowedType,{
        is: "banner",
        then: Joi.string().required(),
        otherwise: Joi.string().forbidden(),
      }),
    }),
  });
}