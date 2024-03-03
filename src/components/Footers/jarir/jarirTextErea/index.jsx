import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import JarirIcons from '../jarirIcons'
import { useGetAllCategoriesQuery } from '../../../../redux/apis/categoriesApi'
import { colors } from '../../../../constants/colors.js'
import { useGetFooterPrivaciesQuery } from '../../../../redux/apis/privacyApi.js'
import i18next from 'i18next'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import { toast } from 'react-toastify'
import { useContactMutation } from '../../../../redux/apis/contactsApis.js'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
// =========================== staticLinks=============================
const links = [
  {
    ar: 'عننا',
    en: 'About Us',
    path: '/aboutUs',
  },
  {
    ar: 'تواصل معنا',
    en: 'Contact Us',
    path: '/contactUs',
  },
  {
    ar: 'مدوناتنا',
    en: 'Our blogs',
    path: '/blogs',
  },
]
// =========================== staticLinks=============================
function Map({ url, ...props }) {
  return (
    <div>
      <iframe
        title="map"
        src={url}
        width="100%"
        height="225"
        style={{ border: '0px' }}
        loading="lazy"
        {...props}
      ></iframe>
    </div>
  )
}

const FooterOptions = ({ lang }) => ({
  footerText:
    lang === 'en'
      ? ` جميع الحقوق محفوظه ©  لشركه الضبيبي التجاريه -حي ريع زاخر 
      +966 555 98 3449 store@dh-trd.com`
      : ` جميع الحقوق محفوظه  © لشركه الضبيبي التجاريه -حي ريع زاخر 
      +966 555 98 3449 store@dh-trd.com`,
  information: {
    address: 'شركة الضبيبي التجارية - مكة المكرمة- حي ريع زاخر',
    email: 'store@dh-trd.com',
    phone: '+966 555 98 3449',
  },
  social: {
    color: '#fff',
    bgColor: '#5B0888',
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    linkedin: 'https://www.linkedin.com',
  },
  map: {
    url: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1854.8072173905196!2d39.1349908!3d21.6009683!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3db4ed164d9a9%3A0xb6a4ba7216165791!2sSarri%20technology!5e0!3m2!1sen!2seg!4v1695652130557!5m2!1sen!2seg',
  },
  bgColor: { primary: colors.darkColor, secondary: colors.blackColor },
  color: { primary: colors.mainColor, secondary: colors.mainColor },
  variant: 'form',
})
function Logo() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <JarirIcons />
    </Box>
  )
}
//=============================privcey======================================
function FooterPrivacy({ style }) {
  const navigate = useNavigate()
  const { language } = i18next
  const { data, isLoading } = useGetFooterPrivaciesQuery(undefined)
  return (
    <>
      {!isLoading && data?.data.length > 0
        ? data?.data?.map((item) => {
            return (
              <>
                <Typography
                  sx={[
                    style,
                    {
                      cursor: 'pointer',
                      fontSize: {
                        xs: '14px !important',
                        md: '16px !important',
                      },
                      fontWeight: { xs: '400', sm: 'bold' },
                    },
                  ]}
                  key={item}
                  onClick={() => navigate(`/policies/${item.type}`)}
                >
                  {item[`title_${language}`]}
                </Typography>
              </>
            )
          })
        : null}
    </>
  )
}
function CategorySection({ color }) {
  const categories = Array.from({ length: 5 }, (_, index) => `قسم ${index + 1}`);

  const {
    i18n: { language },
  } = useTranslation()
  return (
    <>
      <Stack width={'100%'} direction={'column'}>
        <div>
          <Typography
            sx={{
              color: color.primary,
              fontSize: 20,
              textAlign: { xs: 'center', md: 'start' },
              my: {
                xs: 2,
                md: 0,
              },
            }}
          >
            {language === 'en' ? 'Categories' : 'الاقسام'}
          </Typography>
          <Divider
            orientation="horizontal"
            style={{ backgroundColor: color.primary, marginBottom: '10px' }}
          />
        </div>
        <Stack
          direction={{
            xs: 'row',
            md: 'column',
          }}
          gap={2}
          width={'100%'}
          sx={{
            justifyContent: { xs: 'center', md: 'start' },
            flexWrap: 'wrap',
            wordBreak: 'break-word',
            my: {
              xs: 2,
              md: 0,
            },
          }}
        >
          {categories.map((category, index) => (
            <Box
              key={index}
              sx={{
                color: color.primary,
                textDecoration: 'none !important',
              }}
              component={Link}
              to={`/departments/${category._id}/${category?.name_en}`}
            >
              {language === 'en' ? category : `القسم ${index + 1}`}
            </Box>
          ))}
        </Stack>
      </Stack>
    </>
  )
}
function ContentSection({ color, map, variant, children }) {
  const {
    i18n: { language },
  } = useTranslation()

  return (
    <Stack
      direction={'column'}
      sx={{
        justifyContent: { xs: 'center', md: 'start' },
        my: {
          xs: 2,
          md: 0,
        },
      }}
      width={'100%'}
      height="100%"
      gap={2}
    >
      <div>
        <Typography
          sx={{
            color: color.primary,
            textAlign: { xs: 'center', md: 'start' },
            fontSize: 20,
          }}
        >
          {language === 'en' ? 'Quick Links' : 'روابط سريعة'}
        </Typography>
        <Divider
          orientation="horizontal"
          style={{ backgroundColor: color.primary, marginBottom: '10px' }}
        />
      </div>
      {/* links  */}
      <Stack
        direction={{ xs: 'row', md: 'column' }}
        sx={{
          flexWrap: 'wrap',

          justifyContent: {
            xs: 'center',
            md: 'flex-start',
          },
        }}
        gap={3}
        // justifyContent={'center'}
      >
        {links.map((link, index) => (
          <Box
            key={link.path}
            sx={{
              color: color.primary,
              textDecoration: 'none !important',
              cursor: 'pointer',
              fontSize: {
                xs: '16px !important',
                md: '16px !important',
              },
              fontWeight: { xs: '400', sm: 'bold' },
              justifyContent: 'center',
            }}
            component={Link}
            to={link.path}
          >
            {language === 'en' ? link.en : link.ar}
          </Box>
        ))}
        {children}
        <FooterPrivacy
          style={{
            color: color.primary,
            textDecoration: 'none !important',
            // fontSize: 18,
            fontWeight: 'bold',
          }}
        />
      </Stack>

      {(variant === 'map' || variant === 'form-map') && map && (
        <Box sx={{ pt: 5 }}>
          <Map url={map.url} />
        </Box>
      )}
    </Stack>
  )
}
function SocialSection({ information, color, variant }) {
  const {
    i18n: { language },
  } = useTranslation()
  return (
    <Stack
      direction={'column'}
      gap={2}
      sx={{
        justifyContent: {
          xs: 'center',
          md: 'start',
        },
        alignItems: { xs: 'center', md: 'start' },
        textAlign: { xs: 'center', md: 'start' },
      }}
    >
      <Box width="100%">
        <Typography
          sx={{
            color: color.primary,
            textAlign: { xs: 'center', md: 'start' },
            fontSize: 25,
          }}
        >
          {language === 'en' ? 'Contact Us' : 'تواصل معنا'}
        </Typography>
        <Divider
          orientation="horizontal"
          style={{ backgroundColor: color.primary, marginBottom: '10px' }}
        />
      </Box>
      <Box
        component={'a'}
        href={`tel:${information?.phone}`}
        target="_blank"
        sx={{
          color: color.primary,
          textDecoration: 'none !important',
          direction: 'ltr',
        }}
      >
        {information?.phone}
      </Box>
      <Box
        component={'a'}
        href={`mailto:${information?.email}`}
        target="_blank"
        sx={{
          color: color.primary,
          textDecoration: 'none !important',
        }}
      >
        {information?.email}
      </Box>
      <Box
        sx={{
          color: color.primary,
          textDecoration: 'none !important',
        }}
      >
        {information?.address}
      </Box>
      {variant === 'form-map' && (
        <Stack
          sx={{
            width: '100%',
            gap: 2,
            pt: 2,
          }}
        >
          <Box
            component={'input'}
            type="text"
            placeholder={language === 'en' ? 'Email' : 'البريد الالكتروني'}
            sx={{
              color: color.primary,
              '::placeholder': { color: color.secondary },
              fontSize: {
                xs: 14,
                md: 16,
              },
              width: { xs: '100%', md: '50%' },
              backgroundColor: 'transparent',
              padding: '5px 10px',
              border: 'none',
              outline: 'none !important',
              borderBottom: `1px solid ${color.primary}`,
            }}
          />
          <Box
            component={'textarea'}
            placeholder={language === 'en' ? 'Write Here' : 'اكتب هنا'}
            rows={5}
            sx={{
              color: color.primary,
              '::placeholder': { color: color.secondary },
              fontSize: {
                xs: 14,
                md: 16,
              },
              backgroundColor: 'transparent',
              padding: '5px 10px',
              outline: 'none !important',
              border: `1px solid ${color.primary}`,
              resize: `none`,
            }}
          />
        </Stack>
      )}
    </Stack>
  )
}
function JarirTextEarea({ logo, children }) {
  const {
    i18n: { language },
  } = useTranslation()
  const { bgColor, color, variant, map, information, footerText } =
    FooterOptions({ language })
  const { data, isLoading, isSuccess } = useGetAllCategoriesQuery()
  const { pathname } = useLocation()
  const categories = data?.data || []
  const [contact] = useContactMutation()

  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      contactType: 'customerService',
    },
    validationSchema: object({
      name: string().required(
        language === 'en' ? 'Name is required' : 'الاسم مطلوب'
      ),
      email: string()
        .email(
          language === 'en' ? 'Email is invalid' : 'البريد الالكتروني غير صحيح'
        )
        .required(
          language === 'en' ? 'Email is required' : 'البريد الالكتروني مطلوب'
        ),
      phone: string()
        .matches(
          /^\+?[0-9]+$/,
          language === 'en' ? 'Invalid phone number' : 'رقم الهاتف غير صالح'
        )
        .required(language === 'en' ? 'Phone is required' : 'رقم الهاتف مطلوب'),
      message: string().required(
        language === 'en' ? 'Message is required' : 'اكتب رسالتك مطلوبة'
      ),
      contactType: string()
        .required(
          language === 'en' ? 'Select Contact Type' : 'اختار نوع التواصل'
        )
        .ensure()
        .oneOf(
          ['complaints', 'suggestions', 'customerService'],
          language === 'ar'
            ? 'يجب أن يكون نوع الاتصال أحد القيم التالية: شكاوي، اقتراحات، خدمة العملاء'
            : 'ContactType must be one of the following values: complaints, suggestions, customerService'
        ),
    }),
    onSubmit: (values, { resetForm }) => {
      contact(values)
        .unwrap()
        .then((res) => {
          toast.success(res[`success_${language}`])
          resetForm()
        })
        .catch((err) => {
          toast.error(err?.data[`error_${language}`])
        })
    },
  })
  const checkFormikError = (key) =>
    formik.errors[key] && formik.touched[key] ? formik.errors[key] : undefined
  const { currentUser } = useSelector((state) => state)
  useEffect(() => {
    formik.resetForm()
  }, [pathname])
  return (
    <Stack
      direction={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{
        fontWeight: 'bold',
        display:
          pathname === '/thankYou' ||
          pathname === '/sign-in' ||
          pathname === '/register' ||
          pathname === '/forgetPassword' ||
          pathname === '/notfound'
            ? 'none'
            : 'flex',
      }}
      dir={dir}
    >
      <Logo />
      <Box bgcolor={bgColor.primary} width={'100%'}>
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          justifyContent={'center'}
          gap={2}
          pt={3}
          px={2}
          sx={{
            height: '100%',
          }}
        >
          <Stack
            direction={'column'}
            sx={{
              width: {
                xs: '100%',
                md: '40%',
              },
              height: '100%',
            }}
          >
            <Stack
              direction={{
                xs: 'column',
                md: 'row',
              }}
              gap={2}
              sx={{
                width: '100%',
                height: '100%',
                justifyContent: 'space-between',
                alignItems: { xs: 'center', md: 'flex-start' },
                alignContent: 'flex-start',
              }}
            >
              <ContentSection
                color={color}
                map={map}
                variant={variant}
                children={children}
              />
              <Divider
                orientation="vertical"
                style={{
                  backgroundColor: color.primary,
                  marginBottom: '10px',
                }}
                flexItem
              />
              {isLoading && <div>loading...</div>}
              {isSuccess && (
                <CategorySection color={color} categories={categories} />
              )}
            </Stack>
            {variant === 'form' && (
              <Stack
                component={'form'}
                onSubmit={formik.handleSubmit}
                sx={{
                  width: '100%',
                  gap: 2,
                  py: 2,
                  marginTop: '24px',
                  paddingBottom: '16px',
                  // boxShadow: '0px 0px 5px #614747',
                  marginBottom: '20px',
                  padding: '14px',
                  // borderRadius: '10px',
                }}
              >
                <Stack direction="row" gap={'5%'}>
                  <Box
                    // component={'input'}
                    // name="name"
                    // onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    // value={formik.values.name}
                    // type="text"
                    // placeholder={language === 'en' ? 'Name' : 'الأسم'}
                    // sx={{
                    //   color: color.primary,
                    //   '::placeholder': { color: color.secondary },
                    //   fontSize: {
                    //     xs: 14,
                    //     md: 16,
                    //   },
                    //   backgroundColor: 'transparent',
                    //   padding: '5px 10px',
                    //   border: 'none',
                    //   outline: 'none !important',
                    //   borderBottom: `1px solid ${
                    //     checkFormikError('name') ? '#eee' : color.primary
                    //   }`,
                    //   width: {
                    //     xs: '100%',
                    //     md: '40%',
                    //   },
                    // }}
                  />

                  <Box
                    component={'input'}
                    type="text"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder={
                      language === 'en' ? 'Email' : 'البريد الالكتروني'
                    }
                    sx={{
                      color: color.primary,
                      '::placeholder': { color: color.secondary },
                      fontSize: {
                        xs: 14,
                        md: 16,
                      },
                      backgroundColor: 'transparent',
                      padding: '5px 10px',
                      border: 'none',
                      outline: 'none !important',
                      borderBottom: `1px solid ${
                        checkFormikError('email') ? '#fff' : color.primary
                      }`,
                      width: {
                        xs: '100%',
                        md: '45%',
                      },
                    }}
                  />
                </Stack>
                <Box
                  // component={'input'}
                  // type="text"
                  // name="phone"
                  // onChange={formik.handleChange}
                  // value={formik.values.phone}
                  // onBlur={formik.handleBlur}
                  // placeholder={language === 'en' ? 'Phone' : 'رقم الجوال'}
                  // sx={{
                  //   color: color.primary,
                  //   '::placeholder': { color: color.secondary },
                  //   fontSize: {
                  //     xs: 14,
                  //     md: 16,
                  //   },
                  //   backgroundColor: 'transparent',
                  //   padding: '5px 10px',
                  //   border: 'none',
                  //   outline: 'none !important',
                  //   borderBottom: `1px solid ${
                  //     checkFormikError('phone') ? '#eee' : color.primary
                  //   }`,
                  //   width: {
                  //     xs: '100%',
                  //     md: '40%',
                  //   },
                  // }}
                />
                <Box
                  component={'textarea'}
                  name="message"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                  placeholder={language === 'en' ? 'Write Here' : 'اكتب هنا'}
                  rows={5}
                  sx={{
                    color: color.primary,
                    '::placeholder': { color: color.secondary },
                    fontSize: {
                      xs: 14,
                      md: 16,
                    },
                    width: { xs: '100%', md: '90%' },
                    backgroundColor: 'transparent',
                    padding: '5px 10px',
                    outline: 'none !important',
                    border: `1px solid ${
                      checkFormikError('message') ? '#fff' : color.primary
                    }`,
                    resize: `none`,
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: {
                      md: 'flex-start',
                      xs: 'center',
                    },
                  }}
                >
                  <Button
                    type="submit"
                    sx={{
                      width: {
                        md: 'auto',
                        xs: 0.5,
                      },
                      justifySelf: 'center',
                      bgcolor: `${color.primary} !important`,
                      color: '#fff',
                    }}
                  >
                    {language === 'en' ? 'Send' : 'إرسال'}
                  </Button>
                </Box>
              </Stack>
            )}
          </Stack>
          <Divider
            orientation="vertical"
            style={{
              backgroundColor: color.primary,
              marginBottom: '10px',
            }}
            flexItem
          />
          <SocialSection
            variant={variant}
            color={color}
            information={information}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundColor: bgColor.secondary,
          width: '100%',
          minHeight: 60,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Typography
          sx={{
            color: color.primary,
            fontSize: {
              xs: 10,
              md: 12,
              lg: 12,
            },
            textAlign: 'center',
            my: {
              xs: 2,
              md: 0,
            },
          }}
        >
          {footerText}
        </Typography>
      </Box>
    </Stack>
  )
}

export default JarirTextEarea
