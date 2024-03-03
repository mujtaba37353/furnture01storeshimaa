import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../constants/baseUrl";

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
  tagTypes: ["meta"],
  endpoints: (builder) => ({
   
    getMetaByRefrence: builder.query({
      query: (id) => `/meta/getByReference/${id}`,
      providesTags: ["meta"],
    }),
  }),
});

export const { useLazyGetMetaByRefrenceQuery } = metaApi;
