import { CardColors1 } from './card.colors'

const { colors } = CardColors1
export default {
  cardPaper: {
    width: { xs: '80%', md: '87%' },
    height: { xs: '310px', sm: '340px', md: '400px', lg: '400px', xl: '450px' },
    display: 'block',
    flexDirection: 'column',
    border: null,
    borderRadius: null,
    bgcolor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    pb: 0,
  },
  cardImg: {
    width: '100%',
    objectFit: 'cover',
    height: '65%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: { xs: 'center', md: 'start' },
    width: '100%',
    cursor: 'default',
    height: '35%',
    bgcolor: colors.cardContentBg,
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
  favIcon: {
    position: 'absolute',
    top: 10,
    stroke: 'tomato',
    right: 10,
    fontSize: { xs: '1.8rem', lg: '2.3rem' },
    cursor: 'pointer',
  },
}
