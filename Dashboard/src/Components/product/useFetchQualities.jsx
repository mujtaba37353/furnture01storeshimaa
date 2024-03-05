import { useEffect, useState } from "react";
import { useLazyGetAllQualitiesQuery } from "../../api/qualities.api";

const useFetchQualities = () => {
  const [state, setState] = useState({});
  const [getAllQualities] = useLazyGetAllQualitiesQuery();
  useEffect(() => { 
    getAllQualities().unwrap().then((res) => {} )
  },[])
  return {}
};
