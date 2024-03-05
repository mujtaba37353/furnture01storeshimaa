import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLazyGetAllSubCategoriesForSpecificCategoryQuery } from "../api/subcategories.api";
export const useFetchSubCategoriesByCategoryId = (categoryId) => {
  const [_, { language }] = useTranslation();
  const [getAllSubCategoriesForSpecificCategory, { isLoading }] =
    useLazyGetAllSubCategoriesForSpecificCategoryQuery();
  const [subCategories, setSubCategories] = useState({ data: [], error: "" });
  useEffect(() => {
    if (categoryId) {
      getAllSubCategoriesForSpecificCategory({
        id: categoryId,
        query: `limit=100`,
      })
        .unwrap()
        .then((res) => {
          setSubCategories({
            data: res.data,
            error: "",
          });
        })
        .catch((err) => {
          setSubCategories({
            data: [],
            error: err.data[`error_${language}`],
          });
        });
    } else {
      setSubCategories({
        data: [],
        error: "",
      });
    }
  }, [categoryId]);
  return { subCategories, isLoading };
};
