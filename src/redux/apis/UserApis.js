import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../constants/baseUrl'
import { setCurrentUser } from '../slices/userSlice'
import { savedProductsApi } from './SavedProductApi'
import cartApi from './cartApi'
import { toast } from 'react-toastify'
import guestUserApi from './gestUserApi'

export const userApi = createApi({
  reducerPath: 'APIs',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      return headers
    },
  }),

  tagTypes: ['user'],

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => ({
        url: `/auth/login`,
        method: 'POST',
        body: user,
        keepUnusedDataFor: 5,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          localStorage.setItem('token', data?.token)
          if (localStorage.getItem('token') === data.token) {
            console.log(
              'userTokeb',
              localStorage.getItem('token'),
              'new token',
              data.token
            )
            dispatch(setCurrentUser({ ...data.data }))
            dispatch(userApi.endpoints.getMe.initiate(undefined))
          }
        } catch (err) {
          console.log(err)
        }
      },

      invalidatesTags: ['user'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/user/logout`,
        method: 'PUT',
      }),
    }),
    register: builder.mutation({
      query: (user) => ({
        url: `/auth/register`,
        method: 'POST',
        body: user,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem('token', data?.token)
          if (localStorage.getItem('token') === data.token) {
            console.log(
              'userTokeb',
              localStorage.getItem('token'),
              'new token',
              data.token
            )
            dispatch(setCurrentUser({ ...data.data }))
            dispatch(userApi.endpoints.getMe.initiate(undefined))
          }
        } catch (err) {
          console.log(err)
        }
      },
      invalidatesTags: ['user'],
    }),
    getMe: builder.query({
      query: () => `/users/getMe`,
      keepUnusedDataFor: 0,

      providesTags: ['user'],
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          data?.data?.role !== 'guest'
            ? dispatch(setCurrentUser({ ...data.data }))
            : dispatch(setCurrentUser({}))
        } catch (err) {
          const { currentUser } = getState()
          if (!Object?.keys(currentUser)?.length) {
            // toast.error("You Have To sign in first");
            dispatch(setCurrentUser({}))         
               // if(err)  window.location.replace('/sign-in');;

            // try{
            //   const CreateUser = guestUserApi?.endpoints?.createGuestUser.initiate();

            // }catch(err) {}

          }
          console.log(err)
        }
      },
    }),
    updateUser: builder.mutation({
      query: (values) => ({
        url: `/users/updateLoggedUser`,
        method: 'PUT',
        body: values,
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateUserMutation,
  useLazyGetMeQuery,
} = userApi
