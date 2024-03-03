import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

const uploadsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  reducerPath: 'uploadMedia',
  tagTypes: ['uploading'],
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: ({ file, type }) => ({
        url: `/upload/image?type=${type}`,
        method: 'POST',
        body: file,
      }),
      invalidatesTags: ['uploading'],
    }),
  }),
})
export const { useUploadImageMutation } = uploadsApi
export default uploadsApi
