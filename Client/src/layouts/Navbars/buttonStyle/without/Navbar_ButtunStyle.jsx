import {
  AppBar,
  Box,
  CardMedia,
  CssBaseline,
  Grid,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
  Stack,
  Button,
  Badge,
  Menu,
  Drawer,
  List,
  ListItem,
  MenuItem,
  Typography,
  Select,
  Divider,
  Tooltip,
} from '@mui/material'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { store } from '../../../../redux/Store.js'
import {
  DepertmentStyles,
  LogoStyle,
  MainNavIcons,
  MainStyles,
  NavDrrawerStyles,
  NavLinksStyles,
  NavMenuStyles,
  Navcolors,
  NestedSubsubSubCategoriesMenuStyles,
  ProfileMenuStyles,
  ProfileSyles,
  iconStyle,
  allBrandsBtn,
} from './styles.js'
import { useEffect } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import CategoryIcon from '@mui/icons-material/Category'
import InfoIcon from '@mui/icons-material/Info'
import CallIcon from '@mui/icons-material/Call'
import MapsUgcIcon from '@mui/icons-material/MapsUgc'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import LogoutIcon from '@mui/icons-material/Logout'
import { NavLink } from 'react-router-dom'
import BookIcon from '@mui/icons-material/Book'
import { allsubSubCategoriesBtn } from './styles.js'
import cartApi, {
  useLazyGetAllCartsQuery,
} from '../../../../redux/apis/cartApi.js'
import {
  savedProductsApi,
  useGetAllSavedProductsQuery,
} from '../../../../redux/apis/SavedProductApi.js'
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { toast } from 'react-toastify'
import { useCreateGuestUserMutation } from '../../../../redux/apis/gestUserApi.js'
import { navCategoryMenuStyles } from './styles.js'
import { removeCurrentUser } from '../../../../redux/slices/userSlice.js'
// import { Cart03 } from '../../../../pages/cart/cart3/Cart03.jsx'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Notifications from '../../../../components/Notifications/Notifications.jsx'
import { countries } from '../../../../components/providers/countries.js'
import { useGetCurrencyQuery } from '../../../../redux/apis/currencyApi.js'
import { CurencyActions } from '../../../../redux/slices/currency/currencySlice.js'
import { userApi } from '../../../../redux/apis/UserApis.js'
import { dashboardUrl } from '../../../../constants/baseUrl.js'
import { NotificationsApi } from '../../../../redux/apis/NotificationsApi.js'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShoppingCartIcon from '../../../../assets/jpg/icons8-shopping-cart.gif'
import DrawerIconPNG from '../../../../assets/png/drawerIcon.png'
import ProfileIconSVG from '../../../../assets/jpg/profile.png'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
// ================================== HELPERS =================================//
const resolvepathname = (pathname) => {
  const pattern = /\/([^\/]+)(\/|$)/
  const result = pathname.match(pattern)
  if (result) {
    return result[1]
  }
}
import SearchIcon from '@mui/icons-material/Search'
import { useLazyGetAllProductsQuery } from '../../../../redux/apis/ProductApis.js'
import { useFetchCategoriesWithSubs } from './navbar.hooks.js'
const excludePages = ['sign-in', 'register', 'thankYou', 'forgetPassword']
export const constants = {
  navlins: [],
  NavData: () => {
    const { categoriesWithSubs } = useFetchCategoriesWithSubs()
    const nestedLinks =
      categoriesWithSubs.data.length > 0
        ? categoriesWithSubs.data.map((item) => {
            return {
              id: item.category['id'],
              title_en: item.category.name_en,
              title_ar: item.category.name_ar,
              subs: item.subCategories.map((el) => ({
                id: el.subCategory.id,
                title_en: el.subCategory.name_en,
                title_ar: el.subCategory.name_ar,
                subSubCategories: el.subSubCategory.map((subSub) => ({
                  id: subSub._id,
                  title_en: subSub.name_en,
                  title_ar: subSub.name_ar,
                })),
              })),
              isLoading: categoriesWithSubs.isLoading,
            }
          })
        : []
    return [
      {
        link_en: 'Home',
        link_ar: 'الرئيسية',
        icon: <HomeIcon />,
        path: '/',
      },
      {
        link_en: 'Categories',
        link_ar: 'الأقسام',
        path: '/departments',
        icon: <CategoryIcon />,
        nestedLinks: nestedLinks,
      },
      // {
      //   link_en: 'About Us',
      //   link_ar: 'حولنا',
      //   path: '/aboutUs',
      //   icon: <InfoIcon />,
      // },
      // {
      //   link_en: 'Contact Us',
      //   link_ar: 'تواصل معنا',
      //   path: '/contactUs',
      //   icon: <MapsUgcIcon />,
      // },
      // {
      //   link_en: 'Our Blogs',
      //   link_ar: 'مدوناتنا',
      //   path: '/blogs',
      //   icon: <BookIcon />,
      // },
    ]
  },
  pagesWithout: (pathname) => excludePages.includes(resolvepathname(pathname)),
  muiIcons: (lng) => [
    <HomeIcon
      key="home"
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <CategoryIcon
      key={'category'}
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <InfoIcon
      key={'info'}
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <MapsUgcIcon
      key={'message'}
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
    <BookIcon
      key={'Book'}
      sx={{
        ml: lng === 'en' ? '-4px' : '8px',
        mr: lng === 'en' ? '8px' : '-4px',
      }}
    />,
  ],
  ProfileMenuData: [
    {
      name_en: 'Login',
      name_ar: 'تسجيل الدخول',
      path: 'sign-in',
      icon: <LoginIcon sx={iconStyle} />,
    },
    {
      name_en: 'Register',
      name_ar: 'تسجيل حساب',
      path: 'register',
      icon: <AppRegistrationIcon sx={iconStyle} />,
    },
    {
      name_en: 'Profile',
      name_ar: 'الملف الشخصي',
      path: 'profile',
      icon: <AccountCircleIcon sx={iconStyle} />,
    },
    {
      name_en: 'Logout',
      name_ar: 'تسجيل خروج',
      path: '',
      icon: <LogoutIcon sx={iconStyle} />,
    },
  ],
}
// ======================================|| DRAWER ICON - Navbar ||================================//
function DrawerIcon({ handleDrawerToggle }) {
  return (
    <IconButton
      sx={{ display: { lg: 'none', xs: 'block' }}}
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
    >
      <CardMedia
        src={DrawerIconPNG}
        component={'img'}
        sx={{
          height: '22px',
          width: '32px',
        }}
      />
    </IconButton>
  )
}
// =================================================================================================//

