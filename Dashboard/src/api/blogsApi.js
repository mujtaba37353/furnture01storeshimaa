import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";
export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Blogs"],
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: (params) => `/blogs${params ? params : ""}`,
      providesTags: ["Blogs"],
    }),
    getBlogById: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: ["Blogs"],
    }),
    createBlog: builder.mutation({
      query: (payload) => ({
        url: `/blogs`,
        body: payload,
        method: "POST",
      }),
      invalidatesTags: ["Blogs"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/blogs/${id}`,
        body: payload,
        method: "PUT",
      }),
      invalidatesTags: ["Blogs"],
    }),
    deleteComment: builder.mutation({
      query: ({ blogId, payload }) => ({
        url: `/blogs/deleteComment/${blogId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Blogs"],
    }),
    addReplyForComment: builder.mutation({
      query: ({ blogId, payload }) => ({
        url: `/blogs/addReply/${blogId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Blogs"],
    }),
    deleteReplyFromComment: builder.mutation({
      query: ({ blogId, payload }) => ({
        url: `/blogs/deleteReply/${blogId}`,
        body: payload,
        method: `PUT`,
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});
export const {
  useLazyGetAllBlogsQuery,
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useDeleteCommentMutation,
  useAddReplyForCommentMutation,
  useDeleteReplyFromCommentMutation,
} = blogsApi;
