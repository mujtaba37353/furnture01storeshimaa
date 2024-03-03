import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const subcategoryApi = createApi({
  reducerPath: "subcategoryApi",
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
  tagTypes: ["subcategoryApi"],
  endpoints: (builder) => ({
    getAllSubCategories: builder.query({
      query: (params) => ({ url: `/subCategories${params ? params : ""}` }),
      providesTags: ["subcategoryApi"],
    }),
    getAllSubCategoriesForSpecificCategory: builder.query({
      query: ({id, query}) => ({
        url: `/subCategories/forSpecificCategory/${id}${
          query ? `?${query}` : ""
        }`,
      }),
      providesTags: ["subcategoryApi"],
    }),
    getSubCategoryById: builder.query({
      query: (params) => ({ url: `/subCategories${params}` }),
      providesTags: ["subcategoryApi"],
    }),
    createSubCategory: builder.mutation({
      query: (body) => ({
        url: "/subCategories",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["subcategoryApi"],
    }),
    updateSubCategoryById: builder.mutation({
      query: ({ body, id }) => ({
        url: `/subCategories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["subcategoryApi"],
    }),
    deleteSubCategoryById: builder.mutation({
      query: (id) => ({
        url: `/subCategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subcategoryApi"],
    }),
  }),
});

export const {
  useGetAllSubCategoriesQuery,
  useLazyGetAllSubCategoriesQuery,
  useGetAllSubCategoriesForSpecificCategoryQuery,
  useLazyGetAllSubCategoriesForSpecificCategoryQuery,
  useGetSubCategoryByIdQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryByIdMutation,
  useDeleteSubCategoryByIdMutation,
} = subcategoryApi;
