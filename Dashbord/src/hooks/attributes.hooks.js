import { useEffect, useState } from "react";
import { useGetAllAttributesQuery } from "../api/attribute.api";

export const useFetchAllAttributes = () => {
  const { data, error, isLoading } = useGetAllAttributesQuery();
  const [attributes, setAttributes] = useState({ data: [], error: "" });
  useEffect(() => {
    if (data) {
        setAttributes({
        data: data.data,
        error: "",
      });
    } else {
        setAttributes({
        data: [],
        error: "",
      });
    }
  }, [data, error]);
  return { attributes, isLoading };
};
