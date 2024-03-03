import { useEffect, useState } from 'react'
import { useLazyGetAllProductsQuery } from '../../redux/apis/ProductApis'

export const useFetchSearchedProducts = (queries) => {
  const [getAllProducts, { isLoading }] = useLazyGetAllProductsQuery()
  const [state, setState] = useState({
    data: [],
    isLoading: true,
  })
  // useEffect(() => {
  //   getAllProducts(queries)
  //     .unwrap()
  //     .then((res) => {
  //       setState({
  //         data: res.data,
  //         isLoading: flase,
  //       })
  //     })
  //     .catch(() => {
  //       setState({
  //         data: [],
  //         isLoading: false,
  //       })
  //     })
  // }, [queries])
  return { searchedProducts: state }
}
