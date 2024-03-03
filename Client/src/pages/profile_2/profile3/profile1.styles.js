import { colors as globalColors } from '../../../constants/colors'
export const colors = {
  primaryBgColor: 'white',
  secondaryBgColor: globalColors.secondColor,
  titleColor: '#727272',
  buttonColor: 'white',
  buttonBgColor: globalColors.secondColor,
  labelColor: '#727272',
  borderColor: globalColors.secondColor,
}
export default {
  pageContainer: {
    gap: {
      lg: 6,
      xs: 3,
    },
    display: 'block',
    justifyContent: 'center',
    my: 10,
    width: { xs: '90%', md: '95%', lg: '85%', xl: '80%' },
     mx: 'auto',
  },
  formContainer: {
    width: '100%',
    py: 4,
    borderRadius: 7,
    bgcolor: colors.primaryBgColor,
    mt: '20px',
  },
  badge: {
    display: 'block',
    width: { xs: '160px', sm: '180px', md: '150px', lg: '260px' },
    height: {
      xs: '160px',
      sm: '180px',
      md: '150px',
      lg: '260px',
    },
    mx: 'auto',
    mb: 5,
  },
  avatar: {
    border: `1px solid ${colors.primaryBgColor}`,
    width: 1,
    height: '100%',
    '& .MuiAvatar-img': {
      objectFit: 'fill',
    },
  },
  EditIcon: {
    bgcolor: `#535353 !important`,
    
  },
  inputBase: {
    mt: '15px',
    display: 'block',
    backgroundColor: '#fff',
    p: { xs: '8px', md: '10px' },
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
    borderRadius: '50px',
    border: '1px solid gray',
    fontSize: { xs: '.95rem', lg: '1.1rem' },
  },
  label: {
    fontWeight: 'bold ',
    color: colors.labelColor,
    fontSize: {
      xs: '.85rem',
      md: '.95rem',
      lg: '1.1rem',
    },
  },
  submitBtn: {
    bgcolor: `#727272 !important`,
    color: `#fff !important`,
    p: {
      xs: '.5rem 2rem',
      md: '.6rem 2.5rem',
      lg: '.8rem 3rem',
    },
    fontSize: { xs: '1rem', lg: '1.1rem' },
    textTransform: 'capitalize',
    borderRadius: '50px',
    boxShadow:'none !important',
    fontFamily:'Segoe UI !important',
    fontWeight:'500'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 5,
    p: 4,
    borderRadius: 7,
    bgcolor:'#F8F4E8',
    mt : "40px",
    boxShadow:'none !important'

  },
  headear: {
    fontSize: '1.5rem',
    mb: 2,
    color: colors.titleColor,
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  error: {
    fontSize: '1.2rem',
    mb: 2,
    color: '#333',
  },
}