// ====================================|| LOGO - NAVBAR ||======================================//
function Logo({ imagePath, extraObjectFit, phoneScreen, sx }) {
  const LogoStyles = LogoStyle()
  const navigate = useNavigate()
  return (
    <>
      {!phoneScreen && (
        <Grid item>
          <Box sx={sx}>
            {imagePath && (
              <CardMedia
                component="img"
                onClick={() => navigate('/')}
                sx={{ ...LogoStyles.cardMedia(extraObjectFit) }}
                src={imagePath}
              />
            )}
          </Box>
        </Grid>
      )}
    </>
  )
}
// =====================================================================================//

// ====================================|| Nav Category Menu -  NAVBAR  ||======================================//

function NavCategoryMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const { lng, pathname } = props
  const Styles = NavMenuStyles({ props, lng, pathname })
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const { scrollActivity } = useSelector((state) => state)
  const theme = useTheme()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('md'))
  const handleClose = () => {
    setAnchorEl(null)
    if (props.handleDrawerToggle) {
      props.handleDrawerToggle()
    }
  }
  const navigate = useNavigate()
  const HandleNavigate = (url) => {
    handleClose()
    navigate(url)
    if (props.handleDrawerToggle) {
      props.handleDrawerToggle()
    }
  }
  // useEffect(() => {
  //   if (scrollActivity.value === true) {
  //     handleClose()
  //     if (props.handleDrawerToggle) {
  //       props.handleDrawerToggle()
  //     }
  //   }
  // }, [scrollActivity])
  return (
    <Box>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          ...navCategoryMenuStyles.categoryMenu(pathname, props.item),
          direction: lng === 'ar' ? 'rtl' : 'ltr',
        }}
        className={!phoneScreen ? 'navbutton' : 'drawwerButton'}
      >
        <Stack direction={'row'} alignItems={'center'} gap={'3px'}>
          {constants.muiIcons.length > 0
            ? constants.muiIcons(lng)[1]
            : undefined}
          <span title={props.item[`title_${lng}`]}>
            {/* {props.item[`title_${lng === 'en' ? 'en' : 'ar'}`]} */}
            {lng === 'en'
              ? props.item.title_en.length > 15
                ? props.item.title_en.slice(0, 15)
                : props.item.title_en
              : props.item.title_ar.length > 10
              ? props.item.title_ar.slice(0, 10)
              : props.item.title_ar}
          </span>
          <ArrowDropDownIcon
            className="ArrowDropDownIcon"
            sx={{
              ...Styles.ArrowDropDownIcon,
              transform: open ? 'rotate(180deg)' : 'rotatex(0)',
            }}
          />
        </Stack>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock={true}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{
          ...Styles.Menu,

          '.MuiList-root': {
            bgcolor: '#fff',
            boxShadow: 'none !important',
          },
          '.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper': {
            boxShadow: 'none !important',
            border: '1.5px solid #A7A7A6 !important',
            borderRadius: 0,
          },
        }}
      >
        {props.item.subs.map((sub) =>
          sub.subSubCategories[0] ? (
            <>
              <NestedSubsubSubCategoriesMenu
                categoryItem={props.item}
                item={sub}
                handleClose={handleClose}
                handleDrawerToggle={props.handleDrawerToggle}
              />
              <Divider
                bgcolor="#797979"
                sx={{
                  width: 0.65,
                  mx: 'auto',
                }}
              />
            </>
          ) : (
            <>
              <MenuItem
                key={props.item.id}
                sx={{
                  ...navCategoryMenuStyles.menuItem(
                    pathname,
                    `/departments/${props.item.id}/${
                      sub.id
                    }/${sub.title_en.replace(/\s+/g, '-')}`
                  ),
                  justifyContent: 'center !important',
                }}
                onClick={() =>
                  HandleNavigate(
                    `/departments/${props.item.id}/${
                      sub.id
                    }/${sub.title_en.replace(/\s+/g, '-')}`
                  )
                }
              >
                {' '}
                {sub[`title_${lng}`]}{' '}
              </MenuItem>
              <Divider
                bgcolor="#797979"
                sx={{
                  width: 0.65,
                  mx: 'auto',
                }}
              />
            </>
          )
        )}
        {props.item.subs[0] && (
          <MenuItem
            sx={navCategoryMenuStyles.menuItem(
              pathname,
              `/departments/${props.item.id}/${props.item.title_en.replace(
                /\s+/g,
                '-'
              )}`
            )}
            onClick={() =>
              HandleNavigate(
                `/departments/${props.item.id}/${props.item.title_en.replace(
                  /\s+/g,
                  '-'
                )}`
              )
            }
          >
            {' '}
            {lng === 'en' ? 'All Sub categories' : 'جميع الأقسام الفرعية'}
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}
// =========================================================================================//

function NestedSubsubSubCategoriesMenu(props) {
  const { pathname } = useLocation()
  const [_, { language: lng }] = useTranslation()
  const Styles = NestedSubsubSubCategoriesMenuStyles({ props, pathname, lng })
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickCategMenu = (event) => setAnchorEl(event.currentTarget)
  const navigate = useNavigate()
  const handleCloseCategMenu = () => {
    setAnchorEl(null)
  }
  const handleNestedLinks = (url) => {
    navigate(url)
    props.handleDrawerToggle && props.handleDrawerToggle()
    props.handleClose && props.handleClose()
    handleCloseCategMenu()
  }
  console.log('doihfydsiugfsdugfsdf', props)
  return (
    <Box sx={Styles.Box}>
      <Button
        sx={{
          ...Styles.Button,
          width: 1,
          mx: 'auto',
        }}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickCategMenu}
        className="drawwerButton"
      >
        <Stack sx={{ ...Styles.stack }}>
          <span>{props.item[`title_${lng === 'en' ? 'en' : 'ar'}`]}</span>
          <ArrowDropDownIcon
            className="ArrowDropDownIcon"
            sx={{
              ...Styles.ArrowDropDownIcon,
              transform: open
                ? `rotate(${lng === 'en' ? '-90deg' : '90deg'})`
                : 'rotatex(0)',
            }}
          />
        </Stack>
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseCategMenu}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        anchorOrigin={{
          horizontal: lng !== 'en' ? 'left' : 'right',
          vertical: 'center',
        }}
        transformOrigin={{
          horizontal: lng === 'en' ? 'left' : 'right',
          vertical: 'top',
        }}
        sx={{
          ...Styles.Menu,

          '.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper': {
            boxShadow: 'none !important',
            border: '1.5px solid #A7A7A6 !important',
            borderRadius: 0,
          },
        }}
      >
        {props.item.subSubCategories.map((brand) => {
          return (
            <>
              <MenuItem
                key={brand.id}
                sx={{
                  ...Styles.brandItem(
                    `/departments/${props.categoryItem._id}/${props.item.id}/${
                      brand.id
                    }/${brand.title_en.replace(/\s+/g, '-')}`
                  ),
                }}
                onClick={() =>
                  handleNestedLinks(
                    `/departments/${props.categoryItem.id}/${props.item.id}/${
                      brand.id
                    }/${brand.title_en.replace(/\s+/g, '-')}`
                  )
                }
              >
                {brand[`title_${lng}`]}
              </MenuItem>
              <Divider
                sx={{
                  width: 0.65,
                  mx: 'auto',
                }}
              />
            </>
          )
        })}
        {props.item.subSubCategories.length ? (
          <MenuItem
            sx={{
              ...allBrandsBtn(
                pathname,
                `/departments/${props.categoryItem.id}/${
                  props?.item.id
                }/${props?.item.title_en.replace(/\s+/g, '-')}/brands`
              ),
            }}
            onClick={() =>
              handleNestedLinks(
                `/departments/${props.categoryItem.id}/${
                  props?.item.id
                }/${props?.item.title_en.replace(/\s+/g, '-')}/brands`
              )
            }
          >
            {lng === 'en' ? 'All' : 'الجميع'}
          </MenuItem>
        ) : null}
      </Menu>
    </Box>
  )
}

