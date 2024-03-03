import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
const forgetPassApi = createApi({
  reducerPath: 'forgetPassApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ['ForgetPass'],
  endpoints: (builder) => ({
    forgetPass: builder.mutation({
      query: (payload) => ({
        url: `/auth/forgetPassword`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ForgetPass'],
    }),
    verifyCode: builder.mutation({
      query: (payload) => ({
        url: `/auth/verifyPasswordResetCode`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ForgetPass'],
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/resetPassword`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['ForgetPass'],
    }),
  }),
})
export const {
  useForgetPassMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} = forgetPassApi
export default forgetPassApi
