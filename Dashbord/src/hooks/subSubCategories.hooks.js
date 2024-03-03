import { useEffect, useState } from "react";
import { useLazyGetSubSubCategoriesQuery } from "../api/subSubCategories.api";

export const useFetchSubSubCategoryBySubId = (subId) => {
  const [getSubSubCategories] = useLazyGetSubSubCategoriesQuery();
  const [state, setState] = useState([]);
  useEffect(() => {
    if (subId) {
      getSubSubCategories(`?subCategory=${subId}`)
        .unwrap()
        .then((res) => {
          setState(res.data);
        })
        .catch((err) => {
          setState([]);
        });
    }
  }, [subId]);
  return { subSubCategories: state };
};
