import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["commentApi"],
  endpoints: (builder) => ({
    getAllCommentsForUserById: builder.query({
      query: (id) => ({ url: `/comments/user/${id}` }),
      providesTags: ["commentApi"],
    }),
    getAllCommentsForAdmin: builder.query({
      query: () => ({ url: `/comments/admin` }),
      providesTags: ["commentApi"],
    }),
    deleteCommentFromProductByAdmin: builder.mutation({
      query: (id) => ({
        url: `/comments/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["commentApi"],
    }),
    getAllCommentsForProduct: builder.query({
      query: (id) => ({ url: `/comments/product/${id}` }),
      providesTags: ["commentApi"],
    }),
  }),
});

export const {
  useGetAllCommentsForUserByIdQuery,
  useGetAllCommentsForAdminQuery,
  useDeleteCommentFromProductByAdminMutation,
  useGetAllCommentsForProductQuery,
} = commentApi;
