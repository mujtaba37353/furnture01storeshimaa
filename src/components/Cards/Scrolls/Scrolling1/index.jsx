import FavoriteIcon from '@mui/icons-material/Favorite'
import { toast } from 'react-toastify'
import { CardMedia, Paper, Box, Stack, Typography } from '@mui/material'
import { imageBaseUrl } from '../../../../constants/baseUrl'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useAddToSavedProductMutation,
  useGetAllSavedProductsQuery,
} from '../../../../redux/apis/SavedProductApi'

import styles from './card.styles'

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
          toFavorite(data?._id)
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

const CardContent = ({ data, lng, proInFav, toFavorite }) => {
  return (
    <Stack sx={styles.contentContainer}>
      <Box>
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
      </Box>
      <FavoriteIconCard
        data={data}
        proInFav={proInFav}
        toFavorite={toFavorite}
        lng={lng}
      />
    </Stack>
  )
}

//⭐ Parent
const Card = (props) => {
  const [, { language: lng }] = useTranslation()
  const nav = useNavigate()
  const [toFavorite] = useAddToSavedProductMutation()
  const { data: favPros } = useGetAllSavedProductsQuery(undefined)
  const proInFav = favPros?.data.favourite.find(
    (f) => f._id === props?.data._id
  )

  return (
    <Paper
      sx={{
        ...styles.cardPaper,
        direction: `${lng === 'en' ? 'ltr' : 'rtl'}`,
      }}
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
        lng={lng}
        proInFav={proInFav}
        toFavorite={toFavorite}
      />
    </Paper>
  )
}

export default Card
