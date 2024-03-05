import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./baseUrl";
import { setAllRepoProducts } from "./slice/repoProducts.slice";
export const productApi = createApi({
  reducerPath: "productApi",
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
  tagTypes: ["productApi"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (params) => ({ url: `/products${params ? `${params}` : ""}` }),
      providesTags: ["productApi", "repoApi"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAllRepoProducts(data.data));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    getProductById: builder.query({
      query: (id) => ({ url: `/products/productDash/${id}` }),
      providesTags: ["productApi"],
    }),
    getProductByIds: builder.query({
      query: (param) => ({ url: `/products?${param}` }),
      providesTags: ["productApi"],
    }),
    createProduct: builder.mutation({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["productApi"],
    }),
    updateProductById: builder.mutation({
      query: ({ body, id }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["productApi"],
    }),
    deleteProductById: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["productApi", "repoApi"],
    }),
  }),
});

export const {
  useLazyGetAllProductsQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductByIdMutation,
  useDeleteProductByIdMutation,
  useLazyGetProductByIdsQuery,
} = productApi;
