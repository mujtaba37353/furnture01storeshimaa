import { Box, CardMedia, Paper, Typography, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ScrollColors } from './colors'
import { useGetMostNewiestProductsQuery } from '../../../../redux/apis/ProductApis'
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import Card8 from '../../../Cards/Horizontal Rectangle/strockCustomCard7/index'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useNavigate } from 'react-router-dom'
import { useAddToSavedProductMutation, useGetAllSavedProductsQuery } from '../../../../redux/apis/SavedProductApi'
import { useAddToCartMutation, useGetAllCartsQuery } from '../../../../redux/apis/cartApi'
import styles from './cardStyles.jsx'
import { imageBaseUrl } from '../../../../constants/baseUrl.js';
import { colors as ss } from "../../../../constants/colors"
import { toast } from 'react-toastify'
 const colors = {
    titleColor: ss.whiteColor,
    backgroundColor: ss.secondColor,
    descColor: ss.whiteColor,
    borderColor: 'transparent',
    hoverColor: '#5A0858',
    buttonTextColor: ss.blackColor,
    buttonBackgroundColor: ss.whiteColor,
}

const Card7 = (props) => {
    const [, { language: lng }] = useTranslation()
    const nav = useNavigate()
    const [toFavorite] = useAddToSavedProductMutation()
    const { data: favPros } = useGetAllSavedProductsQuery(undefined)
    const proInFav = favPros?.data.favourite.find(
        (f) => f._id === props?.data._id
    )
    const [addToCart, { isLoading: cardLoad }] = useAddToCartMutation()
    const { data: cartItems, error } = useGetAllCartsQuery(undefined)

    const cartData = {
        quantity: 1,
        properties: [],
        id: props?.data._id,
    }

    const productInCart =
        !error &&
        cartItems?.data[
            props?.data?.paymentType === 'cash' ? 'cashItems' : 'onlineItems'
        ]?.items?.find(
            (eachProduct) => eachProduct?.product?._id === props?.data?._id
        )

    return (
        <Paper
            sx={{
                ...styles.cardPaper,
                direction: `${lng === 'en' ? 'ltr' : 'rtl'}`,
                'justify-content': 'space-between',
                 display: 'flex',
                'flex-direction': 'column',
            }}
         >
            {/* <FavoriteIconCard
          proInFav={proInFav}
          toFavorite={toFavorite}
          data={props?.data}
          lng={lng}
        /> */}
            {props?.data?.images && props?.data?.images[0] && (
                <CardMedia
                    component={'img'}
                    src={imageBaseUrl + props?.data?.images[0]}
                    onClick={() =>
                        nav(
                            `/products/${props?.data?._id}/${props?.data?.title_en.replace(
                                /\s/g,
                                '-'
                            )}`
                        )
                    }
                    sx={styles.cardImg}
                />
            )}
            <Button
                disabled={productInCart || cardLoad}
                variant={colors.borderColor ? 'outlined' : 'contained'}
                sx={{
                    ...styles.Button,
                    bgcolor: `${colors.buttonBackgroundColor} !important`,
                    color: `${colors.buttonTextColor} !important`,
                    margin: 'auto',
                    marginTop:'30px !important',
                    left: '50% !important',
                    right: '50% !important',
                    transform: 'translateX(50%) !important',
                    width: '69% !important',
                    padding: '9px !important',
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    addToCart(cartData)
                        .unwrap()
                        .then((res) =>
                            toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
                        )
                        .catch((e) =>
                            toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
                        )
                }}
            >
                {productInCart
                    ? lng === 'en'
                        ? 'Product in cart'
                        : 'المنتج في العربة'
                    : lng === 'en'
                        ? cardLoad
                            ? 'Add to cart...'
                            : 'Add to cart'
                        : cardLoad
                            ? 'اضف الي العربة...'
                            : 'أضف إلى العربة'}
            </Button>

        </Paper>
    )
}

export default function Slider({ data }) {

    const [, { language: lang }] = useTranslation()
    return (


        <>

            <Box
                mx={'auto'}
                // width={{ xs: 1, md: 0.9, xl: 0.8 }}
                mt={5}
                px={{ xs: 3, sm: 0 }}
                py={2}
            >
                <Swiper
                     grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={3.5}
                    loop={true}
                    // autoplay={{
                    //   delay: 3000,
                    //   disableOnInteraction: false,
                    // }}
                    centeredSlidesBounds
                    breakpoints={{
                        279: {
                            slidesPerView: 1,
                            spaceBetween: 0,

                        },
                        300: {
                            slidesPerView: 1.2,
                            spaceBetween: 20,

                        },
                        370: {
                            slidesPerView: 1.2,
                            spaceBetween: 30,
                        },
                        460: {
                            slidesPerView: 1.2,
                            spaceBetween: 30,

                        },
                        488: {
                            slidesPerView: 1.8,
                        },
                        576: {
                            slidesPerView: 1.7,
                            spaceBetween: 40,
                        },
                        719: {
                            slidesPerView: 1.7,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 80,
                        },
                        1200: {
                            slidesPerView: 3,
                            spaceBetween: 80,
                        },
                        1500: {
                            slidesPerView: 3.7,
                            spaceBetween: 120,
                        },
                    }}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 1,
                        depth: 100,
                        modifier: 0.5,
                        slideShadows: false,

                    }}
                    modules={[EffectCoverflow, Autoplay]}
                    className="mySwiper"
                >
                    {data?.map((item, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                sx={{
                                    width: '100%',

                                    "& #cardStyle":{

                                    }  ,
                                    " .swiper-slide.swiper-slide-visible.swiper-slide-active #cardStyle":{
                                        height: { xs: '300px !important', sm: '350px !important', md: '450px !important',xl:'536px !important' },

                                    }
    
                                }}
                            >
                                <Card8 data={item} />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box></>
    )
}
