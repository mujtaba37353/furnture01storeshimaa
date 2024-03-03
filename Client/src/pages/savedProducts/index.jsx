import { Box, Grid, Stack, Typography } from '@mui/material'
import 'swiper/css'
import { useTranslation } from 'react-i18next'
import {
  AllProductsGridStyles,
  SavedProductsStyles,
} from './SavedProducts.style.jsx'
import { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { useGetAllSavedProductsQuery } from '../../redux/apis/SavedProductApi.js'
import Card7 from '../../components/Cards/Horizontal Rectangle/StrokeCard7/index.jsx'
import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs.jsx'

import { FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Card8 from './../../components/Cards/Horizontal Rectangle/strockCustomCard7/index';

const Search = ({ onChange, extraWidth }) => {
  const [search, setSearch] = useState('')
  const {
    i18n: { language },
  } = useTranslation()
  useEffect(() => {
    const id = setTimeout(() => {
      const s = search.trim()
        ? `keyword[title_en]=${search}&keyword[title_ar]=${search}&keyword[description_en]=${search}&keyword[description_ar]=${search}`
        : ''
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
        mb: 5,
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
      <CiSearch size={24} />
    </Box>
  )
}


function AllProductsGrid({ cards }) {
  return (
    <Grid
      container
      spacing={{
        xs: 1,
        sm: 1,
        md: 3,
        lg: 2,
        xl:3,
      }}
      pt={1}
      width={{ xs: '100%', sm: '100%',lg:"90%" }}

    >
      {cards?.map((card, index) => (
        <Grid
          item
          xs={6}
          sm={6}
          
          md={4}
          xl={4}
          key={index}
          sx={AllProductsGridStyles.CardItem}
        >
          {card}
        </Grid>
      ))}
    </Grid>
  )
}
export const SavedProductsPage = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('')

  const [, { language: lng }] = useTranslation()
  //custom hook
  const { data: favPros, isLoading: favLoading } =
    useGetAllSavedProductsQuery(query)
  const Styles = SavedProductsStyles({ props, lng })
  //custom hook
  useEffect(() => {
    setData(favPros?.data?.favourite)
    setLoading(favLoading)
  }, [favPros, favLoading])

  return (
    <>
      <Box sx={Styles.Box} direction={'column'}>
        {!loading && data?.length > 0 && (
          <Stack sx={Styles.Stack} direction={'row'}>
            <Search
              extraWidth={{
                lg: 0.5,
                xs: 1,
              }}
              onChange={(value) => {
                setQuery(value)
              }}
            />
          </Stack>
        )}

        <Stack direction={'column'} sx={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
        }}>
          {!favLoading ? (
            <Grid
              container
              mt={10}
              spacing={AllProductsGridStyles.ContainerSpacing}
              sx={{
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems:'center',
                width:'100%'
              }}
            >
              <AllProductsGrid
                cards={data?.map((pro, index) => (
                  <Box
                    className="card_category Two_column"
                    sx={{
                      // border: '1px solid red',
                      '& button': {
                        padding: {
                          xs: '13px 30px !important',
                          md: '11px 30px !important',
                        },
                      },
                    }}
                  >
                    <Card8 data={pro} />
                  </Box>
                ))}
              />
            </Grid>
          ) : (
            <span className="loader"></span>
          )}
          {!loading && (data?.length < 1 || data?.length === undefined) && (
            // <Typography color={'error'} sx={{ m: 20, fontSize: '2rem' }}>
            //   {lng === 'en' ? 'No products found' : 'لا يوجد منتجات'}
            // </Typography>
            <EmptyFavorite lng={lng} />
          )}
          {/* not fo */}
        </Stack>
      </Box>
    </>
  )
}
const EmptyFavorite = ({ lng }) => {
  return (
    <Stack
      direction={'column'}
      alignItems={'center'}
      mt={10}
      sx={{ minHeight: '80vh' }}
    >
      <Stack
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          bgcolor: '#727272',
          width: { xs: '200px', md: '250px' },
          height: { xs: '200px', md: '250px' },
          borderRadius: '50%',
          mb: 2,
        }}
      >
        <FaHeart fontSize={'4rem'} color="#000" />
      </Stack>
      <Typography sx={{ fontSize: '1.5rem' }} fontWeight={'bold'}>
        {lng === 'en' ? 'No Favorites Products Yet' : 'لا يوجد منتجات مفضله'}
      </Typography>
      <Typography variant="caption" color={'GrayText'}>
        {lng === 'en'
          ? 'Save your favorite products to find them easily'
          : 'قم بحفظ المنتجات المفضله لك لتجدها بسهوله'}
      </Typography>
      <Typography
        component={Link}
        to={'/departments'}
        sx={{
          color: '#ffff',
          bgcolor: '#000000',
          fontSize: { xs: '1.2rem', md: '1.3rem' },
          textDecoration: 'none',
          px: 7,
          py: 1.5,
          cursor: 'pointer',
          mt: 5,
        }}
      >
        {lng == 'en' ? 'Start Shopping' : 'ابدأ التسوق'}
      </Typography>
    </Stack>
  )
}