// ====================================|| NAVLINKS - NAVBAR ||======================================//

function NavLinks(props) {
  const { navLinks, lng } = props
  const [activeButton] = useState(null)
  const navLinksStyles = NavLinksStyles()
  const { pathname } = useLocation()
  return (
    <>
      <Grid
        item
        sx={{
          ...navLinksStyles.Grid,
          width: '65% !important',
        }}
      >
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'center'}
          flexWrap={'wrap'}
          columnGap={8}
          gap={'20px'}
          py={1}
        >
          {navLinks.map((item, index) =>
            !item.nestedLinks ? (
              <Button
                className="navbutton"
                component={NavLink}
                key={index}
                id={`button${index}`}
                aria-controls={
                  activeButton === `button${index}` ? `menu${index}` : undefined
                }
                aria-haspopup="true"
                aria-expanded={
                  activeButton === `button${index}` ? 'true' : undefined
                }
                to={item?.path}
                sx={{ ...navLinksStyles.ButtonStyle }}
                startIcon={
                  constants.muiIcons.length > 0
                    ? constants.muiIcons(lng)[index]
                    : null
                }
              >
                {lng === 'en' ? item.link_en : item.link_ar}
              </Button>
            ) : (
              <>
                {item.nestedLinks.length > 0 && (
                  <Button
                    className="navbutton"
                    component={NavLink}
                    to={`/departments`}
                    sx={{
                      ...navCategoryMenuStyles.btnAll(pathname),
                    }}
                    startIcon={
                      constants.muiIcons.length > 0
                        ? constants.muiIcons(lng)[index]
                        : null
                    }
                  >
                    {lng === 'en' ? 'All departments' : 'جميع الأقسام'}
                  </Button>
                )}
                {item.nestedLinks.map((element, index) =>
                  !element.subs[0] ? (
                    <Button
                      className="navbutton"
                      component={NavLink}
                      key={index}
                      id={`button${index}`}
                      aria-controls={
                        activeButton === `button${index}`
                          ? `menu${index}`
                          : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={
                        activeButton === `button${index}` ? 'true' : undefined
                      }
                      to={`/departments/${
                        element.id
                      }/${element.title_en.replace(/\s+/g, '-')}`}
                      sx={{ ...navLinksStyles.ButtonStyle }}
                    >
                      {constants.muiIcons.length > 0
                        ? constants.muiIcons(lng)[1]
                        : undefined}
                      {lng === 'en' ? element.title_en : element.title_ar}
                    </Button>
                  ) : (
                    <NavCategoryMenu
                      {...props}
                      item={element}
                      handleDrawerToggle={props.handleDrawerToggle}
                    />
                  )
                )}
              </>
            )
          )}
        </Stack>
      </Grid>
    </>
  )
}
// ====================================||  MUI ICONS - NAVBAR  ||===============================
function ProfileButton(colors) {
  const { currentUser } = useSelector((state) => state)
  const styles = ProfileSyles(colors)
  const styleProfileMenu = ProfileMenuStyles({ colors })
  const [, { language }] = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const open = Boolean(anchorEl)
  const [createGuestUser] = useCreateGuestUserMutation()

  const handleLogout = () => {
    handleClose()
    // localStorage.clear()
    store.dispatch(savedProductsApi.util.resetApiState())
    store.dispatch(cartApi.util.resetApiState())
    store.dispatch(NotificationsApi.util.resetApiState())
    store.dispatch(userApi.util.resetApiState())
    toast.success(language === 'en' ? 'You are logged out' : 'تم تسجيل الخروج')
    dispatch(removeCurrentUser())
    createGuestUser()
      .unwrap()
      .then((res) => {
        localStorage.setItem('token', res?.token)
      })

    navigate('/')
  }
  const theme = useTheme()
  const MDScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const checkAuthentication =
    (currentUser &&
      Object.keys(currentUser).length > 0 &&
      currentUser?.email) ||
    currentUser?.phone
  const handleClick = (event) => {
    if (MDScreen) {
      if (
        checkAuthentication &&
        [
          'rootAdmin',
          'subAdmin',
          'adminA',
          'adminB',
          'adminC',
          'user',
        ].includes(currentUser.role)
      ) {
        currentUser.role === 'user'
          ? navigate('/profile')
          : setAnchorEl(event.currentTarget)
      } else {
        navigate('/sign-in')
      }
    } else {
      setAnchorEl(event.currentTarget)
    }
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClickMenuItem = (item) => {
    item.name_en === 'Logout'
      ? handleLogout()
      : item?.name_en === 'dashboard'
      ? window.open(item.path)
      : navigate(item.path)
    handleClose()
  }
  // icon_nav
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disableRipple
        sx={{
          ...styles.Button,
          bgcolor: 'transparent !important',
          minWidth: '0 !important',
          maxWidth: '0 !important',
        }}
      >
        {open ? (
          <CloseIcon
            sx={{
              ...styles.CloseIcon,
              color: '#727272',
              fontSize: {
                md: '35px',
                xs: '30px',
              },
            }}
          />
        ) : (
          <Tooltip
            title={
              !checkAuthentication
                ? language === 'en'
                  ? 'Login'
                  : 'سجل دخول'
                : [
                    'rootAdmin',
                    'subAdmin',
                    'adminA',
                    'adminB',
                    'adminC',
                  ].includes(currentUser?.role)
                ? ''
                : language === 'en'
                ? 'Profile'
                : 'الصفحة الشخصية'
            }
            sx={{
              cursor: 'pointer',
              bgcolor: 'transparent !important',
              py: { xs: 0.5, md: 0.8 },
              px: { xs: 1, md: 1.5 },
              borderRadius: 1,
            }}
          >
            <CardMedia
              component={'img'}
              src={ProfileIconSVG}
              className="icon_nav"
              sx={{
                // ...styles.Person2Icon,
                height: 25,
                width: 25,
                color: '#fff',

                fontSize: {
                  md: '35px',
                  xs: '30px',
                },
              }}
            />
          </Tooltip>
        )}
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={styles.Menu}
        MenuListProps={styles.MenuListProps}
        disableScrollLock={true}
      >
        {currentUser?.role !== 'guest' &&
        ['rootAdmin', 'subAdmin', 'adminA', 'adminB', 'adminC'].includes(
          currentUser?.role
        ) ? (
          MDScreen ? (
            <>
              <Box
                onClick={() =>
                  handleClickMenuItem(
                    constants.ProfileMenuData.find(
                      ({ name_en }) => name_en === 'Profile'
                    )
                  )
                }
              >
                <ProfileMenuItem
                  item={constants.ProfileMenuData.find(
                    ({ name_en }) => name_en === 'Profile'
                  )}
                  colors={colors}
                />
              </Box>
            </>
          ) : (
            <>
              <Box
                onClick={() =>
                  handleClickMenuItem(
                    constants.ProfileMenuData.find(
                      ({ name_en }) => name_en === 'Profile'
                    )
                  )
                }
              >
                <ProfileMenuItem
                  item={constants.ProfileMenuData.find(
                    ({ name_en }) => name_en === 'Profile'
                  )}
                  colors={colors}
                />
              </Box>
              <Box
                onClick={() =>
                  handleClickMenuItem(
                    constants.ProfileMenuData.find(
                      ({ name_en }) => name_en === 'Logout'
                    )
                  )
                }
              >
                <ProfileMenuItem
                  item={constants.ProfileMenuData.find(
                    ({ name_en }) => name_en === 'Logout'
                  )}
                  colors={colors}
                />
              </Box>
            </>
          )
        ) : (
          constants.ProfileMenuData.filter(({ name_en }) =>
            currentUser?.email || currentUser?.phone
              ? name_en !== 'Login' && name_en !== 'Register'
              : name_en !== 'Profile' && name_en !== 'Logout'
          ).map((item, index) => (
            <Box key={index} onClick={() => handleClickMenuItem(item)}>
              <ProfileMenuItem item={item} colors={colors} />
            </Box>
          ))
        )}
        {currentUser &&
          ['rootAdmin', 'subAdmin', 'adminA', 'adminB', 'adminC'].includes(
            currentUser?.role
          ) && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={styleProfileMenu.Stack}
              onClick={() => {
                window.open(dashboardUrl, '_blank')
                handleClose()
              }}
            >
              <DashboardIcon />
              <Typography sx={styleProfileMenu.Typography}>
                {language === 'en' ? 'Dashboard' : 'لوحة التحكم'}
              </Typography>
            </Stack>
          )}
      </Menu>
    </div>
  )
}
// =======================================================================================

