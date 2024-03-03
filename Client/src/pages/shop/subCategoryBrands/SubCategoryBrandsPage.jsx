import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  Menu,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputBase,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import 'swiper/css'
import { useTranslation } from 'react-i18next'
import {
  AllProductsGridStyle,
  CategoriesStyle,
  filterMenuStyles,
} from './style.jsx'
import { CiSearch } from 'react-icons/ci'
import Breadcrumbs from '../../../components/BreadCrumbs/BreadCrumbs.jsx'
import { useGetAllProductsByCategoryQuery } from '../../../redux/apis/ProductApis.js'
import { useLazyGetAllAttributesQuery } from '../../../redux/apis/attributeApi.js'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import { colors } from './style.jsx'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloseIcon from '@mui/icons-material/Close'
// import Card8 from '../../../components/Cards/Horizontal Rectangle/strockCustomCard7/index.jsx'
import { useGetBrandsBySubIdQuery } from '../../../redux/apis/subcategoriesApi.js'
import BrandProducts from './BrandProducts.jsx'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useFetchCategoriesWithSubs } from '../../../layouts/Navbars/buttonStyle/without/navbar.hooks.js'

// ===================================search Filters===============================
const Search = ({ onChange }) => {
  const [search, setSearch] = useState('')
  const location = useLocation()
  let searchedQuery = `keyword[title_en]=${search}&keyword[title_ar]=
  ${search}&keyword[description_en]=${search}&keyword[description_ar]=${search}`
  useEffect(() => {
    setSearch('')
  }, [location.pathname])
  const {
    i18n: { language },
  } = useTranslation()
  useEffect(() => {
    const id = setTimeout(() => {
      const s = search.trim() ? searchedQuery : ''
      onChange(s)
    }, 500)
    return () => {
      clearTimeout(id)
    }
  }, [search])
  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '0.5rem',
        display: 'flex',
        border: `1px solid #333`,
        alignItems: 'center',
        padding: '0.5rem',
        justifyContent: 'space-between',
      }}
    >
      <Box
        component={'input'}
        placeholder={language === 'en' ? 'Search' : 'بحث'}
        sx={{
          width: '100%',
          height: '100%',
          border: `none`,
          outline: 'none',
          fontSize: '1rem',
          fontWeight: 'bold',
          zIndex: 2,
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* <CiSearch size={24} /> */}
    </Box>
  )
}

// ===============================search Filters===============================

//===================================PreoductGrid=============================

//===================================PreoductGrid=============================

export const SubCategoryBrandsPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('populate=subCategory')
  const [, { language: lng }] = useTranslation()
  const { subId, categoryItemId } = useParams()
  const navigate = useNavigate()
  const nav = useNavigate()
  const {
    data: subAllBrands,
    isLoading: subBrandsLoading,
    isError,
    isSuccess,
  } = useGetBrandsBySubIdQuery(
    subId +
      `${filterQuery ? `&${query}` : query}${
        query ? `&${filterQuery}` : filterQuery
      }`
  )
  console.log('subAllBrands', subAllBrands)
  const Styles = CategoriesStyle(lng)
  useEffect(() => {
    if (isError && !isSuccess) setData([])
    setData(subAllBrands?.data)
    setLoading(subBrandsLoading)
  }, [subAllBrands, subBrandsLoading, query])
  const { categoriesWithSubs } = useFetchCategoriesWithSubs()
  let findedCategory =
    data &&
    categoriesWithSubs?.data?.find((el) => el?.category?._id === categoryItemId)

  let findedSub =
    findedCategory &&
    findedCategory.subCategories.find((el) => el.subCategory._id === subId)
  return (
    <Box pt={'50px'}>
      <Box sx={{ ...Styles.Box, px: 2 }}>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            my: 5,
            // px: 3,
            direction: lng === 'en' ? 'ltr' : 'rtl',
            bgcolor: colors.bgcolor,
            wordBreak: 'break-word',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.primary,
              fontSize: {
                lg: '20px',
                xs: '16px',
              },
              ':hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
              },
              display: 'inline-block',
            }}
            onClick={() => navigate('/')}
          >
            {lng === 'en' ? 'Home' : 'الرئيسية'}
          </Typography>
          {findedCategory && (
            <>
              <NavigateNextIcon
                fontSize="small"
                sx={{
                  transform: `rotateY(${lng === 'ar' ? '180deg' : '0'})`,
                  color: colors.primary,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  cursor: 'pointer',
                  color: colors.secondary,
                  fontSize: {
                    lg: '15px',
                    xs: '15px',
                  },
                  ':hover': {
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  },
                }}
                onClick={() =>
                  navigate(
                    `/departments/${
                      findedCategory.category._id
                    }/${findedCategory.category.name_en.replace(/\s+/g, '-')}`
                  )
                }
              >
                {findedCategory.category[`name_${lng}`]}
              </Typography>
            </>
          )}
          <NavigateNextIcon
            fontSize="small"
            sx={{
              transform: `rotateY(${lng === 'ar' ? '180deg' : '0'})`,
              color: colors.primary,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              cursor: 'pointer',
              color: colors.secondary,
              fontSize: {
                lg: '15px',
                xs: '15px',
              },
              ':hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
              },
            }}
            onClick={() => {
              navigate(
                `/departments/${findedCategory?.category._id}/${
                  findedSub?.subCategory._id
                }/${findedSub?.subCategory.name_en.replace(/\s+/g, '-')}`
              )
            }}
          >
            {findedSub?.subCategory[`name_${lng}`]}
          </Typography>
          <NavigateNextIcon
            fontSize="small"
            sx={{
              transform: `rotateY(${lng === 'ar' ? '180deg' : '0'})`,
              color: colors.primary,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              cursor: 'default',
              color: colors.secondary,
              fontSize: {
                lg: '15px',
                xs: '15px',
              },
            }}
          >
            {lng === 'en' ? 'All' : 'الجميع'}
          </Typography>
        </Stack>

        <Stack
          direction={'column'}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {!loading ? (
            data.map((item) => {
              return (
                <>
                  <Typography
                    sx={Styles.Typography}
                    onClick={() =>
                      nav(
                        `/departments/${categoryItemId}/${subId}/${
                          item._id
                        }/${item.name_en.replace(/\s+/g, '-')}`
                      )
                    }
                  >
                    {item[`name_${lng === 'en' ? 'en' : 'ar'}`]}
                  </Typography>
                  <BrandProducts brandId={item._id} query={query} />
                </>
              )
            })
          ) : (
            <span className="loader"></span>
          )}
          {!loading && (data?.length < 1 || data?.length === undefined) && (
            <Typography color={'error'} sx={{ m: 5, fontSize: '2rem' }}>
              {lng === 'en' ? 'No products found' : 'لا توجد منتجات'}
            </Typography>
          )}
          {/* not fo */}
        </Stack>
      </Box>
    </Box>
  )
}
