// categories
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const couponApi = createApi({
  reducerPath: "couponApi",
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
  tagTypes: ["couponApi"],
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: (params) => ({ url: `/coupons${params ? params : ""}` }),
      providesTags: ["couponApi"],
    }),
    getCouponById: builder.query({
      query: (id) => ({ url: `/coupons/${id}` }),
      providesTags: ["couponApi"],
    }),
    createCoupon: builder.mutation({
      query: (body) => ({
        url: "/coupons",
        method: "POST",
        body,
      }),
      invalidatesTags: ["couponApi"],
    }),
    updateCouponById: builder.mutation({
      query: ({ body, id }) => ({
        url: `/coupons/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["couponApi"],
    }),
    deleteCouponById: builder.mutation({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["couponApi"],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponByIdMutation,
  useDeleteCouponByIdMutation,
} = couponApi;
