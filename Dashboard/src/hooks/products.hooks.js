import { toast } from "react-toastify";
import {
  useCreateProductMutation,
  useDeleteProductByIdMutation,
  useLazyGetAllProductsQuery,
  useLazyGetProductByIdQuery,
  useUpdateProductByIdMutation,
} from "../api/product.api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { repoApi } from "../api/repos.api";
import { useDispatch } from "react-redux";
export const useAddProduct = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [_, { language }] = useTranslation();
  const navigate = useNavigate();
  const addProduct = (payload) => {
    payload.subCategory === "" && delete payload.subCategory;
    createProduct(payload)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
        navigate("/products");
      })
      .catch((err) => toast.error(err.data[`error_${language}`]));
  };
  return [addProduct, { isLoading }];
};
export const useGetProductById = (productId) => {
  const [product, setProduct] = useState({
    data: null,
    error: "",
  });
  const [_, { language }] = useTranslation();
  const [getProductByIdQuery, { data, isLoading }] =
    useLazyGetProductByIdQuery();
  useEffect(() => {
    getProductByIdQuery(productId)
      .unwrap()
      .then((res) => {
        setProduct({
          data: res.data,
          error: "",
        });
      })
      .catch(() => {
        setProduct({
          data: null,
          error:
            language === "en"
              ? "This product was not found"
              : "لم يتم العثور علي هذا المنتج",
        });
      });
  }, [productId, data]);
  return { product, isLoading };
};
export const useUpdateProductInfo = () => {
  const [updateProductById, { isLoading }] = useUpdateProductByIdMutation();
  const [_, { language }] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const updateProductInfo = (payload, productId) => {
    payload.subCategory === "" && delete payload.subCategory;
    updateProductById({ body: payload, id: productId })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
        navigate("/products");
        dispatch(repoApi.util.invalidateTags(["repoApi"]));
      })
      .catch((error) => {
        const message =
          language === "en" ? error?.data?.error_en : error?.data?.error_ar;
        toast.error(message);
      });
  };
  return [updateProductInfo, { isLoading }];
};
export const useFetchProducts = (queries) => {
  const [getAllProducts, { data, isLoading }] = useLazyGetAllProductsQuery();

  const [_, { language }] = useTranslation();
  const [products, setProducts] = useState({
    data: [],
    totalPages: 0,
    error: "",
  });
  useEffect(() => {
    getAllProducts(queries ? queries : null)
      .unwrap()
      .then((res) => {
        setProducts({
          data: res.data,
          totalPages: res.paginationResult.totalPages,
          error: "",
        });
      })
      .catch(() => {
        setProducts({
          data: [],
          totalPages: 0,
          error:
            language === "en"
              ? "There are not products"
              : "لم يتم العثور علي منتجات",
        });
      });
  }, [data, queries]);
  return { products, isLoading };
};
export const useDeleteProduct = () => {
  const [deleteProductById] = useDeleteProductByIdMutation();
  const dispatch = useDispatch();
  const [_, { language }] = useTranslation();
  const deleteProduct = (product, setFilter) => {
    deleteProductById(product._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
        dispatch(repoApi.util.invalidateTags(["repoApi"]));
        setFilter(() => ({
          title: "",
          category: "",
          subCategory: "",
          brand: "",
          page: 1,
          limit: 12,
        }));
      });
  };
  return [deleteProduct];
};