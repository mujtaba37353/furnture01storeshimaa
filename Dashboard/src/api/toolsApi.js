import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const toolsApi = createApi({
  reducerPath: "toolsApi",
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

  tagTypes: ["toolsApi"],
  endpoints: (builder) => ({
    getMetaAnalytics: builder.query({
      query: () => ({
        url: "/analyticsMeta",
        method: "GET",
      }),
     
      providesTags: ["toolsApi"],
    }),
    addMetaAnalytics: builder.mutation({
      query: (body) => ({
        url: "/analyticsMeta",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["toolsApi"],
   
    }),
    deleteMetaAnalytics: builder.mutation({
      query: (id) => ({
        url: `/analyticsMeta/${id}`,
        method: "DELETE",
      }),
      
      invalidatesTags: ["toolsApi"],
    }),
  }),
});

export const {
  useAddMetaAnalyticsMutation,
  useGetMetaAnalyticsQuery,
  useLazyGetMetaAnalyticsQuery,
  useDeleteMetaAnalyticsMutation,
} = toolsApi;
