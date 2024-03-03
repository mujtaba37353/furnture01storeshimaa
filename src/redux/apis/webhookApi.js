import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

export const webhookApi = createApi({
  reducerPath: 'webhook',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  tagTypes: ['webhook'],
  endpoints: (builder) => ({
    moyasarWebhookPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/webhook/moyasar`,
        method: 'POST',
        body: { id: paymentId },
      }),
      invalidatesTags: ['webhook'],
    }),
    tabbyWebhookPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/webhook/tabby`,
        method: 'POST',
        body: { id: paymentId },
      }),
      invalidatesTags: ['webhook'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useMoyasarWebhookPaymentMutation, useTabbyWebhookPaymentMutation } = webhookApi
