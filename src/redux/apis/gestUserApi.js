import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
// import { baseUrl } from '../components/service'

const guestUserApi = createApi({
  reducerPath: 'Guest',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ['Guest'],
  endpoints: (builder) => ({
    createGuestUser: builder.mutation({
      query: () => ({
        url: `/auth/createGuestUser`,
        method: 'POST',
      }),
      invalidatesTags: ['Guest'],
    }),
  }),
})
export const { useCreateGuestUserMutation } = guestUserApi
export default guestUserApi
