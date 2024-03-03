import {
  Box,
  Grid,
  Typography,
  Stack,
  ButtonBase,
  InputBase,
  InputAdornment,
} from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Person2Icon from '@mui/icons-material/Person2'
import PhoneIcon from '@mui/icons-material/Phone'
import MailIcon from '@mui/icons-material/Mail'
import HttpsIcon from '@mui/icons-material/Https'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import * as yup from 'yup'
import { useRegisterMutation } from '../../../redux/apis/UserApis'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../../redux/slices/userSlice'
import VerifiedCode from '../../../components/verification/VerifiedCode'
import { useGetUserAuthCodeMutation } from '../../../redux/apis/verifiedCodeApi'
import GoogleLogo from '../../../assets/svg/google-color-svgrepo-com.svg'
import { Register2Colors } from './style'
import { baseUrl } from '../../../constants/baseUrl'
import { Link } from 'react-router-dom'
import Popover from '@mui/material/Popover'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

// formik data
const useFormikData = () => {
  const [, { language: lang }] = useTranslation()
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
  }
  const validationSchema = yup.object({
    registrationType: yup.string().required(),
    name: yup.string(),
    phone: yup.string().when('registrationType', {
      is: (val) => (val === 'phone' ? true : false),
      then: () =>
        yup
          .string()
          .matches(
            /^[0-9]/,
            lang === 'en'
              ? 'Phone must start with country code and only numbers'
              : 'يجب أن يبدأ الهاتف برمز البلد وأرقام فقط'
          )
          .required(lang === 'en' ? 'Phone is required*' : '*رقم الهاتف مطلوب')
          .max(
            9,
            lang === 'en'
              ? 'max 9 numbers after country key'
              : 'الحد الأقصى 9 أرقام بعد مفتاح الدولة'
          )
          .min(
            9,
            lang === 'en'
              ? 'min 9 numbers after country key'
              : 'الحد الادني 9 أرقام بعد مفتاح الدولة'
          ),
      otherwise: () => yup.number().notRequired(),
    }),
    email: yup.string().when('registrationType', {
      is: (val) => (val === 'email' ? true : false),
      then: () =>
        yup
          .string()
          .email(lang === 'en' ? 'Invalid email' : 'بريد إلكتروني خاطئ')
          .required(
            lang === 'en' ? 'Email is required*' : '*البريد الإلكتروني مطلوب'
          ),
      otherwise: () => yup.string().notRequired(),
    }),
    password: yup.string().when('registrationType', {
      is: (val) => (val === 'email' ? true : false),
      then: () =>
        yup
          .string()
          .required(
            lang === 'en' ? 'Password is required*' : '*كلمة المرور مطلوبة'
          ),
    }),
  })
  return { initialValues, validationSchema }
}
// =================================================================
// register with google