// =============||   CountriesSelect ||========

const CountriesSelect = (props) => {
  const [, { language: lang }] = useTranslation()
  const dispatch = useDispatch()
  const { data } = useGetCurrencyQuery()
  const [country, setCountry] = useState(
    JSON.parse(localStorage.getItem('country'))?.value || 'sar'
  ) //when refresh get the value from local storage
  const handleChange = (event) => {
    localStorage.setItem(
      'country',
      JSON.stringify(
        countries.find((country) => country.value === event.target.value)
      )
    )
    setCountry(event.target.value)
  }

  useEffect(() => {
    localStorage.setItem(
      'country',
      JSON.stringify(
        JSON.parse(localStorage.getItem('country')) || {
          label: 'SA - Saudi Riyal (ر.س)',
          value: 'sar',
          currency: data?.data[0]?.rates[`${country.toUpperCase()}`],
        }
      )
    )
    setCountry(JSON.parse(localStorage.getItem('country'))?.value || 'sar')
  }, [])

  const countryData = JSON.parse(localStorage.getItem('country'))

  useEffect(() => {
    dispatch(
      CurencyActions.setCurrency({
        currency: data?.data[0]?.rates[`${country.toUpperCase()}`] || 1,
        label: countryData?.label || 'SAR - Saudi Riyal (ر.س)',
      })
    )
  }, [country, data?.data])

  return (
    <Box
      sx={{
        minWidth: 'auto',
        mr: lang === 'ar' && '10px',
        ml: lang === 'en' && '10px',
        width: 'fit-content',
      }}
      className={'currencyContainer'}
    >
      <Select
        id="demo-simple-select"
        value={country}
        onChange={handleChange}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #727070d6',
          height: '25px',
          width: '40px',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          p: 0,
          '& > .currency-flag': {
            opacity: '0 !important',
            width: '50px',
            height: '20px',
            margin: '10px',
          },
          '& #demo-simple-select': {
            justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start',
          },
          '& > svg': {
            color: '#fff',
            height: '15px',
            width: '15px',
            top: '3px',
            right: '-2px',
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: '200px', // Set your custom height here
            },
          },
          disableScrollLock: true,
        }}
      >
        {countries.map((country) => {
          return (
            <MenuItem
              value={country.value}
              key={country.value}
              onClick={(e) =>
                JSON.parse(localStorage.getItem('country'))?.value
              }
              sx={{
                gap: 2,
              }}
            >
              <div
                className={`currency-flag currency-flag-${country.value}`}
              ></div>
              {/* {country.currency} */}
            </MenuItem>
          )
        })}
      </Select>
    </Box>
  )
}

