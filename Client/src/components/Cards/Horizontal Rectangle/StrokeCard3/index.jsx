import FavoriteIcon from '@mui/icons-material/Favorite'
import { toast } from 'react-toastify'
import { CardMedia, Paper, Button, Stack } from '@mui/material'
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
import styles from './card.styles.jsx'
import { CardColors3 } from './card.colors.jsx'
// 1️⃣ child1 of Card1
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

// 2️⃣ child2 of Card1
const CardButton = ({ productInCart, addToCart, cartData, lng, cardLoad }) => {
  const { colors } = CardColors3
  return (
    <Stack sx={styles.contentContainer}>
      <Button
        disabled={productInCart || cardLoad}
        variant={colors.borderColor ? 'outlined' : 'contained'}
        sx={{
          ...styles.Button,

          bgcolor: `${
             colors.buttonBackgroundColor
          } !important`,
          color: `${
              colors.buttonTextColor
          } !important`,
          position:'absolute',
          bottom:'10%',
          padding:'10px 15px',
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
const Card3 = (props) => {
  const [, { language: lng }] = useTranslation()
  const nav = useNavigate()
  const [toFavorite] = useAddToSavedProductMutation()
  const { data: favPros } = useGetAllSavedProductsQuery(undefined)
  const proInFav = favPros?.data.favourite.find((f) => f._id === props?.data._id)
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

    console.log(imageBaseUrl+props?.data?.images[0],'imageBaseUrl')
  return (
  <Stack
  id='cardStyle'
  className='ssss'
  sx={{
    ...styles.cardPaper,
 
  }}
  >
  
  <Stack
  component={'div'}
  sx={{
 height:'100%',

     direction:`${lng === 'en' ? 'ltr' : 'rtl'}`,
    'background-image':`url(${imageBaseUrl}${props?.data?.images[0]})` ,
   'background-position': 'center center',
    'background-origin': 'unset',
    'background-size': 'cover',
   ' background-repeat': 'no-repeat', 
   }}
   onClick={() =>
    nav(
      `/products/${props?.data?._id}/${props?.data?.title_en.replace(
        /\s/g,
        '-'
      )}`
    )
  }
>
 
<stack
     
      sx={styles.cardImg}
    />
 
  <CardButton
    productInCart={productInCart}
    addToCart={addToCart}
    cartData={cartData}
    lng={lng}
    cardLoad={cardLoad}
  />
  </Stack>
  </Stack>
  )
  
}

export default Card3

{/* <Stack
  sx={{
    ...styles.cardPaper,
     direction: `${lng === 'en' ? 'ltr' : 'rtl'}`,
    backgroundImage:`${imageBaseUrl}+${props?.data?.images[0]} !important`
  }}


>
     
    <stack
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
 
  <CardButton
    productInCart={productInCart}
    addToCart={addToCart}
    cartData={cartData}
    lng={lng}
    cardLoad={cardLoad}
  />
</Stack> */}