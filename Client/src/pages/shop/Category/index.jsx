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
import { useEffect, useState,useRef } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AllProductsGridStyles,
  DepertmentStyles,
  SearchStyles,
} from './category.style.jsx'
import { CiSearch } from 'react-icons/ci'
import CloseIcon from '@mui/icons-material/Close'
import Breadcrumbs from '../../../components/BreadCrumbs/BreadCrumbs.jsx'
import { useLazyGetAllProductsQuery } from '../../../redux/apis/ProductApis'
import { useLazyGetAllAttributesQuery } from '../../../redux/apis/attributeApi.js'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import { colors } from './category.style.jsx'
import { filterMenuStyles } from './category.style.jsx'
import RefreshIcon from '@mui/icons-material/Refresh'
import MetaTags from '../../../components/metaTags/MetaTags.jsx'
import Card8 from '../../../components/Cards/Horizontal Rectangle/strockCustomCard7/index.jsx'
import Pagination from '@mui/material/Pagination'
// ============FilterSearch=========================
const Search = ({ onChange }) => {
  const [search, setSearch] = useState('')
  const location = useLocation()
  useEffect(() => {
    setSearch('')
  }, [location.pathname])
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
    <Box sx={SearchStyles.BoxSearch}>
      <Box
        component={'input'}
        placeholder={language === 'en' ? 'Search' : 'بحث'}
        sx={SearchStyles.BoxInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <CiSearch size={24} />
    </Box>
  )
}
// ============FilterSearch=========================

