import FavoriteIcon from '@mui/icons-material/Favorite'
import { toast } from 'react-toastify'
import { CardMedia, Paper, Box, Stack, Typography, Button } from '@mui/material'
import { imageBaseUrl } from '../../../../constants/baseUrl'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import img1 from '../../../../assets/jpg/img.png';
import img2 from '../../../../assets/jpg/img.png';
import img3 from '../../../../assets/jpg/img.png';
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
import { Link } from 'react-router-dom'


const FavoriteIconCard = ({ data, lng, toFavorite, proInFav }) => {
  return (
    <FavoriteIcon
      className="heart"
      sx={{
        color: proInFav ? 'tomato' : 'transparent',
        strokeWidth: proInFav ? 0 : 1,
        stroke: 'ButtonHighlight',
        // position: 'absolute',
        // left: lng==="en"?'unset':'5%',
        // right: lng==="en"?'5%':'unset',
        fontSize: {
          xs: '2.1rem',
          sm: '2.5rem',
          md: '2.5rem',
          lg: '3.4rem',
          xl: '3rem',
        },

        // bottom: '-30px',
        cursor: 'pointer',
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
  props,
}) => {
  console.log(props, 'hasa props')
  const [toFavorite] = useAddToSavedProductMutation()
  const { data: favPros } = useGetAllSavedProductsQuery(undefined)
  const proInFav = favPros?.data.favourite.find(
    (f) => f._id === props?.data._id
  )
  const { data: cartItems, error } = useGetAllCartsQuery(undefined)
  const navigate = useNavigate()
  const loremIpsumEn = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus ante non felis vulputate, et finibus elit feugiat. Nullam varius ligula non tortor convallis consequat. Integer et eros nec lorem pharetra sollicitudin. Cras condimentum velit vel enim suscipit, in auctor ligula cursus. Donec consequat tellus vitae arcu lacinia convallis. Duis sit amet eros ut risus eleifend lobortis. Nam faucibus urna a dolor ultrices efficitur. Sed aliquam sem nec neque iaculis fringilla. Maecenas tempor sit amet felis in cursus. Donec euismod pretium felis, a posuere tortor posuere vitae. Duis sit amet mauris ultricies, malesuada turpis eget, pharetra nisi. Integer ut condimentum turpis, id vestibulum tellus. Morbi tristique magna a mollis vestibulum.`;
  const loremIpsumAr = `النص هو في الأصل نص شكلي ومؤقت في صناعات الطباعة والتنضيد. كان النص الشكلي هو النص المستخدم في الصناعة منذ القرن الخامس عشر، عندما قامت طابعة مجهولة برص مجموعة من الأحرف لصنع كتاب نموذج للطباعة. لم يقم أحد في القرن الخامس عشر بالنظر إلى النص المستخدم في الطباعة، بل قام بتصويرها كتاب ذات طابع شكلي. تم استخدامها بنجاح في صناعة الطباعة في القرن الخامس عشر. لقد عاش لوريم إيبسوم لسنوات في الكتب المدرسية والطباعة، ولذلك يعتبر الآن النص الشكلي القياسي في هذه الصناعة.`;

  const { colors } = CardColors7
  const HandleAddToCard = (cartData) => {
    console.log('clicking on cart cartData', data)
    if (data?.paymentType === 'both' || data?.qualities?.length) {
      navigate(`/products/${data?._id}/${data?.title_en.replace(/\s/g, '-')}`)
    } else {
      addToCart({
        ...cartData,
        paymentType: data?.paymentType,
      })
        .unwrap()
        .then((res) =>
          toast.success(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
        )
        .catch((e) =>
          toast.error(e.data[`error_${lng === 'en' ? 'en' : 'ar'}`])
        )
    }
  }

  return (
    <Stack className={'card-co'}>
      <>
        <Box
          sx={{
            display: 'block',
            justifyContent: 'space-around',
            alignItems: lng === 'en' ? 'flex-start' : 'flex-end',
            width: '100%',
            // flexDirection: lng === 'en' ? 'row' : 'row-reverse',
            direction: lng === 'ar' ? 'rtl' : 'ltr',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              ' flex-direction': 'column',
              widht: '100%',
              display: 'block',

              // alignItems: lng === 'en' ? 'flex-start' : 'flex-end',
            }}
            className="conten"
          >
            {/* <Typography
              id={'title'}
              sx={{
                color: '#fff',

                fontSize: {
                  xs: '15px !important',
                  sm: '25px !important',
                  md: '20px !important ',
                  lg: '18px !important ',
                  xl: '23px !important ',
                },
                widht: '100%',
                display: 'block',
                textShadow: '1px 0px 0px black !important',
                padding: '5px 10px !important',
                background: '#ffe4c4ad',
                fontWeight: '400 !important',
                color: '#000000',
                textAlign: 'center',
              }}
            >
              {lng === 'en' ? loremIpsumEn.slice(0, 50) : loremIpsumAr.slice(0, 50)}
        {lng === 'en' ? (loremIpsumEn.length > 40 ? <>&hellip;</> : null) : loremIpsumAr.length > 40 ? <>&hellip;</> : null}
              {/* {lng === 'en'
                ? data[`title_${lng === 'en' ? 'en' : 'ar'}`].slice(0, 50)
                : data.title_ar.slice(0, 50)}
              {lng === 'en' ? (
                data?.title_en?.length > 40 ? (
                  <>..</>
                ) : null
              ) : data?.title_ar?.length > 40 ? (
                <>..</>
              ) : null} */}
            {/* </Typography>  */}
            {/* <Typography
              id={'description'}
              sx={{
                // color: '#fff',
                padding: '5px 10px !important',
                background: '#ffe4c4ad',
                fontWeight: '400 !important',
                color: '#000000',

                fontSize: {
                  xs: '12px',
                  sm: '12px',
                  md: '12px',
                  lg: '15px',
                  xl: '19px',
                },
                '& > p': {
                  marginY: 'unset',
                  justifyContent: 'center',

                },
                '&  * ': {
                  display: 'flex',
                  textAlign: lng === 'ar' ? 'right' : 'left',
                },
                '& > * ': {
                  textAlign: lng === 'ar' ? 'right' : 'left',
                  fontSize: {
                    xs: '12px',
                    sm: '14px',
                    md: '13px',
                    lg: '16px',
                    xl: '20px',
                  },
                  fontWeight: '400',
                  // 'text-shadow': '/ 0px 0px black',
                },
                width: '100%',
                display: 'block',
              }}
              dangerouslySetInnerHTML={{
                __html: `${data[
                  `description_${lng === 'en' ? 'en' : 'ar'}`
                ].slice(0, 50)} `,
              }}
            /> */}
            {/* {lng === 'en' ? (
                data?.description_en?.length > 40 ? (
                  <>..</>
                ) : null
              ) : data?.description_ar?.length > 40 ? (
                <>..</>
              ) : null} */}
          </Box>
        </Box>
      </>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-around',
          marginTop: '15px',
        }}
      >
        <Button
          disabled={cardLoad}
          variant={colors.borderColor ? 'outlined' : 'contained'}
          className="cate_button"
          sx={{
            bgcolor: `${colors.buttonBackgroundColor} !important`,
            color: `${colors.buttonTextColor} !important`,
            mb: '2px',
            'border-radius': '8px',
            fontWeight: '700',
            border: '0px !Important',
            width: {
              xs: '200px !important',
              sm: '180px !important',
              md: '180px !important',
              lg: '200px !important',
            },
            height: { xs: '45px', sm: '40px', md: '45px', lg: '50px' },
          }}
          onClick={(e) => {
            e.stopPropagation()
            HandleAddToCard(cartData)
          }}
        >
          {lng === 'en'
            ? cardLoad
              ? 'LOrem Ipsum'
              : 'LOrem Ipsum'
            : cardLoad
            ? "لوريم إيبسوم"
            : "لوريم إيبسوم"}
        </Button>

        <FavoriteIconCard
          proInFav={proInFav}
          toFavorite={toFavorite}
          data={props?.data}
          lng={lng}
        />
      </Stack>
    </Stack>
  )
}

// ⭐ Parent
const Card8 = (props) => {
  console.log(props, 'cartprops');
  const [, { language: lng }] = useTranslation();
  const nav = useNavigate();
  const [toFavorite] = useAddToSavedProductMutation();
  const { data: favPros } = useGetAllSavedProductsQuery(undefined);
  const proInFav = favPros?.data.favourite.find(
    (f) => f._id === props?.data._id
  );
  const [addToCart, { isLoading: cardLoad }] = useAddToCartMutation();
  const { data: cartItems, error } = useGetAllCartsQuery(undefined);

  const cartData = {
    quantity: 1,
    properties: [],
    id: props?.data._id,
  };

  const productInCart =
    !error &&
    cartItems?.data[
      props?.data?.paymentType === 'cash' ? 'cashItems' : 'onlineItems'
    ]?.items?.find(
      (eachProduct) => eachProduct?.product?._id === props?.data?._id
    );
  console.log('productInCart', props?.item?.title_en, productInCart);

  // Static images array
  const staticImages = [img1, img2, img3];

  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: '#c4a035',
      }}
      id="cardStyle"
    >
      {staticImages.map((image, index) => (
        <Link
          key={index}
          to={`/products/${props?.data?._id}/${props?.data?.title_en.replace(
            /\s/g,
            '-'
          )}`}
        >
          <CardMedia
            component={'img'}
            src={image} // Use static image URL here
            sx={styles.cardImg}
          />
        </Link>
      ))}
      <CardContent
        data={props?.data}
        productInCart={productInCart}
        addToCart={addToCart}
        cartData={cartData}
        lng={lng}
        cardLoad={cardLoad}
        props={props}
      />
    </Paper>
  );
};


export default Card8
