import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const MessagesApi = createApi({
  reducerPath: "Messages",
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
  tagTypes: ["Messages"],
  endpoints: (builder) => ({

    SendEmailMessage: builder.mutation({
      query: (body) => ({
        url: "/sendNews/viaEmail",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messages"],
    }),

    SendSmsMessage: builder.mutation({
      query: (body) => ({
        url: '/sendNews/viaSMS',
        method: 'POST',
        body, }),
      invalidatesTags: ["Messages"],

    })
  })
 

})


export const {  useSendEmailMessageMutation,  useSendSmsMessageMutation } = MessagesApi