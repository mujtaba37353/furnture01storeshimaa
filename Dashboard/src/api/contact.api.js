import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const contactApi = createApi({
  reducerPath: "contactApi",
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

  tagTypes: ["contactApi"],
  endpoints: (builder) => ({
    getAllContactMessages: builder.query({
      query: (params) => ({ url: `/contacts?limit=10000` }),
      providesTags: ["contactApi"],
    }),
    getContactMessageById: builder.query({
      query: (id) => ({ url: `/contacts/${id}` }),
      providesTags: ["contactApi"],
    }),
    deleteContactMessageById: builder.mutation({
      query: (id) => ({ url: `/contacts/${id}`, method: "DELETE" }),
      invalidatesTags: ["contactApi"],
    }),
    toggleMessageOpend: builder.mutation({
      query: (id) => (
        { url: `/contacts/OpendMessage/${id}`, 
        method: "PUT" }
      ),
      invalidatesTags: ["contactApi"],
    }),
  }),
});

export const {
  useGetAllContactMessagesQuery,
  useGetContactMessageByIdQuery,
  useDeleteContactMessageByIdMutation,
  useToggleMessageOpendMutation,
} = contactApi;
