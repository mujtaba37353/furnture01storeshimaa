import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {} from '@reduxjs/toolkit'
import { baseUrl } from '../../constants/baseUrl'

// this end point to verify the user when he login and sign up

export const CouponApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  reducerPath: 'coupon',
  tagTypes: ['coupon'],
  endpoints: (builder) => ({
    CouponQuery: builder.mutation({
        query: (code) => ({
          url:`coupons/getCouponByNameAndProducts`, 
           body:{  code },
           method:'post'
          }),
       
        providesTags: ['coupon','cart'],
      }),
    
  }),
})

export const { useCouponQueryMutation} =
CouponApi
