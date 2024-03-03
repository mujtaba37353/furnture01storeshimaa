import { CardColors } from './card.colors'

const { colors } = CardColors
export default {
  cardPaper: {
    width: '100%',
    height: '100%',
    display: 'block',
    flexDirection: 'column',
    border: null,
    borderRadius: null,
    bgcolor: colors.BackgroundColor,
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    pb: 2,
  },
  cardImg: {
    width: '100%',
    objectFit: 'cover',
    height: '60%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'end',
    width: '100%',
    cursor: 'default',
    height: '40%',
    mx: 0,
    pt: 2,
    mb: 1,
  },
  titleStyle: {
    color: colors.titleColor,
    fontWeight: 'bold',
    fontSize: { xs: '0.7rem', md: '1rem' },
    textAlign: 'center',
    px: 2,
    pt: 2,
  },
  descStyle: {
    fontWeight: 'normal',
    color: colors.descColor,
    wordBreak: 'break-word',
    overflow: 'hidden',
    display: { xs: 'none', md: 'block' },
    textAlign: 'center',
    px: 2,
  },
  Button: {
    borderRadius: null,
    borderColor: `${colors.borderColor} !important`,
    // '&:hover': {
    //   borderColor: `${colors.borderColor} !important`,
    //   bgcolor: `${colors.buttonTextColor} !important`,
    //   color: `${colors.buttonBackgroundColor} !important`,
    // },
    px: { md: 5, xs: 3 },
    mb: 3,
    mt: 1,
    fontSize: { md: 'initial', xs: '13px', sm: '16px' },
    textTransform: 'capitalize',
  },
  favIcon: {
    position: 'absolute',
    top: 10,
    stroke: 'tomato',
    right: 10,
    fontSize: {xs:'1.8rem',lg:'2.3rem'},
    cursor: 'pointer',
  },
}