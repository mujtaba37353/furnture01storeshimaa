import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import img1 from '../../../assets/jpg/img.png';
import img2 from '../../../assets/jpg/img.png';
import img3 from '../../../assets/jpg/img.png';

import {
  Box,
  Button,
  Container,
  Grid,
  Rating,
  Stack,
  Chip,
  Link,
  Typography,
  ButtonGroup,
} from '@mui/material'
import { IconButton, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useAddRatingMutation,
  useGetSingleProductQuery,
} from '../../../redux/apis/ProductApis.js'
import { useTranslation } from 'react-i18next'
import { imageBaseUrl } from '../../../constants/baseUrl.js'
import {
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useGetAllCartsQuery,
} from '../../../redux/apis/cartApi'
import { toast } from 'react-toastify'
import Popover from '@mui/material/Popover'

import { useSelector } from 'react-redux'
// import Banner from '../../HomePage/Banners/Banner'
import { Nooncolors } from './colors.jsx'
import Breadcrumbs from '../../../components/BreadCrumbs/BreadCrumbs.jsx'
import { NavLink } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Similarproduct from '../similarproduct/index.jsx'
import ProductComments from '../../../components/productComments/ProductComments.jsx'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
// import Banner from '../../../components/Banners/Banner.jsx'
// import { useGetSingleProductQuery } from '../src/APIs/ProductApis'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useAddToSavedProductMutation } from '../../../redux/apis/SavedProductApi.js'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { CustomZoomContent } from './CustomZoom.jsx'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Qualites from './Qualities.jsx'
const BreadcrumbColors = {
  bgcolor: 'red',
  primary: 'white',
  secondary: 'white',
}
// ================================customBreadCumbs=============================
function CustomBreadcrumb({ data, lng }) {
  console.log(data)
  return (
    <Grid
      item
      xs={12}
      sx={{
        display: 'flex',
        justifyContent: 'end',
        pb: 2,
      }}
    >
      <Breadcrumbs
        colors={BreadcrumbColors}
        dir={lng === 'en' ? 'ltr' : 'rtl'}
        aria-label="breadcrumb"
      >
        <Link component={NavLink} underline="hover" color="inherit" to="/">
          {lng === 'en' ? 'Home' : 'الرئيسية'}
        </Link>
        {data}

        <Typography color="text.primary">
          {lng === 'en' ? data.title_en : data.title_ar}
        </Typography>
      </Breadcrumbs>
    </Grid>
  )
}
// ================================customBreadCumbs=============================
function MouseOverPopover({
  children,
  text,
  cartData,
  setCartData,
  key,
  attr,
  values,
}) {
  console.log(cartData)
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (event) => {
    setCartData((prev) => {
      const newQualities = prev?.qualities?.filter(
        (v) => v.key_en !== attr.key_en && v.key_ar !== attr.key_ar
      )
      return {
        ...prev,
        qualities: [
          ...newQualities,
          {
            key_en: attr.key_en,
            key_ar: attr.key_ar,
            value_en: values.value_en,
            value_ar: values.value_ar,
            price: values?.price,
          },
        ],
      }
    })
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setCartData((prev) => ({
      ...prev,
      qualities: cartData.qualitiesBefore,
    }))
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {children}
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        disablePortal
        disableScrollLock
        transformOrigin={{
          vertical: 'top',
          horizontal: 'top',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2 }}> {text}</Typography>
      </Popover>
    </div>
  )
}
//   ========================================Attr===============================

