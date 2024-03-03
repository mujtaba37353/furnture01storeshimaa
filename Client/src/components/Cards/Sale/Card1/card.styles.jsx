import { CardColors } from './card.colors'

const { colors } = CardColors
export default {
  box: {
    position: 'relative',
    maxWidth: 600,
    width: { xs: '80%', md: '90%', lg: '100%' },
    height: 400,
    background: '#fff',
    boxShadow: '0 0 15px rgba(0, 0, 0, .1)',
    bgcolor: colors.backgroundColor,
    borderRadius: 3,
    cursor:"pointer"
  },
  cardImg: {
    width: '100%',
    objectFit: 'cover',
    height: '65%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: { xs: 'center', md: 'start' },
    width: '100%',
    cursor: 'default',
    height: '35%',
    bgcolor: colors.cardContentBg,
    py: 1,
  },
  titleStyle: {
    color: colors.titleColor,
    fontWeight: 'bold',
    fontSize: { xs: '0.7rem', md: '1rem' },
    textAlign: 'center',
  },
  descStyle: {
    fontWeight: 'normal',
    color: colors.descColor,
    wordBreak: 'break-word',
    overflow: 'hidden',
    display: { xs: 'none', md: 'block' },
    textAlign: 'center',
  },
  favIcon: {
    position: 'absolute',
    top: 10,
    stroke: 'tomato',
    right: 10,
    fontSize: { xs: '1.8rem', lg: '2.3rem' },
    cursor: 'pointer',
  },
  Button: {
    borderRadius: 4,
    borderColor: `${colors.borderColor} !important`,
    '&:hover': {
      borderColor: `${colors.borderColor} !important`,
      bgcolor: `${colors.buttonBackgroundColor} !important`,
      color: `${colors.buttonTextColor} !important`,
    },
    my: 0.5,
    fontSize: { md: 'initial', xs: '13px', sm: '16px' },
    textTransform: 'capitalize',
  },
}
