import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ScrollColors } from './colors'
import { useGetMostNewiestProductsQuery } from '../../../../redux/apis/ProductApis'
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import Card from '../../../Cards/Horizontal Rectangle/StrokeCard7/index'
import { Swiper, SwiperSlide } from 'swiper/react'
import Card8 from './../../../Cards/Horizontal Rectangle/strockCustomCard7/index';
 
const ErrorSection = ({ isError, error }) => {
  const [_, { language: lang }] = useTranslation()

  if (isError) return null

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Typography
        fontSize={'1.5rem'}
        my={10}
        textAlign={'center'}
        color="error"
      >
        {error?.data && error?.data[`error_${lang}`]}
      </Typography>
    </Box>
  )
}

const Slider = ({ data }) => {
  return (
    <Box
      mx={'auto'}
      // width={{ xs: 1, md: 0.9, xl: 0.8 }}
      mt={5}
      px={{ xs: 3, sm: 0 }}
      py={2}
    >
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3.5}
        loop={data?.length <4 ?false:true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          291: {
            slidesPerView: 1.1,
            spaceBetween: 30,

          },
          300: {
            slidesPerView: 1.1,
            spaceBetween: 30,

          },
          370: {
            slidesPerView: 1.4 ,
            spaceBetween: 30,
          },
          460: {
            slidesPerView: 1.6,
            spaceBetween: 30,

          },
          488: {
            slidesPerView: 1.8,
          },
          576: {
            slidesPerView: 2.1,
            spaceBetween: 40,
          },
          719: {
            slidesPerView: 2.6,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 80,
          },
          1200: {
            slidesPerView: 3.5,
            spaceBetween: 80,
          },
          1500: {
            slidesPerView: 3.7,
            spaceBetween: 50,
          },
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 1,
          depth: 50,
          modifier:0.5,
          slideShadows: false,
          
          
        }}
        // centeredSlidesBounds={data?.length<=3?true:false}
        modules={[EffectCoverflow, Autoplay]}
        className="mySwiper"
       >
        {data?.map((item, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                width: '100%',
                  margin:data?.length<=3?'auto':'unset',
                  "& Button":{
                        width:'fit-content',
                        px:'25px',
                        borderRadius:'8px',
                  },
                 
              "&  button":{
                height:'40px !important',
                padding:{xs:` 15px 32px!Important` ,sm:` 16ox 32px!Important` ,md:` 24px 32px!Important` ,lg:` 24px 32px!Important` }       
                
              }    ,
               
                
              }}
              id={'cardStyle'}
              className="newest"



            >
              <Card8 data={item} />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}

const Scrolling2 = () => {
  const [, { language: lang }] = useTranslation()
  const { data, isSuccess, isError, error, isLoading } =
    useGetMostNewiestProductsQuery()
  const { colors } = ScrollColors

  return (
    <Box py={5}
    sx={{
      // 'margin-top': '-158px'

    }}
    bgcolor={colors.bgColor}>
      {isLoading && <div className="loader"></div>}
      {isError && error && <ErrorSection error={error} isError={isError} />}
      {isSuccess && data && data?.data?.length > 0 && (
        <>
          <Typography
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem', lg: '4rem' },
              fontWeight: 'bold',
              color: colors.title,
              textAlign: 'center',
              my:{xs:'-30px',md:'none'}
            }} >
            {lang === 'en' ? 'Newest' : 'الاحدث'}
          </Typography>
          <Slider data={data?.data?.slice(0,9)} />
        </>
      )}
    </Box>
  )
}

export default Scrolling2
