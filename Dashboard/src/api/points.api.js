import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const pointsApi = createApi({
  reducerPath: "points",
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
  tagTypes: ["points"],
  endpoints: (builder) => ({
    getAllPoints: builder.query({
      query: () => `/static-point-request`,
      providesTags: ["points"],
    }),
    acceptUserRequest:builder.mutation({
      query:(id)=>({
        body:id,
        url:`/static-point-request/${id}`,
        method:'PUT'  
      }),
      invalidatesTags :['points']
    }),
    rejectUserRequest:builder.mutation({
      query:(id)=>({
        body:id,
        url:`/static-point-request/${id}`,
        method:'DELETE'  
      }),
      invalidatesTags :['points']
    }),
  }),
});

export const { useGetAllPointsQuery ,useAcceptUserRequestMutation,useRejectUserRequestMutation} = pointsApi;
