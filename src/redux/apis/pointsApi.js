import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
import cartApi from './cartApi'
 
const PointsApi = createApi({
  reducerPath: 'points',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  
  keepUnusedDataFor: 0,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({

    SubmitPoints: builder.mutation({
        query: (userToken) => ({
            url: '/points-management/grantPoints',
            body: userToken,
            method: 'POST'
        }),
        async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
          dispatch(cartApi.endpoints.getAllCarts.initiate(undefined))

          console.log(arg)
          try {
            const { data } = await queryFulfilled
            console.log(data,'sadsadsad')
            
              dispatch(cartApi.endpoints.getAllCarts.initiate(undefined))
       
          } catch (err) {
            console.log(err)
          }
        },
  
        invalidatesTags: [ 'points','cart'] 
    }),
})
  
})

export const {
  useSubmitPointsMutation
} = PointsApi
export default PointsApi
