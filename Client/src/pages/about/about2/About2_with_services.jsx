import { Box, CardMedia, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import aboutImg from '../../../assets/jpg/about2.jpg'
import { useGetSectionByTypeQuery } from '../../../redux/apis/sectionsApi'
import { colors } from './about2.style'

const Services = ({ colors }) => {
  const [, { language: lang }] = useTranslation()
  const data = [
    {
      title_en: 'Quality Assurance',
      title_ar: 'ضمان الجودة',
      desc_en: 'We guarantee the authenticity and quality of all our products.',
      desc_ar: 'نضمن أصالة وجودة جميع منتجاتنا',
    },
    {
      title_en: 'Competitive Pricing',
      title_ar: 'تسعير تنافسي',
      desc_en: 'We offer the best prices in the market.',
      desc_ar: 'نقدم أفضل الأسعار في السوق',
    },
    {
      title_en: 'Customer Service',
      title_ar: 'خدمة عملاء',
      desc_en: 'Our dedicated customer service team is here to help you',
      desc_ar: 'فريق خدمة العملاء المخصص لمساعدتك',
    },
  ]
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent={'space-between'}
      columnGap={5}
      rowGap={2}
      sx={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}
    >
      {data?.map((item, index) => (
        <Stack
          key={item?.title_en}
          flex={1}
          direction={'row'}
          alignItems={'center'}
          gap={3}
          sx={{
            bgcolor: index === 1 ? colors.bgColor1 : colors.bgColor2,
            py: { xs: 2, lg: 2.5 },
            px: { xs: 2, lg: 6 },
          }}
        >
          <Box sx={{ bgcolor: 'black', width: '20px', height: '20px' }} />
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '1.1rem', md: '1.4rem', lg: '1.8rem' },
                color: colors.titleColor,
              }}
            >
              {lang === 'en' ? item?.title_en : item?.title_ar}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '.9rem', md: '1.1rem', lg: '1.4rem' },
                color: colors.descColor,
              }}
            >
              {lang === 'en' ? item?.desc_en : item?.desc_ar}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}

const About2_with_services = () => {
  const imgs = [aboutImg]
  const [_, { language: lang }] = useTranslation()
  const { data, isLoading, error } = useGetSectionByTypeQuery('aboutus')
  const descLength = data && !error && data.data[0].description_en.length
  return (
    <Box sx={{ p: { xs: 1, md: 3 }, mt: { xs: '100px', md: 0 } }}>
      <Stack
        direction={{ xs: 'column', md: 'row-reverse' }}
        spacing={2}
        sx={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}
      >
        <Stack direction={'row'} flex={1} spacing={1} sx={{ height: '80vh' }}>
          <Box sx={{ height: '80vh' }}>
            {[imgs[0], imgs[1]].map((img, index) => (
              <CardMedia
                key={index}
                component={'img'}
                src={img}
                sx={{
                  display: 'block',
                  width: '95%',
                  height: '250px',
                  mb: 1,
                }}
              />
            ))}
          </Box>
          <Box sx={{ alignSelf: 'center' }}>
            {[data?.data[0].image, imgs[2]].map((img, index) => (
              <CardMedia
                key={index}
                component={'img'}
                // src={data?.image}
                src={img}
                sx={{
                  display: 'block',
                  width: '95%',
                  height: '250px',
                  mb: 1,
                }}
              />
            ))}
          </Box>
        </Stack>
        <Box
          flex={1}
          sx={{
            lineHeight: 2,
            fontSize: { md: 18, lg: 20, xl: 25 },

            color: colors.descColor,
          }}
          dangerouslySetInnerHTML={{
            __html:
              lang === 'en'
                ? data?.data[0].description_en.slice(0, descLength / 2)
                : data?.data[0].description_ar.slice(0, descLength / 2),
          }}
        />
      </Stack>
      <Box
        sx={{
          lineHeight: 2,
          fontSize: { md: 18, lg: 20, xl: 25 },
          color: colors.descColor,
          textAlign: lang == 'en' ? 'left' : 'right',
        }}
        dangerouslySetInnerHTML={{
          __html:
            lang === 'en'
              ? data?.data[0].description_en.slice(descLength / 2, descLength)
              : data?.data[0].description_ar.slice(descLength / 2, descLength),
        }}
      />

      <Box sx={{ px: { xs: 3, md: 0 } }}>
        <Services colors={colors} />
      </Box>
    </Box>
  )
}

export default About2_with_services
