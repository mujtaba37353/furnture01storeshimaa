import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

export const NotificationsApi = createApi({
  reducerPath: 'NotificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  
  }),
  tagTypes: ['Notifications'],
  
  endpoints: (builder) => ({
    getNotificationsByUserId: builder.query({
      query: () => '/notifications/all?limit=1000',
    
      extraOptions: { maxRetries: 2 },

      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data,'dassadsad')
        }catch(err){

        }
      
      },
      providesTags: ['Notifications'],
      
    }),
    getUnReadNotifications: builder.query({
      query: () => '/notifications/unread?limit=1000',
      providesTags: ['Notifications'],
    }),
    markNotificationAsRead: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/notifications/read/${id}`,
        body: payload,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
})

export const {
  useGetNotificationsByUserIdQuery,
  useLazyGetNotificationsByUserIdQuery,
  useGetUnReadNotificationsQuery,
  useLazyGetUnReadNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = NotificationsApi
