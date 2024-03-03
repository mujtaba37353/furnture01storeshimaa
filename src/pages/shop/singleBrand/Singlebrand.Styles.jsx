import { colors as globalColors } from '../../../constants/colors.js'

export const colors = {
  filter: {
    buttonBg: '#727272',
    buttonColor: globalColors.whiteColor,
    checkBoxLabel: globalColors.darkColor,
    borderColor: globalColors.darkColor,
  },
}
export const DepertmentStyles = ({ lng }) => ({
  Breadcrumbs: {
    bgcolor: 'transparent',
    primary: globalColors.darkColor,
    secondary: '#333',
  },
  Box: {
    my: 5,
    mx: { xs: 1, sm: 3, lg: 10, md: 10 },
    minHeight: '70vh',
    direction: lng === 'en' ? 'ltr' : 'rtl',
    gap: 0,
    // "& button":{
    //   width:'198px',
    //   height: {xs:'40px',sm:"40px",md:'56px'}
    // }
  },
  Stack: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: { xs: 'flex-start', md: 'center' },
    alignItems: 'center',
    gap: 3,
  },

  StackDirection: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  Typography: {
    fontWeight: 600,
    mt: 5,
    fontSize: '1.5rem',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'start',
    zIndex: 1,
  },
  AllProductsGridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
    width: '100%',
    my: 5,
  },
})

export const AllProductsGridStyles = {
  ContainerSpacing: {
    xs: 7,
    md: 4,
    lg: 2,
    xl:2,
  },
  GridSpace: {
    xs: 7,
    md: 4,
    lg: 4,
    xl: 15,
  },
  GridItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
  },
}

export const SearchStyles = {
  BoxSx: {
    width: '100%',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    justifyContent: 'space-between',
    border: '1px solid #333',
  },
  BoxInput: {
    width: '100%',
    height: '100%',
    border: `none`,
    outline: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    zIndex: 2,
  },
}

export const filterMenuStyles = {
  menuButton: {
    fontSize: {
      lg: '20px',
      md: '18px',
      xs: '15px',
    },
    fontWeight: 'bold',
    mx: '10px',
    color: `${colors.filter.buttonColor} !important`,
  },
  priceBtn: {
    // fontFamily: publicFontFamily,
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'green',
    textAlign: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '10px',
  },
  checkBoxLabel: {
    color: colors.filter.checkBoxLabel,
    fontFamily: 'bold',
    fontSize: '19px',
    // fontFamily: publicFontFamily,
    cursor: 'pointer',
  },
  formPriceBtn: {
    mt: '10px',
    fontWeight: 'bold',
    fontSize: '13px',
    color: `${colors.filter.buttonBg} !important`,
    border: `1px solid ${colors.borderColor}`,
  },
}
