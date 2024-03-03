import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const offersApi = createApi({
  reducerPath: "offersApi",
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
  tagTypes: ["Offers"],
  endpoints: (builder) => ({
    getAllOffers: builder.query({
      query: (params) => `/offers${params ? params : ""}`,
      providesTags: ["Offers"],
    }),
    getOfferById: builder.query({
      query: (id) => `/offers/${id}`,
      providesTags: ["Offers"],
    }),
    createOffer: builder.mutation({
      query: (payload) => ({
        url: `/offers`,
        body: payload,
        method: "POST",
      }),
      invalidatesTags: ["Offers"],
    }),
    deleteOffer: builder.mutation({
      query: (offerId) => ({
        url: `/offers/${offerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offers"],
    }),
    updateOffer: builder.mutation({
      query: (payload) => ({
        url: `/offers/${payload.id}`,
        body: payload.body,
        method: "PUT",
      }),
      invalidatesTags: ["Offers"],
    }),
  }),
});
export const {
  useLazyGetAllOffersQuery,
  useGetAllOffersQuery,
  useLazyGetOfferByIdQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = offersApi;
