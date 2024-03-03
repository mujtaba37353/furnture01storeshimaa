import { useState, useEffect, useRef } from 'react'
import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'
import {
  useLazyGetMeQuery,
  useUpdateUserMutation,
} from '../../../redux/apis/UserApis'
import { useLazyGetUserOrdersQuery } from '../../../redux/apis/ordersApi'
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
} from '@mui/material'
import { useUploadImageMutation } from '../../../redux/apis/UploadsApi'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import styles from './profile2.styles'
import EditIcon from '@mui/icons-material/Edit'
import { imageBaseUrl } from '../../../constants/baseUrl'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { toast } from 'react-toastify'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { json } from 'react-router-dom'

// ================================|| PROFILE - ORDER CARD ||================================ //
const OrderCard = (props) => {
  const { currencyPrice, label } = useSelector(state => state.currency);
  const labelText = label.match(/\(([^)]+)\)/);
  const currencySymbol = labelText ? labelText[1] : '';

  const { items, tracking, id, lang } = props
console.log(items);
  const handelDownload = (downloadLink) => {

    // window.open(downloadLink);
    window.open(downloadLink,"popup","width=600,height=600,left=500,top=200,scrollbars=no,resizable=no");
    
    // const link = document.createElement("iframe");
    // link.setAttribute("src", "https://www.youtube.com/embed/6jkFPCH6TFQ?si=bHuR3aW8vaaQ9WZx");
    // link.setAttribute("src", downloadLink);
    // console.log(downloadLink);
    // link.setAttribute("style", "display:block; position:absolute; top:50%; left:50%; width:500px; height:400px; border:none;transform:translate(-50%, -50%);");
    // document.body.appendChild(link);
    // i need to remove the iframe after the download is done
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography textAlign={'center'}>
          {lang === 'en' ? 'Order Number' : 'رقم الطلب'} {id}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid
          container
          direction="row"
          // justifyContent={'space-between'}
          gap={2}
          p={2}
        >
          {items.map(({ totalPrice, quantity, product, properties }, index) => (
            <Grid item xs={12} md={12} key={index}>
              <Grid
                container
                direction="row"
                justifyContent={'space-between'}
                spacing={2}
                sx={{
                  color: 'inherit',
                }}
              >
                <Grid item xs={12} md={5}>
                  {product ? <CardMedia
                    component="img"
                    height="240"
                    width={'100%'}
                    image={product?.images[0] ? `${imageBaseUrl}${product?.images[0]}` : null}
                    alt={product.name}
                    sx={{
                      objectFit: 'contain',
                    }}
                  /> : null}
                </Grid>
                <Grid item xs={12} md={7}>
                  {product ? <Typography variant="h6">
                    {lang === 'en' ? 'Name' : 'الاسم'} :{' '}
                    {lang === 'en' ? product.title_en : product.title_ar}
                  </Typography>
                    : null}
                  <Typography variant="h6">
                    {lang === 'en' ? 'Price' : 'السعر'} : {((totalPrice) * currencyPrice).toFixed(2)}{' '}
                    {currencySymbol}
                  </Typography>

                  <Typography variant="h6">
                    {' '}
                    {lang === 'en' ? 'Quantity' : 'الكمية'} : {quantity}{' '}
                  </Typography>
                  {properties?.map((property) => (
                    <Typography variant="h6">
                      {lang === 'en' ? property.key_en : property.key_ar} :{' '}
                      {lang === 'en' ? property.value_en : property.value_ar}
                    </Typography>
                  ))}
                  {product?.directDownloadLink && (

                    <Tooltip
                      title={lang === "en" ? "Download product" : "تحميل المنتج"
                      }
                      sx={{
                        color: "#000",

                        // borderColor: customColors.inputField,
                        borderRadius: "10%",
                        height: "55px",

                      }}
                    >
                      <ArrowCircleDownIcon
                        onClick={() => handelDownload(product.directDownloadLink)}
                        sx={{
                          fontSize: "50px",
                          cursor: "pointer",
                          mt: 1,
                        }} />
                    </Tooltip>
                  )}

                </Grid>
              </Grid>
            </Grid>
          ))}
          {tracking.length > 0 && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {tracking.map(({ orderNumberTracking, path }) => (
                  <Grid item xs={12} md={12} key={orderNumberTracking}>
                    <Typography
                      component={Paper}
                      elevation={3}
                      p={2}
                      variant="h6"
                      textAlign={'center'}
                      sx={{
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        window.open(path, '_blank')
                      }}
                    >
                      {lang === 'en' ? 'Tracking Number' : 'رقم التتبع'}{' '}
                      {orderNumberTracking}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
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
          .catch((err) => { })
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
    <Box sx={{ flex: 1,my:{xs:2,md:0} }}>
      <Paper
        component="form"
        onSubmit={formik.handleSubmit}
        elevation={3}
        sx={styles.formContainer}
      >
        <Badge
          sx={styles.badge}
          overlap="circular"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          badgeContent={
            <Box onClick={handelUploadImage}>
              <Avatar sx={styles.EditIcon}>
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
            <Grid key={index} item xs={10}>
              <Box
                sx={{
                  mt: '20px',
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
            sx={styles.submitBtn}
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
          <Grid
            container
            direction="row"
            justifyContent={'space-between'}
            width={'100%'}
            gap={2}
          >
            {ordersItems.data.map(({ items, tracking, _id }, index) => (
              <Grid component={Paper} item key={index} xs={12} width={'100%'}>
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

const Profile2 = () => {

  const [_, { language: lang }] = useTranslation()
  const [getMe, { isLoading,error }] = useLazyGetMeQuery()
  const [user, setUser] = useState()
  const [getUserOrders, { isLoading: isLoadingOrders }] =
    useLazyGetUserOrdersQuery()
  const [ordersItems, setOrdersItems] = useState({
    data: [],
    error: '',
  })
  useEffect(() => {
    getMe()
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
            
            // console.log("err profile",json.stringify(err));
            console.log("ljmljmljljljlj");
            // setOrdersItems({
            //   data: [],
            //   error: err.data[`error_${lang}`],
            // })
          })
      }).catch((err) => {
        console.log("err profile",JSON.stringify(err));
      })
  }, [])
  return (
    <Box
      sx={{ ...styles.pageContainer, direction: lang === 'en' ? 'ltr' : 'rtl' }}
    >
      {isLoading && (
        <div className="loader"></div>
      ) }
      {!error && !isLoading && (

        <>
          <ProfileForm lang={lang} user={user} />
          <ProfileOrders
            lang={lang}
            ordersItems={ordersItems}
            isLoadingOrders={isLoadingOrders}
          />
        </>
      )}
      
    </Box>
  )
}

export default Profile2

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
