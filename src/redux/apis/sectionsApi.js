import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

const sectionsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  reducerPath: 'sectionsApi',
  tagTypes: ['Sections'],
  endpoints: (builder) => ({
    /* 
    aboutus
    banner
    slider
    */
    getSectionByType: builder.query({
      query: (type) => `/sections?type=${type}`,
      providesTags: ['Sections'],
    }),
    getFooterPrivacies: builder.query({
      query: () =>
        `/sections?type=retrieval&&type=public&&type=usage&&type=privacy`,
      providesTags: ['Sections'],
    }),
  }),
})
export const {
  useGetSectionByTypeQuery,
  useLazyGetSectionByTypeQuery,
  useGetFooterPrivaciesQuery,
} = sectionsApi
export default sectionsApi
