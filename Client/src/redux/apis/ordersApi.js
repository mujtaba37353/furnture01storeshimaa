import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
import cartApi from './cartApi'
let task = ''
const ordersApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  reducerPath: 'order',
  tagTypes: ['Orders', 'Cart'],
  endpoints: (builder) => ({
    getUserOrders: builder.query({
      query: () => '/orders/myOrders',
      providesTags: ['Orders'],
    }),
    addOrder: builder.mutation({
      query: (payload) => ({
        url: `/orders`,
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(cartApi.endpoints.getAllCarts.initiate(undefined))
         }catch(err){

        }
      
      },
      invalidatesTags: ['Orders', 'Cart'],
    }),
    getVerifyOrder: builder.mutation({
      query: (payload) => ({
        url: `/orders/verifyOrder`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
    trackOrder: builder.query({
      query: (id) => `orders/trackOrder/${id}`,
      providesTags: ['Orders'],
    }),

    
    // New Order Endpoints
    getOrderShippingById: builder.query({
      query: (id) => ({ url: `/repositories/allProduct/${id}` }),
      providesTags: ["orderApi"],
    }),
    // New Order Endpoints
    TrackOrderRepo: builder.mutation({
      query: ({orderId,id}) => ({ 
        url: `/orders/trackOrder/${id}` ,
        body:{
         
          orderId
        } ,
        method:'POST',
       
      }),
      
      providesTags: ["orderApi"],
      
    }),

    checkoutTabby: builder.query({
      query: () =>`/orders/checkoutTabby`,
      providesTags: ['orderApi'],
    }),
  }),
})
export const {
  useGetUserOrdersQuery,
  useLazyGetUserOrdersQuery,
  useAddOrderMutation,
  useGetVerifyOrderMutation,
  useLazyTrackOrderQuery,
  useLazyGetOrderShippingByIdQuery,
  useTrackOrderRepoMutation,
  useLazyCheckoutTabbyQuery
} = ordersApi
export default ordersApi