//===================================================================================================
const Register2 = ({ logo, backgroundImage }) => {
  const { pathname } = useLocation()
  const [userPhone, setUserPhone] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const [selectedValue, setSelectedValue] = useState('email')
  const [, { language: lang }] = useTranslation()
  const [passwordType, setPasswordType] = useState(true)
  const [register, { isLoading: regLoad }] = useRegisterMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [getUserAuthCode, { isLoading: authLoad }] =
    useGetUserAuthCodeMutation(undefined)
  const { initialValues, validationSchema } = useFormikData()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  // ===================================================================================================
  // switch between login and register
  const handelTypeAuth = (typeAuth) => {
    formik.resetForm()
    typeAuth === 'login' ? navigate('/sign-in') 
    : navigate('/register')
  }
  // ===================================================================================================
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const handleClose = () => {
    setAnchorEl(null)
  }
  // ===================================================================================================
  // handel register with phone
  const handelerCode = (code, userPhone) => {
    getUserAuthCode({ code, phone: userPhone })
      .unwrap()
      .then((res) => {
        setOpenModal(false)
        toast.success(res[`success_${lang}`])
        localStorage.setItem('token', res.token)
        dispatch(setCurrentUser(res.data))
        // navigate('/')
        window.location.replace('/')
      })
      .catch((err) => {
        toast.error(err.data[`error_${lang}`])
      })
  }
  // ===================================================================================================
  const [acceptTerms, setAcceptTerms] = useState(false)
  const handleLoginGoogle = async () => {
    if (!acceptTerms) {
      toast.error(
        lang === 'en'
          ? 'Must be agree the terms and conditions first!'
          : 'يجب ان تكون موافق على البنود و الشروط أولاً'
      )
    } else {
      window.location.href = `${baseUrl}/auth/google`
    }
  }
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      registrationType: selectedValue,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!acceptTerms) {
        toast.error(
          lang === 'en'
            ? 'Must be agree the terms and condition first!'
            : 'يجب ان تكون موافق على البنود و الشروط أولاً'
        )
      } else {
        let data = { ...values, phone: `+966${values.phone}` }
        data.registrationType === 'email'
          ? delete data.phone
          : (delete data.email, delete data.password)
        data.name?.length === 0 && delete data.name
        if (values.registrationType === 'phone') {
          register(data)
            .unwrap()
            .then((res) => {
              setOpenModal(true)
              setUserPhone(res?.data?.phone)
            })
            .catch((err) => {
              if (!err.data) {
                toast.error(
                  lang === 'en' ? 'Something went wrong!' : 'حدث خطأ ما'
                )
              } else {
                toast.error(err.data[`error_${lang}`])
              }
            })
        } else {
          register(data)
            .unwrap()
            .then((res) => {
              localStorage.setItem('token', res.token)

              // toast.success(res[`success_${lang}`])
              dispatch(setCurrentUser(res.data))
              navigate('/')
              window.location.replace('/')
            })
            .catch((err) => {
              if (!err.data) {
                toast.error(
                  lang === 'en' ? 'Something went wrong!' : 'حدث خطأ ما'
                )
              } else {
                toast.error(err.data[`error_${lang}`])
              }
            })
        }
      }
    },
  })
  return (
    <Box>
      <Grid
        container
        sx={{
          direction: lang === 'en' ? 'ltr' : 'rtl',
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            minHeight: {
              md: '90vh',
              xs: 'auto',
            },
            width: '100%',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: { xs: '250px', md: '300px' },
              height: { xs: '200px', md: '200px' },
              position: 'absolute',
              display: { xs: 'none', md: 'block' },
              top: {
                xs: '0%',
                md: '15%',
              },
              left: { xs: '50%', md: lang === 'en' ? '50%' : '52%' },
              transform: 'translate(-50%,-50%)',
              textAlign: 'center',
              color: 'gray',
            }}
          >
            <h1 style={{ fontSize: '60px' }}>لوجو</h1>
          </Box>
          <Box
            mt={{ xs: 15, md: 21 }}
            sx={{
              width: { xs: '100%', sm: '80%' },
              mx: 'auto',
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Stack
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: '20px 0',
                  mt: { xs: 6, md: '0' },
                }}
              >
                <Box
                  sx={{
                    py: { xs: '10px', md: '50px' },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    width: {
                      xl: 550,
                      lg: 425,
                      md: 0.75,
                      xs: 0.92,
                    },
                  }}
                >
                  <Box>
                    {/* Name */}
                    <InputBase
                      autoComplete={'off'}
                      startAdornment={
                        <Person2Icon
                          sx={{
                            color: Register2Colors.iconColor
                              ? Register2Colors.iconColor
                              : 'black',
                            mx: 2,
                            textAlign: lang === 'en' ? 'left' : 'right',
                          }}
                        />
                      }
                      placeholder={lang === 'en' ? 'Name' : 'الاسم'}
                      type={'text'}
                      sx={{
                        p: '15px 6px',
                        border: `2px solid ${
                          Register2Colors.borderInputColor
                            ? `${Register2Colors.borderInputColor} !important`
                            : `2px solid black !important`
                        }`,
                        backgroundColor: 'transparent !important',

                        '& > .css-17ewsm8-JoyInput-root': {
                          inputFocusedHighlight: 'black !important',
                        },
                        '& input::placeholder': {
                          color: Register2Colors.placeholderColor
                            ? Register2Colors.placeholderColor
                            : 'gray',
                        },
                        width: { xs: '100%', md: '90%' },
                        borderRadius: '15px',
                      }}
                      name="name"
                      value={formik.values.name}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </Box>

                  {/* Email */}

                  <Box
                    sx={{
                      display: selectedValue === 'phone' ? 'none' : 'block',
                    }}
                  >
                    <InputBase
                      autoComplete={'off'}
                      disabled={
                        selectedValue === 'phone' || formik.values.phone !== ''
                          ? true
                          : false
                      }
                      startAdornment={
                        <InputAdornment
                          position="start"
                          disabled={
                            selectedValue === 'phone' ||
                            formik.values.phone !== ''
                              ? true
                              : false
                          }
                        >
                          <MailIcon
                            disabled={
                              selectedValue === 'phone' ||
                              formik.values.phone !== ''
                                ? true
                                : false
                            }
                            sx={{
                              color:
                                selectedValue === 'phone' ||
                                formik.values.phone !== ''
                                  ? 'gray'
                                  : Register2Colors.iconColor
                                  ? Register2Colors.iconColor
                                  : 'black',
                              mx: 2,
                            }}
                          />
                        </InputAdornment>
                      }
                      placeholder={
                        lang === 'en' ? 'Email' : 'البريد الإلكتروني'
                      }
                      type={'text'}
                      sx={{
                        borderRadius: '0px !important',
                        mt: '10px',
                        p: '15px 0px',
                        width: { xs: '100%', md: '90%' },
                        border:
                          formik.values.phone !== ''
                            ? '2px solid gray !important'
                            : `2px solid ${
                                Register2Colors.borderInputColor
                                  ? Register2Colors.borderInputColor
                                  : `2px solid black`
                              }!important`,
                        '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                          opacity: 0,
                        },
                        '& input::placeholder': {
                          color: Register2Colors.placeholderColor
                            ? Register2Colors.placeholderColor
                            : 'gray',
                        },
                        '& fieldset': {
                          border: '1px solid red',
                        },
                        borderRadius: '15px',
                      }}
                      name="email"
                      value={formik.values.email}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      onClick={() => {
                        formik.setFieldValue('registrationType', 'email')
                      }}
                    />
                    {formik.errors.email && formik.touched.email && (
                      <Typography
                        fontWeight={'bold'}
                        fontSize={13}
                        //   variant="p"
                        color="red"
                        sx={
                          {
                            // fontFamily: publicFontFamily,
                          }
                        }
                      >
                        {formik.errors.email}
                      </Typography>
                    )}
                  </Box>
           
                  {/* Password */}
                  <Box
                    sx={{
                      display: selectedValue === 'phone' ? 'none' : 'block',
                    }}
                  >
                    <InputBase
                      autoComplete={'off'}
                      name="password"
                      value={formik.values.password}
                      disabled={
                        selectedValue === 'phone' || formik.values.phone !== ''
                      }
                      placeholder={lang === 'en' ? 'Password' : 'كلمة المرور'}
                      type={passwordType ? 'password' : 'text'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onClick={() => {
                        formik.setFieldValue('registrationType', 'email')
                      }}
                      startAdornment={
                        <InputAdornment
                          position="start"
                          disabled={
                            selectedValue === 'phone' ||
                            formik.values.phone !== ''
                          }
                        >
                          <HttpsIcon
                            disabled={
                              selectedValue === 'phone' ||
                              formik.values.phone !== ''
                            }
                            sx={{
                              color:
                                selectedValue === 'phone' ||
                                formik.values.phone !== ''
                                  ? 'gray'
                                  : Register2Colors.iconColor
                                  ? Register2Colors.iconColor
                                  : 'black',
                              mx: 2,
                            }}
                          />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment
                          position="end"
                          disabled={
                            selectedValue === 'phone' ||
                            formik.values.phone !== ''
                          }
                        >
                          <IconButton
                            aria-label="toggle password visibility"
                            disabled={
                              selectedValue === 'phone' ||
                              formik.values.phone !== ''
                            }
                            onClick={() => setPasswordType(!passwordType)}
                            // onMouseDown={handleMouseDownPassword}

                            edge="end"
                          >
                            {passwordType ? (
                              <VisibilityOff
                                sx={{
                                  color:
                                    selectedValue === 'phone' ||
                                    formik.values.phone !== ''
                                      ? 'gray'
                                      : Register2Colors.iconColor
                                      ? Register2Colors.iconColor
                                      : 'black',
                                  mx: lang === 'en' ? 2 : 1,
                                }}
                              />
                            ) : (
                              <Visibility
                                disabled={
                                  selectedValue === 'phone' ||
                                  formik.values.phone !== ''
                                }
                                sx={{
                                  color:
                                    selectedValue === 'phone' ||
                                    formik.values.phone !== ''
                                      ? 'gray'
                                      : Register2Colors.iconColor
                                      ? Register2Colors.iconColor
                                      : 'black',
                                  mx: lang === 'en' ? 2 : 1,
                                }}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      sx={{
                        p: '15px 0px',
                        width: { xs: '100%', md: '90%' },
                        borderRadius: '0px',
                        mt: '10px',
                        border:
                          selectedValue === 'phone' ||
                          formik.values.phone !== ''
                            ? '2px solid gray'
                            : `2px solid ${
                                Register2Colors.borderInputColor
                                  ? Register2Colors.borderInputColor
                                  : `2px solid black`
                              }`,
                        '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                          opacity: 0,
                        },
                        '.css-2ehmn7-MuiInputBase-root-MuiOutlinedInput-root': {
                          px: lang === 'en' ? undefined : '0',
                        },
                        ' .css-152mnda-MuiInputBase-input-MuiOutlinedInput-input':
                          {
                            p: lang === 'en' ? undefined : '16.5px 14px',
                          },
                        '& input::placeholder': {
                          color: Register2Colors.placeholderColor
                            ? Register2Colors.placeholderColor
                            : 'gray',
                        },
                        borderRadius: '15px',
                      }}
                    />
                    {/* <Typography fontWeight={'bold'} fontSize={13} color="red">
                      {lang === 'en'
                        ? 'Password must be greated then or equal to 6'
                        : 'كلمة المرور تجب ان تكون اكبر من او تساوي 6'}
                    </Typography> */}
                    
                    <HelpOutlineIcon
                      sx={{
                        width: '20px',
                        height: '20px',
                        marginRight: '10px',
                        cursor: 'pointer',
                        mt: 3,
                      }}
                      aria-describedby={id}
                      type="button"
                      onClick={handleClick}
                    />
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
                        {lang === 'en' ? (
                          <>Password Must Be At Least 6 characters </>
                        ) : (
                          <> يجب ان يكون الرقم السري 6 ارقام علي الاقل</>
                        )}
                      </Typography>
                    </Popover>
                    {formik.errors.password && formik.touched.password && (
                      <Typography fontWeight={'bold'} fontSize={13} color="red">
                        {formik.errors.password}
                      </Typography>
                    )}
                  </Box>

                  {/* if unUsed radio select */}

                  <Box>
                    <Box textAlign={'center'} position={'relative'}>
                      <Typography
                        sx={{
                          '::after': {
                            content: "''",
                            width: lang === 'en' ? '40%' : '38%',
                            height: '1px',
                            backgroundColor: Register2Colors.iconColor
                              ? Register2Colors.iconColor
                              : 'black',
                            position: 'absolute',
                            top: '50%',
                            left:
                              lang === 'en'
                                ? '0'
                                : { xs: '0px', md: '35px', lg: '55px' },
                            transform: 'translateY(-50%)',
                          },
                          '::before': {
                            content: "''",
                            width:
                              lang === 'en'
                                ? { xs: '42%', md: '35%', xl: '35%' }
                                : '40%',
                            height: '1px',
                            backgroundColor: Register2Colors.iconColor
                              ? Register2Colors.iconColor
                              : 'black',
                            position: 'absolute',
                            top: '50%',
                            left:
                              lang === 'en' ? { xs: '60%', md: '55%' } : '60%',
                            transform: 'translateY(-50%)',
                          },
                          fontSize: {
                            xl: '30px',
                            md: '25px',

                            xs: '20px',
                          },
                          fontWeight: 'bold',
                          mt: '20px',
                          ml:
                            lang === 'en'
                              ? { xs: 0, md: -2 }
                              : { xs: 0, md: 5 },
                          color: Register2Colors.iconColor
                            ? Register2Colors.iconColor
                            : 'gray',
                        }}
                      >
                        {lang === 'en' ? 'OR' : 'أو'}
                      </Typography>
                    </Box>
                    <Box>
                      <InputBase
                        autoComplete="off"
                        disabled={
                          formik.values.email !== '' ||
                          formik.values.password !== ''
                        }
                        endAdornment={
                          <InputAdornment
                            position="start"
                            disabled={
                              formik.values.email !== '' ||
                              formik.values.password !== ''
                            }
                            sx={{
                              padding:'0px 10px'
                            }}
                          >
                            {lang==="en"?"+966":"966+"}
                          </InputAdornment>
                        }
                        startAdornment={
                          <InputAdornment
                            position="start"
                            disabled={
                              formik.values.email !== '' ||
                              formik.values.password !== ''
                            }
                          >
                            <PhoneIcon
                              disabled={
                                formik.values.email !== '' ||
                                formik.values.password !== ''
                              }
                              sx={{
                                color:
                                  formik.values.email !== '' ||
                                  formik.values.password !== ''
                                    ? 'gray'
                                    : Register2Colors.iconColor
                                    ? Register2Colors.iconColor
                                    : 'black',
                                mx: 2,
                              }}
                            />
                          </InputAdornment>
                        }
                        placeholder={lang === 'en' ? 'Phone' : 'الهاتف'}
                        type={'text'}
                        sx={{
                          p: '15px 0px',
                          borderRadius: '0px',
                          width: { xs: '100%', md: '90%' },
                          mt: '20px',
                          border:
                            formik.values.email !== '' ||
                            formik.values.password !== ''
                              ? '2px solid gray'
                              : `2px solid ${
                                  Register2Colors.borderInputColor
                                    ? Register2Colors.borderInputColor
                                    : `2px solid black`
                                }`,
                          '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                            opacity: 0,
                          },
                          '& input::placeholder': {
                            color: Register2Colors.placeholderColor
                              ? Register2Colors.placeholderColor
                              : 'gray',
                          },
                          borderRadius: '15px',
                        }}
                        name="phone"
                        value={`${formik.values.phone}`}
                        onBlur={formik.handleBlur}
                        onChange={(event) => {
                          const { value } = event.target
                          
                             formik.handleChange('phone')(`${value}`)
                         
                        }}
                        onClick={() => {
                          formik.setFieldValue('registrationType', 'phone')
                        }}
                      />
                      {formik.errors.phone && formik.touched.phone && (
                        <Typography
                          fontWeight={'bold'}
                          fontSize={13}
                          color="red"
                          sx={{}}
                        >
                          {formik.errors.phone}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Typography
                        sx={{
                          fontSize: '10px',
                          color: '#727272',
                        }}
                      >
                        {lang === 'ar'
                          ? ' رقم الهاتف يجب ان يبدا  خمسة و9 ارقام'
                          : 'Phone number must start with 5 and be at least 9 numbers'}
                      </Typography>
                  <Stack direction={'row'} alignItems={'center'} gap={'6px'}>
                    <input
                      onChange={() => setAcceptTerms(!acceptTerms)}
                      type="checkbox"
                      style={{
                        height: '20px',
                        width: '20px',
                        accentColor: '#727272',
                      }}
                    />
                    <Typography>
                      {lang === 'en' ? 'I accept' : 'أوفق على'}
                    </Typography>
                    <Typography
                      component={Link}
                      target="_blank"
                      sx={{
                        textDecoration: 'none',
                        color: '#727272 !important',
                      }}
                      to={`/policies/usage`}
                    >
                      {lang === 'en' ? 'terms & conditions' : 'البنود و الشروط'}
                    </Typography>
                  </Stack>
                  <ButtonBase
                    disabled={regLoad}
                    type="submit"
                    sx={{
                      color: '#fff',
                      bgcolor: Register2Colors.backgroundBtn
                        ? Register2Colors.backgroundBtn
                        : 'gray',
                      mt: '20px',
                      fontSize: {
                        xl: '35px',
                        lg: '20px',

                        xs: '18px',
                      },

                      py: {
                        lg: '6px',
                        xs: '10px',
                      },
                      px: '35px',
                      // fontWeight: 'bold',
                      borderRadius: '15px',
                      width: { xs: '100%', md: '90%' },
                    }}
                  >
                    {lang === 'en'
                      ? regLoad
                        ? 'Subscription...'
                        : 'Subscription'
                      : regLoad
                      ? 'جاري الاشتراك...'
                      : 'إشتراك'}
                  </ButtonBase>

                  {/* google login */}
                  <ButtonBase
                    onClick={handleLoginGoogle}
                    sx={{
                      color: '#4285F4',
                      border: '2px solid #4285F4',
                      mt: '20px',

                      py: {
                        xl: '11px',
                        lg: '12px',
                        xs: '11px',
                      },
                      px: '15px',
                      // fontWeight: 'bold',
                      borderRadius: '0px',
                      width: { xs: '100%', md: '90%' },
                      borderRadius: '15px',
                    }}
                  >
                    <Stack
                      direction="row-reverse"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          width: '90%',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xl: '25px',
                              lg: '15px',
                              md: '12px',
                              sm: '18px',
                              xs: '15px',
                            },

                            color: '#4285F4',
                          }}
                        >
                          {lang === 'en'
                            ? 'Login with google'
                            : 'تسجيل الدخول عن طريق جوجل'}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: '12%',
                          height: { xs: '30px', xl: '45px' },
                        }}
                      >
                        <img
                          src={GoogleLogo}
                          alt="google"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    </Stack>
                  </ButtonBase>
                </Box>
              </Stack>
            </form>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            // background: backgroundImage ? `url(${backgroundImage})` : 'none',
            // backgroundRepeat: 'no-repeat',
            // backgroundSize: 'cover',
            // backgroundPosition: '75%',
            backgroundColor: '#dadada',
            // i need to rotate background image

            position: 'relative',
            minHeight: {
              md: '100vh',
              xs: '380px',
            },
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: { xs: '250px', md: '300px' },
              height: { xs: '200px', md: '200px' },
              position: 'absolute',
              display: { xs: 'block', md: 'none' },
              top: {
                xs: '60%',
                md: '15%',
              },

              left: { xs: '20%', md: lang === 'en' ? '0%' : '100%' },
              transform: 'translate(-50%,-50%)',
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* Button of choose login or signUp */}
          <Stack
            direction={'column'}
            sx={{
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              top: { xs: '100%', md: '50%' },

              left: { xs: '50%', md: lang === 'en' ? '0%' : '100%' },
              transform: 'translate(-50%,-50%)',
              gap: { xs: '20px', lg: '50px' },
              width: { xs: '90%', md: '30%' },
              mt: { xs: 5, md: '0' },
              zIndex: 100,
            }}
          >
            <Box
              sx={{
                // px: 4,
                mt: -10,
                mb: 1,
                py: 1.5,
                minWidth: { xs: '250px', md: '200px' },
                borderRadius: '15px',
                border: `2px solid ${
                  Register2Colors.color
                    ? Register2Colors.color
                    : `2px solid black`
                }`,
                backgroundColor: pathname.includes('/register')
                  ? Register2Colors.color
                  : 'transparent',

                cursor: 'pointer',
              }}
              onClick={() => handelTypeAuth('signUp')}
            >
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  fontSize: {
                    xl: '20px',

                    sm: '15px',
                    xs: '18px',
                  },
                  fontWeight: 'bolder',
                  color: pathname.includes('/register')
                    ? '#fff'
                    : Register2Colors.color
                    ? Register2Colors.color
                    : 'gray',
                }}
              >
                {lang === 'en' ? 'Create account' : 'إنشاء حساب'}
              </Typography>
            </Box>
            <Box
              sx={{
                // px: 4,
                py: 1.5,
                minWidth: { xs: '250px', md: '200px' },
                borderRadius: '15px',
                border: `2px solid ${
                  Register2Colors.color
                    ? Register2Colors.color
                    : `2px solid black`
                }`,
                backgroundColor: pathname.includes('/sign-in')
                  ? Register2Colors.color
                  : 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => handelTypeAuth('login')}
            >
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  fontSize: {
                    xl: '20px',

                    sm: '15px',
                    xs: '18px',
                  },
                  fontWeight: 'bolder',
                  color: '#767676',
                }}
              >
                {lang === 'en' ? 'Login' : ' الدخول'}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <VerifiedCode
        loading={authLoad}
        open={openModal}
        handelerCode={handelerCode}
        userPhone={userPhone}
        setOpenModal={setOpenModal}
      />
    </Box>
  )
}

export default Register2
