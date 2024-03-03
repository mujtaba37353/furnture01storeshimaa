import { Box, Button, CircularProgress, Grid, InputBase } from '@mui/material'
import { Container, Typography } from '@mui/joy'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useContactMutation } from '../../../redux/apis/contactsApis'
import Banner from '../../../components/Banners/Banner'
import { toast } from 'react-toastify'
import img from '../../../assets/jpg/img.png';
import * as yup from 'yup'
import { ContactNoon2Style } from './ContactNoon2Style'
import Whatsapp from '../../../components/whatsapp/Whatsapp'
// ===========================|| FROMIK DATA AND VALIDATION ||=========================== //
const useContact = () => {
  const [_, { language: lang }] = useTranslation()

  const contactData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    contactType: '',
  }

  const contactValidation = yup.object({
    name: yup
      .string()
      .required(lang === 'en' ? 'Name is required' : 'الاسم مطلوب'),
    email: yup
      .string()
      .email(lang === 'en' ? 'Email is invalid' : 'البريد الالكتروني غير صحيح')
      .required(
        lang === 'en' ? 'Email is required' : 'البريد الالكتروني مطلوب'
      ),
    phone: yup
      .string()
      .matches(
        /^\+?[0-9]+$/,
        lang === 'en' ? 'Invalid phone number' : 'رقم الهاتف غير صالح'
      )
      .required(lang === 'en' ? 'Phone is required' : 'رقم الهاتف مطلوب'),
    message: yup
      .string()
      .required(lang === 'en' ? 'Message is required' : 'اكتب رسالتك مطلوبة'),
    contactType: yup
      .string()
      .required(lang === 'en' ? 'Select Contact Type' : 'اختار نوع التواصل')
      .ensure()
      .oneOf(
        ['complaints', 'suggestions', 'customerService'],
        lang === 'ar'
          ? 'يجب أن يكون نوع الاتصال أحد القيم التالية: شكاوي، اقتراحات، خدمة العملاء'
          : 'ContactType must be one of the following values: complaints, suggestions, customerService'
      ),
  })

  return { contactData, contactValidation }
}

// // ===========================|| Contact Input ||=========================== //
const ContactTextInput = (props) => {
  console.log(props)
  return (
    <Box>
      <Container>
        {/* <InputBase
          type="text"
          value={props.value}
          name={props.name}
          placeholder={props.placeholder}
          sx={{
            bgcolor: 'transparent !important',
            width: '100%',
            p: '18px 20px',
            color: 'black',
            border:
              props.error && props.touched
                ? `2px solid red`
                : `2px solid ${
                    props.color?.borderColor
                      ? props.color?.borderColor
                      : 'black'
                  } `,
            borderRadius: '50px',
            '& input::placeholder': {
              fontSize: '20px',
              
            },
          }}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
        />
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'bold',
            color: 'red',
          }}
        >
          {props.error && props.touched ? props.error : undefined}
        </Typography> */}
      </Container>
    </Box>
  )
}

