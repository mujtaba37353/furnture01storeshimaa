import FavoriteIcon from '@mui/icons-material/Favorite'
import { toast } from 'react-toastify'
import { CardMedia, Paper, Box, Stack, Typography, Button } from '@mui/material'
import { imageBaseUrl } from '../../../../constants/baseUrl'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useAddToSavedProductMutation,
  useGetAllSavedProductsQuery,
} from '../../../../redux/apis/SavedProductApi'

import {
  useAddToCartMutation,
  useGetAllCartsQuery,
} from '../../../../redux/apis/cartApi'
import styles from './card.styles'
import { CardColors7 } from './card.colors'

const FavoriteIconCard = ({ data, lng, toFavorite, proInFav }) => {
  return (
    <FavoriteIcon
      sx={{
        ...styles.favIcon,
        color: proInFav ? 'tomato' : 'transparent',
        strokeWidth: proInFav ? 0 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation(),
          toFavorite(data._id)
            .unwrap()
            .then((res) => {
              toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
            })
            .catch((e) =>
              toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
            )
      }}
    />
  )
}

const CardContent = ({
  data,
  lng,
  productInCart,
  addToCart,
  cartData,
  cardLoad,
}) => {
  const { colors } = CardColors7
  return (
    <Stack sx={styles.contentContainer}>
      <>
        <Typography
        
        id="title"

        sx={{...styles.titleStyle,
                    textAlign: `${lng === 'en' ? 'left' : 'right'} !important`,

           marginLeft:lng==="ar"?'auto':'unset',
          marginRight:lng==="en"?'auto':'unset'
        }}>
          {lng === 'en'
            ? data[`title_${lng === 'en' ? 'en' : 'ar'}`]
            : data.title_ar}
        </Typography>
        <Box
          className="desc"
          id="desc"
          sx={{ 
            ...styles.descStyle,
            // '& ul': {
            //   textAlign: `${lng === 'en' ? 'left' : 'right'} !important`,
            // },
            // '& ol': {
            // },
            display:'block !important',
            fontSize:{xs:'25px !important',},
            textAlign: `${lng === 'en' ? 'left' : 'right'} !important`,
             marginLeft:lng==="ar"?'auto':'unset',
             marginRight:lng==="en"?'auto':'unset'

          }}

          dangerouslySetInnerHTML={{
            __html:
            
                 `${data[`description_${lng === 'en' ? 'en' : 'ar'}`].slice(0,18)} `
                
          }}
        />
      </>
      <Button
        disabled={productInCart || cardLoad}
        variant={colors.borderColor ? 'outlined' : 'contained'}
        sx={{
          ...styles.Button,
          bgcolor: `${colors.buttonBackgroundColor} !important`,
          color: `${colors.buttonTextColor} !important`,
          mt:'auto',
          mb:'20px'
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
    </Stack>
  )
}

// ⭐ Parent
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
      
        margin:'auto'
      }}
      id="cardStyle"
    >
     
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
      <CardContent
        data={props?.data}
        productInCart={productInCart}
        addToCart={addToCart}
        cartData={cartData}
        lng={lng}
        cardLoad={cardLoad}
      />
      
    </Paper>
  )
}

export default Card7
