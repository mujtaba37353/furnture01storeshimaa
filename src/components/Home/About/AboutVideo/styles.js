import {colors} from "../../../../constants/colors"
export const Colors = {
  bgColor: '#bfbfbf',
  // boxShadow: '0px 0px 0px yellowgreen, 0px 3px 20px yellowgreen',
  titleColor: '#000',
  // titleColor: colors.whiteColor,
  marginBottom: '30px',
  // descColor: colors.whiteColor,
  descColor: '#000',
  subTitleColor: '#000',
  // subTitleColor: colors.whiteColor,
  buttonTextColor: '#000',
  // buttonTextColor: '#fff',

  buttonBgColor: '#BF9FEA',
}

export default {
  gridContainer: {
    boxShadow: Colors.bgColor,
    marginBottom: Colors.marginBottom,
    py: 2,
  },
  aboutSection: {
    typography: {
      fontSize: { xs: '27px', sm: '30px', lg: '5rem' },
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors.titleColor, textTransform: 'capitalize',
    },
    dangerously: {
      mt: 2,
      fontSize: { xs: '18px', md: '22px', lg: '25px' },
      color: Colors.subTitleColor,
    },
    flexHeader: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
}
