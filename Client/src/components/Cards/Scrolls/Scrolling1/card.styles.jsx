import { CardColors } from './card.colors'

const { colors } = CardColors
export default {
  cardPaper: {
    width: '100%',
    height: '100%',
    display: 'block',
    flexDirection: 'column',
    border: null,
    borderRadius: 5,
    position: 'relative',
    cursor: 'pointer',
    pb: 2,
  },
  cardImg: {
    width: '100%',
    objectFit: 'cover',
    height: '70%',
    borderRadius: 2,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    cursor: 'default',
    bgcolor: colors.cardContentBg,
    height: '30%',
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
    // overflow: 'hidden',
    textAlign: 'center',
    display: { xs: 'none', md: 'block' },
    px: 2,
  },
  favIcon: {
    stroke: 'tomato',
    right: 10,
    fontSize: '2.3rem',
    cursor: 'pointer',
  },
}
