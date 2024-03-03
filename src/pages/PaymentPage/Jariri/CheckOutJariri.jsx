import {
  Autocomplete,
  Button,
  Box,
  CircularProgress,
  Container,
  Divider,
  FormLabel,
  Grid,
  InputBase,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material'
import { useFormik } from 'formik'
import img from '../../../assets/jpg/img.png';
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import {
  cityArabic,
  cityEnglish,
} from '../../../components/providers/city-english'
import PhoneIcon from '@mui/icons-material/Phone'

import VerifiedCode from '../../../components/verification/VerifiedCode'
import { imageBaseUrl } from '../../../constants/baseUrl'
import { useLazyGetMeQuery } from '../../../redux/apis/UserApis'
import './index.css'
import {
  useGetAllCartsQuery,
  useVerifyCartMutation,
} from '../../../redux/apis/cartApi'
import { useAddOrderMutation } from '../../../redux/apis/ordersApi'
import { useGetUserCodeMutation } from '../../../redux/apis/verifiedCodeApi'
import { JaririStyle } from './Style'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Link } from 'react-router-dom'
import { ProductDiscountForProduct } from '../../cart/cart2/utlts/ProductAfterDiscount'
// ================================|| CHECKOUT - BILLING DETAILS ||================================ //
const BillingDetails = (props) => {
  const [openModal, setOpenModal] = useState(false)
  const [userPhone, setUserPhone] = useState('')
  const [userData, setUserData] = useState({})
  const [_, { language }] = useTranslation()
  const [addOrder, { isLoading: orderLoad }] = useAddOrderMutation()
  const { refetch } = useGetAllCartsQuery(undefined)
  const [getUserCode, { isLoading: codeLoad }] = useGetUserCodeMutation()
  const navigate = useNavigate()
  const [getMe] = useLazyGetMeQuery(undefined)
  const [location, setLocation] = useState(null)
  const [Check, setCheck] = useState(false)
  const [submitCheckout, { isLoading: verfyCouponLoading }] =
    useVerifyCartMutation()
  useEffect(() => {
    getMe(undefined).then(({ data }) => {
      if (data?.data) {
        setUserData(data?.data)
        formik.setFieldValue('email', data?.data?.email || '')
        formik.setFieldValue('phone', data?.data?.phone || '')
        formik.setFieldValue('name', data?.data?.name || '')
      }
    })
  }, [])
  const handelerCode = (code, phone) => {
    getUserCode({ code, phone })
      .unwrap()
      .then((res) => {
        console.log(res, 'checkout resdasdsad')
        refetch()
        toast.success(res[`success_${language}`])
        if (res.paymentType === 'cash') {
          navigate('/thankYou')
        } else {
          navigate('/select-payment')
        }
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`])
      })
  }
  const Class = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 'fit-content',

    top: { xs: `50%`, md: `50%` },
    bottom: ` 50%`,
    right: `10px`,
    transform: ` translateY(-50%)`,
    position: 'absolute',
    flexDirection: 'row-reverse',
  }
  const Class_2 = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 'fit-content',

    top: { xs: `50%`, md: `30%` },
    bottom: ` 50%`,
    right: `10px`,
    transform: ` translateY(-50%)`,
    position: 'absolute',
    flexDirection: 'row-reverse',
  }

  const formik = useFormik({
    initialValues: {
      city: '',
      name: '',
      area: '',
      address: '',
      postalCode: '',
      phone: '',
      email: '',
      orderNotes: '',
      country: 'SA',
      Longitude: '',
      Latitude: '',
    },

    validationSchema: yup.object({
      name: yup
        .string()
        .required(language === 'en' ? 'Name Required' : 'الاسم مطلوب'),
      area: yup
        .string()
        .required(language === 'en' ? 'Area Required' : 'المنطقة مطلوبة'),
      address: yup
        .string()
        .required(language === 'en' ? 'Address Required' : 'العنوان مطلوب'),
      city: yup
        .string()
        .required(language === 'en' ? 'City Required' : 'المدينة مطلوبة'),
      phone: yup
        .string()
        .required(language === 'en' ? 'Phone Required' : 'الهاتف مطلوب')
        .matches(
          /^\+?[0-9]+$/, // Updated regular expression to allow only digits
          language === 'en'
            ? 'Phone must contain only numbers'
            : 'يجب أن يحتوي الهاتف على أرقام فقط'
        )
        .length(
          userData?.email && !userData?.phone ? 9 : 13,
          language === 'en'
            ? 'Phone must be 12 digits'
            : 'يجب أن يكون رقم الهاتف 12 رقمًا'
        ),
      email: yup
        .string()
        .required(
          language === 'en' ? 'Email Required' : 'البريد الالكتروني مطلوب'
        )
        .email(
          language === 'en' ? 'Email is invalid' : 'البريد الالكتروني غير صالح'
        ),
      postalCode: yup
        .string()
        .matches(
          /^\d+$/,
          language === 'en'
            ? 'Postal Code must contain only numbers'
            : 'يجب أن يحتوي الرمز البريدي على أرقام فقط'
        )
        .required(
          language === 'en' ? 'Postal Code Required' : 'الرمز البريدي مطلوب'
        ),
      orderNotes: yup.string().optional(),
    }),
    onSubmit: (values) => {
      const data = {
        ...values,
        phone: values.phone.startsWith('+966')
          ? values.phone
          : `+966${values.phone}`,
        Longitude: location?.longitude.toString(),
        Latitude: location?.latitude.toString(),
      }
      if (values.orderNotes === '') {
        delete data.orderNotes
      }
      const couponData = JSON.parse(localStorage.getItem('couponData'))

      if (couponData?.couponEnter !== '') {
        submitCheckout({
          productsIds: couponData?.products,
          code: couponData?.couponEnter,
        })
          .unwrap()
          .then((res) => {
            toast.success(res[`success_${language === 'en' ? 'en' : 'ar'}`])

            // cartApi.endpoints.getAllCarts.initiate()

            addOrder(data)
              .unwrap()
              .then((res) => {
                setUserPhone(res?.data?.phone)
                setOpenModal(true)
              })
              .catch((err) => {
                toast.error(err.data[`error_${language}`])
              })
            // nav('/checkout')
          })
          .catch((e) => {
            // toast.error(e?.data[`error_${lng === 'en' ? 'en' : 'ar'}`]);
            toast.error(lng === 'en' ? e.data?.error_en : e?.data?.error_ar)
          })
      } else {
        addOrder(data)
          .unwrap()
          .then((res) => {
            setUserPhone(res?.data?.phone)
            setOpenModal(true)
          })
          .catch((err) => {
            if (err?.data) {
              toast.error(err?.data[`error_${language}`])
            }
          })
      }
    },
  })

  const DataEn = useMemo(() => cityEnglish, [cityEnglish, language])
  const DataAr = useMemo(() => cityArabic, [cityArabic, language])
  const { handleBlur, handleChange } = formik

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
          console.log(latitude, longitude, 'locationsdasad')
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error(
            language === 'en'
              ? 'You Have To Enable Your Location Please'
              : ' يجب عليك تمكين موقعك من فضلك'
          )
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  useEffect(() => {
    if (location !== null) {
      setCheck(true)
    }
  }, [location])

  return (
    <Box
      sx={{
        direction: language === 'en' ? 'ltr' : 'rtl',
        marginRight: 'unset',
      }}
    >
      <Container
        sx={{
          py: { xs: 0, md: 2 },
          marginBottom: 4,
          width: { xs: ' 100%', md: ' 90%' },
          marginLeft: { xs: 'unset', md: 'auto' },
          marginRight: 'unset',
        }}
      >
        <Box
          sx={{
            py: { xs: 0, md: 2 },
          }}
        >
          {/* <Typography
            variant='h4'
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '25px', md: '30px' },
              color: props.color?.title,
            }}
          > */}
          {/* {language === 'en' ? 'Billing Details' : 'تفاصيل الفاتورة'} */}
          {/* </Typography> */}
        </Box>
        {/* form */}

        <form onSubmit={formik.handleSubmit}>
          <Box mt={2}>
            {/* <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'Name' : 'الاسم'}
            </FormLabel> */}
            <InputBase
              name="name"
              onBlur={formik.handleBlur}
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder={language === 'en' ? 'Name' : 'الاسم'}
              sx={{
                width: '100%',
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${
                  props.color?.label ? props.color?.label : 'gray'
                }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
                border: '1px solid #707070',
                borderRadius: '10px',
              }}
            />
            {formik.touched.name && formik.errors.name ? (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.name}
              </Typography>
            ) : null}
          </Box>
          <Box
            mt={2}
            sx={{
              position: 'relative',
            }}
          >
            <Box
              sx={
                formik.touched.city && formik.errors.city
                  ? {
                      ...Class_2,
                    }
                  : {
                      ...Class,
                    }
              }
            >
              <FormLabel
                sx={{
                  fontSize: {
                    xs: '15px',
                    md: '15px ',
                    xl: '20px',
                  },
                  color: '#a4a0a0',
                  marginLeft: '10px',
                }}
              >
                {language === 'en' ? 'City' : 'المدينة'}
              </FormLabel>
              <SearchOutlinedIcon
                sx={{
                  color: '#a4a0a0',
                }}
              />
            </Box>
            <Autocomplete
              disablePortal
              clearOnBlur
              onBlur={formik.handleBlur}
              // value={formik.values.city}
              getOptionLabel={(option) =>
                language === 'en' ? option.en : option.ar
              }
              onChange={(e, value) => {
                formik.setFieldValue('city', value?.en)
              }}
              id="combo-box-demo"
              options={language === 'en' ? DataEn : DataAr}
              noOptionsText={language === 'en' ? 'City' : 'المدينة'}
              sx={{
                width: '100%',
                height: { xs: '65px', sm: '75px', md: '55px' },
                mt: 2,

                border: '0px  !important',

                '& input': {
                  fontSize: { xs: '1rem', sm: '20px' }, // Adjust the font size as needed

                  ml: 4,
                },
                backgroundColor: 'transparent !important',
                '.MuiAutocomplete-inputRoot.MuiInputBase-adornedEnd.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-fullWidth.MuiInputBase-root.MuiOutlinedInput-root.css-154xyx0-MuiInputBase-root-MuiOutlinedInput-root':
                  {
                    border: '1px solid #707070',

                    borderRadius: '10px !important',
                  },
                '.css-segi59': {
                  border: '0px  !important',
                  borderRadius: '10px !important',
                  outline: 'none !important',
                },
                '.css-1q60rmi-MuiAutocomplete-endAdornment': {
                  left: '0px !IMPORTANT',
                  right: ' 91% !important',
                  // display:formik?.values?.city!==""?'none':'absolute'
                },
                '.css-2iz2x6': {
                  left: '0px !IMPORTANT',
                  right: ' 95% !important',
                  // display:formik?.values?.city!==""?'none':'absolute'
                },
                'input#combo-box-demo': {
                  marginRight: '11%',
                },
              }}
              renderInput={(params) => <TextField name="city" {...params} />}
            ></Autocomplete>
            {formik.touched.city && formik.errors.city && (
              <Typography sx={{ color: 'red', mt: 1 }}>
                {formik.errors.city}
              </Typography>
            )}
          </Box>
          <Box mt={2} sx={{}}>
            {/* <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'Area' : 'المنطقة'}
            </FormLabel> */}
            <InputBase
              name="area"
              onBlur={formik.handleBlur}
              value={formik.values.area}
              onChange={formik.handleChange}
              placeholder={language === 'en' ? 'Area' : 'المنطقة'}
              sx={{
                width: '100%',
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `1px solid  #ddd !important '
                  }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
                border: '1px solid #707070',
                borderRadius: '10px',
              }}
            />
            {formik.touched.area && formik.errors.area && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.area}
              </Typography>
            )}
          </Box>
          <Box mt={2} sx={{}}>
            <InputBase
              name="address"
              onBlur={formik.handleBlur}
              value={formik.values.address}
              onChange={formik.handleChange}
              placeholder={language === 'en' ? 'Address' : 'العنوان'}
              sx={{
                width: '100%',
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${
                  props.color?.label ? props.color?.label : 'gray'
                }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
                border: '1px solid #707070',
                borderRadius: '10px',
              }}
            />
            {formik.touched.address && formik.errors.address && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.address}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <Box
              mt={2}
              sx={{
                width: { xs: '100%', sm: '100%', md: '49%' },
              }}
            >
              {/* <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en' ? 'Postal Code' : 'الرمز البريدي'}
            </FormLabel> */}
              <InputBase
                name="postalCode"
                onBlur={formik.handleBlur}
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                placeholder={
                  language === 'en' ? 'Postal Code' : 'الرمز البريدي'
                }
                sx={{
                  width: '100%',
                  height: { xs: '65px', sm: '75px', md: '60px' },
                  borderRadius: 0,
                  border: `2px solid ${
                    props.color?.label ? props.color?.label : 'gray'
                  }`,
                  mt: 2,
                  '& input': {
                    fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                    ml: 2,
                  },
                  backgroundColor: 'transparent !important',
                  px: language === 'en' ? 0 : 2,
                  border: '1px solid #707070',
                  borderRadius: '10px',
                }}
              />
              {formik.touched.postalCode && formik.errors.postalCode && (
                <Typography sx={{ color: 'red' }}>
                  {formik.errors.postalCode}
                </Typography>
              )}
            </Box>
            <Box
              mt={2}
              sx={{
                width: { xs: '100%', sm: '100%', md: '49%' },
              }}
            >
              <InputBase
                name="phone"
                onBlur={formik.handleBlur}
                value={
                  userData?.email && !formik.values.phone.startsWith('+966')
                    ? `+966${formik.values.phone}`
                    : formik.values.phone
                }
                placeholder={language === 'en' ? 'Phone' : 'الهاتف'}
                onChange={(event) => {
                  const { value, selectionStart, selectionEnd } = event.target
                  const prefix = '+966'
                  // Check if the value starts with "+966" and only allow editing the part after it
                  if (userData?.email && !userData?.phone) {
                    if (value.startsWith('+966')) {
                      const userInput = value.substring(4) // Remove "+966" from the input
                      formik.handleChange('phone')(userInput) // Update the user's input
                    } else {
                      // If the input does not start with "+966," keep the previous value
                      formik.handleChange('phone')(formik.values.phone)
                    }
                  } else {
                    // When user doesn't have an email, prevent deletion of "+966"
                    if (
                      (selectionStart && selectionStart < prefix.length) ||
                      (selectionEnd && selectionEnd < prefix.length)
                    ) {
                      event.preventDefault()
                    } else {
                      formik.handleChange('phone')(value)
                    }
                  }
                }}
                sx={{
                  height: { xs: '65px', sm: '75px', md: '60px' },
                  borderRadius: 0,
                  border: `2px solid ${
                    props.color?.label ? props.color?.label : 'gray'
                  }`,
                  mt: 2,
                  '& input': {
                    fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                    ml: 2,
                  },
                  width: '100%',
                  backgroundColor: 'transparent !important',
                  px: language === 'en' ? 0 : 2,
                  border: '1px solid #707070',
                  borderRadius: '10px',
                }}
              />
              {formik.touched.phone && formik.errors.phone && (
                <Typography sx={{ color: 'red' }}>
                  {formik.errors.phone}
                </Typography>
              )}
            </Box>
          </Box>

          <Box mt={2}>
            <InputBase
              name="email"
              onBlur={formik.handleBlur}
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder={language === 'en' ? 'Email' : 'البريد الالكتروني'}
              sx={{
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${
                  props.color?.label ? props.color?.label : 'gray'
                }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                width: '100%',
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
                border: '1px solid #707070',
                borderRadius: '10px',
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.email}
              </Typography>
            )}
          </Box>
          <Box mt={2}>
            {/* <FormLabel
              sx={{
                fontSize: { xs: '20px', md: '25px' },
                color: props.color?.label ? props.color?.label : '#4e6f72',
              }}
            >
              {language === 'en'
                ? ' Order Notes (optional)'
                : 'ملاحظات الطلب (اختياري)'}
            </FormLabel> */}
            <InputBase
              name="orderNotes"
              onBlur={formik.handleBlur}
              value={formik.values.orderNotes}
              onChange={formik.handleChange}
              sx={{
                height: { xs: '65px', sm: '75px', md: '60px' },
                borderRadius: 0,
                border: `2px solid ${
                  props.color?.label ? props.color?.label : 'gray'
                }`,
                mt: 2,
                '& input': {
                  fontSize: { xs: '1rem', sm: '20px', md: '22px' }, // Adjust the font size as needed
                  ml: 2,
                },
                width: '100%',
                backgroundColor: 'transparent !important',
                px: language === 'en' ? 0 : 2,
                border: '1px solid #707070',
                borderRadius: '10px',
              }}
              placeholder={
                language === 'en'
                  ? ' Order Notes (optional)'
                  : 'ملاحظات الطلب (اختياري)'
              }
            />
            {formik.touched.orderNotes && formik.errors.orderNotes && (
              <Typography sx={{ color: 'red' }}>
                {formik.errors.orderNotes}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              disabled={!location || orderLoad}
              type="submit"
              sx={{
                mt: 6,
                mb: 5,
                width: 'fit-content',
                height: '60px',
                borderRadius: '15px',
                bgcolor: props.button?.backgroundColor
                  ? `${props.button?.backgroundColor} !important`
                  : 'black !important',
                color: props.button?.color
                  ? `${props.button?.color} !important`
                  : 'white',
                fontSize: { xs: '13px', md: '13px' },
                textTransform: 'none',
                padding: '30px',
              }}
            >
              {orderLoad ? (
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress
                    sx={{
                      color: props.button?.color || 'white',
                    }}
                  />
                </Box>
              ) : language === 'en' ? (
                'Order Now'
              ) : (
                'اتمام الطلب  '
              )}
            </Button>

            <Typography
              sx={{
                color: '#4D4C4C',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/cart')}
            >
              {language === 'en'
                ? '  Return To Cart  >'
                : '<  الرجوع الي السله'}
            </Typography>
          </Box>
          {!Check ? (
            <>
              {language === 'en'
                ? 'You Have To Enable Your Location To Submit Payment'
                : 'يجب عليك تمكين موقعك لاتمام عمليه الدفع'}
            </>
          ) : null}
        </form>
      </Container>

      <VerifiedCode
        open={openModal}
        handelerCode={handelerCode}
        userPhone={userPhone}
        loading={codeLoad}
        setOpenModal={setOpenModal}
      />
    </Box>
  )
}
// ================================================================================================ //

// ================================|| CHECKOUT - ORDER SUMMARY ||================================ //

const cartPrice = (total, quantity, price) => {
  const pricePlusTax = total / quantity
  const tax = pricePlusTax - price
  return tax
}

const OrderSummary = ({ color }) => {
  const { currencyPrice, label } = useSelector((state) => state.currency)
  const labelText = label.match(/\(([^)]+)\)/)
  const currencySymbol = labelText ? labelText[1] : ''
  const [_, { language }] = useTranslation()
  const { data, isSuccess } = useGetAllCartsQuery(undefined)
  const cashItems = data?.data.cashItems?.items || []
  const onlineItems = data?.data.onlineItems?.items || []
  const productInCart = [...cashItems, ...onlineItems]

  let couponData = JSON.parse(localStorage.getItem('couponData'))
  const calculateCartPrice = (online, cash) => {
    return (online + cash).toFixed(2)
  }
  const CalculatePercentage = (total, percentage) => {
    return total - (total * percentage) / 100
  }
  const calculateProductsAfterDiscount = (
    productsArray,
    products,
    percent,
    callback
  ) => {
    let totalItemsCart = 0

    if (productsArray?.length) {
      const arr = productsArray?.map((item) => {
        const {
          total,
          product: { finalPrice },
        } = item
        const itemAfterCoupon = (percent / 100) * finalPrice
        const isDiscount = products?.includes(item.product._id)
        if (isDiscount)
          return {
            ...item,
            total: Math?.abs(Math?.ceil(total - itemAfterCoupon)),
          }
        return item
      })

      totalItemsCart = arr?.reduce((acc, item) => item?.total + acc, 0)
    }

    return callback(totalItemsCart)
  }
  const calculateProductsAfterDiscountForAll = (
    arr1,
    arr2,
    products,
    percent,
    callback
  ) => {
    const after1 = arr1?.map((item) => {
      const { total } = item
      const itemAfterCoupon = (percent / 100) * total
      const isDiscount = products?.includes(item?.product._id)
      if (isDiscount)
        return {
          ...item,
          total: Math?.abs(Math?.ceil(total - itemAfterCoupon)),
        }
      return item
    })
    const after2 = arr2?.map((item) => {
      const { total } = item
      const itemAfterCoupon = (percent / 100) * total
      const isDiscount = products?.includes(item?.product?._id)
      if (isDiscount)
        return {
          ...item,
          total: Math?.abs(Math?.ceil(total - itemAfterCoupon)),
        }
      return item
    })

    const total = [...after1, ...after2]?.reduce(
      (acc, item) => item?.total + acc,
      0
    )
    return callback(total)
  }
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Container
        sx={{
          mt: 4,
          p: 2,
          marginRight: 'auto',
          marginLeft: 'unset',
        }}
      >
        {/* prouduct with images */}

        <Box
          id={'CustomScroll'}
          sx={{
            overflowY: 'auto', // Apply scroll only if more than 3 items
            height: { xs: '300px', md: '400px' },
            marginRight: 'auto',
          }}
        >
          {productInCart?.map((item) => (
            <Stack
              key={item.product.id}
              direction="row"
              sx={{
                mt: 2,
                mb: 2,
                p: 2,

                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  width: { xs: '50px', md: '100px' },
                  height: { xs: '50px', md: '100px' },
                  overflow: 'hidden',
                  borderRadius: '10px',
                  border: '1px solid #ddd !important',
                  margin: '0px 10px',
                }}
              >
                <img
                  src={img}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    'max-width': '100px',
                    'min-height': '100px',
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  sx={{
                    color: color?.title ? color?.title : 'gray',
                    mx: { xs: 2, lg: 0 },
                    fontSize: {
                      xs: '13px',
                      md: '15px',
                    },
                  }}
                >
                  {item.product[`title_${language}`].slice(0, 18)}
                </Typography>
                <Typography
                  sx={{
                    color: color?.title ? color?.title : 'gray',
                    mx: { xs: 2, lg: 0 },
                    fontSize: {
                      xs: '13px',
                      md: '15px',
                    },
                    alignSelf: 'flex-start',
                  }}
                >
                  {language == 'en' ? 'Quantity' : 'العدد'} {item?.quantity}
                </Typography>
              </Box>

              <Stack
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  sx={{
                    color: color?.title ? color?.title : 'gray',
                    fontSize: {
                      xs: '13px',
                      md: '15px',
                    },
                  }}
                >
                  {(
                    (ProductDiscountForProduct(item)
                      ? ProductDiscountForProduct(item)
                      : item?.total - item?.product?.shippingPrice) *
                    currencyPrice
                  ).toFixed(2)}
                  {/* {item.product.priceAfterDiscount
                    ? (
                        (cartPrice(
                          item.total,
                          item.quantity,
                          item.product.finalPrice
                        ) +
                          item.product.priceAfterDiscount) *
                        currencyPrice
                      ).toFixed(2)
                    : (
                        (cartPrice(
                          item.total,
                          item.quantity,
                          item.product.finalPrice
                        ) +
                          item.product.priceBeforeDiscount) *
                        currencyPrice
                      ).toFixed(2)}{' '} */}
                  {currencySymbol}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Box>

        <Stack
          direction={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 7,
            mb: 2,
            pb: 2,
            paddingTop: '10px',
            borderTop: '1px solid #ddd',
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '15px', md: '15px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {language === 'en' ? 'Cash on delivery:' : 'الدفع عند الاستلام'}
            </Typography>
          </Box>

          {/* get user order */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '15px', md: '15px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {console.log(
                data?.data?.cashItems.totalPrice,
                couponData?.persentage,
                'couponData?.percentage'
              )}
              {data?.data.cashItems.totalPrice !== 0 ? (
                couponData?.couponEnter !== '' ? (
                  <>
                    {calculateProductsAfterDiscount(
                      data?.data?.cashItems?.items,
                      couponData?.products,
                      couponData?.persentage,
                      (total) => {
                        return <>{(total * currencyPrice).toFixed(2)}</>
                      }
                    )}
                  </>
                ) : (
                  (data?.data?.cashItems.totalPrice * currencyPrice).toFixed(2)
                )
              ) : (
                0 || 0
              )}{' '}
              {currencySymbol}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
            mb: 2,
            pb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '15px', md: '15px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {language === 'en' ? 'Online payment:' : ' الدفع الالكتروني'}
            </Typography>
          </Box>

          {/* get user order */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '15px', md: '25px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {data?.data.onlineItems.totalPrice !== 0 ? (
                couponData?.couponEnter !== '' ? (
                  <>
                    {calculateProductsAfterDiscount(
                      data?.data?.onlineItems?.items,
                      couponData?.products,
                      couponData?.persentage,
                      (total) => {
                        return <>{(total * currencyPrice).toFixed(2)}</>
                      }
                    )}
                  </>
                ) : (
                  //  ( CalculatePercentage(data?.data.onlineItems,
                  //   couponData?.persentage)*currencyPrice).toFixed(2)
                  (data?.data.onlineItems.totalPrice * currencyPrice).toFixed(2)
                )
              ) : (
                0
              )}{' '}
              {currencySymbol}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
            mb: 2,
            pb: 2,
            borderTop: '1px solid #ddd',
            paddingTop: '10px',
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '15px', md: '15px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {language === 'en' ? 'Total' : ' المجموع'}
            </Typography>
          </Box>

          {/* get user order */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '15px', md: '15px' },
                color: color?.title ? color?.title : 'gray',
              }}
            >
              {couponData?.couponEnter !== '' ? (
                <>
                  {console.log(
                    data?.data?.onlineItems?.items,
                    data?.data?.cashItems?.items,
                    'sadq33q'
                  )}
                  <>
                    {calculateProductsAfterDiscount(
                      data?.data?.onlineItems?.items,
                      couponData?.products,
                      couponData?.persentage,
                      (total_1) => {
                        return (
                          <>
                            {calculateProductsAfterDiscount(
                              data?.data?.cashItems?.items,
                              couponData?.products,
                              couponData?.persentage,
                              (total) => {
                                return (
                                  <>
                                    {(
                                      (total_1 + total) *
                                      currencyPrice
                                    ).toFixed(2)}
                                  </>
                                )
                              }
                            )}
                          </>
                        )
                      }
                    )}
                  </>
                </>
              ) : (
                (
                  calculateCartPrice(
                    data?.data?.onlineItems.totalPrice,
                    data?.data?.cashItems.totalPrice
                  ) * currencyPrice
                ).toFixed(2)
              )}{' '}
              {currencySymbol}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
// ================================================================================================ //

// ===========================|| CHECKOUT ||=========================== //

const CheckOutJariri = () => {
  const [, { language }] = useTranslation()

  return (
    <Box
      sx={{
        direction: language === 'en' ? 'ltr' : 'rtl',
        mt: 5,
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '100%' },
          mx: 'auto',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', md: 'row' },
          }}
        >
          <Grid item xs={12} md={7} lg={8}>
            <BillingDetails
              color={JaririStyle.color}
              button={JaririStyle.button}
            />
          </Grid>

          <Grid item xs={12} md={5} lg={3.6}>
            <OrderSummary color={JaririStyle.color} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default CheckOutJariri
