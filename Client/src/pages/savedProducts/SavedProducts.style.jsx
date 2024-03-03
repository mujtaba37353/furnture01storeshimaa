import { colors as globalColors } from '../../constants/colors.js'

export const colors = {
  filter: {
    buttonBg: '#727272',
    buttonColor: globalColors.whiteColor,
    checkBoxLabel: globalColors.darkColor,
    borderColor: globalColors.darkColor,
  },
}
export const SavedProductsStyles = ({ lng }) => ({
  Breadcrumbs: {
    bgcolor: 'transparent',
    primary: globalColors.darkColor,
    secondary: globalColors.secondColor,
  },
  Box: {
    my: 5,
    mx: { xs: 5, sm: 2, md: 4, lg: 20 },
    minHeight: '70vh',
    direction: lng === 'en' ? 'ltr' : 'rtl',
    gap: 0,
  },
  Stack: {
    // justifyContent: { xs: 'flex-start', md: 'space-around' },
    // alignItems: 'center',
  },
  justifyContent: {
    alignItems: 'center',
    width: '100%',
  },

  StackDirection: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
})

export const SearchStyles = () => ({
  Box: {
    width: '100%',
    borderRadius: '0.5rem',
    display: 'flex',
    border: `1px solid #333`,
    alignItems: 'center',
    padding: '0.5rem',
    justifyContent: 'space-between',
  },
  InnerBox: {
    width: '100%',
    height: '100%',
    border: `none`,
    outline: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    zIndex: 2,
  },
})
export const AllProductsGridStyles = {
  ContainerSpacing: {
    xs: 1,
    md: 1,
    lg: 1,
    xl: 1,
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
export const filterMenuStyles = {
  menuButton: {
    fontSize: {
      lg: '20px',
      md: '18px',
      xs: '15px',
    },
    fontWeight: 500,
    mx: '10px',
    color: `${colors.filter.buttonColor} !important`,
  },
  priceBtn: {
    // fontFamily: publicFontFamily,
    fontWeight: 'bold',
    cursor: 'pointer',
    color: colors.filter.checkBoxLabel,
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