// ===========================|| Contact Us - Noon2 ||=========================== //
const ContactNoon2 = ({ backgroundImag }) => {
  console.log(backgroundImag)
  const [_, { language: lang }] = useTranslation()
  const [contact, { isLoading }] = useContactMutation()
  const { contactData, contactValidation } = useContact()
  const formik = useFormik({
    initialValues: contactData,
    validationSchema: contactValidation,
    onSubmit: (values) => {
      contact(values)
        .unwrap()
        .then((res) => {
          toast.success(res[`success_${lang}`])
          formik.resetForm()
        })
        .catch((err) => {
          toast.error(err?.data[`error_${lang}`])
        })
    },
  })

  return (
    <Box
      sx={{
        direction: lang === 'en' ? 'rtl' : 'ltr',
        minHeight: '100vh',
        mb: 18,
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          minHeight: {
            xs: 'auto',
            md: '83vh',
            xl: '93vh',
          },
        }}
      >
        <Grid
          item
          p={2}
          xs={12}
          md={6}
          minHeight={{ xs: 400, md: '100%' }}
          width={'50%'}
          sx={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: '30px',
          }}
        >
          <Box mt={1} mx={4} width={'50%'}>
            <Banner bannerVertical />
          </Box>
        </Grid>

        <Grid
          item
          minHeight={'100vh'}
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
          }}
        >
          <Container
            sx={{
              height: '100%',
              py: 2,
            }}
          >
            <Box mt={0}>
              <Typography
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: { xs: '25px', md: '35px' },
                  py: '10px',
                  color: ContactNoon2Style.color?.textColor
                    ? ContactNoon2Style.color.textColor
                    : 'black',
                }}
              >
                {lang === 'en' ? 'Contact Us' : 'تواصل معنا'}
              </Typography>
            </Box>

            <Box
              sx={{
                direction: lang === 'en' ? 'ltr' : 'rtl',
                mt: 5,
                minHeight: '100%',
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Box mt={4}>
                  <ContactTextInput
                    index={0}
                    value={formik.values.name}
                    name={'name'}
                    error={formik.errors.name}
                    touched={formik.touched.name}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    placeholder={lang === 'en' ? 'Name' : 'الاسم'}
                    color={ContactNoon2Style.color}
                  />
                </Box>

                <Box mt={4}>
                  <ContactTextInput
                    index={0}
                    value={formik.values.email}
                    name={'email'}
                    error={formik.errors.email}
                    touched={formik.touched.email}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    placeholder={lang === 'en' ? 'Email' : 'البريد الالكتروني'}
                    color={ContactNoon2Style.color}
                  />
                </Box>
                <Box mt={4}>
                  <ContactTextInput
                    index={0}
                    value={formik.values.phone}
                    name={'phone'}
                    error={formik.errors.phone}
                    touched={formik.touched.phone}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    placeholder={lang === 'en' ? 'Phone' : 'الجوال'}
                    color={ContactNoon2Style.color}
                  />
                </Box>

                <Container>
                  <Box mt={4}>
                    <select
                      value={formik.values.contactType}
                      name="contactType"
                      style={{
                        backgroundColor: 'transparent',
                        width: '100%',
                        borderRadius: '50px',
                        padding: '13px 20px',
                        border:
                          formik.errors.contactType &&
                          formik.touched.contactType
                            ? `2px solid red `
                            : `2px solid ${
                                ContactNoon2Style.color?.borderColor
                                  ? ContactNoon2Style.color?.borderColor
                                  : 'black'
                              }`,
                        fontSize: '20px',
                        color: formik.values.contactType
                          ? ContactNoon2Style.color?.textColor
                          : '#333',
                        outline: 'none',
                        // WebkitAppearance: 'none',
                        // MozAppearance: 'none',
                        // appearance: 'none'
                      }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="select one" hidden selected>
                        {lang === 'en'
                          ? 'Select Contact Type'
                          : 'أختار نوع التواصل'}
                      </option>
                      <option
                        value="complaints"
                        style={{
                          color: ContactNoon2Style.color?.textColor
                            ? ContactNoon2Style.color.textColor
                            : 'black',
                          fontSize: '15px',
                          fontWeight: 'bold',
                        }}
                      >
                        {lang === 'en' ? 'Complaints' : 'الشكاوي'}
                      </option>
                      <option
                        value="suggestions"
                        style={{
                          color: ContactNoon2Style.color?.textColor
                            ? ContactNoon2Style.color.textColor
                            : 'black',
                          fontSize: '15px',
                          fontWeight: 'bold',
                        }}
                      >
                        {lang === 'en' ? 'Suggestions' : 'الاقتراحات'}
                      </option>
                      <option
                        value="customerService"
                        style={{
                          color: ContactNoon2Style.color?.textColor
                            ? ContactNoon2Style.color.textColor
                            : 'black',
                          fontSize: '15px',
                          fontWeight: 'bold',
                        }}
                      >
                        {lang === 'en' ? 'Customer Service' : 'خدمة العملاء'}
                      </option>
                    </select>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'red',
                      }}
                    >
                      {formik.errors.contactType && formik.touched.contactType
                        ? formik.errors.contactType
                        : undefined}
                    </Typography>
                  </Box>

                  <Box my={4}>
                    <textarea
                      value={formik.values.message}
                      name="message"
                      placeholder={lang === 'en' ? 'Message' : 'اكتب رسالتك'}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        height: '260px',
                        backgroundColor: 'transparent ',
                        fontSize: '16px',
                        // color: formik.values.message
                        //   ? ContactNoon2Style?.color?.textColor
                        //   : '#BCD6D9',

                        border:
                          formik.errors.message && formik.touched.message
                            ? '2px solid red'
                            : `2px solid ${
                                ContactNoon2Style.color?.borderColor
                                  ? ContactNoon2Style.color?.borderColor
                                  : 'black'
                              }`,
                        outline: 0,
                        borderRadius: '20px',
                        resize: 'none',
                      }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'red',
                      }}
                    >
                      {formik.errors.message && formik.touched.message
                        ? formik.errors.message
                        : undefined}
                    </Typography>
                  </Box>
                  {/* Button */}
                  <Box
                    sx={{
                      textAlign: { xs: 'center', md: 'start' },
                      display: 'flex',
                      flexDirection:"row",
                      alignItems:"center",
                      
                    }}
                  >
                    <Box>

                    <Button
                      disabled={isLoading}
                      variant="contained"
                      sx={{
                        borderRadius: 10,
                        backgroundColor: ContactNoon2Style.button
                          ?.backgroundColor
                          ? `${ContactNoon2Style.button?.backgroundColor} !important`
                          : '#000 !important',
                        color: ContactNoon2Style.button?.color
                          ? `${ContactNoon2Style.button?.color} !important`
                          : '#fff !important',
                        fontWeight: 'bold',
                        fontSize: { xs: '20px', md: '26px' },
                        transition: 'all 0.3s',
                        px: {
                          md: '60px',
                          xs: '55px',
                        },
                        py: '6px',
                        '&:active': {
                          transform: 'scale(0.9)',
                        },
                      }}
                      type="submit"
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex' }}>
                          <CircularProgress
                            sx={{
                              color: ContactNoon2Style.button?.color || 'white',
                            }}
                          />
                        </Box>
                      ) : lang === 'en' ? (
                        'Send'
                      ) : (
                        'ارسال'
                      )}
                    </Button>
                    </Box>
                    <Box sx={{
                      mx:2,
                      
                    }}>
                      
                      <Whatsapp/>
                    </Box>

                  </Box>
                </Container>
              </form>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ContactNoon2
