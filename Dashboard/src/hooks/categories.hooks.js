import { useEffect, useState } from "react";
import { useGetAllCategoriesQuery } from "../api/category.api";

export const useFetchAllCategories = () => {
  const { data, error, isLoading } = useGetAllCategoriesQuery("?limit=100");
  const [categories, setCategories] = useState({ data: [], error: "" });
  useEffect(() => {
    if (data) {
      setCategories({
        data: data.data,
        error: "",
      });
    } else {
      setCategories({
        data: [],
        error: "",
      });
    }
  }, [data, error]);
  return { categories, isLoading };
};
