import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

const analyticsMetaApi = createApi({
  reducerPath: 'AnalyticsMetaApi',
  tagTypes: ['AnalyticsMetas'],
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAllAnalyticsMeta: builder.query({
      query: () => `/analyticsMeta`,
      providesTags: ['AnalyticsMetas'],
    }),
  }),
})

export const {useGetAllAnalyticsMetaQuery } =
  analyticsMetaApi
export default analyticsMetaApi
