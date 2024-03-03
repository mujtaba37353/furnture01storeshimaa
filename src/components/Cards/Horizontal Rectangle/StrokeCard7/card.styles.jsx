import { CardColors7 } from './card.colors'

const { colors } = CardColors7
export default {
  cardPaper: {
     height: { xs: '330px', sm: '330px', md: '375px', lg: '350px', xl: '420px' },
    display: 'block',
    flexDirection: 'column',
    // border: `2px solid ${colors.borderColor} `,
    borderRadius: 8,
    bgcolor: colors.backgroundColor,
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    pb: 0,
    border :'0px !important',
    width : 1,
    // padding:" 18px",
  },
  cardImg: {
    width: '100%',
    objectFit: 'cover',
    height: '100%',
    padding:'0px !Important'
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: { xs: 'center', md: 'start' },
    width: '100%',
    cursor: 'default',
    height: '40%',
    mx: 0,
    pt: 2,
    position: 'absolute',
    bottom: '20px',
    // mb: 1,
    height: '115px  !important'

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
    textAlign: 'center',
    display: {   md: 'block' },
    px: 2,
  },
  Button: {
    borderRadius: 4,
    borderColor: `${colors.borderColor} !important`,
    'box-shadow': 'rgba(0, 0, 0, 0.24) 0px 0px 5px',
    'border': '1px solid #9a9a9a !IMPORTANT',
    '&:hover': {
      borderColor: `${colors.borderColor} !important`,
      bgcolor: `${colors.buttonTextColor} !important`,
      color: `${colors.buttonBackgroundColor} !important`,
    },
    px: { md: 5, xs: 3 },
    my: 0.5,
    fontSize: { md: 'initial', xs: '13px', sm: '16px' },
    textTransform: 'capitalize',
  },
  favIcon: {
    position: 'absolute',
    top: 10,
    stroke: 'tomato',
    right: 10,
    fontSize: { xs: '1.8rem', lg: '2.3rem' },
    cursor: 'pointer',
  },
}
