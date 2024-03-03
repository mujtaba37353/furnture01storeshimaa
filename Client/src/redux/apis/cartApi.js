import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
import { toast } from 'react-toastify'

const cartApi = createApi({
  reducerPath: 'Cart',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  keepUnusedDataFor: 0,

  tagTypes: ['Cart', 'Verification', 'Orders'],
  endpoints: (builder) => ({
    getAllCarts: builder.query({
      query: () => '/cart',
      transformResponse: (response, meta, arg) => {
        console.log(response, arg, 'response')
        return response
      },
      // transformResponse:(){},
      providesTags: ['Cart', 'Verification', 'points'],
    }),
    updateQuantity: builder.mutation({
      query: (payload) => ({
        url: `/cart/${payload.product}`,
        method: 'POST',
        body: {
          quantity: payload.quantity,
          properties: payload.properties,
        },
      }),
      invalidatesTags: ['Cart'],
    }),

    deleteFromCart: builder.mutation({
      query: (cartData) => ({
        url: `/cart/${cartData?.id}`,
        body:{
          properties:cartData?.qualities
        },
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
        } catch (err) {}
      },
      invalidatesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: `/cart/${cartData.id}`,
        body: {
          quantity: cartData.quantity,
          properties: cartData.qualities,
          paymentType:cartData.paymentType,
        },
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart/deleteAllByUser',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    verifyCart: builder.mutation({
      query: ({ productsIds = [], code = '' }) => ({
        url: '/cart/verify',
        method: 'POST',
        body: { productsIds, code },
      }),

      providesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetAllCartsQuery,
  useLazyGetAllCartsQuery,
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useUpdateQuantityMutation,
  useClearCartMutation,
  useVerifyCartMutation,

} = cartApi
export default cartApi