const Attrs = ({ colors, attr, setCartData, cartData }) => {
  const { attrAciveColors } = colors
  console.log(colors)
  const [, { language: lng }] = useTranslation()
  const handleUpdateQualities = ({ attr, values }) => {
    setCartData((prev) => {
      const newQualities = prev.qualities.filter(
        (v) => v.key_en !== attr.key_en && v.key_ar !== attr.key_ar
      )
      // qualitiesBefore
      const qualitiesBeforeHover = [
        ...newQualities,
        {
          key_en: attr.key_en,
          key_ar: attr.key_ar,
          value_en: values.value_en,
          value_ar: values.value_ar,
          price: values?.price,
        },
      ]

      return {
        ...prev,
        qualities: qualitiesBeforeHover,
        qualitiesBefore: qualitiesBeforeHover,
      }
    })
  }
  const isSelectedAtt = (val) =>
    val.value_en ===
    cartData?.qualities?.findLast((v) => v.key_en === attr.key_en)?.value_en

  return (
    <Box
      key={attr._id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: lng === 'en' ? 'row' : 'row-reverse',
      }}
      dir="ltr"
    >
      <Typography
        sx={{
          color: colors.attrKeyColor,
          fontWeight: 'bold',
          textAlign: lng === 'en' ? 'left' : 'right',
          marginLeft: '10px',
        }}
      >
        {attr[`key_${lng === 'en' ? 'en' : 'ar'}`]}
      </Typography>
      <ButtonGroup
      // disabled={
      //   attr.key_en ===
      //   cartData.qualities.find((v) => v.key_en === attr.key_en)?.key_en
      // }
      >
        {attr?.values?.map((val) => (
          <>
            {!val[`color`]?.startsWith('#') ? (
              <Button
                sx={{
                  color: isSelectedAtt(val)
                    ? attrAciveColors.ActiveColor
                    : colors.attrValueColor,
                  bgcolor: isSelectedAtt(val)
                    ? attrAciveColors.background
                    : `${colors.attrValueBgColor} !important`,
                  borderColor: `${colors.attrValueBorderColor} !important`,
                  boxShadow: attrAciveColors.boxShadow,
                  margin: 'auto 10px',
                  height: '30px',
                  'border-radius': ' 6px',
                  border: '1px solid #ddd !important',
                }}
                key={val.value_en}
                onClick={() =>
                  handleUpdateQualities({
                    attr,
                    values: {
                      value_en: val.value_en,
                      value_ar: val.value_ar,
                      price: val?.price,
                    },
                  })
                }
              >
                <MouseOverPopover
                  text={`${val.price} 
            ${lng === 'en' ? 'SAR' : 'رس'}`}
                  setCartData={setCartData}
                  cartData={cartData}
                  attr={attr}
                  values={{
                    value_en: val?.value_en,
                    value_ar: val?.value_ar,
                    price: val?.price,
                  }}
                  sx={{
                    fontSize: '15px !important',
                  }}
                >
                  {val[`value_${lng === 'en' ? 'en' : 'ar'}`]}
                </MouseOverPopover>
              </Button>
            ) : (
              <MouseOverPopover
                text={`${val.price} 
${lng === 'en' ? 'SAR' : 'رس'}`}
                setCartData={setCartData}
                cartData={cartData}
                attr={attr}
                values={{
                  value_en: val?.value_en,
                  value_ar: val?.value_ar,
                  price: val?.price,
                }}
              >
                <Box
                  sx={{
                    color:
                      val[`color`] === '#fff' ||
                      val[`color`] === 'white' ||
                      val['color'].toLowerCase().includes('#fff') ||
                      val[`color`] === '#fffff'
                        ? '#333'
                        : '#fff',

                    borderColor: `${colors.attrValueBorderColor} !important`,
                    boxShadow: attrAciveColors.boxShadow,
                    margin: 'auto 10px',
                    height: '30px',
                    'border-radius': ' 6px',
                    border: '1px solid #ddd !important',
                    background: `${val[`color`]}`,
                    cursor: 'pointer',
                    padding: ' 5px 15px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  key={val.value_en}
                  onClick={() =>
                    handleUpdateQualities({
                      attr,
                      values: {
                        value_en: val.value_en,
                        value_ar: val.value_ar,
                        price: val?.price,
                      },
                    })
                  }
                >
                  {val[`value_${lng === 'en' ? 'en' : 'ar'}`]}
                </Box>
              </MouseOverPopover>
            )}
          </>
        ))}
      </ButtonGroup>
    </Box>
  )
}

//
// ========================================copyButton===========================================
const CopyButton = ({ colors }) => {
  const [, { language: lng }] = useTranslation()
  const [copied, setCopied] = useState(false)
  const product_url = window.location.href
  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
      })
      .catch((error) => {
        setCopied(false)
        console.error('Error copying text to clipboard:', error)
      })
  }
  return (
    <Tooltip
      title={
        lng === 'en'
          ? copied
            ? 'Product link has been copied'
            : 'Product Link'
          : copied
          ? 'تم نسخ الرابط'
          : ' نسخ رابط المنتج'
      }
      sx={{
        color: colors.buttonColor,
        bgcolor: colors.buttonBgColor,
        '&:hover': { bgcolor: `${colors.buttonBgColor} !important` },
      }}
    >
      <IconButton onClick={() => handleCopy(product_url)}>
        <ContentCopyIcon />
      </IconButton>
    </Tooltip>
  )
}
// ========================================copyButton===========================================

// =========================================custom Payment Type =====================================
const MAP_TYPE = {
  cash: {
    ar: 'عند الاستلام',
    en: 'cash',
  },
  online: {
    ar: 'الدفع اونلاين',
    en: 'online',
  },
  both: {
    ar: 'الدفع عند الاستلام او اونلاين',
    en: 'online or cash',
  },
}
// =========================================custom Payment Type =====================================

