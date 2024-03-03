import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const subscriberApi = createApi({
  reducerPath: "subscriberApi",
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
  tagTypes: ["subscriberApi"],
  endpoints: (builder) => ({
    getAllSubscribersWithFiltration: builder.query({
        query: (params) => ({ url: `/subscribers?${params}` }),
        providesTags: ["subscriberApi"],
    }),
    deleteSubscriberById: builder.mutation({
        query: (id) => ({
            url: `/subscribers/${id}`,
            method: "DELETE",
        }),
        invalidatesTags: ["subscriberApi"],
    })
  }),
});

export const {
    useGetAllSubscribersWithFiltrationQuery,
    useDeleteSubscriberByIdMutation,
} = subscriberApi;
