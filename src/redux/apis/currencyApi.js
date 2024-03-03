import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
// import {key} from "../../constants/baseUrl"

const currencyApi = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: `https://v6.exchangerate-api.com/v6/${key}/latest`,
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),
  reducerPath: 'currencyApi',
  tagTypes: ['Currency'],
  endpoints: (builder) => ({
    getCurrency: builder.query({
      query: () => `/changeCurrency`,
      providesTags: ['Currency'],
    }),
  }),
})
export const { useGetCurrencyQuery, useLazyGetCurrencyQuery } = currencyApi
export default currencyApi
