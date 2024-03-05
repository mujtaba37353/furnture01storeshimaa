import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const userApi = createApi({
  reducerPath: "userApi",
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
  tagTypes: ["userApi"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => `/users?${params ? params : ""}`,
      providesTags: ["userApi"],
    }),
    getAllAdmin: builder.query({
      query: () => ({ url: `/users/getAllAdmins` }),
      providesTags: ["userApi"],
    }),
    getUserById: builder.query({
      query: (params) => ({ url: `/users/${params}` }),
      providesTags: ["userApi"],
    }),
    getMe: builder.query({
      query: () => ({ url: `/users/getMe` }),
      providesTags: ["userApi"],
    }),
    createAdmin: builder.mutation({
      query: (body) => ({
        url: "/users/addAdmin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["userApi"],
    }),
    addRole: builder.mutation({
      query: (body, id) => ({
        url: `/users/${id}/addRole`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["userApi"],
    }),
    updateLoggedUser: builder.mutation({
      query: (body) => ({
        url: "/users/updateLoggedUser",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["userApi"],
    }),
    deleteUserById: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["userApi"],
    }),
    deleteManyUsers: builder.mutation({
      query: (payload) => ({
        url: `/users/deleteMany`,
        method: "DELETE",
        body: {
          ids: payload,
        },
      }),
      invalidatesTags: ["userApi"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useGetAllAdminQuery,
  useGetUserByIdQuery,
  useGetMeQuery,
  useLazyGetMeQuery,
  useCreateAdminMutation,
  useAddRoleMutation,
  useUpdateLoggedUserMutation,
  useDeleteUserByIdMutation,
  useDeleteManyUsersMutation,
} = userApi;
