import { CardColors3 } from './card.colors'

const { colors } = CardColors3
export default {
  cardPaper: {
    width: "100%",
    height: { xs: '310px', md: '300px', lg: '420px' },
    display: 'block',
    flexDirection: 'column',
    border: `0px `,
    borderRadius: 10,
    backgroundColor: colors.backgroundColor,
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    pb: 0,
  },
  cardImg: {
    width: '100%',
    objectFit: 'cover',
    height: '70%',
  },
  favIcon: {
    position: 'absolute',
    top: 10,
    stroke: 'tomato',
    right: 10,
    fontSize: { xs: '1.8rem', lg: '2.3rem' },
    cursor: 'pointer',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: { xs: 'center', md: 'start' },
    width: '100%',
    cursor: 'default',
    height: '20%',
    mx: 0,
    pt: 2,
    mb: 1,
  },
  Button: {
    borderRadius: 9,
    borderColor: `${colors.borderColor} !important`,
    '&:hover': {
      borderColor: `${colors.borderColor} !important`,
      bgcolor: `${colors.buttonTextColor} !important`,
      color: `${colors.buttonBackgroundColor} !important`,
    },
   
    // my: 1,
    fontSize: { md: 'initial', xs: '13px', sm: '16px' },
    textTransform: 'capitalize',
    'font-size':' 12px',
    padding: '7px 20px',
  
   },
}
