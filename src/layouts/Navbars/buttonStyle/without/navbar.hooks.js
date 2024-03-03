import { useTranslation } from 'react-i18next'
import { useGetAllCategoriesWithSubsQuery } from '../../../../redux/apis/categoriesApi'
import { useEffect, useState } from 'react'

export const useFetchCategoriesWithSubs = () => {
  const { data, error, isLoading } =
    useGetAllCategoriesWithSubsQuery('limit=1000')
  const [_, { language }] = useTranslation()
  const [categoriesWithSubs, setCategories] = useState({
    data: [],
    error: '',
    isLoading,
  })
  useEffect(() => {
    if (data && !error) {
      setCategories({
        data: data.data,
        isLoading,
        error: `${
          language === 'en'
            ? 'Error while fetching categories'
            : 'حدث خطأ أثناء جلب الأقسام'
        }`,
      })
    } else {
      setCategories({
        data: [],
        error: `${
          language === 'en'
            ? 'Error while fetching categories'
            : 'حدث خطأ أثناء جلب الأقسام'
        }`,
      })
    }
  }, [data, error])
  return { categoriesWithSubs }
}
