import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const qualitiesApi = createApi({
  reducerPath: "qualities-api",
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
  tagTypes: ["qualities-api"],
  endpoints: (builder) => ({
    getAllQualities: builder.query({
      query: (params) => ({ url: `/generalQualities${params ? params : ""}` }),
      providesTags: ["qualities-api"],
    }),
    getQualityById: builder.query({
      query: (id) => ({ url: `/generalQualities/${id}` }),
      providesTags: ["qualities-api"],
    }),
    createQuality: builder.mutation({
      query: (payload) => ({
        url: "/generalQualities",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["qualities-api"],
    }),
    updateQuality: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/generalQualities/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["qualities-api"],
    }),
    deleteQualityById: builder.mutation({
      query: (id) => ({
        url: `/generalQualities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["qualities-api"],
    }),
  }),
});

export const {
  useGetAllQualitiesQuery,
  useLazyGetAllQualitiesQuery,
  useGetQualityByIdQuery,
  useCreateQualityMutation,
  useUpdateQualityMutation,
  useDeleteQualityByIdMutation,
} = qualitiesApi;
