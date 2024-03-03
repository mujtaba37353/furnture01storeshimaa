import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const attributeApi = createApi({
  reducerPath: "attributeApi",
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
  tagTypes: ["attributeApi"],
  endpoints: (builder) => ({
    getAllAttributes: builder.query({
      query: (params) => ({ url: `/attributes${params ? params : ""}` }),
      providesTags: ["attributeApi"],
    }),
    getAttributeById: builder.query({
      query: (id) => ({ url: `/attributes/${id}` }),
      providesTags: ["attributeApi"],
    }),
    createAttribute: builder.mutation({
      query: (payload) => ({
        url: "/attributes",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["attributeApi"],
    }),
    updateAttribute: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/attributes/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["attributeApi"],
    }),
    deleteAttributeById: builder.mutation({
      query: (id) => ({
        url: `/attributes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["attributeApi"],
    }),
  }),
});

export const {
  useGetAllAttributesQuery,
  useGetAttributeByIdQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeByIdMutation,
} = attributeApi;
