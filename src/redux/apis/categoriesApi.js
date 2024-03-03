import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

export const categoriesApi = createApi({
  reducerPath: 'category',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => `/categories?limit=1000`,
      providesTags: ['Category'],
    }),
    getCategoryDetails: builder.query({
      query: (categoryId) => `/categories/${categoryId}`,
      providesTags: ['Category'],
    }),
    getAllCategoriesWithSubs: builder.query({
      query: () => `/categories/getAllCategoriesWithSubCategoriesWithSubSubCategories`,
      providesTags: ['Category'],
    }),
    getAllSubCategories: builder.query({
      query: (categoryId) => `${categoryId}`,
      providesTags: ['Category'],
    }),
    getAllProductsByEveryCategory: builder.query({
      query: () => `/categories/getAllCategoriesWithProducts`,
      providesTags: ['Category'],
    }),
    getAllSubCategoriesByCategoryId: builder.query({
      query: (categoryId) => `/subCategories/forSpecificCategory/${categoryId}`,
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query({
      query: (categoryId) => `/categories/${categoryId}`,
      providesTags: ['Category'],
    }),
  }),
})

export const {
  useGetAllCategoriesQuery,
  useLazyGetCategoryDetailsQuery,
  useGetAllCategoriesWithSubsQuery,
  useLazyGetAllSubCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useGetAllProductsByEveryCategoryQuery,
  useGetAllSubCategoriesByCategoryIdQuery,
  useGetCategoryByIdQuery,
} = categoriesApi
