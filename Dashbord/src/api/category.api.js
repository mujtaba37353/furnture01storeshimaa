// categories
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
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
  tagTypes: ["categoryApi"],
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: (params) => ({ url: `/categories${params ? params : ""}` }),
      providesTags: ["categoryApi"],
    }),
    getCategoryById: builder.query({
      query: (id) => ({ url: `/categories/${id}` }),
      providesTags: ["categoryApi"],
    }),
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["categoryApi"],
    }),
    updateCategoryById: builder.mutation({
      query: ({ body, id }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["categoryApi"],
    }),
    deleteCategoryById: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categoryApi"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useLazyGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryByIdMutation,
  useDeleteCategoryByIdMutation,
} = categoryApi;