function CustomPaymentType({ type, lang }) {
  return (
    <Stack direction={'row'} gap={2}>
      <Typography variant="h6">
        {lang === 'ar' ? MAP_TYPE[type]?.ar : MAP_TYPE[type]?.en}
      </Typography>

      <Typography variant="h6">
        {' :'} {lang === 'en' ? 'Payment Type' : 'الدفع'}
      </Typography>
    </Stack>
  )
}
// =========================================custom Payment Type =====================================

export const NoonSingleProduct = () => {
  const { currencyPrice, label } = useSelector((state) => state.currency)
  const labelText = label.match(/\(([^)]+)\)/)
  const currencySymbol = labelText ? labelText[1] : ''
  const [categoryId, Setcategoryid] = useState()
  const [cartIn, SetCartIn] = useState(false)
  const colors = Nooncolors
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const { id } = useParams()
  const { data, isLoading, isError } = useGetSingleProductQuery(id)
  const [, { language: lng }] = useTranslation()
  const [paymentMethod, setPaymentMethod] = useState('')
  //
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)
  const navigate = useNavigate()
  const {
    data: cartItems,
    error,
    isError: IsCartInErorr,
    isSuccess,
  } = useGetAllCartsQuery(undefined)
  const [cartData, setCartData] = useState({
    quantity: 1,
    qualities: [],
    id: id,
  })
  const [addToSavedProduct] = useAddToSavedProductMutation()

  // product Attributes
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [check, setCheck] = useState(false)
  const [img, setImage] = useState('')
  const [quantityImages, setquantityImages] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [QuantityImages, setQuantityImages] = useState([])
  // product Attributes
  const [product, setProduct] = useState({})
  const [addToCart, { isLoading: cardLoad }] = useAddToCartMutation()
  const [rate] = useAddRatingMutation()
  const [DeleteCart, { isLoading: DeleteFromCartLoading }] =
    useDeleteFromCartMutation()
  const { savedItems } = useSelector((st) => st)
  useEffect(() => {
    !isError && !isLoading && Setcategoryid(data?.data?.category?.id)
    setProduct(data?.data)
    setSelectedItems([])

    if (data?.qualities != undefined && data?.qualities?.length > 0) {
      console.log(data?.qualities[0], 'qualitiesasda')
      const SelectedItemsResturctured = data?.qualities.map((item) => {
        const { child, ...items } = item
        return {
          ...item,
        }
      })
    }
    setQuantityImages(data?.data?.images)
  }, [data?.data?.category?.id, data])
  const productInCart =
    !isError &&
    cartItems?.data[
      data?.paymentType === 'cash' ? 'cashItems' : 'onlineItems'
    ]?.items?.find((item) => item?.product?._id === data?.data?._id)

  // ===========================================quentityUpdate===================================================\\
  const updateQty = (method) => {
    method === '+'
      ? setCartData({ ...cartData, quantity: cartData.quantity + 1 })
      : cartData.quantity > 1 &&
        setCartData({ ...cartData, quantity: cartData.quantity - 1 })
  }
  // ===========================================quentityUpdate===================================================\\

  const [qImage, setQimages] = useState([])

  const { currentUser } = useSelector((state) => state)

  const handleRating = (productId, rating) => {
    if (!currentUser) {
      toast.error(lng === 'en' ? 'Login first' : 'سجل دخول أولاً')
    } else {
      rate({ productId, rating })
        .unwrap()
        .then((res) =>
          toast.success(lng === 'en' ? res.success_en : res.success_ar)
        )
        .catch((e) =>
          toast.error(lng === 'en' ? e.data.error_en : e.data.error_ar)
        )
    }
  }

  useEffect(() => {
    if (isSuccess && !isLoading) {
      const cards = [
        ...cartItems?.data?.cashItems?.items,
        ...cartItems?.data?.onlineItems?.items,
      ]
      console.log(cards, data?.data, 'cardscardscardscards')
      const InCart = cards.some((item) => {
        console.log(item.product === data?.data, 'dsasada3e13123413')
        return item.product._id === data?.data?._id
      })

      SetCartIn(InCart)
    }
  }, [id, cartItems, data, location.pathname, cartData])

  const HandleAddToCart = (qu) => {
    if (data?.data?.paymentType === 'both')
      if (paymentMethod === '') {
        toast?.error(
          lng === 'en'
            ? 'please Select a payment method First '
            : 'من فضلك اختر طريقه الدفع اولا'
        )
        return
      }

    if (data?.qualities?.length) {
      if (check) {
        console.log(check, 'checkcheck')
        if (cartData.quantity <= quantity) {
          console.log(selectedItems, 'selectedItems')
          addToCart({
            quantity: cartData.quantity,
            id,
            qualities: selectedItems?.map((item) => {
              const { child, ...itemS } = item
              const { color, ...iteme } = itemS
              return {
                ...iteme,
              }
            }),
            paymentType:
              data?.data?.paymentType === 'both'
                ? paymentMethod
                : data?.data?.paymentType,
          })
            .unwrap()
            .then((res) => {
              toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
              setSelectedItems([data?.qualities[0]])
              setCheck(false)
            })
            .catch((e) =>
              toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
            )
        } else {
          toast.error(
            lng === 'en' ? 'Quantity is not avalible' : ' الكميه غير متوفره'
          )
        }
      } else {
        toast.error(
          lng === 'en'
            ? 'please Select qualities First'
            : 'من فضلك اختر المعيار اولا '
        )
      }
    } else {
      addToCart({
        quantity: cartData.quantity,
        id,
        paymentType:
          data?.data?.paymentType === 'both'
            ? paymentMethod
            : data?.data?.paymentType,
      })
        .unwrap()
        .then((res) =>
          toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
        )
        .catch((e) =>
          toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
        )
    }
  }

  const AddToCartFunc = (cartData) => {
    const qualitiesAfterDeletePrice = cartData.qualities.map((item) => {
      delete item.price
      return item
    })
    HandleAddToCart(qualitiesAfterDeletePrice)
  }

  const handleDelete = (key) => {
    const qualitiesAfterDelete = cartData.qualities.filter(
      (quality) => quality.key_en !== key
    )
    setCartData({
      ...cartData,
      qualities: qualitiesAfterDelete,
      qualitiesBefore: qualitiesAfterDelete,
    })
  }
  const handleToggleSaved = () => {
    addToSavedProduct(data.data._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lng}`])
      })
      .catch((error) => {
        toast.success(error.data[`error_${lng}`])
      })
  }

  const boxes = [
    { text: 'Red', color: 'red' },
    { text: 'Green', color: 'green' },
    { text: 'Blue', color: 'blue' }, // Add more colors/texts as needed
  ]
  const staticImages = [img1, img2, img3];

  const { bestSellerProducts } = useSelector((state) => state)
  return (
    <Box
      pt={{
        xs: '20px',
        md: '100px',
      }}
    >
      {isLoading && !data && !isError && (
        <Container sx={{ minHeight: '60vh' }}>
          <span className="loader" />
        </Container>
      )}

      {!isLoading && data && (
        <Container
          sx={{
            minWidth: {
              xs: '100% !important',
              md: '93%',
              lg: '93%',
              xl: 0.9,
            },
            padding: '6px',
          }}
        >
          <Box
            sx={{
              direction: lng === 'en' ? 'ltr' : 'rtl',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Typography
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate('/departments')
              }}
            >
              {lng === 'en' ? 'Products' : 'المنتجات'}{' '}
            </Typography>
            <ChevronRightIcon
              sx={{
                transform: `rotate(${lng === 'ar' ? '180deg' : '0'})`,
              }}
            />
            <Typography>
              {data.data[`title_${lng === 'en' ? 'en' : 'ar'}`]}
            </Typography>
          </Box>
          <Grid
            container
            sx={{
              direction: lng === 'en' ? 'rtl' : 'ltr',
              mt: 3,
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              lg={7.5}
              sx={{ textAlign: 'end', px: { xs: '0px', sm: 0, md: 5 } }}
            >
              <Stack gap={3} alignItems={'end'}>
                {bestSellerProducts.data?.find(
                  (el) => el._id === data?.data?._id
                ) && (
                  <Typography
                    disableRipple
                    sx={{
                      bgcolor: `#727272 !important`,
                      color: '#fff',
                      cursor: 'default',
                      borderRadius: '50px',
                      px: '20px',
                      textTransform: 'capitalize',
                      height: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {lng === 'en' ? 'best seller' : 'أكثر مبيعا'}
                  </Typography>
                )}
                {data?.data?.priceAfterDiscount > 0 && (
                  <Typography
                    sx={{
                      color: '#000',
                      fontSize: {
                        lg: '1.5rem',
                        md: '1.25rem',
                        xs: `1rem`,
                      },
                      fontWeight: 'bold',
                    }}
                  >
                    {(
                      (data?.data?.priceAfterDiscount + price || 0) *
                      currencyPrice
                    ).toFixed(2)}{' '}
                    {currencySymbol}
                  </Typography>
                )}

                <Typography
                  sx={{
                    mt: {
                      xs: '10px',
                      md: '-10px',
                    },
                    color: colors.priceBeforeColor,
                    textDecoration:
                      data?.data?.priceAfterDiscount > 0
                        ? 'line-through'
                        : 'none',
                    fontWeight:
                      data?.data?.priceAfterDiscount < 1 ? 'bold' : 'normal',
                    fontSize:
                      data?.data?.priceAfterDiscount < 1
                        ? {
                            lg: '1.5rem',
                            md: '1.25rem',
                            xs: `1.5rem`,
                          }
                        : 'initial',
                    fontFamily: 'Segoe UI !Important',
                    fontWeight: '600',
                  }}
                >
                  {(
                    (data.data.priceBeforeDiscount + price) *
                    currencyPrice
                  ).toFixed(2)}{' '}
                  {currencySymbol}
                </Typography>
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      mx: '10px',
                      fontSize: {
                        xs: '10px',
                        md: '11px',
                      },
                      color: '#8c8c8c',
                    }}
                  >
                    {(
                      (data.data.priceBeforeDiscount + price) *
                      currencyPrice
                    ).toFixed(2)}{' '}
                    {currencySymbol}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: {
                        xs: '10px',
                        md: '11px',
                      },
                      color: '#8c8c8c',
                    }}
                  >
                    {lng === 'en' ? ':price in kg ' : ':السعر بالكيلو جرام'}
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      mx: '10px',
                      fontSize: {
                        xs: '10px',
                        md: '11px',
                      },
                    }}
                  >
                    {data?.data?.weight}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: {
                        xs: '10px',
                        md: '11px',
                      },
                      color: '#8c8c8c',
                    }}
                  >
                    {lng === 'en' ? ':Weight ' : 'الوزن'}
                  </Typography>
                </Stack>
                {data?.data?.shippingPrice ? (
                  <Stack direction={'row'} gap={2}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#585858',
                        fontSize: {
                          lg: '1.5rem',
                          md: '1.25rem',
                          xs: '1rem',
                        },
                      }}
                    >
                      {(data?.data?.shippingPrice * currencyPrice).toFixed(2)}{' '}
                      {currencySymbol}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        color: '#585858',
                        fontSize: {
                          lg: '1.5rem',
                          md: '1.25rem',
                          xs: '1rem',
                        },
                      }}
                    >
                      {lng === 'ar' ? 'سعر الشحن' : 'shipping Price'}
                    </Typography>
                  </Stack>
                ) : null}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '5px',
                  }}
                >
                  {boxes.map((box, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor: box.color,
                        color: 'white',
                        padding: '2px 17px',
                        borderRadius: '4px',
                        marginRight: index < boxes.length - 1 ? '8px' : '8px', // Add margin-right for all boxes except the last one
                      }}
                    >
                      {box.text}
                    </Box>
                  ))}
                  :Color
                </Box>
                {/* <Rating
                  value={data.data.rating}
                  sx={{ direction: lng === 'en' ? 'ltr' : 'rtl' }}
                  onChange={(_, newValue) => {
                    // rate({ productId: data.data._id, rating: newValue })
                    handleRating(data.data._id, newValue)
                  }}
                /> */}

                {/* <Stack
                  direction="row"
                  justifyContent={'flex-end'}
                  width={'100%'}
                  spacing={2}
                >
                  {cartData?.qualities?.map((chip) => {
                    return (
                      <Chip
                        label={`${
                          lng === 'en' ? chip.value_en : chip.value_ar
                        }`}
                        key={chip?.key_en}
                        variant="outlined"
                        sx={{
                          margin: '10px !important',
                          padding: 1,
                          visibility: 'visible',
                          'border-radius': ' 6px',
                          'border-color': '#c4a035',
                          color: '#c4a035',
                          '& >.MuiChip-deleteIcon ': {
                            ' margin-right': '5px',
                            color: ' #c4a035 !important',
                          },
                        }}
                        onDelete={() => handleDelete(chip?.key_en)}
                      />
                    )
                  })}
                </Stack> */}

                <Box
                  sx={{
                    direction: lng === 'en' ? 'ltr' : 'rtl',
                    textAlign: lng === 'en' ? 'left' : 'right',
                    marginTop: '30px',
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.descriptionColor,
                      fontSize: { xs: '0.7rem', sm: '1.4rem' },
                      fontWeight: 'bold',
                      mt: '-20px',
                      mb: '20px',
                      // direction:lng==="en"?"ltr":'rtl',
                    }}
                  >
                    {lng === 'en'
                      ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum sapien a nisi accumsan, vel vestibulum felis efficitur.'
                      : 'لوريم إيبسوم هو نص شكلي وهمي يُستخدم في صناعات المطبوعات والتصميم الجرافيكي.'}
                  </Typography>
                  <Box
                    // sx={{
                    //   mt: '-20px',
                    //   // direction:lng==="en"?"ltr":'rtl',
                    //   mt: '10px',
                    // }}
                    // dangerouslySetInnerHTML={{
                    //   __html:
                    //     data?.data[`description_${lng === 'en' ? 'en' : 'ar'}`],
                    // }}
                  />
                </Box>

                {/* {data?.qualities?.length > 0 && data?.qualities != undefined ? (
                  <Qualites
                    setQuantity={setQuantity}
                    check={check}
                    setCheck={setCheck}
                    item={data?.qualities}
                    defaultImage={product?.images[0]}
                    setImage={setImage}
                    quantityImages={quantityImages}
                    setImages={setQuantityImages}
                    defaultImages={product?.images}
                    setPrice={setPrice}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    language={lng === 'ar'}
                  />
                ) : null} */}
                {/* {data?.data?.quantity < 5 &&
                data?.data?.quantity !== 0 &&
                data?.qualities !== undefined &&
                !data?.qualities?.length ? (
                  <Typography
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection:
                        lng === 'en' ? 'row-reverse' : 'row-reverse',
                    }}
                  >
                    {lng === 'en'
                      ? 'low Stock Quantity'
                      : 'يوجد كميه قليله من هذا المنتج'}
                    <Typography
                      sx={{
                        margin: '0px 10px',
                      }}
                    >
                      {data?.data?.quantity}
                    </Typography>
                  </Typography>
                ) : null} */}

                {/* {data?.data?.qualities?.length &&
                selectedItems?.length &&
                check &&
                quantity < 5 ? (
                  <Typography
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection:
                        lng === 'en' ? 'row-reverse' : 'row-reverse',
                    }}
                  >
                    {lng === 'en'
                      ? 'low Stock Quantity'
                      : 'يوجد كميه قليله من هذا المنتج'}
                    <Typography
                      sx={{
                        margin: '0px 10px',
                      }}
                    >
                      {quantity}
                    </Typography>
                  </Typography>
                ) : null} */}

                <Stack >
                  {/* <CopyButton
                    colors={{
                      buttonColor: colors.buttonColor,
                      buttonBgColor: colors.buttonBgColor,
                    }}
                  />{' '} */}
                  <Stack
                    direction={'row'}
                    // sx={{
                    //   border: '1px solid black',
                    //   borderRadius: 1,
                    //   alignItems: 'center',
                    //   my: 1,
                    //   width: 'fit-content',
                    //   py: 0.2,
                    // }}
                  >
                    {/* <Button
                      size="small"
                      onClick={() => updateQty('-')}
                      disabled={cartData.quantity === 1}
                      sx={{
                        color: 'black',
                        minWidth: 40,
                      }}
                    >
                      -
                    </Button> */}

                    <Stack
                    // component={'input'}
                    // onChange={(e) =>
                    //   setCartData({ ...cartData, quantity:Number( e.target.value) })
                    // }
                    // sx={{
                    //   width: ' 60px',
                    //   border: ' 0px',
                    //   'text-align': 'center',

                    //   '& :focus': {
                    //     border: '0px !important',
                    //   },
                    // }}
                    // min={1}
                    // // max={data?.data?.quantity}
                    // value={cartData.quantity}
                    />
                    {/* {console.log(
                      data?.data?.quantity,
                      'data?.data?.quantitydata?.data?.quantity'
                    )} */}
                    {/* <Button
                      size="small"
                      onClick={() => updateQty('+')}
                      sx={{ color: 'black !important', minWidth: 45 }}
                    >
                      +
                    </Button> */}
                  </Stack>
                </Stack>

                {data?.data?.paymentType === 'both' ? (
                  <Stack
                    sx={{
                      width: '100%',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      {lng === 'en' ? 'payment Method' : 'طريقه الدفع'}
                    </Typography>

                    <Stack
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: {
                          xs: lng === 'en' ? 'flex-end' : 'flex-end',
                        },

                        flexDirection: 'row',
                        width: {
                          xs: '100%',
                          sm: '100%',
                          md: '100%',
                        },
                        my: 2,
                      }}
                    >
                      <Button
                        sx={{
                          padding: '10px',
                          border: '1px solid #727272',
                          color: '#727272',
                          borderRadius: '5px',
                          margin: '0px 20px ',
                          fontWeight: 'bold',
                          color:
                            paymentMethod === 'online' ? '#fff' : '#727272',
                          bgcolor: paymentMethod === 'online' ? '#727272' : '',
                          '&:hover': {
                            color: '#fff',
                            bgcolor: '#727272',
                          },
                          width: {
                            xs: '49%',
                            sm: '49%',
                            md: '200px',
                          },
                          fontSize: {
                            xs: '13px',
                            sm: '14px',
                            md: '17px',
                          },
                          marginLeft: '20px',

                          textTransform: 'lowercase',
                        }}
                        onClick={() => setPaymentMethod('online')}
                      >
                        {lng === 'en' ? 'online' : '    اونلاين'}
                      </Button>
                      <Button
                        sx={{
                          padding: '10px',
                          border: '1px solid #727272',
                          borderRadius: '5px',
                          margin: '0px 20px ',
                          marginLeft: lng === 'en' && '0px',
                          marginRight: '0px',
                          fontWeight: 'bold',
                          color: paymentMethod === 'cash' ? '#fff' : '#727272',
                          bgcolor:
                            paymentMethod === 'cash' ? '#727272' : '#fff',
                          '&:hover': {
                            color: '#fff',
                            bgcolor: '#727272',
                          },
                          width: {
                            xs: '49%',
                            sm: '49%',
                            md: '200px',
                          },
                          fontSize: {
                            xs: '13px',
                            sm: '14px',
                            md: '15px',
                          },
                          textTransform: 'lowercase',
                        }}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        {lng === 'en' ? 'cash on delivery' : ' عند الاستلام'}
                      </Button>
                    </Stack>
                    <Typography
                      sx={{
                        color: 'red',
                      }}
                    >
                      {data?.data?.paymentType === 'both' &&
                      !cartIn &&
                      paymentMethod == ''
                        ? paymentMethod === ''
                          ? lng === 'en'
                            ? 'choose Payment Type'
                            : 'اختر نوع الدفع'
                          : ''
                        : ''}
                    </Typography>
                  </Stack>
                ) : null}

                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center '}
                  width={'100%'}
                  gap={'20px'}
                >
                  {savedItems.data.find(({ _id }) => _id === data.data._id) ? (
                    <FavoriteIcon
                      sx={{
                        color: 'tomato',
                        fontSize: '2.4rem',
                        cursor: 'pointer',
                        stroke: 'ButtonHighlight',
                      }}
                      onClick={handleToggleSaved}
                    />
                  ) : (
                    <FavoriteIcon
                      sx={{
                        color: 'transparent',
                        fontSize: '2.4rem',
                        cursor: 'pointer',
                        stroke: '#ddd',
                      }}
                      onClick={handleToggleSaved}
                    />
                  )}

                  {data?.data?.quantity > 0 ? (
                    <Button
                      variant="contained"
                      sx={{
                        // px: 2,
                        py: 1,
                        color: `${
                          productInCart ? '#fff' : colors.buttonColor
                        } !important`,
                        bgcolor: `${colors.buttonBgColor} !important`,
                        fontSize: { xs: '11px', md: '12 px', xl: '14px' },
                        width: '90% !important',
                        padding: '15px',
                      }}
                      disabled={
                        data?.data?.paymentType === 'both' && !cartIn
                          ? paymentMethod === ''
                            ? true
                            : false
                          : false || cardLoad || DeleteFromCartLoading
                      }
                      onClick={() => AddToCartFunc(cartData)}
                    >
                      {cardLoad || DeleteFromCartLoading ? (
                        <>
                          <Typography>
                            {lng === 'en' ? 'loading' : 'جاري التحميل'}
                          </Typography>
                          <CircularProgress
                            size={20}
                            style={{ marginRight: '4px' }}
                            color="inherit"
                          />
                        </>
                      ) : (
                        <>
                          <>
                            {lng === 'en'
                              ? 'Add to cart'
                              : 'أضف إلى سلة التسوق'}
                          </>
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        width: 'fit-content',
                        px: 2,
                        py: 1,
                        color: colors.buttonColor,
                        bgcolor: `${colors.buttonBgColor} !important`,
                        height: '40px !important',
                      }}
                      disabled
                    >
                      <>{lng === 'en' ? 'Out Of Stock' : 'المنتج غير متوفر'}</>
                    </Button>
                  )}
                </Stack>

                <CustomPaymentType type={data.data.paymentType} lang={lng} />
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={4.5}
              sx={{
                order: { xs: -1, md: 'unset' },
                position: { md: 'sticky' },
                top: '120px',
                height: 'fit-content',
              }}
            >
              <Stack
                direction={'row'}
                justifyContent={{
                  xs: lng === 'en' ? 'start' : 'end',
                  md: 'start',
                }}
              >
                <Stack
                  className="mo_stack"
                  sx={{
                    width: {
                      xs: '76%',
                      sm: '80%',
                      md: '75%',
                    },
                    height: {
                      xs: '400px',
                      sm: '400px',
                      md: '400px',
                      lg: '490px',
                      xl: '609.12px',
                      md: '528px',
                    },
                    bgcolor: colors.imageBackgroundColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '25px',
                  }}
                >
                  <Box
                    component={Swiper}
                    sx={{
                      width: '100%',
                      height: '100%',
                      direction: 'ltr',
                      '--swiper-navigation-color': '#fff',
                      borderRadius: '24px',
                      border: ' 1px solid #ddd',
                      'box-shadow': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                      position: 'relative',
                    }}
                    spaceBetween={10}
                    //
                    navigation={{
                      prevEl: navigationPrevRef?.current,
                      nextEl: navigationNextRef?.current,
                    }}
                    onBeforeInit={(swiper) => {
                      if (
                        swiper.params.navigation &&
                        typeof swiper.params.navigation !== 'boolean'
                      ) {
                        swiper.params.navigation.prevEl =
                          navigationPrevRef?.current
                        swiper.params.navigation.nextEl =
                          navigationNextRef?.current
                      }
                    }}
                    //

                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2"
                  >
                    {staticImages?.map((img) => (
                      <SwiperSlide key={img}>
                        <Zoom ZoomContent={CustomZoomContent}>
                          <Box
                            component={'img'}
                            // src={imageBaseUrl + img}
                            src={img}
                            sx={{
                              // background: `url("${ }") center center`,
                              backgroundSize: ' cover',
                              backgroundRepeat: 'no-repeat',
                              width: '100%',
                              height: {
                                xs: '400px',
                                sm: '400px',
                                md: '400px',
                                lg: '490px',
                                xl: '609.12px',
                                md: '528px',
                              },
                            }}
                          />
                        </Zoom>
                      </SwiperSlide>
                    ))}
                    <Stack
                      sx={{
                        position: 'absolute',
                        zIndex: '10',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: lng === 'en' ? 'row' : 'row',
                        width: '100%',
                        left: '10px',
                        padding: '0px 10px',
                        bottom: '50%',
                      }}
                    >
                      <Button
                        ref={navigationNextRef}
                        onClick={() => {
                          navigationNextRef
                        }}
                        sx={{
                          background: 'none !important',
                          left: { xs: '-2%', md: '-3%' },
                        }}
                      >
                        <ArrowBackIosIcon
                          sx={{
                            fontSize: {
                              xs: '22px',
                              sm: '30px',
                              md: '30px',
                              lg: '40px',
                            },
                            color: '#000',
                            fontWeight: '300',
                          }}
                        />
                      </Button>
                      <Button
                        ref={navigationPrevRef}
                        onClick={() => {
                          navigationPrevRef
                        }}
                        sx={{
                          background: 'none !important',
                          outline: 'none !important',
                          right: { xs: '-2%', lg: '-3%', xl: '-2.4%' },
                        }}
                      >
                        <ArrowForwardIosIcon
                          sx={{
                            fontSize: {
                              xs: '22px',
                              sm: '30px',
                              md: '30px',
                              lg: '40px',
                            },
                            color: '#000',
                            fontWeight: '300',
                          }}
                        />
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
                <Box
                  id={'scrollbar_swiber'}
                  component={Swiper}
                  direction={'vertical'}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  breakpoints={{
                    640: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                    1280: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                    1440: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                    1600: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                    1920: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                  }}
                  sx={{
                    width: 'auto',
                    m: 1,
                    height: {
                      xs: '400px',
                      sm: '400px',
                      md: '400px',
                      lg: '490px',
                      xl: '609.12px',
                      md: '528px',
                    },
                    '--swiper-navigation-color': '#fff',
                  }}
                  className="mySwiper"
                >
                  {staticImages?.map((img) => (
                    <SwiperSlide key={img}>
                      <Stack
                        sx={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: { xs: 50, md: 95 },
                          height: {
                            xs: 70,
                            md: '100.4px',
                          },
                          overflow: 'hidden',
                          bgcolor: colors.attrKeyColor,
                          border: ' 1px solid #ddd',
                          'box-shadow': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                          marginBottom: '10px',
                          borderRadius: '20px',
                        }}
                      >
                        <Box
                          component={'img'}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '15px',
                            width: { xs: 50, md: 95 },
                            height: {
                              xs: 90,
                              md: '150.4px',
                            },
                          }}
                          // src={imageBaseUrl + img}
                          src={img}
                        />
                      </Stack>
                    </SwiperSlide>
                  ))}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      )}
      <ProductComments colors={colors.commentsColors} productId={id} />
      {!isError && !isLoading && (
        <Similarproduct productId={data?.data?.id} id={categoryId} />
      )}
    </Box>
  )
}
