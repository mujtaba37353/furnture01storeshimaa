import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const uploadApi = createApi({
  reducerPath: "uploadApi",
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

  tagTypes: ["uploadApi"],
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (body) => ({
        url: "/upload/image?type=jpeg",
        method: "POST",
        body,
      }),
      invalidatesTags: ["uploadApi"],
    }),
    uploadFile: builder.mutation({
      query: (body) => ({
        url: "/upload/file",
        method: "POST",
        body,
      }),
      invalidatesTags: ["uploadApi"],
    }),
    uploadFiles: builder.mutation({
      query: (files) => ({
        url: "/upload/files",
        method: "POST",
        body: files,
      }),
      invalidatesTags: ["uploadApi"],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useUploadFileMutation,
  useUploadFilesMutation,
} = uploadApi;
