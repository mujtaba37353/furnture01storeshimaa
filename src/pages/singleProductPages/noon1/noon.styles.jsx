export const SingleProductPage = () => ({
  Typography: {
    color: colors.priceBeforeColor,
    textDecoration: data.data.priceAfterDiscount > 0 ? 'line-through' : 'none',
    fontSize: data.data.priceAfterDiscount > 0 ? '0.7rem' : 'initial',
  },
  StackButton: {
    width: 'fit-content',
    px: 2,
    py: 1,
    color: `${productInCart ? '#fff' : colors.buttonColor} !important`,
    bgcolor: `${colors.buttonBgColor} !important`,
  },
  CustomPaymentBox: {
    color: colors.descColor,
    direction: lng === 'en' ? 'ltr' : 'rtl',
    textAlign: lng === 'en' ? 'left' : 'right',
    '& ul': {
      textAlign: `${lng === 'en' ? 'left' : 'right'} !important`,
    },
    '& ol': {
      textAlign: `${lng === 'en' ? 'left' : 'right'} !important`,
    },
  },
  SwiperSlideBox: (imageBaseUrl, img) => ({
    Box1: {
      background: `url("${imageBaseUrl + img}") center center`,
      backgroundSize: ' contain',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%',
    },
    Box2: {
      background: `url("${imageBaseUrl + img}") center center`,
      backgroundSize: ' contain',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%',
    },
  }),

  BoxSwipperVertical: {
    width: '100%',
    m: 1,
    height: '50vh',
    direction: 'ltr',
    '--swiper-navigation-color': '#fff',
    maxHeight: '50vh',
  },

  qImageSwipperSlide: () => ({
    Box1: { width: '100px', height: '100px', objectFit: 'contain' },
  }),
})
