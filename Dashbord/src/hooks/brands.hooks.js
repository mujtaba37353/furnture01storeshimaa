import { useEffect, useState } from "react";
import { useLazyGetBrandsQuery } from "../api/brands.api";

export const useFetchBrandsBySubId = (subId) => {
  const [getBrands] = useLazyGetBrandsQuery();
  const [state, setState] = useState([]);

  useEffect(() => {
    if (subId) {
      getBrands(`?subCategory=${subId}`)
        .unwrap()
        .then((res) => {
          setState(res.data);
        })
        .catch((err) => {
          setState([]);
        });
    }
  }, [subId]);
  return { subBrands: state };
};
