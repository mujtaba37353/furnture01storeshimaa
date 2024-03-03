import {
  Box,
  Button,
  CardMedia,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  tooltipClasses,
  Fade,
  Menu,
  useMediaQuery,
} from '@mui/material'
import { useTranslation } from 'react-i18next';
import img1 from '../../../assets/jpg/img.png';
import {
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useGetAllCartsQuery,
  useLazyGetAllCartsQuery,
} from '../../../redux/apis/cartApi'
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { imageBaseUrl } from '../../../constants/baseUrl'
import { toast } from 'react-toastify'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { colors } from './styles'
import { useDispatch, useSelector } from 'react-redux'

const qty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Popover from '@mui/material/Popover'
import { useSubmitPointsMutation } from '../../../redux/apis/pointsApi'
import { useCouponQueryMutation } from '../../../redux/apis/couponApi'
import styled from '@emotion/styled'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link } from 'react-router-dom'
import { useTheme } from '@emotion/react'
import { NewCartAction } from '../../../redux/slices/cartSlice'
import { calculateProductsAfterDiscount } from './utlts/calculateAllProductsAfterDiscount'
import { ProductDiscount } from './utlts/ProductDiscountBoolean'
import { calculateShippingPrice } from './utlts/productShippingPrice'

const cartPrice = (total, quantity, price) => {
  const pricePlusTax = total / quantity
  const tax = pricePlusTax - price
  return tax
}

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    textAlign: 'center',
    background: '#fff',
    color: '#333',
    padding: '10px',
    border: '1px solid #eee',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  },
})
export default function QuantityMenu({ item }) {
  const [addToCart] = useAddToCartMutation()

  const [anchorEl, setAnchorEl] = useState(null)
  const [_, { language: lang }] = useTranslation()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // git
  const handleUpdateQty = (value) => {
    const DeletedId = item?.properties?.map((obj) => {
      const { _id, ...cleanedObj } = obj
      return cleanedObj
    })
    console.log(item?.properties, 'item?.properties')
    handleClose()
    if (item?.properties?.length) {
      addToCart({
        quantity: value,
        id: item.product.id,
        paymentType: item?.paymentType,
        qualities: DeletedId,
      })
        .unwrap()
        .then((res) => {
          toast.success(res[`success_${lang === 'en' ? 'en' : 'ar'}`])
        })
        .catch((e) =>
          toast.error(e.data[`error_${lang === 'en' ? 'en' : 'ar'}`])
        )
    } else {
      addToCart({
        quantity: value,
        id: item.product.id,
        paymentType: item?.paymentType,
      })
        .unwrap()
        .then((res) => {
          toast.success(res[`success_${lang === 'en' ? 'en' : 'ar'}`])
        })
        .catch((e) =>
          toast.error(e.data[`error_${lang === 'en' ? 'en' : 'ar'}`])
        )
    }
  }
  function findQuality(properties, qualities) {
    if (!Array.isArray(properties)) {
      // Handle the case where properties is not an array (e.g., throw an error or return null)
      return null
    }
    return qualities.find((quality) => {
      return properties.every((property) =>
        quality.values.some(
          (value) =>
            value?.key_en === property?.key_en &&
            value?.key_ar === property?.key_ar &&
            value?.value_en === property?.value_en &&
            value?.value_ar === property?.value_ar
        )
      )
    })
  }

  let availableQuantities = findQuality(
    item?.properties,
    item?.product?.qualities
  )
  if (availableQuantities) {
    availableQuantities = availableQuantities?.quantity
    if (availableQuantities > 100) {
      availableQuantities = 100
    }
  }
  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          bgcolor: `${colors.main} !important`,
          borderRadius: '8px',
          width: '80px',
          padding: '10px',
          height: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          boxShadow: ' rgba(149, 157, 165, 0.2) 0px 8px 24px !important',
        }}
      >
        <Stack
          direction={'row'}
          alignItems={'center'}
          sx={{
            width: '100%',
          }}
        >
          <Typography
            sx={{
              color: '#fff',

              fontSize: '13px',
            }}
          >
            {lang === 'en' ? 'Qty: ' : 'الكمية: '}
          </Typography>
          <Typography
            sx={{
              color: '#fff',
              fontSize: '13px',
              marginRight: 'auto',
            }}
          >
            {item.quantity}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              color: '#fff',
              fontSize: '13px',
              marginLeft: 'auto',
            }}
          />
        </Stack>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        disableScrollLock
        sx={{
          '.MuiList-root': {
            maxHeight: '300px',
            overflowY: 'scroll',
          },
        }}
      >
        {[
          ...Array(
            availableQuantities
              ? availableQuantities
              : item?.product?.quantity < 100
              ? item?.product?.quantity
              : 100 || 0
          ),
        ].map((_, index) => (
          <MenuItem
            sx={{
              color: item.quantity === index + 1 ? colors.main : 'initial',
            }}
            onClick={() => {
              handleUpdateQty(index + 1)
            }}
          >
            {index + 1}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
const CalculatePercentage = (total, percentage) => {
  return total - (total * percentage) / 100
}
const CalculatePercentageCoupon = (total, percentage, item) => {
  return total - (total * percentage) / 100
}
const CartItemRow = ({ item, currencySymbol, currencyPrice, couponAdded }) => {
  const [_, { language: lng }] = useTranslation()
  const [removeItem] = useDeleteFromCartMutation()
  const nav = useNavigate()
  console.log('itemitemitem  ===>>', item)
  const HandleProperties = (item) => {
    const concatenatedValues = item?.properties
      ?.map((obj) => {
        return Object.values({ obj })
          .map((ob) => {
            return lng === 'en' ? obj.value_en : obj.value_ar
          })
          .join('/')
      })
      .join('/')

    return concatenatedValues
  }

  return (
    <Stack
      direction={{ xs: 'row', md: 'row' }}
      justifyContent={'space-between'}
      sx={{ bgcolor: colors.productsBg, p: 1, overflow: 'auto' }}
    >
      {/* IMG & INFO */}
      <Stack direction={'row'} gap={1} sx={{}}>
        {/* IMG */}
        <Stack
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={colors.main}
          width={150}
          height={200}
          sx={{
            width: {
              xs: 130,
              md: 150,
            },
            height: {
              xs: 130,
              md: 150,
            },
          }}
        >
          <CardMedia
            component="img"
            src={img1}
            sx={{
              width: {
                xs: 1,
                md: 1,
              },
              height: {
                xs: 1,
                md: 1,
              },
              objectFit: 'cover',
            }}
          />
        </Stack>
        {/* PRODUCT INFO */}
        <Stack
          direction={{
            xs: 'column',
            md: 'column',
          }}
          gap={1}
          justifyContent={'space-between'}
        >
          <Typography
            onClick={() => {
              // console.log()
              nav(`/products/${item?.product?._id}/${item.product?.title_en}`)
            }}
            variant="h6"
            sx={{
              color: `${colors.title} !important`,
              textDecoration: 'none',

              cursor: 'pointer',
              fontSize: {
                xs: '11px',
                md: '1rem',
              },
            }}
          >
            {item.product[`title_${lng === 'en' ? 'en' : 'ar'}`]}{' '}
          </Typography>

          <Typography
            sx={{
              fontSize: '13px',
              color: '#A3A3A3',
            }}
          >
            {item.product?.quantity !== 0
              ? lng === 'en'
                ? 'In Stock'
                : ' متوفر'
              : lng === 'en'
              ? 'Out Of Stock'
              : 'غير متوفر'}
          </Typography>
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {HandleProperties(item)}
          </Typography>
          <QuantityMenu item={item} />
          <Typography
            sx={{
              cursor: 'pointer',
              display: 'flex',
              color: colors.remove,
              fontSize: '1rem',
            }}
            onClick={() => {
              console.log(item, 'itemDeleted')

              removeItem({
                id: item.product.id,
                qualities: item?.properties,
              })
                .unwrap()
                .then((res) => {
                  toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
                })
                .catch((e) =>
                  toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
                )
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: '1.3rem' }} />
            {lng === 'en' ? 'Remove' : 'مسح'}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        sx={{
          justifyContent: lng === 'en' ? 'flex-start' : 'flex-start',
          alignItems: {
            xs: lng === 'en' ? 'flex-end' : 'flex-start',
            md: 'center',
          },
          gap: '10px',
        }}
      >
        <Box sx={{}}>
          <Typography
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: lng === 'en' ? 'flex-end' : 'flex-start',
              justifyContent: lng === 'en' ? 'flex-end' : 'flex-end',
              fontSize: {
                xs: '0.8rem',
                md: '1.2rem',
              },
            }}
          >
            <Box
              sx={{
                color: colors.priceAfter,

                fontSize: {
                  xs: '0.8rem',
                  md: '1.2rem',
                },
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {lng === 'en' ? 'price' : 'السعر'}

              <Typography
                sx={{
                  margin: '0px 8px',
                  fontSize: {
                    xs: '0.8rem',
                    md: '1.2rem',
                  },
                }}
              >
                {couponAdded?.couponEnter !== '' ? (
                  <>
                    {console.log(item, 'asdsaddasssss')}
                    {ProductDiscount(item) ? (
                      <>
                        {(
                          (item?.totalWithoutShipping -
                            item?.totalWithoutShipping *
                              (couponAdded?.persentage / 100)) *
                          currencyPrice
                        ).toFixed(2)}
                      </>
                    ) : (
                      <>
                        {(item?.totalWithoutShipping * currencyPrice).toFixed(
                          2
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {' '}
                    {(item?.totalWithoutShipping * currencyPrice).toFixed(2)}
                  </>
                )}
              </Typography>
              <Box
                component={'span'}
                sx={{
                  mx: 0.5,
                  fontSize: {
                    xs: '0.8rem',
                    md: '1.2rem',
                  },
                }}
              >
                {currencySymbol}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alingItems: 'center',
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                },
                marginTop: '10px',
              }}
            >
              {lng === 'en' ? 'shipping Price' : 'سعر الشحن'}
              <Typography
                sx={{
                  margin: '0px 10px',
                }}
              >
                {`   ${(item?.product?.shippingPrice * currencyPrice).toFixed(
                  2
                )}
   ${''}
   ${currencySymbol}`}
              </Typography>
            </Box>

            {item.product.priceAfterDiscount > 0 && (
              <Box
                component={'span'}
                sx={{
                  color: colors.priceBefore,
                  textDecoration: `line-through 1px solid ${colors.priceBefore}`,
                  fontSize: '0.7rem',
                }}
              >
                {`${(
                  (cartPrice(
                    item.total,
                    item.quantity,
                    item.product.finalPrice
                  ) +
                    item.product.priceBeforeDiscount) *
                  currencyPrice
                ).toFixed(2)} ${currencySymbol}`}
              </Box>
            )}
          </Typography>

          {ProductDiscount(item) && couponAdded.couponEnter !== '' ? (
            <Stack
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '3px 7px',
                background: colors.main,
                borderRadius: '10px',
                fontSize: ' 12px',
                color: ' #fff',
                width: 'fit-content',
                marginTop: '10px',
                marginLeft: lng === 'en' ? 'auto' : 'unset',
                marginRight: lng === 'ar' ? 'auto' : 'unset',
              }}
            >
              <Stack component={'span'} sx={{ margin: '0px 10px' }}>
                {lng === 'en' ? 'discount' : 'نسبه الخصم'}
              </Stack>
              <Stack component={'span'}>{couponAdded?.persentage}%</Stack>
            </Stack>
          ) : null}
        </Box>

        {/* price */}
      </Stack>
    </Stack>
  )
}

export const Cart02 = () => {
  const [coupon, setCoupon] = useState('')
  const [getCartdata, { data: cartData, isSuccess: isSuccessData }] =
    useLazyGetAllCartsQuery()

  const { currencyPrice, label } = useSelector((state) => state.currency)
  const labelText = label.match(/\(([^)]+)\)/)
  const [couponPrice, setTotalCouponPrice] = useState()
  const [acceptTerms, setAcceptTerms] = useState(false)

  useEffect(() => {
    localStorage.setItem('couponData', JSON.stringify(couponAdded))
  }, [couponPrice])
  const currencySymbol = labelText ? labelText[1] : ''
  const { data, isSuccess, isError, isLoading } = useGetAllCartsQuery(undefined)

  const nav = useNavigate()

  const [, { language: lng }] = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser)
  const [SubmitCouponA, { isError: ErrorCoupon, isLoading: isLoadingC }] =
    useCouponQueryMutation()
  const [addPoints, { isLoading: PointsLoading, isError: PointsError }] =
    useSubmitPointsMutation()
  const [couponAdded, setCouponAdded] = useState({
    couponEnter: '',
    persentage: 0,
    products: [],
    total: 0,
  })
  useEffect(() => {
    const couponData = JSON.parse(localStorage.getItem('couponData'))
    if (couponData && Object.keys(couponData).length) setCouponAdded(couponData)
  }, [])

  useEffect(() => {
    if (couponAdded.couponEnter !== '') {
      const { persentage, products } = couponAdded
      if (isSuccess && !isLoading) {
        const {
          cashItems: { items: cash },
          onlineItems: { items: online },
        } = data?.data
        console.log(products, persentage, 'products?')
        calculateProductsAfterDiscount(
          online,
          cash,
          products,
          persentage,
          (total) => {
            console.log(total, 'totalsadsd3qa')
            setCouponAdded({
              ...couponAdded,
              total,
            })

            setTotalCouponPrice(total)
          }
        )
      }
    }
  }, [data?.data, couponAdded.couponEnter])
  const handleDelete = () => {
    setCouponAdded((prev) => ({
      ...prev,
      couponEnter: '',
      persentage: 0,
      products: [],
      total: 0,
    }))
  }
  const SubmitCoupon = (e) => {
    e.preventDefault()
    if (coupon !== '') {
      SubmitCouponA(coupon)
        .unwrap()
        .then((res) => {
          setCouponAdded({
            ...couponAdded,
            couponEnter: coupon,
            persentage: res?.data?.discount,
            products: res?.data?.productsCouponsIds,
          })
          setCoupon('')

          toast.success(
            lng === 'en' ? 'coupon added succefully' : 'تم اضافه الكوبون بنجاح'
          )
        })
        .catch((e) => {
          toast.error(
            e?.data ? e?.data[`error_${lng === 'en' ? 'en' : 'ar'}`] : e.message
          )
        })
    }
  }

  useEffect(() => {
    localStorage.setItem('couponData', JSON.stringify(couponAdded))
    dispatch(NewCartAction.SetTotal(couponAdded?.total * currencyPrice))
  }, [couponAdded.couponEnter, couponPrice])
  const SubmitPoints = () => {
    if (currentUser && currentUser.points) {
      addPoints(currentUser.id)
        .unwrap()
        .then((res) => {
          toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
          getCartdata()
        })
        .catch((e) => {
          toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
        })
    } else {
      toast.error(
        lng === 'en'
          ? `There 's No Points To Submit `
          : `ليست هناك نقاط للاضافه بعد `
      )
    }
  }

  console.log(currentUser, 'currentUsercurrentUser')
  const HandleNavigateToCheckout = () => {
    if (currentUser !== null && !Object?.keys(currentUser)?.length) {
      toast.error(
        lng === 'en'
          ? 'You Have To Sign In First To Submit Payment'
          : 'يجب عليك تسجيل الدخول اولا لاتمام عمليه الدفع'
      )
      return
    }
    localStorage.setItem(
      'couponData',
      JSON.stringify({
        ...couponAdded,
        total: couponAdded?.couponEnter
          ? couponPrice * currencyPrice
          : data?.totalCartPrice * currencyPrice,
      })
    )
    nav('/checkout')
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const calculateCartPrice = (online, cash) => {
    return (online + cash).toFixed(2)
  }
  const theme = useTheme()

  const phoneScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Grid
      container
      p={{ xs: 1, md: 3 }}
      mt={5}
      sx={{
        minHeight: '75vh',
        direction: lng === 'en' ? 'ltr' : 'rtl',

        display: `flex`,
        justifyContent: `space-around`,
        height: 'fit-content',
      }}
    >
      {isError && !isLoading && <EmptyFavorite lng={lng} />}
      {isSuccess ? (
        <>
          <Grid
            item
            xs={12}
            sm={12}
            md={9}
            xl={10}
            sx={{
              height: 'fit-content',
            }}
            p={1}
            bgcolor={'#F8F4E8'}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Typography variant="h5" sx={{ color: colors.header }}>
                {lng === 'en' ? 'Shopping Cart' : 'سلة التسوق'}
              </Typography>
            </Stack>
            <Divider
              sx={{
                border: '1px solid #707070',
                mt: 3,
                mb: 1,
              }}
            />
            {data?.data?.cashItems ? (
              <>
                <Stack direction={'column'} sx={{ gap: 3 }}>
                  {/* CASH */}
                  <Typography>
                    {lng === 'en' ? 'Cash on delivery' : 'الدفع عند الإستلام'}
                  </Typography>
                  {data?.data?.cashItems?.items.map((item, index) => (
                    <>
                      {index > 0 ? <Divider /> : undefined}
                      <CartItemRow
                        item={item}
                        key={index}
                        currencySymbol={currencySymbol}
                        currencyPrice={currencyPrice}
                        couponAdded={couponAdded}
                        lng={lng}
                      />
                    </>
                  ))}
                </Stack>

                <Typography
                  textAlign={'end'}
                  sx={{ color: colors.orderSummaryBody }}
                >
                  {couponAdded?.couponEnter !== '' ? (
                    <>
                      {' '}
                      {(
                        (data?.data?.cashItems?.totalPrice -
                          (data?.data?.cashItems.totalPrice *
                            couponAdded?.persentage) /
                            100) *
                        currencyPrice
                      ).toFixed(2)}{' '}
                    </>
                  ) : (
                    <>
                      {' '}
                      {(
                        data?.data?.cashItems?.totalPrice * currencyPrice
                      ).toFixed(2)}{' '}
                    </>
                  )}
                  {console.log(data?.data?.cashItems?.totalPrice, 'sadadqe')}
                  {currencySymbol}
                  <Box component={'span'} sx={{ color: colors.quantity }}>
                    ({data?.data?.cashItems?.quantity}{' '}
                    {lng === 'en' ? 'Items' : 'منتج'})
                  </Box>
                </Typography>
                <Divider sx={{ border: '1px solid #707070', my: 1 }} />
              </>
            ) : null}
            {/* ONLINE */}
            {data?.data?.onlineItems?.items?.length > 0 ? (
              <>
                {' '}
                <Stack direction={'column'} sx={{ gap: 3 }}>
                  <Typography>
                    {lng === 'en' ? 'Online payment' : 'الدفع أونلاين'}
                  </Typography>
                  {data?.data?.onlineItems?.items.map((item, index) => (
                    <>
                      {index > 0 ? <Divider /> : undefined}
                      <CartItemRow
                        item={item}
                        key={index}
                        currencySymbol={currencySymbol}
                        currencyPrice={currencyPrice}
                        couponAdded={couponAdded}
                        lng={lng}
                      />
                    </>
                  ))}
                  <Typography
                    textAlign={'end'}
                    sx={{ color: colors.orderSummaryBody }}
                  >
                    {couponAdded?.couponEnter !== '' ? (
                      <>
                        {' '}
                        {(
                          (data?.data?.onlineItems?.totalPrice -
                            (data?.data?.onlineItems.totalPrice *
                              couponAdded?.persentage) /
                              100) *
                          currencyPrice
                        ).toFixed(2)}{' '}
                      </>
                    ) : (
                      <>
                        {' '}
                        {(
                          data?.data?.onlineItems?.totalPrice * currencyPrice
                        ).toFixed(2)}{' '}
                      </>
                    )}
                    {console.log(
                      data?.data?.onlineItems?.totalPrice,
                      'sadadqe'
                    )}
                    {currencySymbol}
                    <Box component={'span'} sx={{ color: colors.quantity }}>
                      ({data?.data?.onlineItems?.quantity}{' '}
                      {lng === 'en' ? 'Items' : 'منتج'})
                    </Box>
                  </Typography>
                  <Divider sx={{ border: '1px solid #707070', my: 1 }} />
                </Stack>
              </>
            ) : null}
          </Grid>

          <Grid
            item
            xs={10}
            sm={5}
            xl={2}
            md={3}
            p={3}
            sx={{
              height: 'fit-content',
              marginRight: '10px',
              position: {
                md: 'sticky',
                xs: 'relative',
              },
              top: {
                xs: '20px',
                md: '150px',
              },
              marginRight: { xs: 'auto', md: 'none' },
              margin: { xs: 'auto', sm: 'unset' },
              'box-shadow':
                phoneScreen &&
                '   rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important',
              ' padding-bottom': '37px  !important',
            }}
          >
            <Box>
              {/* shipping Price */}

              {[
                ...data?.data?.onlineItems?.items,
                ...data?.data?.cashItems?.items,
              ].filter((item) => item?.product?.shippingPrice > 0).length >
              0 ? (
                <>
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    my={3}
                    flexWrap={'wrap'}
                  >
                    <Typography
                      sx={{
                        color: colors.orderSummaryBody,
                        xs: '13px',
                        md: '13px',
                        xl: '14px',
                      }}
                    >
                      {lng === 'en' ? 'Sub Total :' : 'المجموع الفرعي :'}
                    </Typography>

                    <Typography
                      sx={{
                        color: colors.orderSummaryBody,
                        fontSize: {
                          xs: '13px',
                          md: '13px',
                          xl: '14px',
                        },
                      }}
                    >
                      {(
                        calculateShippingPrice(couponAdded)(
                          data?.data?.onlineItems.totalPrice +
                            data?.data?.cashItems.totalPrice,
                          data?.data?.onlineItems.items,
                          data?.data?.cashItems.items,
                          true
                        ) * currencyPrice
                      ).toFixed(2)}

                      {currencySymbol}
                    </Typography>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    my={3}
                    flexWrap={'wrap'}
                  >
                    <Typography
                      sx={{
                        color: colors.orderSummaryBody,
                        xs: '13px',
                        md: '13px',
                        xl: '14px',
                      }}
                    >
                      {lng === 'en' ? 'Total Shipping:' : 'سعر الشحن :'}
                    </Typography>
                    <Typography
                      sx={{
                        color: colors.orderSummaryBody,
                        fontSize: {
                          xs: '13px',
                          md: '13px',
                          xl: '14px',
                        },
                      }}
                    >
                      {(
                        calculateShippingPrice(couponAdded)(
                          data?.data?.onlineItems.totalPrice +
                            data?.data?.cashItems.totalPrice,
                          data?.data?.onlineItems.items,
                          data?.data?.cashItems.items,
                          false
                        ) * currencyPrice
                      ).toFixed(2)}
                      {currencySymbol}
                    </Typography>
                  </Stack>
                </>
              ) : null}
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                my={1}
                flexWrap={'wrap'}
              >
                <Typography
                  sx={{
                    color: colors.orderSummaryBody,
                    xs: '13px',
                    md: '13px',
                    xl: '13px',
                  }}
                >
                  {lng === 'en' ? 'Total:' : 'المجموع  :'}
                </Typography>
                <Typography
                  sx={{
                    color: colors.orderSummaryBody,

                    xs: '13px',
                    md: '13px',
                    xl: '14px',
                  }}
                >
                  {couponAdded?.couponEnter !== ''
                    ? (couponPrice * currencyPrice).toFixed(2)
                    : (
                        calculateCartPrice(
                          data?.data?.onlineItems.totalPrice,
                          data?.data?.cashItems.totalPrice
                        ) * currencyPrice
                      ).toFixed(2)}{' '}
                  {currencySymbol}
                </Typography>
              </Stack>
              {/* shipping Price */}

              {/* {couponAdded?.couponEnter !== '' ? (
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  my={3}
                  flexWrap={'wrap'}
                >
                  <Typography
                    sx={{ color: colors.orderSummaryBody, fontWeight: 'bold' }}
                  >
                    {lng === 'en'
                      ? 'Total After Discount:'
                      : ' المجموع الكلي بعد الخصم'}
                  </Typography>
                  <Typography
                    sx={{ color: colors.orderSummaryBody, fontWeight: 'bold' }}
                  >
                    {currencySymbol} {couponAdded?.total.toFixed(2) || 0}
                  </Typography>
                </Stack>
              ) : null} */}
              {couponAdded.couponEnter !== '' ? (
                <Chip
                  label={couponAdded.couponEnter}
                  sx={{
                    padding: '10px',
                    background: colors?.buttonBg,
                    color: '#fff',
                    height: ' 26px',
                  }}
                  onDelete={handleDelete}
                />
              ) : null}
              <Box>
                <Box>
                  <Typography
                    component={'span'}
                    sx={{
                      fontSize: '0.8',
                      color: colors.quantity,
                    }}
                  ></Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: '100%',
                    }}
                  >
                    <form
                      onSubmit={(e) => SubmitCoupon(e)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        margin: '10px auto',
                        borderRadius: '10px !important',
                      }}
                    >
                      <input
                        label="coupon"
                        value={coupon}
                        style={{
                          width: '80%',
                          padding: '13px',
                          height: '40px',
                          border: '1px solid #ddd ',
                          padding: '3px !important',
                          background: 'transparent',
                          outline: 'none',
                          borderRadius: '5px',
                          height: '32,5px',
                          borderRadius: '0px',
                          marginLeft: '3px',
                          height: '32px !important',
                          borderRadius: '10px !important',
                        }}
                        className="input_form"
                        placeholder={
                          lng === 'en' ? 'add coupon' : 'اضافه كوبون'
                        }
                        onChange={(e) => setCoupon(e.target.value)}
                      ></input>
                      <CustomWidthTooltip
                        title={
                          data?.data?.isPointUsed
                            ? lng === 'en'
                              ? "You can't use coupons because you have already used Your Points "
                              : ' لا يمكنك استخدام نقاطك لانك استخدمت نقاطك بالفعل '
                            : ''
                        }
                        sx={{
                          background: '#fff !important',
                        }}
                      >
                        <span
                          style={{
                            justifyContent: 'end',
                          }}
                        >
                          <Button
                            sx={{
                              border: '1px solid #ddd',
                              padding: '10px',
                              height: '30px ',
                              margin: '10px auto',
                              background: colors?.buttonBg,
                              color: colors?.button,
                              transition: '0.7s all ease-in-out',
                              width: '45%',
                              fontSize: { xs: '11px', sm: '12px' },
                              '&:hover': {
                                background: colors?.buttonBg,
                                opacity: '0.7',
                              },
                              width: '75%',
                              margin: 'auto 20px',
                              margin: 'unset',
                              height: '30px ',
                              borderRadius: '10px !important',
                            }}
                            disabled={
                              data?.data?.couponUsed ||
                              data?.data?.isPointUsed ||
                              isLoadingC
                            }
                            type={'submit'}
                          >
                            {lng === 'en' ? 'Add' : 'اضافه  '}
                          </Button>
                        </span>
                      </CustomWidthTooltip>
                    </form>
                  </Box>
                  <Typography
                    component={'span'}
                    sx={{
                      fontSize: '12px',
                      margin: '10px 0px',
                    }}
                  >
                    {data?.data?.couponUsed
                      ? lng === 'ar'
                        ? 'عربه التسوق تم استخدام الكوبون '
                        : 'You Already Used Coupon For This Cart'
                      : null}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      direction: lng === 'en' ? 'rtl' : 'ltr',
                    }}
                  >
                    <Typography
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                        }}
                      >
                        {currentUser?.points}
                        <HelpOutlineIcon
                          sx={{
                            width: '20px',
                            height: '20px',
                            marginRight: '10px',
                            cursor: 'pointer',
                          }}
                          aria-describedby={id}
                          type="button"
                          onClick={handleClick}
                        />
                      </span>
                      {lng === 'en' ? 'Your Points' : 'النقاط'}
                    </Typography>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      disableScrollLock
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        padding: '3px',
                      }}
                    >
                      <Typography
                        sx={{
                          p: 2,
                          textTransform: 'capitalize',
                          fontSize: {
                            xs: '13px',
                            width: 'fit-content',
                          },
                        }}
                      >
                        {lng === 'en' ? (
                          <>
                            Those Points Are calculated in checkout for every
                            succefully purchesed products{' '}
                          </>
                        ) : (
                          <>هذه النقاط يتم احتسابها لكل عمليه شراء ناجحه </>
                        )}
                      </Typography>
                    </Popover>
                    <CustomWidthTooltip
                      title={
                        couponAdded?.couponEnter !== ''
                          ? lng === 'en'
                            ? 'You Have To Delete the coupon To Use Your Points'
                            : 'يجب حذف الكوبون حتي تتمكن من استخدام نقاطك'
                          : data?.data?.couponUsed
                          ? lng == 'en'
                            ? 'You Have Already Used Coupon For This Cart'
                            : 'عربه التسوق تم استخدام الكوبون'
                          : ''
                      }
                      sx={{
                        background: '#fff !important',
                      }}
                    >
                      <div style={{ width: '100%' }}>
                        {data?.data?.isPointUsed ? null : (
                          <Button
                            disabled={
                              data?.data?.couponUsed ||
                              couponAdded?.couponEnter !== '' ||
                              data?.data?.isPointUsed
                            }
                            sx={{
                              m: 1,
                              border: '1px solid #ddd',
                              padding: '10px',
                              margin: '10px auto',
                              background: colors?.buttonBg,
                              color: `${colors?.button} !important`,
                              transition: '0.7s all ease-in-out',
                              width: '100%',
                              '&:hover': {
                                background: colors?.buttonBg,
                                opacity: '0.7',
                              },
                              height: '30px',
                              borderRadius: '10px !important',
                            }}
                            onClick={SubmitPoints}
                          >
                            {lng === 'en'
                              ? 'Use Your  Points '
                              : 'استخدم نقاطك'}
                          </Button>
                        )}

                        <Stack
                          component={'span'}
                          sx={{
                            margin: '3px',
                            textAlign: 'right',
                            color: '#000',
                            fontWeight: '',
                          }}
                        >
                          {data?.data?.isPointUsed ? (
                            <>
                              {lng === 'en'
                                ? 'You Used Your  Points    '
                                : 'تم استخدمت نقاطك '}
                            </>
                          ) : null}
                        </Stack>
                      </div>
                    </CustomWidthTooltip>
                  </Box>
                </Box>
              </Box>

              <Stack
                direction={'column'}
                alignItems={'flex-start'}
                gap={'6px'}
                sx={{
                  margin: '10px 0px',
                }}
              >
                <Stack
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <input
                    onChange={() => setAcceptTerms(!acceptTerms)}
                    type="checkbox"
                    style={{
                      height: '15px',
                      width: '15px',
                      accentColor: '#727272',
                      fontSize: '11px',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '11px',
                    }}
                  >
                    {lng === 'en' ? 'You Have To ' : '   يجب عليك السماح'}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    textDecoration: 'none',
                    color: '#727272 !important',
                    fontSize: '11px',
                  }}
                >
                  {lng === 'en'
                    ? 'Share Your Location To Continue Payment'
                    : ' بتحديد موقعك لاتمام عمليه الدفع'}
                </Typography>
              </Stack>
              <Button
                variant="contained"
                fullWidth
                disabled={(isError && !isSuccess) || !acceptTerms}
                sx={{
                  color: colors.button,
                  bgcolor: `${colors.buttonBg} !important`,
                  height: '28px',
                  borderRadius: '0px !important',
                  padding: '2px 0px !important',
                  borderRadius: '10px !important',
                }}
                onClick={() => {
                  HandleNavigateToCheckout()
                }}
              >
                {lng === 'en' ? 'Checkout' : 'الدفع'}
              </Button>
            </Box>
          </Grid>
        </>
      ) : (
        !isError && <span className="loader"></span>
      )}
    </Grid>
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
        <ShoppingCartIcon
          sx={{
            fontSize: '75px',
          }}
          color="#000"
        />
      </Stack>
      <Typography sx={{ fontSize: '1.5rem' }} fontWeight={'bold'}>
        {lng === 'en'
          ? 'There are no products in the shopping cart'
          : 'لا توجد منتجات في سلة التسوق'}
      </Typography>
      <Typography variant="caption" color={'GrayText'}>
        {lng === 'en'
          ? 'add products in your cart to find them easily'
          : 'أضف المنتجات إلى سلة التسوق الخاصة بك للعثور عليها بسهولة'}
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
