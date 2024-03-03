import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const subSubCategoriesApi = createApi({
  reducerPath: "subSubCategory",
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
  tagTypes: ["subSubCategoriesApi"],
  endpoints: (builder) => ({
    getSubSubCategories: builder.query({
      query: (param) => ({
        url: `/subSubCategories${param ? param : ""}`,
      }),
      providesTags: ["subSubCategoriesApi"],
    }),
    createNewbRrand: builder.mutation({
      query: (payload) => ({
        url: `/subSubCategories`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["subSubCategoriesApi"],
    }),
    editBrand: builder.mutation({
      query: ({ brandId, payload }) => ({
        url: `/subSubCategories/${brandId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["subSubCategoriesApi"],
    }),
    removeRrand: builder.mutation({
      query: (brandId) => ({
        url: `/subSubCategories/${brandId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subSubCategoriesApi"],
    }),
  }),
});

export const {
  useLazyGetSubSubCategoriesQuery,
  useGetSubSubCategoriesQuery,
  useCreateNewbRrandMutation,
  useEditBrandMutation,
  useRemoveRrandMutation,
} = subSubCategoriesApi;
