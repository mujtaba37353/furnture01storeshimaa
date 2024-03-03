import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const loginGoogleApi = createApi({
  reducerPath: 'loginGoogle',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://reusable-servieces.onrender.com/api/v1',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),

  tagTypes: ['loginGoogle'],

  endpoints: (builder) => ({
    //  LOGIN ENDPOINTS =>
    getLoginGoogle: builder.mutation({
      query: (name) => ({
        url: `auth/google/callback?${name}`,
        method: 'GET',
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const data = await queryFulfilled
          console.log(data)
        } catch (err) {
          console.log(err)
        }
      },
      invalidatesTags: ['loginGoogle'],
    }),
  }),
})

export const { useGetLoginGoogleMutation } = loginGoogleApi
