// Packages NPM Import
import { body, param } from "express-validator";
import slugify from "slugify";

// Middleware Import
import { validate } from "../../middlewares/validation-express-validator";
import { Blog } from "../../models/blog.model";
import IUser from "../../interfaces/user/user.interface";

export const getBlogByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage({
      en: "Blog id is required",
      ar: "معرف المدونة مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Blog id is not valid",
      ar: "معرف المدونة غير صالح",
    })
    .custom(async (val) => {
      const blog = await Blog.findById(val);
      if (!blog) {
        return Promise.reject({
          en: "Blog Not Found",
          ar: "المدونة غير موجودة",
        });
      }
    }),
  validate,
];

export const createBlogValidator = [
  body("title")
    .notEmpty()
    .withMessage({
      en: "Title is required",
      ar: "العنوان مطلوب",
    })
    .isString()
    .withMessage({
      en: "Title Must be string",
      ar: "يجب أن يكون العنوان حروف",
    })
    .isLength({ min: 3, max: 50 })
    .withMessage({
      en: "Must be between 3 to 50 characters",
      ar: "يجب أن يكون بين 3 إلى 50 حرفا",
    })
    .trim()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("description")
    .notEmpty()
    .withMessage({
      en: "Description is required",
      ar: "الوصف مطلوب",
    })
    .isString()
    .withMessage({
      en: "Description Must be string",
      ar: "يجب أن يكون الوصف حروف",
    })
    .trim(),
  body("image")
    .notEmpty()
    .withMessage({
      en: "Image is required",
      ar: "الصورة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Image Must be string",
      ar: "يجب أن تكون الصورة سلسلة",
    }),
  validate,
];

export const updateBlogValidator = [
  param("id")
    .notEmpty()
    .withMessage({
      en: "Blog id is required",
      ar: "معرف المدونة مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Blog id is not valid",
      ar: "معرف المدونة غير صالح",
    })
    .custom(async (val) => {
      const blog = await Blog.findById(val);
      if (!blog) {
        return Promise.reject({
          en: "Blog Not Found",
          ar: "المدونة غير موجودة",
        });
      }
    }),
  body("title")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Title is required",
      ar: "العنوان مطلوب",
    })
    .isString()
    .withMessage({
      en: "Title Must be string",
      ar: "يجب أن يكون العنوان حروف",
    })
    .isLength({ min: 3, max: 50 })
    .withMessage({
      en: "Must be between 3 to 50 characters",
      ar: "يجب أن يكون بين 3 إلى 50 حرفا",
    })
    .trim()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("description")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Description is required",
      ar: "الوصف مطلوب",
    })
    .isString()
    .withMessage({
      en: "Description Must be string",
      ar: "يجب أن يكون الوصف حروف",
    })
    .trim(),
  body("image")
    .optional()
    .notEmpty()
    .withMessage({
      en: "Image is required",
      ar: "الصورة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Image Must be string",
      ar: "يجب أن تكون الصورة سلسلة",
    }),
  validate,
];

export const deleteBlogValidator = [
  param("id")
    .notEmpty()
    .withMessage({
      en: "Blog id is required",
      ar: "معرف المدونة مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Blog id is not valid",
      ar: "معرف المدونة غير صالح",
    })
    .custom(async (val) => {
      const blog = await Blog.findById(val);
      if (!blog) {
        return Promise.reject({
          en: "Blog Not Found",
          ar: "المدونة غير موجودة",
        });
      }
    }),
  validate,
];

export const addCommentValidator = [
  param("id")
    .notEmpty()
    .withMessage({
      en: "Blog id is required",
      ar: "معرف المدونة مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Blog id is not valid",
      ar: "معرف المدونة غير صالح",
    })
    .custom(async (val) => {
      const blog = await Blog.findById(val);
      if (!blog) {
        return Promise.reject({
          en: "Blog Not Found",
          ar: "المدونة غير موجودة",
        });
      }
    }),
  body("comment")
    .notEmpty()
    .withMessage({
      en: "Comment is required",
      ar: "التعليق مطلوب",
    })
    .isString()
    .withMessage({
      en: "Comment Must be string",
      ar: "يجب أن يكون التعليق حروف",
    })
    .trim(),
  validate,
];

