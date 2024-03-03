import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
import { getBestItems } from '../slices/bestSellerProductsSlice'
export const ProductsApi = createApi({
  reducerPath: 'Product',
  keepUnusedDataFor: 0,
  tagTypes: ['Product'],
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAllProductsByCategory: builder.query({
      query: (query) =>
        `/categories/getAllCategoriesWithProducts?limit=10000${
          query ? `&${query}` : ''
        }`,
      providesTags: ['Product'],
    }),
    getAllProductsOfBrands: builder.query({
      query: (query) =>
        `/subSubCategories/getAllSubSubCategoriesWithProducts?limit=10000${
          query ? `&${query}` : ''
        }`,
      providesTags: ['Product'],
    }),
    getAllProducts: builder.query({
      query: (query) => `/products?${query ? query : ''}`,
      providesTags: ['Product'],
    }),
    getAllProductsBySubId: builder.query({
      query: (parameter) => `/products/${parameter}`,
      providesTags: ['Product'],
    }),
    getAllProductsByBrandId: builder.query({
      query: (parameter, query) => `/products?subSubCategory=${parameter}`,
      providesTags: ['Product'],
    }),
    getMostSellingProducts: builder.query({
      query: () => `/products?sort=-sales`,
      providesTags: ['Product'],
    }),
    getMostNewiestProducts: builder.query({
      query: () => `/products?sort=-createdAt`,
      providesTags: ['Product'],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          dispatch(getBestItems(data.data))
        } catch (err) {}
      },
    }),
    getProductsOfCategory: builder.query({
      query: (id) => `/products/forSpecificCategory/${id}`,
      providesTags: ['Product'],
    }),
    getSingleProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, product }) => ({
        url: `/products/${productId}`,
        body: product,
        method: 'PUT',
      }),
      invalidatesTags: ['Product'],
    }),
    addRating: builder.mutation({
      query: ({ productId, rating }) => ({
        url: `/reviews/product/${productId}`,
        body: { rating },
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
})

export const {
  useGetAllProductsQuery,
  useLazyGetAllProductsQuery,
  useGetAllProductsBySubIdQuery,
  useGetMostSellingProductsQuery,
  useGetMostNewiestProductsQuery,
  useGetProductsOfCategoryQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useAddRatingMutation,
  useGetAllProductsByCategoryQuery,
  useLazyGetAllProductsByCategoryQuery,
  useLazyGetProductsOfCategoryQuery,
  useGetAllProductsByBrandIdQuery,
  useLazyGetAllProductsByBrandIdQuery,
  useGetAllProductsOfBrandsQuery,
} = ProductsApi
