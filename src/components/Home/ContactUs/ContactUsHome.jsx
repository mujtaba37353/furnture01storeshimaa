import React from 'react'
import {
  Box,
  Grid,
  Typography,
  Container,
  Stack,
  Button,
  InputBase,
  CircularProgress,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ContactUsStyle } from './ContactUsStyle'
import { useContactMutation } from '../../../redux/apis/contactsApis'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'

// ============================>>>>>>> Custom Input
const ContactTextInput = (props) => {
  return (
    <Box>
      <Container>
        <InputBase
          type="text"
          value={props.value}
          name={props.name}
          placeholder={props.placeholder}
          sx={{
            bgcolor: props.colors?.backgroundInputColor
              ? `${props.colors?.backgroundInputColor} !important`
              : 'transparent !important',
            width: '100%',
            p: '15px 20px',
            color: props.colors?.color ? props.colors?.color : 'white',
            border:
              props.error && props.touched
                ? `2px solid red`
                : props.colors?.borderColor
                  ? props.colors?.borderColor
                  : `transparent`,
            mt: 4,
            borderRadius: '50px',
            '& input::placeholder': {
              fontSize: '20px',
              color: props.colors?.placeholderColor
                ? props.colors?.placeholderColor
                : 'gray',
            },
          }}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
        />
        <Typography
          sx={{
            fontSize: '12px',
            color: 'red',
          }}
        >
          {props.error && props.touched ? props.error : undefined}
        </Typography>
      </Container>
    </Box>
  )
}

// ============================>>>>>>> Custom Hook
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
      .matches(/^\+?[0-9]+$/, lang === 'en' ? 'Invalid phone number' : 'رقم الهاتف غير صالح')
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
//   =======================================================

const ContactForm = (props) => {
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
    <Box>
      <Container>
        <Box
          sx={{
            direction: lang === 'en' ? 'ltr' : 'rtl',
            mx: 'auto',
            mb: 2,
            py: 2,
            mt: { xs: 0, md: 2 },
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{
                justifyContent: 'space-between',
              }}
            >
              <Box width={{ xs: '100%', md: '50%' }}>
                <ContactTextInput
                  value={formik.values.name}
                  name={'name'}
                  placeholder={lang === 'en' ? 'Name' : 'الاسم'}
                  error={formik.errors.name}
                  touched={formik.touched.name}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  label={lang === 'en' ? 'Name' : 'الاسم'}
                  colors={props.colors}
                />
              </Box>

              <Box width={{ xs: '100%', md: '50%' }}>
                <ContactTextInput
                  value={formik.values.email}
                  name={'email'}
                  placeholder={lang === 'en' ? 'Email' : 'البريد الالكتروني'}
                  error={formik.errors.email}
                  touched={formik.touched.email}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  label={lang === 'en' ? 'Email' : 'البريد الالكتروني'}
                  colors={props.colors}
                />
              </Box>
            </Stack>

            <Box>
              <ContactTextInput
                value={formik.values.phone}
                name={'phone'}
                placeholder={lang === 'en' ? 'Phone' : 'رقم الهاتف'}
                error={formik.errors.phone}
                touched={formik.touched.phone}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                label={lang === 'en' ? 'Phone' : 'رقم الهاتف'}
                colors={props.colors}
              />
            </Box>
            <Container>
              {/* type of connections */}
              <Box>
                <Box my={2}></Box>
                <select
                  value={formik.values.contactType}
                  name="contactType"
                  style={{
                    width: '100%',
                    backgroundColor: ContactUsStyle.colors?.backgroundInputColor
                      ? `${ContactUsStyle?.colors?.backgroundInputColor} `
                      : 'transparent',
                    border: ContactUsStyle.colors?.borderColor
                      ? ContactUsStyle.colors?.borderColor
                      : `transparent`,
                    borderRadius: '50px',

                    padding: '14px',
                    fontSize: '20px',
                    color: ContactUsStyle.colors?.placeholderColor
                      ? ContactUsStyle.colors?.placeholderColor
                      : '#333',
                    outline: 'none',
                    marginTop: 6,
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option
                    value="select one"
                    hidden
                    style={{
                      color: props.colors.color,
                      fontSize: '15px',
                      fontWeight: 'bold',
                    }}
                  >
                    {lang === 'en'
                      ? 'Select Contact Type'
                      : 'أختار نوع التواصل'}
                  </option>
                  <option
                    value="complaints"
                    style={{
                      color: props.colors.color ? props.colors.color : '#000',
                      fontSize: '15px',
                      fontWeight: 'bold',
                    }}
                  >
                    {lang === 'en' ? 'Complaints' : 'الشكاوي'}
                  </option>
                  <option
                    value="suggestions"
                    style={{
                      color: props.colors.color ? props.colors.color : '#000',
                      fontSize: '15px',
                      fontWeight: 'bold',
                    }}
                  >
                    {lang === 'en' ? 'Suggestions' : 'الاقتراحات'}
                  </option>
                  <option
                    value="customerService"
                    style={{
                      color: props.colors.color ? props.colors.color : '#000',
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

              {/* Message */}

              <Box sx={{ mt: 3 }}>
                <textarea
                  value={formik.values.message}
                  name="message"
                  placeholder={
                    lang === 'en' ? 'Write your message' : 'اكتب رسالتك'
                  }
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    height: '150px',
                    outline: 'none',
                    border: props.colors?.borderColor
                      ? props.colors?.borderColor
                      : `transparent`,
                    borderRadius: '20px',

                    backgroundColor: props.colors?.backgroundInputColor
                      ? `${props?.colors?.backgroundInputColor} `
                      : 'transparent',
                    fontSize: '20px',
                    color: props.colors?.color ? props.colors?.color : '#333',
                   resize:'none',
                  
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
            </Container>
            {/* Button */}
            <Box
              sx={{
                mt: 4,
                textAlign: 'center',
              }}
            >
              <Button
              disabled={isLoading}
                variant="contained"
                sx={{
                  backgroundColor: props.colors?.backgroundBtn
                    ? `${props.colors?.backgroundBtn} !important`
                    : 'black !important',
                  color: props.colors?.colorBtn
                    ? `${props.colors?.colorBtn}`
                    : '#fff !important',
                  fontWeight: 'bold',
                  fontSize: { xs: '20px', md: '26px' },
                  borderRadius: '20px',
                  transition: 'all 0.3s',
                  textTransform: 'capitalize',
                  px: {
                    md: '60px',
                    xs: '25px',
                  },
                  py: {
                    md: '8px',
                    xs: '6.5px',
                  },
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
                        color: props.colors?.colorBtn || 'white',
                      }}
                    />
                  </Box>
                ) : (lang === 'en' ? 'Send' : 'ارسال')}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

const ContactUs = () => {
  const [, { language: lang }] = useTranslation()
  return (
    <Box
      sx={{
        direction: lang === 'en' ? 'ltr' : 'rtl',
        bgcolor: ContactUsStyle.colors?.backgroundColor
          ? ContactUsStyle.colors?.backgroundColor
          : 'gray',
        my: 5,
        py: { xs: 4, sm: 0 },
      }}
    >
      <Grid container>
        {/* title */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              color: ContactUsStyle.colors?.color
                ? ContactUsStyle.colors?.color
                : 'white',

              fontSize: {
                xs: '40px',
                lg: '45px',
              },
              fontWeight: 'bold',
            }}
          >
            {lang === 'en' ? 'Contact Us' : 'تواصل معنا'}
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <ContactForm colors={ContactUsStyle.colors} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ContactUs
