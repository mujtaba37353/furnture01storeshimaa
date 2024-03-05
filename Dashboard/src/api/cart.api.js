import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const cartApi = createApi({
  reducerPath: "cartApi",
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
  tagTypes: ["cartApi"],
  endpoints: (builder) => ({
    getAllCarts: builder.query({
      query: () => ({ url: `/cart/getAllCarts` }),
      providesTags: ["cartApi"],
    }),
    deleteCartById: builder.mutation({
      query: (id) => ({
        url: `/cart/deleteByAdmin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cartApi"],
    }),
    deleteManyCarts: builder.mutation({
      query: (payload) => ({
        url: `/cart/deleteMany`,
        method: "DELETE",
        body: {
          ids: payload,
        },
      }),
      invalidatesTags: ["cartApi"],
    }),
  }),
});
export const {
  useGetAllCartsQuery,
  useDeleteCartByIdMutation,
  useDeleteManyCartsMutation,
} = cartApi;
