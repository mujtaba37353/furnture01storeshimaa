import { colors as ss } from "../../../../constants/colors"

const colors= {
  titleColor: ss.whiteColor,
  backgroundColor: ss.secondColor,
  descColor: ss.whiteColor,
  borderColor: 'transparent',
  hoverColor: '#5A0858',
  buttonTextColor: ss.blackColor,
  buttonBackgroundColor: ss.whiteColor,
}

export default {
    cardPaper: {
       height: { xs: '330px', sm: '330px', md: '375px', lg: '350px', xl: '420px' },
      display: 'block',
      flexDirection: 'column',
      border: `0px solid ${colors.borderColor} `,
      borderRadius: 8,
      bgcolor: colors.backgroundColor,
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
      // pb: 4,
      padding:" 18px",
      padding:'0px !important'
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
      pt: 2,
  
     
      // mb: 1,
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
      
      '&:hover': {
        borderColor: `${colors.borderColor} !important`,
        bgcolor: `${colors.buttonTextColor} !important`,
        color: `${colors.buttonBackgroundColor} !important`,
      },
      px: { md: 5, xs: 3 },
      my: 0.5,
      fontSize: { md: 'initial', xs: '13px', sm: '16px' },
      textTransform: 'capitalize',
      position: 'absolute',
      bottom: '21px',
      right: '18%',
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