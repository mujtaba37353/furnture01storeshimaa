import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

const attributeApi = createApi({
  reducerPath: 'attributeApi',
  tagTypes: ['Attributes'],
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  endpoints: (builder) => ({
    getAllAttributes: builder.query({
      query: () => `/attributes`,
      providesTags: ['Attributes'],
    }),
  }),
})

export const { useGetAllAttributesQuery, useLazyGetAllAttributesQuery } =
  attributeApi
export default attributeApi
