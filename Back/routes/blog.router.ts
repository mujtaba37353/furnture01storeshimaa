import { Router } from "express";
import {
  getAllBlogs,
  getOneBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment,
  deleteComment,
  addReply,
  deleteReply,
} from "../controllers/blog.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  BlogCreateValidator,
  BlogUpdateValidator,
} from "../validations/blog.validator";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { Role } from "../interfaces/user/user.interface";

const { protectedMiddleware } = require("../middlewares/protected.middleware");

const blogRouter = Router();

blogRouter
  .route("/")
  .get(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin,
      Role.USER,
      Role.Marketer,
      Role.Guest
    ),
    getAllBlogs
  );

blogRouter
  .route("/:id")
  .get(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin,
      Role.USER,
      Role.Marketer,
      Role.Guest
    ),
    getOneBlog
  );

blogRouter
  .route("/")
  .post(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin
    ),
    validate(BlogCreateValidator),
    createBlog
  );

blogRouter
  .route("/:id")
  .put(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin
    ),
    validate(BlogUpdateValidator),
    updateBlog
  );

blogRouter
  .route("/:id")
  .delete(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin
    ),
    deleteBlog
  );

blogRouter
  .route("/addComment/:id")
  .put(protectedMiddleware, allowedTo(Role.USER), addComment);

blogRouter
  .route("/deleteComment/:id")
  .put(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.SubAdmin,
      Role.USER
    ),
    deleteComment
  );

blogRouter
  .route("/addReply/:id")
  .put(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.SubAdmin,
      Role.USER
    ),
    addReply
  );

blogRouter
  .route("/deleteReply/:id")
  .put(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.SubAdmin,
      Role.USER
    ),
    deleteReply
  );

export default blogRouter;
