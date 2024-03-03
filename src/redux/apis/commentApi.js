import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    getProductComments: builder.query({
      query: (id) => `/comments/product/${id}`,
      providesTags: ['commentsApi'],
    }),
    createCommentForProduct: builder.mutation({
      query: ({ productId, comment }) => ({
        url: `/comments/product/${productId}`,
        body: {
          comment,
        },
        method: 'POST',
      }),
      invalidatesTags: ['commentsApi'],
    }),
    removeCommentFromProduct: builder.mutation({
      query: (commentId) => ({
        url: `/comments/user/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['commentsApi'],
    }),
  }),
})

export const {
  useGetProductCommentsQuery,
  useCreateCommentForProductMutation,
  useRemoveCommentFromProductMutation,
} = commentsApi
export default commentsApi
