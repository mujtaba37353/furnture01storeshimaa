export const colors = {
  filter: {
    buttonBg: 'red',
    buttonColor: 'blue',
    checkBoxLabel: 'green',
    borderColor: 'green',
  },
}
export const CategoriesStyle = (lng) => ({
  Breadcrumbs: {
    bgcolor: 'red',
    primary: 'blue',
    secondary: 'red',
  },
  Box: {
    my: 5,
    mx: { xs: 1, sm: 1, lg: 3, md: 3 },
    minHeight: '70vh',
    direction: lng === 'en' ? 'ltr' : 'rtl',
    gap: 0,
  },
  Stack: {
    flexDirection: { lg: 'row', xs: 'column' },
    justifyContent: { xs: 'flex-start', md: 'space-around' },
    alignItems: 'center',
  },
  justifyContent: {
    alignItems: 'center',
    width: '100%',
  },
  Stack: {
    flexDirection: { lg: 'row', xs: 'column' },

    justifyContent: { xs: 'flex-start', md: 'space-around' },
    alignItems: 'center',
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
})

export const AllProductsGridStyle = {
  GridSpacing: {
    xs: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  sx: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
  },
}

export const SearchStyle = () => ({
  Box: {
    width: '100%',
    borderRadius: '0.5rem',
    display: 'flex',
    border: `1px solid #333`,
    alignItems: 'center',
    padding: '0.5rem',
    justifyContent: 'space-between',
  },
  InputBox: {
    width: '100%',
    height: '100%',
    border: `none`,
    outline: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    zIndex: 2,
  },
})

export const filterMenuStyles = {
  menuButton: {
    fontSize: {
      md: '20px',
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
    border: `1px solid ${colors.borderColor}`,
  },
}
