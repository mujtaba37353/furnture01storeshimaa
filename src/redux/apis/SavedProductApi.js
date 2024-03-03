import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
import { useDispatch } from 'react-redux'
import { getSavedItems } from '../slices/saveditemsSlice'
export const savedProductsApi = createApi({
  reducerPath: 'SavedProduct',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  tagTypes: ['SavedProduct'],
  endpoints: (builder) => ({
    //  SavedProductS ENDPOINTS =>
    getAllSavedProducts: builder.query({
      query: (query) => `/favourites?limit=1000${query ? `&${query}` : ''}`,
      providesTags: ['SavedProduct'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(getSavedItems(data.data.favourite))
        } catch (err) {}
      },
    }),

    addToSavedProduct: builder.mutation({
      query: (productId) => ({
        url: `/favourites/toggleItemToFavourites/${productId}`,
        method: 'PUT',
        body: {
          productId,
        },
      }),

      invalidatesTags: ['SavedProduct'],
    }),
    deleteSavedProduct: builder.mutation({
      query: (id) => ({
        url: `/favourites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedProduct'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddToSavedProductMutation,
  useLazyGetAllSavedProductsQuery,
  useGetAllSavedProductsQuery,
  useDeleteSavedProductMutation,
} = savedProductsApi
