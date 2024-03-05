import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const brandsApi = createApi({
  reducerPath: "brandsApi",
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
  tagTypes: ["brandsApi"],
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (param) => ({
        url: `/brands${param ? param : ""}`,
      }),
      providesTags: ["brandsApi"],
    }),
    createNewbRrand: builder.mutation({
      query: (payload) => ({
        url: `/brands`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["brandsApi"],
    }),
    editBrand: builder.mutation({
      query: ({ brandId, payload }) => ({
        url: `/brands/${brandId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["brandsApi"],
    }),
    removeRrand: builder.mutation({
      query: (brandId) => ({
        url: `/brands/${brandId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["brandsApi"],
    }),
  }),
});

export const {
  useLazyGetBrandsQuery,
  useGetBrandsQuery,
  useCreateNewbRrandMutation,
  useEditBrandMutation,
  useRemoveRrandMutation,
} = brandsApi;
