// categories
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";

export const repoApi = createApi({
  reducerPath: "repoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["repoApi"],
  endpoints: (builder) => ({
    getAllRepos: builder.query({
      query: (params) => ({
        url: `/repositories${params ? params : ""}`,
      }),
      providesTags: ["repoApi"],
    }),
    addProductToRepo: builder.mutation({
      query: ({ body, id }) => ({
        url: `/repositories/${id}/add-product`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["repoApi"],
    }),
    createNewRepo: builder.mutation({
      query: (payload) => ({
        url: "/repositories",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["repoApi"],
    }),
    updateRepo: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/repositories/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["repoApi"],
    }),
    deleteRepo: builder.mutation({
      query: (id) => ({
        url: `/repositories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["repoApi"],
    }),
    GetProductsData: builder.query({
      query: (id) => ({
        url: `repositories/allProduct/${id}`,
      }),
    }),
    removeProductFromRepo: builder.mutation({
      query: ({ repoId, productId }) => ({
        url: `/repositories/${repoId}/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["repoApi"],
    }),
    updateQuantityForRepo: builder.mutation({
      query: ({ repoId, productId, quantity }) => ({
        url: `/repositories/${repoId}/products/${productId}`,
        method: "PUT",
        body: {
          quantity,
        },
      }),
      invalidatesTags: ["repoApi"],
    }),
  }),
});

export const {
  useGetAllReposQuery,
  useLazyGetAllReposQuery,
  useAddProductToRepoMutation,
  useCreateNewRepoMutation,
  useDeleteRepoMutation,
  useUpdateRepoMutation,
  useLazyGetProductsDataQuery,
  useRemoveProductFromRepoMutation,
  useUpdateQuantityForRepoMutation,
} = repoApi;
