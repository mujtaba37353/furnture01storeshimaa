import React from 'react'
import {
  Typography,
  Box,
  Button,
  Grid,
  CardMedia,
  Container,
} from '@mui/material'
import { useGetSectionByTypeQuery } from '../../../../../../redux/apis/sectionsApi'
import { useTranslation } from 'react-i18next'
import { imageBaseUrl } from '../../../../../../constants/baseUrl'
import { SwiperSlide, Swiper } from 'swiper/react'
import { useNavigate } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import HeroSectionImg from '../../../../../../assets/jpg/img.png';

import { Hero4Style } from './Hero4Style'

const Hero4Normal = () => {
  const navigate = useNavigate()
  const [_, { language: lang }] = useTranslation()

  // استخدم البيانات الثابتة بدلاً من استدعاء الـ API
  const data = {
    data: [
      {
        title_en: "Lorem Ipsum",
        title_ar: "لوريم إيبسوم",
        description_en: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum obcaecati quibusdam veritatis amet? Repellendus corrupti, aut et, eaque sit, error nesciunt porro molestiae iusto atque voluptates vel aspernatur nisi fugiat.",
        description_ar: "لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إيليت. دولوروم أوبكايكاتي كويبوسدام فيريتاتيس آميت؟ ريبيليندوس كورروبتي، آوت إت، إياكوي سيت، إرور نيسكيونت بوررو موليستياي إيوستو أتكي فولوبتاتيس فيل آسبرناتور نيسي فوجيات."
      }
    ]
  }

  const dataHero = data?.data.length - 1 //last item in array

  return (
    <Container maxWidth="xl" sx={{ mt: '30px' }}>
    <Box minHeight={{ xs: '70vh', md: '60vh', overflowY: 'hidden' }}>
      <Box
        sx={{
          height: { xs: '70vh', md: '60vh' },
          width: '100%', 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // تغيير ترتيب العناصر في الهاتف والحواسب اللوحية وأعلى
        }}
      >
        
        {/* النص */}
        <Box
          sx={{
            height: '100%', // تم تغيير الارتفاع ليتناسب مع الحجم
            width: { xs: '100%', md: '50%' }, // تم تغيير العرض ليكون 50%
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center', // تم تحديد وسط العنصر
            pl: { xs: 0, md: 2 }, // تم تغيير الهوامش لتتناسب مع الحجم
          }}
        >
          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              mb: 2,
              color: Hero4Style.color?.titleColor
                ? `${Hero4Style.color.titleColor}`
                : `gray`,
              fontWeight: 'bold',
              fontSize: {
                xs: '2rem',
                sm: '2.3rem',
                md: '2.5rem',
                lg: '3.2rem',
                xl: '4rem',
              },
              wordBreak: 'break-word',
            }}
          >
            {data?.data[dataHero][`title_${lang}`]}
          </Typography>
          {/* Description */}
          <Typography
            variant="p"
            sx={{
              color: Hero4Style.color?.subTitleColor
                ? `${Hero4Style.color.subTitleColor}`
                : `gray`,
              fontSize: {
                xs: '1rem',
                sm: '1rem',
                md: '1.2rem',
              },
              wordBreak: 'break-word',
            }}
            dangerouslySetInnerHTML={{
              __html: data?.data[dataHero][`description_${lang}`],
            }}
          />
          {/* Button */}
          <Button
            variant="contained"
            onClick={() => navigate('/departments')}
            sx={{
              mt: 2,
              color: Hero4Style.Btn?.colorBtn
                ? `${Hero4Style.Btn?.colorBtn} !important`
                : `white !important`,
              backgroundColor: Hero4Style.Btn?.backgroundColorBtn
                ? `${Hero4Style.Btn?.backgroundColorBtn} !important`
                : `black !important`,
              p: '9px 40px',
              borderRadius: '50px',
              outline: 'none',
              height: '45px', // تم تصحيح هذا الخطأ
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: '16px',
                  sm: '18px',
                  md: '20px',
                },
                textTransform: 'capitalize',
              }}
            >
              {lang === 'en' ? 'More' : 'المزيد'}
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            height: '100%', // تم تغيير الارتفاع ليتناسب مع الحجم
            width: { xs: '100%', md: '50%' }, // تم تغيير العرض ليكون 50%
            backgroundImage: `url(${HeroSectionImg})`,
            backgroundRepeat: 'no-repeat',
            borderRadius: '10px',
            backgroundSize: 'cover', // تغيير حجم الصورة لتناسب المربع
          }}
        />
      </Box>
    </Box>
    </Container>
  )
}

export default Hero4Normal



