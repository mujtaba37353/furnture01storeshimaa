export const colors = {
  bgPage: 'transparent',
}
export default {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
  },
  root: {
    backgroundColor: colors.bgPage,
    pt: 10,
    pb: 2,
  },
  container: {
    width: {
      md: 0.9,
      xs: 0.97,
    },
    mx: 'auto',
  },
  header: {
    mb: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: {
      xl: 0.25,
      lg: 0.33,
      md: 0.5,
      xs: 1,
    },
    padding: 3,
    mb: 6,
    textAlign: 'center',
  },
  blogTitle: {
    mt: 1,
    mb: 2,
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    mt: 4,
  },
  avatar: {
    width: 5,
    height: 5,
    mr: 2,
  },
  seeMore: {
    mt: 1,
    display: 'flex',
    justifyContent: 'center',
    a: {
      textDecoration: 'none',
      backgroundColor:"#c4a035",
      color:"white",
      padding: '5px 10px',
      borderRadius: '5px',
    },
  },
}
