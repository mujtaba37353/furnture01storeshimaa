export default {
  Breadcrumbs: {
    bgcolor: 'transparent',
    primary: '#414042',
    secondary: '#414042',
  },
  Stack: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: { xs: 'flex-start', md: 'center' },
    alignItems: 'center',
    gap: 3,
  },
  Box: {
    my: 5,
    mx: { xs: 1, sm: 3, lg: 10, md: 10 },
    minHeight: '70vh',
    gap: 0,
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
}
export const AllProductsGridStyles = {
  ContainerSpacing: {
    xs: 7,
    md: 4,
    lg: 2,
    xl: 2,
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
