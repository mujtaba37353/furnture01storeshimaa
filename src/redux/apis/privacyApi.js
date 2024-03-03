import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

// sections?type=usage&&type=privacy
const privacyApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  reducerPath: 'privacy',
  tagTypes: ['Privacy'],
  endpoints: (builder) => ({
    getFooterPrivacies: builder.query({
      query: () =>
        `/sections?type=retrieval&&type=public&&type=usage&&type=privacy`,
      providesTags: ['Privacy'],
    }),
    getSpecificPrivacy: builder.query({
      query: (privacyName) => `/sections?type=${privacyName}`,
      providesTags: ['Privacy'],
    }),
  }),
})
export const { useGetFooterPrivaciesQuery, useLazyGetSpecificPrivacyQuery } =
  privacyApi
export default privacyApi
