import { Box, Button, Grid, Typography, Container } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ScrollColors } from './colors'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { useNavigate } from 'react-router-dom'
import img1 from '../../../assets/jpg/img.png'
import img2 from '../../../assets/jpg/img.png'
import img3 from '../../../assets/jpg/img.png'
import img4 from '../../../assets/jpg/img.png'

import {
  useGetProductsOfCategoryQuery,
  useLazyGetProductsOfCategoryQuery,
} from '../../../redux/apis/ProductApis'
import Card from '../../../components/Cards/Scrolls/Scrolling1'
import { useEffect } from 'react'
import { useState } from 'react'
import Card8 from '../../../components/Cards/Horizontal Rectangle/strockCustomCard7'

const ErrorSection = ({ isError, error }) => {
  const [, { language: lang }] = useTranslation()

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
        {isError
          ? error?.data && error?.data[`error_${lang}`]
          : error?.data && error?.data[`error_${lang}`]}
      </Typography>
    </Box>
  )
}

const SliderHeader = ({ colors }) => {
  const [, { language: lang }] = useTranslation()
  const navigate = useNavigate()
  return (
    <Box sx={{ textAlign: lang === 'en' ? 'center' : 'center' }}>
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', sm: '1.8rem', lg: '2.7rem' },
          color: colors.title,
        }}
      >
        {lang === 'en' ? 'similar products' : 'المنتجات المتشابهه'}
      </Typography>
    </Box>
  )
}

const Slider = ({ data, lang, productid }) => {
  return (
    <Grid
      width={'100%'}
      item
      xs={12}
      md={9}
      py={4}
      sx={{
        direction: lang === 'en' ? 'ltr' : 'rtl',
      }}
    >
      <Box px={2}>
        <Swiper
          style={{ direction: 'ltr' }}
          className="mySwiper"
          slidesPerView={3}
          spaceBetween={30}
          modules={[FreeMode]}
          breakpoints={{
            200: {
              slidesPerView: 1,
              spaceBetween: 120,
            },
            320: {
              slidesPerView: 1,
              spaceBetween: 120,
            },
            719: {
              slidesPerView: 2,
              spaceBetween: 50,
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {data
            ?.filter((item) => item?.id !== productid)
            .map((item) => (
              <SwiperSlide key={item.title}>
                <Box p={2}>
                  <Box
                    sx={{
                      '#cardStyle': {
                        width: '100% !important',
                      },
                    }}
                    className="card_category"
                  >
                    <Card8 data={item} />
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
        </Swiper>
      </Box>
    </Grid>
  )
}

const Similarproduct = ({ id, productId = '' }) => {
  const staticImages = [img1, img2, img3, img4, img3, img4]
  const [data, setData] = useState({})

  const [getSimilarProducts, { isSuccess, isError, error }] =
    useLazyGetProductsOfCategoryQuery()
  useEffect(() => {
    console.log(id)
    id &&
      getSimilarProducts(id)
        .unwrap()
        .then((res) => {
          console.log(res)
          setData(res.data)
        })
        .catch((err) => console.log(err))
  }, [id])
  const [, { language: lang }] = useTranslation()
  const { colors } = ScrollColors
  return (
    <>
      {data?.length > 1 ? (
        <Box
          mt={10}
          sx={{
            direction: lang === 'en' ? 'ltr' : 'rtl',
          }}
          my={data?.data !== undefined ? 5 : 0}
          py={data?.data !== undefined ? 3 : 0}
        >
          {isError && error && <ErrorSection error={error} isError={isError} />}
          {isSuccess && !isError && data?.length > 0 ? (
            <>
              {/* SliderHeader */}
              <Container>
                <SliderHeader colors={colors} />

                {/* Grid for static images and dynamic slider */}
                <Grid container spacing={2}>
                  {/* Static images */}
                  {staticImages.map((image, index) => (
                    <Grid item key={index} xs={12} sm={6} md={3} lg={4}>
                      <img
                        src={image}
                        alt={`Static Image ${index + 1}`}
                        style={{ width: '100%', height: '300px' }}
                      />
                      <div
                        style={{
                          position: 'relative',
                          bottom: '100px',
                          textAlign: 'center',
                          padding: '15px 20',
                          fontWeight: '500',
                          backgroundColor: '#fff', 
                          color: '#000',
                          width: 'fit-content',
                          margin: 'auto',
                        }}
                      >
                        <Typography
                          variant="p"
                          style={{
                            backgroundColor: 'transparent',
                          }}
                        >
                          {index === 0
                            ? lang === 'en'
                              ? 'Lorem Ipsum'
                              : 'لوريم ابسيوم'
                            : index === 1
                            ? lang === 'en'
                              ? 'Lorem Ipsum'
                              : 'لوريم ابسيوم'
                            : index === 2
                            ? lang === 'en'
                              ? 'Lorem Ipsum'
                              : 'لوريم ابسيوم'
                            : lang === 'en'
                            ? 'Lorem Ipsum'
                            : 'لوريم ابسيوم'}
                        </Typography>
                      </div>
                    </Grid>
                  ))}

                  {/* Dynamic slider */}
                  <Grid item xs={12} sm={6} md={6} lg={12}>
                    <Slider
                      data={data.filter((pId) => pId.id !== productId)}
                      productid={productId}
                      lang={lang}
                    />
                  </Grid>
                </Grid>
              </Container>
            </>
          ) : null}
        </Box>
      ) : null}
    </>
  )
}

export default Similarproduct
