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
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PhoneIcon from '@mui/icons-material/Phone'
import MailIcon from '@mui/icons-material/Mail'
import HttpsIcon from '@mui/icons-material/Https'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import * as yup from 'yup'
import { useLoginMutation } from '../../../redux/apis/UserApis'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../../redux/slices/userSlice'
import VerifiedCode from '../../../components/verification/VerifiedCode'
import { useGetUserAuthCodeMutation } from '../../../redux/apis/verifiedCodeApi'

import { Login2Colors } from './style'
import { baseUrl } from '../../../constants/baseUrl'
import GoogleLogo from '../../../assets/svg/google-color-svgrepo-com.svg'
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
              ? 'Phone must start with 5 and only numbers'
              : 'يجب أن يبدأ الهاتف  5 وأرقام فقط'
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

// handle login with google
const handleLoginGoogle = async () => {
  window.location.href = `${baseUrl}/auth/google`
  // 'https://reusable-servieces.onrender.com/api/v1/auth/google'
}
// =================================================================

const Login2 = ({ logo, backgroundImage }) => {
  const { pathname } = useLocation()
  const [userPhone, setUserPhone] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [selectedValue, setSelectedValue] = useState('email')
  const [, { language: lang }] = useTranslation()
  const [passwordType, setPasswordType] = useState(true)
  const [login, { isLoading: loginLoad }] = useLoginMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [getUserAuthCode, { isLoading: authLoad }] =
    useGetUserAuthCodeMutation(undefined)
  const { initialValues, validationSchema } = useFormikData()

  // ===================================================================

  // handle type of auth when switch between login and register
  const handelTypeAuth = (typeAuth) => {
    formik.resetForm()
    typeAuth === 'login' ? navigate('/sign-in') : navigate('/register')
  }
  // ===================================================================

  // handle code when user enter code
  const handelerCode = (code, userPhone) => {
    getUserAuthCode({ code, phone: userPhone })
      .unwrap()
      .then((res) => {
        setOpenModal(false)
        // toast.success(res[`success_${lang}`])
        dispatch(setCurrentUser(res.data))
        localStorage.setItem('token', res.token)
        window.location.replace('/')
      })
      .catch((err) => {
        toast.error(err.data[`error_${lang}`])
      })
  }
  // ===================================================================

  // handle formik
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      registrationType: selectedValue,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let data = { ...values, phone: `+966${values.phone}` }
      data.registrationType === 'email'
        ? delete data.phone
        : (delete data.email, delete data.password)
      delete data.name
      if (data.registrationType === 'phone') {
        login(data)
          .unwrap()
          .then((res) => {
            setUserPhone(res?.data?.phone)
            setOpenModal(true) // verifycode
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
        login(data)
          .unwrap()
          .then((res) => {
            localStorage.setItem('token', res.token)
            window.location.replace('/')
            dispatch(setCurrentUser(res.data))
            navigate('/')
            // toast.success(res[`success_${lang}`])
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
    },
  })
  // ===================================================================

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
            overflow: 'hidden',
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
            mt={{ xs: 15, md: 20 }}
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
                    py: { xs: '10px', md: '40px' },
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
                    {/* Email */}

                    <Box
                      sx={{
                        display: selectedValue === 'phone' ? 'none' : 'block',
                      }}
                    >
                      <InputBase
                        autoComplete="off"
                        disabled={
                          selectedValue === 'phone' ||
                          formik.values.phone !== ''
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
                                    : Login2Colors.iconColor
                                    ? Login2Colors.iconColor
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
                          mt: '20px',
                          p: '15px 0px',
                          width: { xs: '100%', md: '90%' },
                          border:
                            formik.values.phone !== ''
                              ? '2px solid gray !important'
                              : `2px solid ${
                                  Login2Colors.borderInputColor
                                    ? Login2Colors.borderInputColor
                                    : `2px solid black`
                                }!important`,
                          '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                            opacity: 0,
                          },
                          '& input::placeholder': {
                            color: Login2Colors.placeholderColor
                              ? Login2Colors.placeholderColor
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
                        name="password"
                        autoComplete="off"
                        value={formik.values.password}
                        disabled={
                          selectedValue === 'phone' ||
                          formik.values.phone !== ''
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
                                    : Login2Colors.iconColor
                                    ? Login2Colors.iconColor
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
                              disabled={
                                selectedValue === 'phone' ||
                                formik.values.phone !== ''
                              }
                              aria-label="toggle password visibility"
                              onClick={() => setPasswordType(!passwordType)}
                              // onMouseDown={handleMouseDownPassword}

                              edge="end"
                            >
                              {passwordType ? (
                                <VisibilityOff
                                  disabled={
                                    selectedValue === 'phone' ||
                                    formik.values.phone !== ''
                                  }
                                  sx={{
                                    color:
                                      selectedValue === 'phone' ||
                                      formik.values.phone !== ''
                                        ? 'gray'
                                        : Login2Colors.iconColor
                                        ? Login2Colors.iconColor
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
                                        : Login2Colors.iconColor
                                        ? Login2Colors.iconColor
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
                          mt: '20px',
                          border:
                            selectedValue === 'phone' ||
                            formik.values.phone !== ''
                              ? '2px solid gray'
                              : `2px solid ${
                                  Login2Colors.borderInputColor
                                    ? Login2Colors.borderInputColor
                                    : `2px solid black`
                                }`,
                          '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                            opacity: 0,
                          },
                          '.css-2ehmn7-MuiInputBase-root-MuiOutlinedInput-root':
                            {
                              px: lang === 'en' ? undefined : '0',
                            },
                          ' .css-152mnda-MuiInputBase-input-MuiOutlinedInput-input':
                            {
                              p: lang === 'en' ? undefined : '16.5px 14px',
                            },
                          '& input::placeholder': {
                            color: Login2Colors.placeholderColor
                              ? Login2Colors.placeholderColor
                              : 'gray',
                          },
                          borderRadius: '15px',
                        }}
                      />

                      {formik.errors.password && formik.touched.password && (
                        <Typography
                          fontWeight={'bold'}
                          fontSize={13}
                          color="red"
                        >
                          {formik.errors.password}
                        </Typography>
                      )}
                    </Box>

                    {formik.values.registrationType !== 'phone' && (
                      <Box mt={2}>
                        <Typography
                          onClick={() => navigate('/forgetPassword')}
                          sx={{
                            cursor: 'pointer',
                            display: 'inline',
                            borderBottom: `1px solid ${Login2Colors.iconColor}`,
                            color: Login2Colors.iconColor,
                          }}
                        >
                          {lang === 'en'
                            ? 'Forget password ?'
                            : 'نسيت كلمة المرور ؟'}
                        </Typography>
                      </Box>
                    )}

                    {/* if unUsed radio select */}

                    <Box>
                      <Box textAlign={'center'} position={'relative'}>
                        <Typography
                          sx={{
                            '::after': {
                              content: "''",
                              width: lang === 'en' ? '40%' : '38%',
                              height: '1px',
                              backgroundColor: Login2Colors.iconColor
                                ? Login2Colors.iconColor
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
                              backgroundColor: Login2Colors.iconColor
                                ? Login2Colors.iconColor
                                : 'black',
                              position: 'absolute',
                              top: '50%',
                              left:
                                lang === 'en'
                                  ? { xs: '60%', md: '55%' }
                                  : '60%',
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
                            color: Login2Colors.iconColor
                              ? Login2Colors.iconColor
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
                              position="end"
                              disabled={
                                formik.values.email !== '' ||
                                formik.values.password !== ''
                              }
                              sx={{
                                padding: '0px 10px',
                              }}
                            >
                              {lang === 'en' ? '+966' : '966+'}
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
                                onClick={() => null}
                                sx={{
                                  color:
                                    formik.values.email !== '' ||
                                    formik.values.password !== ''
                                      ? 'gray'
                                      : Login2Colors.iconColor
                                      ? Login2Colors.iconColor
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
                                    Login2Colors.borderInputColor
                                      ? Login2Colors.borderInputColor
                                      : `2px solid black`
                                  }`,
                            '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                              opacity: 0,
                            },
                            '& input::placeholder': {
                              color: Login2Colors.placeholderColor
                                ? Login2Colors.placeholderColor
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
                      <Typography
                        sx={{
                          fontSize: '10px',
                          color: '#c4a035',
                        }}
                      >
                        {lang === 'ar'
                          ? ' رقم الهاتف يجب ان يبدا  خمسة و9 ارقام'
                          : 'Phone number must start with 5 and be at least 9 numbers'}
                      </Typography>
                    </Box>
                  </Box>
                  <ButtonBase
                    disabled={loginLoad}
                    type="submit"
                    sx={{
                      color: '#fff',
                      bgcolor: Login2Colors.backgroundBtn
                        ? Login2Colors.backgroundBtn
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
                      ? loginLoad
                        ? 'Login...'
                        : 'Login'
                      : loginLoad
                      ? 'جاري الدخول...'
                      : 'اضغط للدخول'}
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
            backgroundColor: '#dadada',
            // backgroundRepeat: 'no-repeat',
            // backgroundSize: 'cover',
            // backgroundPosition: '75%',

            // backgroundColor: '#dbc684',
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

              left: { xs: '20%', md: lang === 'en' ? '0%' : '50%' },
              transform: 'translate(-50%,-50%)',
            }}
          >
            {/* <img
              src={logo}
              alt="logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            /> */}
            لوجو
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
                py: 1.5,
                minWidth: { xs: '250px', md: '200px' },
                borderRadius: '0px',
                border: `2px solid ${
                  Login2Colors.color ? Login2Colors.color : `2px solid black`
                }`,
                backgroundColor: pathname.includes('/register')
                  ? Login2Colors.color
                  : 'transparent',

                cursor: 'pointer',
                borderRadius: '15px',
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
                  color: '#767676',
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
                borderRadius: '0px',
                border: `2px solid ${
                  Login2Colors.color ? Login2Colors.color : `2px solid black`
                }`,
                backgroundColor: pathname.includes('/sign-in')
                  ? Login2Colors.color
                  : 'transparent',
                cursor: 'pointer',
                borderRadius: '15px',
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
                  color: pathname.includes('/sign-in')
                    ? '#fff'
                    : Login2Colors.color
                    ? Login2Colors.color
                    : 'gray',
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

export default Login2