function AllProductsGrid({ cards }) {
  return (
    <Grid
      container
      spacing={{
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 3,
      }}
      pt={1}
      width={{ xs: '97%', sm: '100%', md: '100%', lg: '90%' }}
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
// ============FilterSearch=========================

// ============================HookCategory====================
const useFetchProductsByCategoryId = (categoryId, subId, query) => {
  const [params, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [paginationData, setPaginationData] = useState({})
  const [getAllProducts, { isLoading }] = useLazyGetAllProductsQuery()
  const pageNumber = params.get('page') || 1
  useEffect(() => {
    if (categoryId && !subId) {
      params.set('category', categoryId)
      params.set('limit', 24)
      params.set('page', pageNumber)

      getAllProducts(
        // `category=${categoryId}&limit=2${query ? `&${query}` : ''}&page=${pageNumber}`
        params.toString().concat(query ? `&${query}` : '')
      )
        .unwrap()
        .then((res) => {
          setPaginationData(res.paginationResult)
          setProducts(res.data)
        })
        .catch(() => {
          setProducts([])
        })
    }
  }, [query, categoryId, subId, pageNumber])
  return {
    categoryProducts: products,
    isLoading,
    paginationData,
    params,
    setSearchParams,
  }
}
// ============================   HookCategory      ====================
export const CategoryPage = (props) => {
  const { categoryId } = useParams()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [, { language: lng }] = useTranslation()
  //custom hook
  const {
    categoryProducts,
    isLoading: categoryProductsLoading,
    paginationData,
    params,
    setSearchParams,
  } = useFetchProductsByCategoryId(
    categoryId,
    undefined,
    `${filterQuery ? `&${query}` : query}${
      query ? `&${filterQuery}` : filterQuery
    }`
  )
  const Styles = DepertmentStyles({ props, lng })
  useEffect(() => {
    setData(categoryProducts)
    setLoading(categoryProductsLoading)
  }, [categoryProducts, categoryProductsLoading, categoryId])
  const { totalPages } = paginationData

  const handlPagination = (e, page) => {
    params.set('page', page)
    setSearchParams(params)
  }

  return (
    <>
      {/* Get Category Meta */}
      <MetaTags id={categoryId} />
      <Box
        sx={{
          ...Styles.Stack,
          alignItems: 'center',
          justifyContent: 'flex-start',
          direction: lng === 'en' ? 'ltr' : 'rtl',
          px: {
            md: '20px',
            xs: '5px',
          },
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        }}
      >
              <Breadcrumbs colors={Styles.Breadcrumbs} />

        {/* <Search onChange={(value) => setQuery(value)} /> */}
    
      </Box>
      <Box sx={Styles.Box}>
        <Stack direction={'column'} sx={Styles.StackDirection}>
          {!loading ? (
            <Stack direction={'column'} sx={Styles.AllProductsGridContainer}>
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
              {totalPages > 1 && (
                <Box
                  sx={{
                    direction: 'ltr',
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={Number(params.get('page' || 1))}
                    variant="outlined"
                    shape="rounded"
                    onChange={handlPagination}
                  />
                </Box>
              )}
            </Stack>
          ) : (
            <span className="loader"></span>
          )}
          {!loading && (data?.length < 1 || data?.length === undefined) && (
            <Typography color={'error'} sx={{ m: 5, fontSize: '2rem' }}>
              {lng === 'en' ? 'No products found' : 'لا يوجد منتجات'}
            </Typography>
          )}
          {/* not fo */}
        </Stack>
      </Box>
    </>
  )
}
function FilterAttributesMenu({ filterQuery, setFilterQuery }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [_, { language: lang }] = useTranslation()
  const { attributesData } = GenerateAttributeData()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    formik.resetForm()
    setExpanded(false)
  }
  const [expanded, setExpanded] = useState(false)
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const manipulateQuery = () => {
    let query = ''
    let selAttsValues = selectedAtts
      .reduce((item, obj) => {
        return item.concat(obj.values)
      }, [])
      .map(({ value_en }) => value_en)
    selAttsValues.map((val) => (query += `attributes.values.value_en=${val}&`))
    if (priceState) {
      query += !query ? `` : '&'
      query += `priceBeforeDiscount[gte]=${priceState.from}&priceBeforeDiscount[lte]=${priceState.to}`
    }
    return query
  }
  const [selectedAtts, setSelectedAtts] = useState([])
  const [priceState, setPriceState] = useState()
  const hundleAddAtt = (attribute, selectedValue, event) => {
    const existedAtt = selectedAtts.find(
      (item) => item.key_en === attribute.key_en
    )
    const { checked, value } = event.target
    if (checked) {
      existedAtt
        ? setSelectedAtts(
            selectedAtts.map((item) =>
              item.key_en === attribute.key_en
                ? {
                    key_en: attribute.key_en,
                    key_ar: attribute.key_ar,
                    values: [...existedAtt.values, { ...selectedValue }],
                  }
                : item
            )
          )
        : setSelectedAtts([
            ...selectedAtts,
            {
              key_en: attribute.key_en,
              value_en: attribute.key_ar,
              values: [selectedValue],
            },
          ])
    } else {
      existedAtt?.values?.length > 1
        ? setSelectedAtts(
            selectedAtts.map((item) =>
              item.key_en === existedAtt.key_en
                ? {
                    ...existedAtt,
                    values: existedAtt?.values.filter(
                      (val) => val.value_en !== value
                    ),
                  }
                : item
            )
          )
        : setSelectedAtts(
            selectedAtts.filter((sel) => sel.key_en !== existedAtt?.key_en)
          )
    }
  }
  useEffect(() => {
    setFilterQuery(manipulateQuery())
  }, [selectedAtts, priceState])
  const formik = useFormik({
    initialValues: { from: '', to: '' },
    validationSchema: object({
      from: string().required(),
      to: string().required(),
    }),
    onSubmit: (values, { resetForm }) => {
      setPriceState(values)
      let submitQueries = `priceBeforeDiscount[gte]=${values.from}&priceBeforeDiscount[lte]=${values.to}`
      setFilterQuery(query ? `${query}&${submitQueries}` : submitQueries)
      resetForm()
    },
  })
  const refetchAllProducts = (e) => {
    setFilterQuery('')
    setSelectedAtts([])
    setPriceState()
  }
  const clearPriceFilter = () => {
    let priceQueries = `priceBeforeDiscount[gte]=${priceState.from}&priceBeforeDiscount[lte]=${priceState.to}`
    setFilterQuery(filterQuery.replace(priceQueries, ''))
    setTimeout(() => {
      setPriceState()
    }, 240)
  }


  // Handle Kyes
  const submitButtonRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      // Add any additional logic or validation here if needed
      // Then disable the submit button
      disableSubmitButton();
    }
  };

  const disableSubmitButton = () => {
    // Add logic to disable the submit button
    // For example, you might have a state variable like isSubmitButtonDisabled
    // and you can set it to true to disable the button
    // this.setState({ isSubmitButtonDisabled: true });
  };

  useEffect(() => {
    // Attach the keydown event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures that the effect runs only once on mount

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'flex-end'}
      sx={{
        width: 'auto',
        gap: '10px',
      }}
    >
      <Box>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={
            <FilterAltOutlinedIcon
              sx={{
                color: `${colors.filter.buttonColor} !important`,
              }}
            />
          }
          sx={{
            bgcolor: `${colors.filter.buttonBg} !important`,
            py: '10px',
          }}
        >
          <Typography sx={filterMenuStyles.menuButton}>
            {lang === 'en' ? 'filter by' : 'تصفية حسب'}
          </Typography>
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            maxHeight: 600,
            p: 0,
            direction: lang === 'en' ? 'ltr' : 'rtl',
          }}
        >
          {attributesData?.length > 0 &&
            attributesData?.map((attribute) => (
              <Accordion
                expanded={expanded === attribute.key_en}
                onChange={handleChange(attribute.key_en)}
                sx={{
                  m: '0 !important',
                }}
              >
                <AccordionSummary
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    {selectedAtts.includes((item) =>
                      item.key_en == attribute.key_en ? (
                        <CheckBoxIcon
                          sx={{
                            color: 'blue',
                            fontSize: '20px',
                          }}
                        />
                      ) : undefined
                    )}
                    <Typography sx={filterMenuStyles.checkBoxLabel}>
                      {attribute[`key_${lang}`]}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    overflow: 'hidden',
                  }}
                >
                  {attribute.values?.map((value) => (
                    <Stack sx={filterMenuStyles.checkBoxContainer}>
                      <input
                        type="checkbox"
                        id={value.value_en}
                        value={value.value_en}
                        checked={selectedAtts.find(
                          (item) =>
                            item.key_en === attribute.key_en &&
                            item.values.find(
                              ({ value_en }) => value_en === value.value_en
                            )
                        )}
                        style={{
                          accentColor: 'blue',
                        }}
                        onChange={(event) =>
                          hundleAddAtt(attribute, value, event)
                        }
                      />
                      <Typography
                        component="label"
                        htmlFor={value.value_en}
                        sx={filterMenuStyles.checkBoxLabel}
                      >
                        {value[`value_${lang}`]}
                      </Typography>
                    </Stack>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          <Accordion
            expanded={expanded === 'price'}
            onChange={handleChange('price')}
            sx={{
              m: '0 !important',
            }}
          >
            <AccordionSummary
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  ...filterMenuStyles.priceBtn,
                  fontWeight: 'normal',
                  color: '#414042',
                  fontSize: '20px',
                }}
              >
                {lang === 'en' ? 'Price' : 'السعر'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                border: 1,
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              <Box component="form" onSubmit={formik.handleSubmit}>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 200,
                  }}
                >
                  <Box
                    sx={{
                      width: 0.45,
                    }}
                  >
                    <Typography
                      sx={{
                        ...filterMenuStyles.checkBoxLabel,
                        fontSize: '12px',
                      }}
                    >
                      {lang === 'en' ? 'From' : 'من'}
                    </Typography>
                    <InputBase
                      name="from"
                      type="number"
                      value={formik.values.from}
                      onChange={formik.handleChange}
                       disabled={priceState}
                      sx={{
                        border: `1px solid ${
                          formik.errors.from && formik.touched.from
                            ? 'red'
                            : '#ddd'
                        } `,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 0.45,
                    }}
                  >
                    <Typography
                      sx={{
                        ...filterMenuStyles.checkBoxLabel,
                        fontSize: '12px',
                      }}
                    >
                      {lang === 'en' ? 'To' : 'إلي'}
                    </Typography>
                    <InputBase
                      type="number"
                      name="to"
                      value={formik.values.to}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={priceState}
                      sx={{
                        border: `1px solid ${
                          formik.errors.to && formik.touched.to ? 'red' : '#ddd'
                        } `,
                      }}
                    />
                  </Box>
                </Stack>

                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Button
                    disabled={priceState}
                    type="submit"
                    sx={filterMenuStyles.formPriceBtn}
                    ref={submitButtonRef}

                    onClick={(e)=>{
                      console.log(e,e.key,'sadsadsadsda')

                      if (e.key === 'Enter') {
                        console.log(e,'sadsadsadsda')
                      e.preventDefault();  
                      }
                      }}
                  >
                    {lang === 'en' ? 'Search by price' : 'بحث بالسعر'}
                  </Button>
                  {priceState && (
                    <CloseIcon
                      sx={{ cursor: 'pointer' }}
                      onClick={clearPriceFilter}
                    />
                  )}
                </Stack>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Menu>
      </Box>
      {selectedAtts?.length > 0 || filterQuery ? (
        <RefreshIcon
          sx={{
            color: colors.filter.checkBoxLabel,
            cursor: 'pointer',
          }}
          onClick={refetchAllProducts}
        />
      ) : undefined}
    </Stack>
  )
}
const GenerateAttributeData = () => {
  const [getAllAttributes] = useLazyGetAllAttributesQuery()
  const [attributesData, setAtts] = useState()
  useEffect(() => {
    getAllAttributes()
      .unwrap()
      .then((res) => {
        setAtts(res.data)
      })
      .catch((err) => {
        setAtts()
      })
  }, [])
  return {
    attributesData,
  }
}
