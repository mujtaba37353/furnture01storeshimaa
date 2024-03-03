import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {} from '@reduxjs/toolkit'
import { baseUrl } from '../../constants/baseUrl'

// this end point to verify the user when he login and sign up

export const verifiedApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  reducerPath: 'verified',
  tagTypes: ['Verification', 'Cart'],
  endpoints: (builder) => ({
    getUserCode: builder.mutation({
      query: ({ code, phone }) => ({
        url: `/orders/verifyOrder`,
        method: 'POST',
        body: { code, phone },
      }),
      invalidatesTags: ['Verification', 'Cart'],
    }),
    getUserAuthCode: builder.mutation({
      query: ({ code, phone }) => ({
        url: `/auth/verifyCode`,
        method: 'POST',
        body: { code, phone },
      }),
      invalidatesTags: ['Verification', 'Cart'],
    }),
  }),
})

export const { useGetUserCodeMutation, useGetUserAuthCodeMutation } =
  verifiedApi