// ======================================|| NavIcons ||================================================
function NavIcons(props) {
  const [, { language: lng, changeLanguage }] = useTranslation()
  const Style = MainNavIcons(props)
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state)
  const theme = useTheme()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const [getCart, { data: dataCart, error: errorCart }] =
    useLazyGetAllCartsQuery(undefined)
  const { data: favPros } = useGetAllSavedProductsQuery(undefined)
  useEffect(() => getCart(undefined), [currentUser])
  const toggleLanguage = () => {
    lng === 'en' ? changeLanguage('ar') : changeLanguage('en')
  }
  const [createGuestUser] = useCreateGuestUserMutation(undefined)
  const dispatch = useDispatch()
  const handleLogout = () => {
    // localStorage.clear()

    store.dispatch(userApi.util.resetApiState())
    toast.success(lng === 'en' ? 'You are logged out' : 'تم تسجيل الخروج')
    createGuestUser()
      .unwrap()
      .then((res) => {
        localStorage.setItem('token', res?.token)
        console.log('login')
        store.dispatch(savedProductsApi.util.resetApiState())
        store.dispatch(cartApi.util.resetApiState())
        store.dispatch(NotificationsApi.util.resetApiState())
      })
    navigate('/')
    dispatch(removeCurrentUser())
  }
  const checkAuthentication =
    (currentUser &&
      Object.keys(currentUser).length > 0 &&
      currentUser?.email) ||
    currentUser?.phone
  return (
    <Grid item sx={{ ...Style.Grid }}>
      <Stack
        direction={{
          lg: 'row',
          xs: 'row',
        }}
        alignItems={'center'}
        justifyContent={'flex-end'}
        gap={0.5}
      >
        <Button
          onClick={toggleLanguage}
          sx={{
            borderRadius: 2,
            minWidth: 0,
            width: {
              md: 42,
              xs: 35,
            },
            height: {
              md: 32,
              xs: 25,
            },
            fontSize: {
              md: '17px',
              xs: '14px',
            },
            color: Navcolors.colors.buttonColor,
            bgcolor: `${Navcolors.colors.buttonBgColor} !important`,
            fontWeight: 'bold',
            bgcolor: 'transparent !important',
            color: '#fff',
            border: `1px solid #727272`,
            width: '32px',
            height: '25px',
            fontSize: '15px',
            fontWeight: '400',
            display: {
              lg: 'none',
              xs: 'flex',
            },
          }}
        >
          {lng === 'en' ? 'Ar' : 'En'}
        </Button>
        <Notifications
          lng={lng}
          iconColor={'white'}
          bgColorBtn={Navcolors.colors.buttonBgColor}
        />

        <ProfileButton
          menuBgColor={Navcolors.colors.menuBgColor || 'transparent'}
          iconColor={Navcolors.colors.buttonColor || 'black'}
          bgColor={Navcolors.colors.buttonBgColor || 'transparent'}
          textColor={Navcolors.colors.menuItemColor || 'black'}
          menuItemBgColor={Navcolors.colors.menuItemBgColor || 'transparent'}
          activeColor={Navcolors.colors.activeLinkBgColor || 'transparent'}
          phoneScreen={props.phoneScreen}
        />
        <Badge
          badgeContent={
            favPros?.data?.favourite?.length > 0
              ? favPros.data.favourite.length
              : 0
          }
          sx={{ ...Style.Badge, mx: '7.5px' }}
        >
          <Tooltip
            title={lng === 'en' ? 'wishlist' : 'المفضله'}
            sx={{
              cursor: 'pointer',
              bgcolor: 'transparent !important',
              py: { xs: 0.5, md: 0.8 },
              px: { xs: 1, md: 1.5 },
              borderRadius: 1,
            }}
          >
            <FavoriteIcon
              onClick={() => navigate('/savedProducts')}
              className="icon_nav"
              sx={{
                ...Style.FavoriteBorderOutlinedIcon,
                fontSize: {
                  md: 30,
                  xs: 27,
                },
                color: 'white !important',
              }}
            />
          </Tooltip>
        </Badge>
        <Badge
          badgeContent={
            dataCart && !errorCart ? dataCart.data.totalQuantity : 0
          }
          sx={Style.Badge}
        >
          {!props.isCartDrawer ? (
            <Tooltip
              title={lng === 'en' ? 'Cart' : 'سله المشتريات'}
              sx={{
                cursor: 'pointer',
                bgcolor: 'transparent !important',
                py: { xs: 0.5, md: 0.8 },
                px: { xs: 1, md: 1.5 },
                borderRadius: 1,
              }}
            >
              <CardMedia
                component={'img'}
                src={ShoppingCartIcon}
                onClick={() => navigate('/cart')}
                className="icon_nav"
                sx={{
                  // ...Style.AddShoppingCartOutlinedIcon,
                  color: '#fff',
                  width: {
                    md: 30,
                    lg: 30,
                    xs: 30,
                  },
                }}
              />
            </Tooltip>
          ) : (
            <Cart03 cartIconStyle={Style.AddShoppingCartOutlinedIcon} />
          )}
        </Badge>

        {!phoneScreen ? (
          <>
            <Button
              onClick={() => {
                if (!checkAuthentication) {
                  navigate(`/sign-in`)
                } else handleLogout()
              }}
              sx={{
                bgcolor: `#fff !important`,
                lineHeight: `1`,
                color: '#000',
                width: {
                  xs: 175,
                  md: 100,
                  lg: 100,
                },
                textTransform: 'capitalize',
                fontWeight: 'bold',
                fontSize: {
                  lg: lng === 'en' ? '13px' : '10px',
                  xs: '12px',
                },
                mr: lng === 'ar' ? '8px' : undefined,
                ml: lng === 'en' ? '8px' : undefined,
                py: '8px',
                borderRadius: '8px',
                marginLeft: lng === 'en' && '20px',
              }}
            >
              {!checkAuthentication
                ? lng === 'en'
                  ? 'Log in'
                  : 'تسجيل الدخول'
                : lng === 'en'
                ? 'Log out'
                : 'تسجيل الخروج'}
            </Button>
          </>
        ) : (
          <Logo
            sx={{
              height: '60px !important',
              width: '75px',
            }}
            imagePath={props.logoPath}
            extraObjectFit={'cover'}
          />
        )}
      </Stack>
    </Grid>
  )
}
// =========================================================================================//
// ====================================|| NAVBAR - NAV DRAWER ||======================================//
const NavDrawer = (props) => {
  const { navLinks, lng, pathname, mobileOpen, handleDrawerToggle } = props
  const Styles = NavDrrawerStyles({ props, lng, pathname })
  const navLinksStyles = NavLinksStyles()
  const [activeButton] = useState(null)
  return (
    <nav>
      <Drawer
        variant="temporary"
        anchor={lng === 'en' ? 'left' : 'right'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ ...Styles.Drawer }}
      >
        <Stack
          sx={{ ...Styles.Stack }}
          direction={'column'}
          alignItems={'center'}
        >
          <Box sx={{ ...Styles.Box }}>
            <Stack direction={'row'} justifyContent={'flex-end'} px={2}>
              <CloseIcon
                sx={{
                  cursor: 'pointer',
                  color: '#fff',
                }}
                onClick={handleDrawerToggle}
              />
            </Stack>
            <List
              sx={{
                mt: '70px',
              }}
            >
              {navLinks.map((item, index) =>
                !item.nestedLinks ? (
                  <ListItem
                    component={NavLink}
                    key={index}
                    to={item?.path}
                    onClick={() => {
                      handleDrawerToggle()
                    }}
                    disablePadding
                    sx={{
                      ...navCategoryMenuStyles.drawerLink(pathname, item.path),
                    }}
                  >
                    {item.icon}
                    <Typography sx={{}}>{item[`link_${lng}`]}</Typography>
                  </ListItem>
                ) : (
                  <>
                    {item.nestedLinks.length > 0 && (
                      <Button
                        component={NavLink}
                        className="drawwerButton"
                        key={index}
                        id={`button${index}`}
                        aria-controls={
                          activeButton === `button${index}`
                            ? `menu${index}`
                            : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={
                          activeButton === `button${index}` ? 'true' : undefined
                        }
                        to={item?.path}
                        sx={{
                          ...navCategoryMenuStyles.btnAll(pathname),
                        }}
                        startIcon={
                          constants.muiIcons.length > 0
                            ? constants.muiIcons(lng)[index]
                            : null
                        }
                        onClick={() => {
                          props.handleDrawerToggle()
                        }}
                      >
                        {lng === 'en' ? 'All departments' : 'جميع الأقسام'}
                      </Button>
                    )}
                    {item.nestedLinks.map((element, index) =>
                      !element.subs[0] ? (
                        <Button
                          component={NavLink}
                          key={index}
                          id={`button${index}`}
                          aria-controls={
                            activeButton === `button${index}`
                              ? `menu${index}`
                              : undefined
                          }
                          className="drawwerButton"
                          aria-haspopup="true"
                          aria-expanded={
                            activeButton === `button${index}`
                              ? 'true'
                              : undefined
                          }
                          to={`/departments/${
                            element.id
                          }/${element.title_en.replace(/\s+/g, '-')}`}
                          sx={{ ...navLinksStyles.ButtonStyle, width: 0.9 }}
                          startIcon={
                            constants.muiIcons.length > 0
                              ? constants.muiIcons(lng)[1]
                              : null
                          }
                          onClick={() => {
                            props.handleDrawerToggle()
                          }}
                        >
                          {lng === 'en' ? element.title_en : element.title_ar}
                        </Button>
                      ) : (
                        <NavCategoryMenu {...props} item={element} />
                      )
                    )}
                  </>
                )
              )}
            </List>
          </Box>
          <CountriesSelect colors={props.colors} />
        </Stack>
      </Drawer>
    </nav>
  )
}
// =========================================================================================//
// ====================================|| NAVBAR - PROFILE MENU ITEM ||===========================//
const ProfileMenuItem = ({ item, colors }) => {
  const style = ProfileMenuStyles({ colors })
  const [, { language }] = useTranslation()
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={style.Stack}
    >
      {item.icon}
      <Typography sx={style.Typography}>
        {language === 'en' ? item.name_en : item.name_ar}
      </Typography>
    </Stack>
  )
}
// =========================================================================================//
// ====================================|| NAVBAR ||======================================//

