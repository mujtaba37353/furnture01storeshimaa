import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: (params) => `/blogs${params ? params : ''}`,
      providesTags: ['Blogs'],
    }),
    getBlogById: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: ['Blogs'],
    }),
    getBlogByName: builder.query({
      query: (name) => `/blogs?title=${name}`,
      providesTags: ['Blogs'],
    }),
    addComment: builder.mutation({
      query: ({ blogId, payload }) => ({
        url: `/blogs/addComment/${blogId}`,
        body: payload,
        method: 'PUT',
      }),
      invalidatesTags: ['Blogs'],
    }),
    deleteComment: builder.mutation({
      query: ({ blogId, payload }) => ({
        url: `/blogs/deleteComment/${blogId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Blogs'],
    }),
    addReplyForComment: builder.mutation({
      query: ({ blogId, payload }) => ({
        url: `/blogs/addReply/${blogId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Blogs'],
    }),
    deleteReplyFromComment: builder.mutation({
      query: ({ blogId, payload }) => ({
        url: `/blogs/deleteReply/${blogId}`,
        body: payload,
        method: `PUT`,
      }),
      invalidatesTags: ['Blogs'],
    }),
  }),
})
export const {
  useLazyGetAllBlogsQuery,
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogByNameQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useAddReplyForCommentMutation,
  useDeleteReplyFromCommentMutation,
} = blogsApi
