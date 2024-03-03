import { useState, useEffect, useRef } from 'react'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'
import {
  useLazyGetMeQuery,
  useUpdateUserMutation,
} from '../../../redux/apis/UserApis'
import {
  useLazyGetUserOrdersQuery,
  useLazyTrackOrderQuery,
  useTrackOrderQuery,
} from '../../../redux/apis/ordersApi'
import {
  Avatar,
  Badge,
  Box,
  Grid,
  Paper,
  Typography,
  InputBase,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardMedia,
  Tooltip,
  ButtonBase,
} from '@mui/material'
import { useUploadImageMutation } from '../../../redux/apis/UploadsApi'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import styles from './profile1.styles'
import EditIcon from '@mui/icons-material/Edit'
import { imageBaseUrl } from '../../../constants/baseUrl'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { toast } from 'react-toastify'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import OrderImage from '../../../assets/svg/order.jpg'
import { useTheme } from '@emotion/react'
import Orders from './Orders'
// ================================|| PROFILE - ORDER CARD ||================================ //
const OrderCard = (props) => {
  const status = {
    error: {
      en: 'Not Shipping',
      ar: 'لم يتم الشحن',
    },
    defualt: {
      en: 'Track Order',
      ar: 'تتبع الطلب',
    },
    initiated: {
      en: 'initiated',
      ar: 'تم البدء',
    },
    created: {
      en: 'created',
      ar: 'تم الانشاء',
    },
    'on going': {
      en: 'on going',
      ar: 'جاري التنفيذ',
    },
    'on delivered': {
      en: 'on delivered',
      ar: 'تم التوصيل',
    },
    completed: {
      en: 'completed',
      ar: 'تم الانتهاء',
    },
    refund: {
      en: 'refund',
      ar: 'تم الاسترجاع',
    },
  }
  const { currencyPrice, label } = useSelector((state) => state.currency)
  const labelText = label.match(/\(([^)]+)\)/)
  const currencySymbol = labelText ? labelText[1] : ''
  const {  id, lang } = props
  const [statu, setStatu] = useState('defualt')

  const [trackOrder, { isLoading, error }] = useLazyTrackOrderQuery()
  const handleTracking = (id) => {
    trackOrder(id)
      .unwrap()
      .then((res) => {
        setStatu(res?.data?.status)
      })
      .catch((err) => {
        setStatu('error')
      })
  }

  return (
    <Box
      sx={{
        width: '100%',
        backgroundImage: `url(${OrderImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        height: '300px',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          py: 2,
          bottom: 40,
        }}
      >
        <Typography sx={{
           fontSize:{
            xs:'10px',
            md:'20px'
          }
        }} textAlign={'center'}>{id}</Typography>
        <ButtonBase onClick={() => handleTracking(id)}>
          <Typography
            sx={{
              borderRadius: '50px',
              backgroundColor: '#C4A035 !important',
              padding: '10px 40px',
              boxShadow:'0px !important',
              fontSize:{
                xs:'10px',
                md:'20px'
              }
            }}
          >
            {status[statu][lang]}
          </Typography>
        </ButtonBase>
      </Box>
    </Box>
   
  )
}
// ================================================================================================ //

// ================================|| PROFILE - FORM ||================================ //

const ProfileForm = ({ lang, user }) => {
  const [uploadImage, { isLoading: uploadingLoading }] =
    useUploadImageMutation()
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation()
  const [uploadedImage, setUploadedImage] = useState()
  const inputFileRef = useRef(null)
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: constants.initialValues,
    validationSchema: constants.validationSchema(lang),
    onSubmit: (values) => {
      if (uploadedImage) {
        const data = new FormData()
        data.append('image', uploadedImage)
        const dotIndex = uploadedImage.name.lastIndexOf('.')
        const type = uploadedImage.name.slice(
          dotIndex + 1,
          uploadedImage.name.length
        )
        uploadImage({ file: data, type })
          .unwrap()
          .then((res) => {
            handleUpdate({ ...values, image: res.image })
          })
          .catch((err) => {})
      } else {
        handleUpdate(values)
      }
    },
  })
  const handleUpdate = (values) => {
    updateUser(values)
      .unwrap()
      .then((res) => {
        toast.success(lang === 'en' ? res?.success_en : res?.success_ar)
        dispatch(setCurrentUser(res?.data))
      })
      .catch((err) => {
        toast.error(lang === 'en' ? err?.data?.error_en : err?.data?.error_ar)
      })
  }
  const handelUploadImage = () => inputFileRef.current?.click()
  const handelChangeImage = (e) => {
    const file = e.target.files[0]
    setUploadedImage(file)
  }
  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user?.name,
        email: user?.email,
        phone: user?.phone ? user?.phone : '',
        image: user?.image,
        password: '',
      })
    }
  }, [user])
  return (
    <Box sx={{ flex: 1 }}>
      <Paper
        component="form"
        onSubmit={formik.handleSubmit}
        elevation={3}
        sx={{

          ...styles.formContainer,
          boxShadow:'none !important'
        }}
      >
        <Badge
          sx={styles.badge}
          overlap="circular"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={
            <Box onClick={handelUploadImage}>
              <Avatar
                sx={{
                  ...styles.EditIcon,
                  position: 'absolute',
                  left: '30%',
                  top: '-5%',
                  height: '50px',
                  width: '50px',
                }}
              >
                <EditIcon sx={{ cursor: 'pointer' }} />
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={inputFileRef}
                style={{
                  visibility: 'hidden',
                }}
                onChange={handelChangeImage}
              />
            </Box>
          }
        >
          <Avatar
            alt="Travis Howard"
            src={
              uploadedImage
                ? URL.createObjectURL(uploadedImage)
                : `${imageBaseUrl}/${formik.values.image}`
            }
            sx={styles.avatar}
          />
        </Badge>
        <Grid
          container
          spacing={{ xs: 2, md: 5 }}
          rowSpacing={3}
          justifyContent="center"
        >
          {constants.inputs.map((inpt, index) => (
            <Grid key={index} item xs={12} md={6}>
              <Box
                sx={{
                  mt: '5px',
                  p: 2,
                }}
              >
                <Typography component="label" sx={styles.label}>
                  {lang === 'en' ? inpt.label_en : inpt.label_ar}
                </Typography>

                <InputBase
                  type={inpt.type === 'password' ? 'password' : 'text'}
                  name={inpt.name}
                  value={formik.values[inpt.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={lang === 'en' ? inpt.label_en : inpt.label_ar}
                  sx={styles.inputBase}
                />
                {formik.touched[inpt.name] && formik.errors[inpt.name] ? (
                  <Typography color="red">
                    {formik.errors[inpt.name]}
                  </Typography>
                ) : null}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Stack direction="row" justifyContent={'center'} gap={3} mt={5}>
          <Button
            variant="contained"
            disabled={loadingUpdate || uploadingLoading}
            type="submit"
            sx={{...styles.submitBtn}}
          >
            {loadingUpdate || uploadingLoading
              ? lang === 'en'
                ? 'Updating...'
                : 'جاري التحديث'
              : lang === 'en'
              ? 'Update'
              : 'تحديث'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
// ================================================================================================ //

// ================================|| PROFILE - ORDERS CONTAIENR ||================================ //
const ProfileOrders = (props) => {
  const { lang, ordersItems, isLoadingOrders } = props
  return (
    <Paper elevation={3} sx={styles.container}>
      {isLoadingOrders ? (
        <div className="loader"></div>
      ) : ordersItems?.data.length !== 0 && !ordersItems.error ? (
        <Box className="previousOrders" sx={{ width: '100%' }}>
          <Typography sx={styles.headear}>
            {lang === 'en' ? 'Orders' : 'الطلبات '}
          </Typography>
          <Grid container direction="row" width={'100%'} gap={2}>
            {ordersItems.data.map(({ items, tracking, _id }, index) => (
              <Grid
                component={Paper}
                item
                key={index}
                xs={5}
                sm={5}
                md={3}
                xl={3}
                width={'90%'}
                className="gridOrder"
                sx={{
                  borderRadius: '30px',
                  overflow: 'hidden',
                  margin:'auto',

                }}
              >
                <OrderCard
                  items={items}
                  tracking={tracking}
                  id={_id}
                  lang={lang}
                />
              </Grid> 
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={styles.errorContainer}>
          <Typography sx={styles.error}>
            {ordersItems?.error
              ? ordersItems.error
              : lang === 'en'
              ? 'No Orders'
              : 'لا يوجد طلبات'}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

// ================================|| PROFILE ||================================ //

const Profile1 = () => {
  const [_, { language: lang }] = useTranslation()
  const [getMe, { isLoading }] = useLazyGetMeQuery()
  const [user, setUser] = useState()
  const [getUserOrders, { isLoading: isLoadingOrders }] =
    useLazyGetUserOrdersQuery()
  const theme = useTheme()
  const [ordersItems, setOrdersItems] = useState({
    data: [],
    error: '',
  })
  useEffect(() => {
    getMe(undefined)
      .unwrap()
      .then((res) => {
        setUser(res.data)
        getUserOrders(undefined)
          .unwrap()
          .then((res) => {
            setOrdersItems({
              data: res.data.map((item) => ({
                _id: item._id,
                items: [...item.cashItems.items, ...item.onlineItems.items],
                tracking: item.tracking,
              })),
              error: undefined,
            })
          })
          .catch((err) => {
            setOrdersItems({
              data: [],
              error: err.data[`error_${lang}`],
            })
          })
      })
      .catch((err) => {
        console.log('err profile', JSON.stringify(err))
      })
  }, [])
  return (
    <Box
      sx={{ ...styles.pageContainer, direction: lang === 'en' ? 'ltr' : 'rtl' }}
    >
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <>
          <ProfileForm lang={lang} user={user} />

          <Orders/>
         
        </>
      )}
    </Box>
  )
}
export default Profile1

// =========================================|| PROFILE - CONSTANTS ||=================================================== //
const constants = {
  initialValues: {
    name: '',
    email: '',
    phone: '',
    password: '',
    image: '',
  },
  inputs: [
    {
      type: 'text',
      name: 'name',
      label_en: 'Name',
      label_ar: 'الاسم',
    },
    {
      type: 'email',
      name: 'email',
      label_en: 'Email Address',
      label_ar: 'البريد الإلكتروني',
    },
    {
      type: 'number',
      name: 'phone',
      label_en: 'Phone number',
      label_ar: 'رقم الجوال',
    },

    {
      type: 'password',
      name: 'password',
      label_en: 'Password',
      label_ar: 'كلمة المرور',
    },
  ],
  validationSchema: (lang) => {
    return object({
      name: string(),
      email: string().email(
        lang === 'en' ? 'Email is invalid' : 'البريد الالكتروني غير صحيح'
      ),
      phone: string().matches(
        /^\+966\d{9}$/,
        lang === 'en'
          ? 'Phone must start with +966 and have a total length of 12 characters'
          : 'يجب أن يبدأ الهاتف بـ +966 ويكون مكون من 12 حرفًا'
      ),
      password: string().min(
        6,
        lang === 'en'
          ? 'Password must be at least 6 characters'
          : 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'
      ),
    })
  },
}

// ================================================================================================ //
