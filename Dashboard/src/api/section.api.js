import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const sectionApi = createApi({
  reducerPath: "sectionApi",
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
  tagTypes: ["sectionApi"],
  endpoints: (builder) => ({
    getAllSections: builder.query({
      query: (params) => ({ url: `/sections${params}` }),
      providesTags: ["sectionApi"],
    }),
    getSectionById: builder.query({
      query: (id) => ({ url: `/sections/${id}` }),
      providesTags: ["sectionApi"],
    }),
    createSection: builder.mutation({
      query: (body) => ({ url: "/sections", method: "POST", body }),
      invalidatesTags: ["sectionApi"],
    }),
    updateSectionById: builder.mutation({
      query: ({ body, id }) => ({
        url: `/sections/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["sectionApi"],
    }),
    deleteSectionById: builder.mutation({
      query: (id) => ({ url: `/sections/${id}`, method: "DELETE" }),
      invalidatesTags: ["sectionApi"],
    }),
  }),
});

export const {
  useGetAllSectionsQuery,
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionByIdMutation,
  useDeleteSectionByIdMutation,
} = sectionApi;
