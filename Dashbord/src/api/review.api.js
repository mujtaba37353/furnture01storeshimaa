import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
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
  tagTypes: ["reviewApi"],
  endpoints: (builder) => ({
    getAllReviewForUserById: builder.query({
      query: (id) => ({ url: `/reviews/user/${id}` }),
      providesTags: ["reviewApi"],
    }),
    getAllReviewForAdmin: builder.query({
      query: () => ({ url: `/reviews/admin` }),
      providesTags: ["reviewApi"],
    }),
    deleteReviewFromProductByAdmin: builder.mutation({
      query: (id) => ({
        url: `/reviews/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reviewApi"],
    }),
    getAllReviewsForProduct: builder.query({
        query: (id) => ({ url: `/reviews/product/${id}` }),
        providesTags: ["reviewApi"],
    })
  }),
});

export const {
    useGetAllReviewForUserByIdQuery,
    useGetAllReviewForAdminQuery,
    useDeleteReviewFromProductByAdminMutation,
    useGetAllReviewsForProductQuery
} = reviewApi;
