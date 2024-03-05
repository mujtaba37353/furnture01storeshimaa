import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    signUp: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/changePassword",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    verifyCode: builder.mutation({
      query: (body) => ({
        url: "/auth/verifyCode",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgetPassword",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    verifyPasswordResetCode: builder.mutation({
      query: (body) => ({
        url: "/auth/verifyPasswordResetCode",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/resetPassword",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation, 
  useChangePasswordMutation,
  useVerifyCodeMutation,
  useForgetPasswordMutation,
  useVerifyPasswordResetCodeMutation,
  useResetPasswordMutation,
} = authApi;