export const deleteCommentValidator = [
  param("id")
    .notEmpty()
    .withMessage({
      en: "Blog id is required",
      ar: "معرف المدونة مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Blog id is not valid",
      ar: "معرف المدونة غير صالح",
    })
    .custom(async (val) => {
      const blog = await Blog.findById(val);
      if (!blog) {
        return Promise.reject({
          en: "Blog Not Found",
          ar: "المدونة غير موجودة",
        });
      }
    }),
  body("commentId")
    .notEmpty()
    .withMessage({
      en: "Comment id is required",
      ar: "معرف التعليق مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Comment id is not valid",
      ar: "معرف التعليق غير صالح",
    })
    .custom(async (val, { req }) => {
      const blog = await Blog.findById(req?.params?.id);
      const comment = blog?.comments.find(
        (comment) => comment._id.toString() === val
      );
      if (!comment) {
        return Promise.reject({
          en: "Comment Not Found",
          ar: "التعليق غير موجود",
        });
      }
      const userId = (req.user! as IUser)._id;
      if (
        comment.user.toString() !== userId.toString() &&
        ((req.user! as IUser).role === "guest" ||
          (req.user! as IUser).role === "marketer")
      ) {
        return Promise.reject({
          en: "You Are Not The Owner Of The Comment",
          ar: "أنت لست صاحب التعليق",
        });
      }
    }),
  validate,
];

export const addReplyValidator = [
  param("id")
    .notEmpty()
    .withMessage({
      en: "Blog id is required",
      ar: "معرف المدونة مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Blog id is not valid",
      ar: "معرف المدونة غير صالح",
    })
    .custom(async (val) => {
      const blog = await Blog.findById(val);
      if (!blog) {
        return Promise.reject({
          en: "Blog Not Found",
          ar: "المدونة غير موجودة",
        });
      }
    }),
  body("commentId")
    .notEmpty()
    .withMessage({
      en: "Comment id is required",
      ar: "معرف التعليق مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Comment id is not valid",
      ar: "معرف التعليق غير صالح",
    })
    .custom(async (val, { req }) => {
      const blog = await Blog.findById(req?.params?.id);
      const comment = blog?.comments.find(
        (comment) => comment._id.toString() === val
      );
      if (!comment) {
        return Promise.reject({
          en: "Comment Not Found",
          ar: "التعليق غير موجود",
        });
      }
    }),
  body("reply")
    .notEmpty()
    .withMessage({
      en: "Reply is required",
      ar: "الرد مطلوب",
    })
    .isString()
    .withMessage({
      en: "Reply Must be string",
      ar: "يجب أن يكون الرد حروف",
    })
    .trim(),
  validate,
];

export const deleteReplyValidator = [
  param("id")
    .notEmpty()
    .withMessage({
      en: "Blog id is required",
      ar: "معرف المدونة مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Blog id is not valid",
      ar: "معرف المدونة غير صالح",
    })
    .custom(async (val) => {
      const blog = await Blog.findById(val);
      if (!blog) {
        return Promise.reject({
          en: "Blog Not Found",
          ar: "المدونة غير موجودة",
        });
      }
    }),
  body("commentId")
    .notEmpty()
    .withMessage({
      en: "Comment id is required",
      ar: "معرف التعليق مطلوب",
    })
    .isMongoId()
    .withMessage({
      en: "Comment id is not valid",
      ar: "معرف التعليق غير صالح",
    })
    .custom(async (val, { req }) => {
      const blog = await Blog.findById(req?.params?.id);
      const comment = blog?.comments?.find(comment => comment._id.toString() === val);
      if (!comment) {
        return Promise.reject({
          en: "Comment Not Found",
          ar: "التعليق غير موجود",
        });
      } else if (comment.user != req?.user?._id) {
        return Promise.reject({
          en: "You Are Not The Owner Of The Comment",
          ar: "أنت لست صاحب التعليق",
        });
      }
    }),
  body("replyId")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage({
      en: "Reply Id Must Be A Valid Mongo ID",
      ar: "رقم الرد يجب أن يكون معرف Mongo صالح",
    })
    .custom(async (val, { req }) => {
      const blog = await Blog.findById(req?.params?.id);
      const comment = blog?.comments.find(
        (comment) => comment._id.toString() === req?.body?.commentId
      );
      if (!comment) {
        return Promise.reject({
          en: "Comment Not Found",
          ar: "التعليق غير موجود",
        });
      }
      const reply = comment.replies.find(
        (reply) => reply._id.toString() === val
      );
      if (!reply) {
        return Promise.reject({
          en: "Reply Not Found",
          ar: "الرد غير موجود",
        });
      }
      if (
        reply.user.userId.toString() !==
        (req.user! as IUser)._id.toString() &&
        ((req.user! as IUser).role === "guest" ||
          (req.user! as IUser).role === "marketer")
      ) {
        return Promise.reject({
          en: "You Are Not The Owner Of The Reply",
          ar: "أنت لست صاحب الرد",
        });
      }
    }),
  validate,
];

