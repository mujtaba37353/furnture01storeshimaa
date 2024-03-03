import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const metaApi = createApi({
  reducerPath: "metaApi",
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
  tagTypes: ["Meta"],
  endpoints: (builder) => ({
    getAllMetaTags: builder.query({
      query: () => `/meta`,
      providesTags: ["Meta"],
    }),
  
  }),
});

export const { useLazyGetAllMetaTagsQuery } = metaApi;
