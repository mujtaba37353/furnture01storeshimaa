import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from './baseUrl'


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
      extraOptions: { maxRetries: 2},
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
