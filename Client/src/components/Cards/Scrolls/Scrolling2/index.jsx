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
import { CardColors } from './card.colors'

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
  const { colors } = CardColors
  return (
    <Stack sx={styles.contentContainer}>
      <>
        <Typography sx={styles.titleStyle}>
          {lng === 'en'
            ? data[`title_${lng === 'en' ? 'en' : 'ar'}`]
            : data.title_ar}
        </Typography>

        <Box
          className="desc"
          sx={{
            ...styles.descStyle,
            '& ul': {
              textAlign: `${lng === 'en' ? 'left' : 'right'} !important`,
            },
            '& ol': {
              textAlign: `${lng === 'en' ? 'left' : 'right'} !important`,
            },
          }}
          dangerouslySetInnerHTML={{
            __html:
              data[`description_${lng === 'en' ? 'en' : 'ar'}`]?.split(' ')
                .length > 3
                ? `${data[`description_${lng === 'en' ? 'en' : 'ar'}`]
                    ?.split(' ')
                    .slice(0, 5)
                    .join(' ')} ...`
                : data[`description_${lng === 'en' ? 'en' : 'ar'}`],
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
const Card = (props) => {
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
      }}
    >
      <FavoriteIconCard
        proInFav={proInFav}
        toFavorite={toFavorite}
        data={props?.data}
        lng={lng}
      />

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

export default Card