const Searching = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [, { language: lng, changeLanguage }] = useTranslation()
  const inputRef = useRef()
  const location = useLocation()
  useEffect(() => {
    setSearchOpen(false)
  }, [location?.pathname])

  const [searchingQ, { error: dataerror }] = useLazyGetAllProductsQuery()
  const navigate = useNavigate()
  const onChange = (v) => {
    searchingQ(v).then((res) => {
      setData(res?.data?.data)
      if (!v.includes('keyword')) {
        setData([])
      }
    })
  }
  let searchedQuery = `keyword[title_en]=${search}&keyword[title_ar]=${search}&keyword[description_en]=${search}&keyword[description_ar]=${search}`
  useEffect(() => {
    if (search) {
      const id = setTimeout(() => {
        const s = search ? searchedQuery : ''
        onChange(s)
      }, 500)
      return () => {
        clearTimeout(id)
      }
    }
  }, [search])
  return (
    <>
      <Stack
        component={'form'}
        onSubmit={(e) => {
          e.preventDefault()
          if (search.trim() !== '') {
            console.log('sdiofydsuyhgfsduifd',search)
            navigate(`search/${search.trim().replaceAll(' ', '_')}`)
            setSearch('')
            setSearchOpen(false)
          } else {
            inputRef.current.focus()
            toast.error(
              lng === 'en' ? 'Enter something to search' : 'أدحل شئ ما للبحث'
            )
          }
        }}
        sx={{
          width: { xs: '100%', md: '85%' },
          margin: 'auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: searchOpen ? 900 : 'initial',
        }}
      >
        <Button
          display={!search}
          type={'submit'}
          sx={{
            height: { xs: '37px', md: '49px' },
            width: '20px',
            borderRadius: '0px',
            borderRight: lng === 'en' ? '1px solid #333' : 'none',
            borderLeft: lng === 'ar' ? '1px solid #333' : 'none',
            background: '#fff !important',
            ' border-radius':
              lng === 'ar' ? '0px 11px 10px 0px' : '11px 0px 0px 10px',
            color: '#000',
          }}
        >
          <SearchIcon />
        </Button>
        <Stack
          id="innn"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          ref={inputRef}
          sx={{
            width: '100%',
            ' border-radius':
              lng === 'ar' ? '11px 0px 0px 10px' : '0px 11px 10px 0px',
            height: { xs: '37px', md: '49px' },
            outline: 'none',
            border: '0px',
            paddingRight: '9px',
            paddingLeft: lng === 'en' ? '15px' : '0px',
            paddingRight: lng === 'ar' ? '15px' : '0px',
          }}
          component={'input'}
          placeholder={lng === 'ar' ? 'ابحث هنا' : 'search here'}
          onClick={() =>
            setSearchOpen((prev) => {
              return {
                ...prev,
                open: false,
              }
            })
          }
        />
        {!dataerror && searchOpen && data?.length && search !== '' ? (
          <Stack
            sx={{
              height: 'auto',
              width: '100%',
              // display:!searchOpen&&'none',
              flexDirection: 'column',
              width: '100%',
              background: '#fff',
              position: 'absolute',
              zIndex: 1000,
              top: '45px',
              left: '0px',
              right: '0px',
              borderRadius: '10px',
              marginTop: '6px',
              boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            }}
          >
            <>
              {data?.map((de) => {
                return (
                  <>
                    <Stack component={'li'}>
                      <Stack
                        component={'li'}
                        sx={{
                          color: '#333',
                          padding: '10px',
                          borderBottom: '1px solid #ddd',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          color: '#aaa',
                          cursor: 'pointer',
                          width: '97%',
                          margin: 'auto',
                        }}
                        onClick={() => {
                          navigate(
                            `/products/${de._id}/${de.title_en.replace(
                              /\s+/g,
                              '-'
                            )}`
                          )
                          setSearchOpen(false)
                          setData([])
                          setSearch('')
                        }}
                      >
                        {lng === 'en'
                          ? de?.title_en + ` ( ${de?.title_ar} )`
                          : de?.title_ar + ` ( ${de?.title_en} )`}

                        {/* <SearchIcon/> */}
                      </Stack>
                    </Stack>
                  </>
                )
              })}
            </>
          </Stack>
        ) : null}
      </Stack>

      {searchOpen ? (
        <Stack
          sx={{
            height: '100%',
            width: '100%',
            position: 'fixed',
            background: '#3339',
            height: ' 100%',
            top: ' 0px',
            'z-index': '800',
            left: '0px',
          }}
          onClick={() => {
            setSearchOpen(false)
            // setSearch('')
          }}
        ></Stack>
      ) : null}
    </>
  )
}
const SwiperNavLinks = (props) => {
  // const navLinks = ['Department1', 'Department2', 'Department3', 'Department4', 'Department5', 'Department6', 'Department8', 'Department9']
  const { navLinks, lng } = props
  const styles = DepertmentStyles(props)
  const navLinksStyles = NavLinksStyles()
  const { pathname } = useLocation()
  const [activeButton] = useState(null)
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const swiperWraperRef = useRef(null)

  return (
    <Box
      sx={{
        borderRight: lng === 'en' ? '1px solid #eee' : 'none',
        borderLeft: lng === 'ar' ? '1px solid #eee' : 'none',
        position: 'relative',
      }}
    >
      <Stack
        sx={{
          ...styles.SwipperBox.sx,
          position: 'relative',
          zIndex: '10',
          // flexDirection: lng === 'en' ? 'row' : 'row-reverse',
          width: '100%',
          padding: '0px 10px',
          bgcolor: '#bfbfbf !important',
          zIndex: 9,
          // direction:  lng==="en"?"ltr":'rtl',
        }}
      >
        <Box
          ref={swiperWraperRef}
          component={Swiper}
          slidesPerView={3}
          spaceBetween={1}
          sx={{
            ...styles.SwipperBox.sx,
            position: 'relative',
            width: '95%',
            display: 'block',
            direction: lng === 'en' ? 'ltr' : 'rtl',
          }}
          navigation={{
            prevEl: navigationPrevRef?.current,
            nextEl: navigationNextRef?.current,
          }}
          onBeforeInit={(swiper) => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation !== 'boolean'
            ) {
            }
          }}
          breakpoints={styles.SwipperBox.Breackpoints}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2"
        >
          {navLinks.map((item, index) => {
            return !item?.nestedLinks ? (
              <SwiperSlide width="200px" key={index}>
                <Button
                  component={NavLink}
                  key={index}
                  aria-haspopup="true"
                  aria-expanded={
                    activeButton === `button${index}` ? 'true' : undefined
                  }
                  to={item?.path}
                  sx={{
                    ...navLinksStyles.ButtonStyle,
                  }}
                  className="navbutton"
                  startIcon={
                    constants.muiIcons.length > 0
                      ? constants.muiIcons(lng)[index]
                      : null
                  }
                >
                  {lng === 'en' ? item.link_en : item.link_ar}
                </Button>
              </SwiperSlide>
            ) : (
              <>
                {item.nestedLinks.length > 0 && (
                  <SwiperSlide key={index}>
                    <Box>
                      <Button
                        component={NavLink}
                        to={`/departments`}
                        sx={{
                          ...navCategoryMenuStyles.btnAll(pathname),
                          direction: lng === 'ar' ? 'rtl' : 'ltr',
                        }}
                        className="navbutton"
                        startIcon={
                          constants.muiIcons.length > 0
                            ? constants.muiIcons(lng)[index]
                            : null
                        }
                      >
                        {lng === 'en' ? 'All departments' : 'جميع الأقسام'}
                      </Button>
                    </Box>
                  </SwiperSlide>
                )}
                {item.nestedLinks.map((element, index) => {
                  return !element.subs[0] ? (
                    <SwiperSlide key={index}>
                      <Box>
                        <Button
                          component={NavLink}
                          key={index}
                          id={`button${index}`}
                          aria-controls={
                            activeButton === `button${index}`
                              ? `menu${index}`
                              : undefined
                          }
                          className="navbutton"
                          aria-haspopup="true"
                          aria-expanded={
                            activeButton === `button${index}`
                              ? 'true'
                              : undefined
                          }
                          title={
                            lng === 'en' ? element.title_en : element.title_ar
                          }
                          to={`/departments/${
                            element.id
                          }/${element.title_en.replace(/\s+/g, '-')}`}
                          sx={{
                            ...navLinksStyles.ButtonStyle,
                            direction: lng === 'ar' ? 'rtl' : 'ltr',
                          }}
                        >
                          {constants.muiIcons.length > 0
                            ? constants.muiIcons(lng)[1]
                            : undefined}
                          {lng === 'en'
                            ? element.title_en.length > 15
                              ? element.title_en.slice(0, 8)
                              : element.title_en
                            : element.title_ar.length > 10
                            ? element.title_ar.slice(0, 8)
                            : element.title_ar}
                        </Button>
                      </Box>
                    </SwiperSlide>
                  ) : (
                    <SwiperSlide width="200px" key={index}>
                      <Box>
                        <NavCategoryMenu
                          {...props}
                          item={element}
                          handleDrawerToggle={props.handleDrawerToggle}
                        />
                      </Box>
                    </SwiperSlide>
                  )
                })}
              </>
            )
          })}
        </Box>

        <Stack
          sx={{
            position: 'absolute',
            display: 'flex',
            'flex-direction': lng === 'ar' ? 'row-reverse' : 'row',
            width: '98%',
            ' justify-content': 'space-between',
            left: '0px',
            margin: '0 auto',
            direction: lng === 'en' ? 'ltr' : 'rtl',
          }}
        >
          {lng === 'ar' ? (
            <>
              <Button
                ref={navigationNextRef}
                onClick={() => {
                  navigationNextRef
                }}
                sx={{
                  background: 'none !important',
                }}
              >
                <ArrowBackIosIcon
                  sx={{
                    fontSize: {
                      xs: '22px',
                      sm: '30px',
                      md: '30px',
                      lg: '20px',
                    },
                    color: '#000',
                    fontWeight: '100',
                  }}
                />
              </Button>
              <Button
                ref={navigationPrevRef}
                onClick={() => {
                  navigationPrevRef
                }}
                sx={{
                  background: 'none !important',
                  outline: 'none !important',
                  right: { xs: '-2%', lg: '-3%', xl: '-2.4%' },
                }}
              >
                <ArrowForwardIosIcon
                  sx={{
                    fontSize: {
                      xs: '22px',
                      sm: '30px',
                      md: '30px',
                      lg: '20px',
                    },
                    color: '#000',
                    fontWeight: '300',
                  }}
                />
              </Button>
            </>
          ) : (
            <>
              <Button
                ref={navigationPrevRef}
                onClick={() => {
                  navigationPrevRef
                }}
                sx={{
                  background: 'none !important',
                }}
              >
                <ArrowBackIosIcon
                  sx={{
                    fontSize: {
                      xs: '22px',
                      sm: '30px',
                      md: '30px',
                      lg: '20px',
                    },
                    color: '#000',
                    fontWeight: '100',
                  }}
                />
              </Button>

              <Button
                ref={navigationNextRef}
                onClick={() => {
                  navigationNextRef
                }}
                sx={{
                  background: 'none !important',
                  outline: 'none !important',
                  right: { xs: '-2%', lg: '-3%', xl: '-2.4%' },
                }}
              >
                <ArrowForwardIosIcon
                  sx={{
                    fontSize: {
                      xs: '22px',
                      sm: '30px',
                      md: '30px',
                      lg: '20px',
                    },
                    color: '#000',
                    fontWeight: '300',
                  }}
                />
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

const Navbar_ButtunStyle = (props) => {
  const [, { language: lng, changeLanguage }] = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const location = useLocation()
  const toggleLanguage = () => {
    lng === 'en' ? changeLanguage('ar') : changeLanguage('en')
    window.location.replace(`${location.pathname}`)
  }
  const navigate = useNavigate()
  const theme = useTheme()
  const phoneScreen = useMediaQuery(theme.breakpoints.down('md'))
  const navLinks = constants.NavData()
  const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState)
  const styles = MainStyles({ pathname, lng })
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return (
    <>
    <Box
      sx={{
        ...styles.MainBox,
        width: '100%',
        position: 'sticky',
        top: '0px',
        zIndex: '20',
      }}
    >
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          ...styles.AppBar,
          justifyContent: 'space-between !important',
          px: 0,
        }}
      >
        <Toolbar
          sx={{
            height: {
              xl: '109px !important',
              xs: '60px!important',
              sm: '70px !important',
              md: '90px !important',
            },
          }}
        >
          {/* drawerButton */}
          <DrawerIcon
            sx={{
              height: {
                md: 'initial',
                xs: '30px',
              },
              width: {
                md: 'initial',
                xs: '30px',
              },
            }}
            handleDrawerToggle={handleDrawerToggle}
          />
          {/* drawerButton */}
          {/* logo */}
          
          <Grid container sx={{ ...styles.container }}>
             <Box 
               onClick={() => navigate(`/`)}>

<Typography variant="h3"> Logo </Typography>

               </Box>
            
            
          
            {/* links */}
            <Box
              sx={{
                width: '100%',
              }}
              id={'labtobNav'}
            >
              <Searching />
            </Box>
            <NavIcons
              {...Navcolors}
              pathname={pathname}
              lng={lng}
              logoPath={props.logoPath}
              isCartDrawer={props.isCartDrawer}
              phoneScreen={phoneScreen}
            />
          </Grid>
        </Toolbar>

        <Stack
          id={'labtobNav'}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            bgcolor: '#bfbfbf',
          }}
        >
          <Stack
            sx={{
              width: '90%',
              marginRight: 'auto',
              position: 'relative',
            }}
          >
            <SwiperNavLinks
              lng={lng}
              pathname={pathname}
              navLinks={navLinks}
              muiIcons={constants.muiIcons(lng)}
              {...Navcolors}
            />
          </Stack>
          <Stack
            sx={{
              width: { md: "'20%'", lg: '10%' },
              marginLeft: 'auto',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <CountriesSelect colors={props.colors} />

            <Button
              onClick={toggleLanguage}
              sx={{
                borderRadius: 2,
                minWidth: 0,
                width: {
                  md: 42,
                  xs: 35,
                },
                height: {
                  md: 32,
                  xs: 25,
                },
                fontSize: {
                  md: '17px',
                  xs: '14px',
                },
                color: Navcolors.colors.buttonColor,
                bgcolor: `${Navcolors.colors.buttonBgColor} !important`,
                fontWeight: 'bold',
                bgcolor: 'transparent !important',
                color: '#727272',
                border: `1px solid #727272`,
                width: '32px',
                height: '25px',
                fontSize: '15px',
                fontWeight: '400',
                margin: '0px 20px',
              }}
            >
              {lng === 'en' ? 'Ar' : 'En'}
            </Button>
          </Stack>
        </Stack>

        <Stack
          id={'MobilebNav'}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            bgcolor: '#bfbfbf !important',
          }}
        >
          <Stack
            sx={{
              width: '90%',
              padding: '10px',
              margin: 'auto',
            }}
          >
            <Searching />
          </Stack>
        </Stack>
      </AppBar>
      <NavDrawer
        {...Navcolors}
        mobileOpen={mobileOpen}
        navLinks={navLinks}
        lng={lng}
        pathname={pathname}
        handleDrawerToggle={handleDrawerToggle}
        muiIcons={constants.muiIcons(lng)}
        logoPath={props.logoPath}
      />
    </Box>
    </>
  )
}
export default Navbar_ButtunStyle
//=============================================================================================//
