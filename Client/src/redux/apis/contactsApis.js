import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'

const contactsApi = createApi({
  reducerPath: 'contactsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  tagTypes: ['Contacts'],
  endpoints: (builder) => ({
    contact: builder.mutation({
      query: (payload) => ({
        url: `/contacts`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Contacts'],
    }),
  }),
})

export const { useContactMutation } = contactsApi
export default contactsApi
