import { useLocation, useNavigate } from "react-router-dom";

function useSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const addToSearch = ({ key, value }) => {
    const params = new URLSearchParams(location.search);
    params.set(key, value);
    navigate({ pathname: location.pathname, search: params.toString() });
  };
  const addArrayToSearch = (data) => {
    const params = new URLSearchParams(location.search);
    data.forEach((item) => {
      params.set(item.key, item.value);
    });
    navigate({ pathname: location.pathname, search: params.toString() });
  };
  const removeArrayFromSearch = (data) => {
    const params = new URLSearchParams(location.search);
    data.forEach((item) => {
      params.delete(item);
    });
    navigate({ pathname: location.pathname, search: params.toString() });
  };
  const removeFromSearch = (key) => {
    const params = new URLSearchParams(location.search);
    params.delete(key);
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  return {
    addToSearch,
    removeFromSearch,
    search: location.search,
    addArrayToSearch,
    removeArrayFromSearch,
  };
}

export default useSearch;
