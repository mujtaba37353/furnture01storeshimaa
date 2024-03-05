import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const pointsMangementApi = createApi({
  reducerPath: "pointsMangement",
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
  tagTypes: ["pointsMangement"],
  endpoints: (builder) => ({
     
    getPoint: builder.query({
      query: () => (`/points-management`),
      providesTags: ["pointsMangement"],
    }),
    AddOrUpdatePoint:builder.mutation({
      query:(body)=>({
        body,
        url:`/points-management`,
        method:'post'  
      }),
      invalidatesTags :['pointsMangement']
    }),
   
   
  }),
});

export const { useAddOrUpdatePointMutation,useGetPointQuery} = pointsMangementApi;
