import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";
// orders/createItemRepository
export const orderApi = createApi({
  reducerPath: "orderApi",
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
  tagTypes: ["orderApi"],
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (query = "") => ({ url: `/orders${query}` }),
      providesTags: ["orderApi"],
    }),
    getAccountingOrders: builder.query({
      query: (query) => ({ url: `/accounting${query}` }),
      providesTags: ["orderApi"],
    }),
    getMyOrders: builder.query({
      query: () => ({ url: `/orders/myOrders` }),
      providesTags: ["orderApi"],
    }),
    getOrderById: builder.query({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: ["orderApi"],
    }),

    // New Shipping EndPoints
    getOrderShippingById: builder.query({
      query: (id) => ({ url: `/repositories/allProduct/${id}` }),
      providesTags: ["orderApi"],
    }),
    ShipSpecificRepo: builder.mutation({
      query: ({orderId,products,repoId}) => ({ 
        url: `/orders/shipping/${orderId}` ,
        body:{
          products,
          repoId
        } ,
        method:'POST',
       
      }),
      
      providesTags: ["orderApi"],
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          orderApi?.endpoints?.getAllOrders.initiate()
        } catch (err) {
        console.log(err,'errrrrrrrrrrrr')
        }
      },
    }),

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



    // New Shipping EndPoints

    changeOrderStatusById: builder.mutation({
      query: ({ body, id }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["orderApi"],
    }),
    deleteOrderById: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orderApi"],
    }),
    createShippingById: builder.mutation({
      query: (id) => ({
        url: `/orders/shipping/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["orderApi"],
    }),
    createItemRepository: builder.mutation({
      query: (payload) => ({
        url: `orders/createItemRepository`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["orderApi"],
    }),
    trackOrder: builder.query({
      query: (id) => ({ url: `/orders/trackOrder/${id}` }),
      providesTags: ["orderApi"],
    }),
    deleteManyOrders: builder.mutation({
      query: (payload) => ({
        url: `/orders/deleteMany`,
        method: "DELETE",
        body: {
          ids: payload,
        },
      }),
      invalidatesTags: ["orderApi"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useLazyGetOrderShippingByIdQuery,
  useGetAccountingOrdersQuery,
  useShipSpecificRepoMut,
  useChangeOrderStatusByIdMutation,
  useDeleteOrderByIdMutation,
  useCreateShippingByIdMutation,
  useLazyTrackOrderQuery,
  useCreateItemRepositoryMutation,
  useDeleteManyOrdersMutation,
  useLazyGetAllOrdersQuery,

  useShipSpecificRepoMutation,
  useTrackOrderRepoMutation
} = orderApi;
