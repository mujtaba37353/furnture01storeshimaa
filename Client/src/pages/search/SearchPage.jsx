import React, { useState ,useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchSearchedProducts } from './searching.hooks'
import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs'
import Styles from './Styles'
import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Search } from './utiles/Searching'
import { FilterAttributesMenu } from './utiles/FilterAttributesMenu'
import Card8 from '../../components/Cards/Horizontal Rectangle/strockCustomCard7/index.jsx'
import { AllProductsGrid } from './utiles/AllProductsGrid.jsx'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useGetAllProductsQuery } from '../../redux/apis/ProductApis.js'
const SearchPage = () => {
  const { searchedTitle } = useParams()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [_, { language: lng }] = useTranslation()
  const [filterQuery, setFilterQuery] = useState('')
  const { data, isLoading, error } = useGetAllProductsQuery(
    `${filterQuery ? `&${query}` : query}${
      query ? `&${filterQuery}` : filterQuery
    }`
  )
  return (
    <>
     
      <Box
        sx={{
          ...Styles.Stack,
          alignItems: 'flex-start',
          justifyContent: 'center',
          direction: lng === 'en' ? 'ltr' : 'rtl',
          px: {
            md: '20px',
            xs: '5px',
          },
          width:'90%',
          margin:'auto',

          flexDirection: 'column',
          my:5
        }}
      >
         <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
         
          direction: lng === 'en' ? 'ltr' : 'rtl',
          bgcolor: 'transparent',
          wordBreak: 'break-word',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#000',
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
        <NavigateNextIcon
          fontSize="small"
          sx={{
            transform: `rotateY(${lng === 'ar' ? '180deg' : '0'})`,
            color: '#000',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            cursor: 'default',
            color: '#000',
            fontSize: {
              lg: '15px',
              xs: '15px',
            },
          }}
        >
          {lng === 'en' ? 'searching' : 'البحث'}
        </Typography>
        {searchedTitle && (
          <>
            <NavigateNextIcon
              fontSize="small"
              sx={{
                transform: `rotateY(${lng === 'ar' ? '180deg' : '0'})`,
                color: '#000',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                cursor: 'default',
                color: '#000',
                fontSize: {
                  lg: '15px',
                  xs: '15px',
                },
              }}
            >
              {searchedTitle.replaceAll('_', ' ')}
            </Typography>
          </>
        )}
      </Stack>
        <Box
          sx={{
           
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            width:'100%',
            flexDirection:{
              xs:'column',
              sm:'column',
              md:'row'
          
      }
          }}
        >
          <Box sx={{
            width:{
              xs:'100%',
              md:'80%'
            },
            mb:{
              xs:'10px',
              md:'0px'
            }
          }}>
          <Search
            searchedTitle={searchedTitle.replaceAll('_', ' ')}
            onChange={(value) => setQuery(value)}
          />
          </Box>
           <FilterAttributesMenu
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
        />
        </Box>
       
      </Box>
      <Box sx={{ ...Styles.Box, direction: lng === 'en' ? 'ltr' : 'rtl' }}>
        <Stack direction={'column'} sx={Styles.StackDirection}>
          {isLoading ? (
            <span className="loader"></span>
          ) : data && !error ? (
            <Stack direction={'column'} sx={Styles.AllProductsGridContainer}>
              <AllProductsGrid
                cards={data?.data.map((pro, index) => (
                  <Box
                    key={index}
                    className="card_category Two_column"
                    sx={{
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
            </Stack>
          ) : (
            <Typography
              color={'error'}
              sx={{ m: 5, fontSize: '2rem', textAlign: 'center' }}
            >
              {lng === 'en'
                ? 'There are no products matching your search'
                : 'لا توجد منتجات مطابقة لبحثك'}
            </Typography>
          )}
        </Stack>
      </Box>
    </>
  )
}
export default SearchPage
