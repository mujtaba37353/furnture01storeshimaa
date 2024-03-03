import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
export const subcategoriesApi = createApi({
  reducerPath: 'subcategory',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  tagTypes: ['subCategory'],
  endpoints: (builder) => ({
    getSubCategoryById: builder.query({
      query: (subcategoryId) => `/subCategories/${subcategoryId}`,
      providesTags: ['subCategory'],
    }),
    getBrandsBySubId: builder.query({
      query: (subcategoryId) =>
        `/subSubCategories?subCategory=${subcategoryId}`,
      providesTags: ['subCategory'],
    }),
    getBrandById: builder.query({
      query: (brandId) => `/subSubCategories/${brandId}`,
      providesTags: ['subCategory'],
    }),
  }),
})
export const {
  useLazyGetSubCategoryByIdQuery,
  useGetBrandsBySubIdQuery,
  useGetBrandByIdQuery,
} = subcategoriesApi
