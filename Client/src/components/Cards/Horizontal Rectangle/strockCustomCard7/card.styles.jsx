import { CardColors7 } from './card.colors'

const { colors } = CardColors7
export default {
  cardPaper: {
     height: { xs: '330px', sm: '330px', md: '375px', lg: '350px', xl: '420px' },
    display: 'block',
     border: `0px solid ${colors.borderColor} `,
    borderRadius: 8,
    bgcolor: colors.backgroundColor,
     position: 'relative',
    cursor: 'pointer',
    pb: 4,
    padding:" 18px",
    mb:'20px',
    padding:'0px !Important',
    width:'100%',
    overflow: 'hidden',
    borderRadius:'15px'
  },
  cardImg: {
    width: '100%',
    objectFit: 'cover',
    height: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: { xs: 'center', md: 'start' },
    width: '100%',
    cursor: 'default',
    height: '40%',
    mx: 0,
    pt: 0,
    'position': 'absolute',
    'bottom': '20px',
    'left': '0px',
    // mb: 1,
  },
  titleStyle: {
    color: colors.titleColor,
    fontWeight: 'bold',
    fontSize: { xs: '20px',sm:'20px', md: '20px' },
    textAlign: 'center',
    px: 2,
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

    '&:hover': {
      borderColor: `${colors.borderColor} !important`,
      bgcolor: `${colors.buttonTextColor} !important`,
      color: `${colors.buttonBackgroundColor} !important`,
    },
    px: { md: 5, xs: 0 },
    my: 0.5,
    fontSize: { md: 'initial', xs: '13px', sm: '13px' },
    textTransform: 'capitalize',
    padding:{xs:'5px 8px !important'},
    width:{xs:'97%',md:'90%'}
  },
  favIcon: {
     fontSize: { xs: '1.8rem', lg: '2.3rem' },
    cursor: 'pointer',
   },
}
