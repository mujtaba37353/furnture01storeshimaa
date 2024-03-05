// categories
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const marketerApi = createApi({
  reducerPath: "marketerApi",
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
  tagTypes: ["marketerApi"],
  endpoints: (builder) => ({
    getAllMarketers: builder.query({
      query: (params) => ({ url: `/marketers${params ? params : ""}` }),
      providesTags: ["marketerApi"],
    }),
    getMarketerById: builder.query({
      query: (id) => ({ url: `/marketers/${id}` }),
      providesTags: ["marketerApi"],
    }),
    createMarketer: builder.mutation({
      query: (body) => ({
        url: "/marketers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["marketerApi"],
    }),
    updateMarketerById: builder.mutation({
      query: ({ body, id }) => ({
        url: `/marketers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["marketerApi"],
    }),
    deleteMarketerById: builder.mutation({
      query: (id) => ({
        url: `/marketers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["marketerApi"],
    }),
  }),
});

export const {
  useGetAllMarketersQuery,
  useGetMarketerByIdQuery,
  useCreateMarketerMutation,
  useUpdateMarketerByIdMutation,
  useDeleteMarketerByIdMutation,
} = marketerApi;
