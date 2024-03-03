import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import backgroundAuth from '../assets/png/auth.png'
import backgroundContact from '../assets/png/contactUs.png'
import AuthLogo from '../assets/svg/الشعار مع الاسم التجاري.svg'
import HomePage from '../pages/home/Index'
// import Profile2 from '../pages/profile_2/profile2/Profile2'
import Google from '../components/google/Google'
import ContactNoon2 from '../pages/ContactUs/Noon2/ContactNoon2'
import Login2 from '../pages/Login/Login2/Login2'
import Register2 from '../pages/Register/Register2/Register2.jsx'
import Profile3 from '../pages/profile_2/profile3/Profile1.jsx'
import { SubCategoriePage } from '../pages/shop/subcategory'
import ForgetPassword from './../pages/ForgetPassword/ForgetPassword'
import { SavedProductsPage } from './../pages/savedProducts/index'
import { CategoryPage } from './../pages/shop/Category/index'

import { useSelector } from 'react-redux'
import PaymentMoyasar from '../pages/Payment/PaymentMoyasar/PaymentMoyasar.jsx'
import CheckOutJariri from '../pages/PaymentPage/Jariri/CheckOutJariri.jsx'
import ThanksPage from '../pages/ThanksPage/ThanksPage.jsx'
import { CategoriesPageSwipper } from '../pages/shop/categoriespageSwipper/index.jsx'
import { NoonSingleProduct } from '../pages/singleProductPages/noon1/index.jsx'
import { NoImage } from './../pages/privacies/NoImage/index'
import ProtectedRoutes from './ProtectedRoutes'

import { useEffect } from 'react'
import NotificationsPage from '../pages/Notifications/index.jsx'
import SelectPayment from '../pages/Payment/SelectPayment/SelectPayment.jsx'
import ThanksPageTabby from '../pages/ThanksPage/ThanksPageTabby.jsx'
import About2 from '../pages/about/about2/About2.jsx'
import BlogsPage from '../pages/blogs/blogs1/Blogs1.jsx'
import { Cart02 } from '../pages/cart/cart2/Cart02.jsx'
import SearchPage from '../pages/search/SearchPage.jsx'
import {
  SubCategoryBrandProductsPage
} from '../pages/shop/Brand/index.jsx'
import { BrandsProductsPage } from '../pages/shop/Brands/index.jsx'
import { SingleBrandPage } from '../pages/shop/singleBrand/index.jsx'
import { SubCategoryBrandsPage } from '../pages/shop/subCategoryBrands/SubCategoryBrandsPage.jsx'
import SingleBlog1 from '../pages/singleBlog/singleBlog1/SingleBlog1.jsx'
const AppRoutes = ({ isCartDrawer }) => {
  const { currentUser } = useSelector((state) => state)
  const router = useLocation()
  useEffect(() => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }, [router?.pathname])
  const checkAuthentication =
    (currentUser &&
      Object.keys(currentUser).length > 0 &&
      currentUser?.email) ||
    currentUser?.phone
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products/:id/:name" element={<NoonSingleProduct />} />

      <Route element={<ProtectedRoutes condition={!checkAuthentication} />}>
        <Route
          path="/sign-in"
          element={<Login2 backgroundImage={backgroundAuth} logo={AuthLogo} />}
        />
        <Route
          path="/register"
          element={
            <Register2 backgroundImage={backgroundAuth} logo={AuthLogo} />
          }
        />
      </Route>
      <Route
        path="/departments/:categoryItemId/:subItemId/:brandId/:name"
        element={<SubCategoryBrandProductsPage />}
      />

      <Route element={<ProtectedRoutes condition={checkAuthentication} />}>
        <Route path="/profile" element={<Profile3 />} />
        <Route path="/checkout" element={<CheckOutJariri />} />
      </Route>

      <Route
        path="/contactUs"
        element={<ContactNoon2 backgroundImag={backgroundContact} />}
      />
      <Route path="/aboutus" element={<About2 />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="/departments" element={<CategoriesPageSwipper />} />
      <Route path="/departments/:categoryId/:name" element={<CategoryPage />} />

      <Route path="/auth/google/callback" element={<Google />} />
      {!isCartDrawer && <Route path="/cart" element={<Cart02 />} />}
      <Route
        path="/departments/:categoryId/:subId/:name"
        element={<SubCategoriePage />}
      />
      <Route
        path="/subSubCategories/:brandId/:name"
        element={<SingleBrandPage />}
      />
      <Route
        path="/departments/:categoryItemId/:subId/:subName/brands"
        element={<SubCategoryBrandsPage />}
      />
      <Route path="/subSubCategories" element={<BrandsProductsPage />} />
      <Route path="/savedProducts" element={<SavedProductsPage />} />
      <Route path="/select-payment" element={<SelectPayment />} />
      <Route path="/payment-moyasar" element={<PaymentMoyasar />} />
      <Route path="/thankYou" element={<ThanksPage />} />
      <Route path="/success" element={<ThanksPageTabby />} />
      <Route path="/cancel" element={<ThanksPageTabby />} />
      <Route path="/failure" element={<ThanksPageTabby />} />
      <Route path="/policies/:policyType" element={<NoImage />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="blogs/:blogId/:blogName" element={<SingleBlog1 />} />
      <Route path="/search/:searchedTitle" element={<SearchPage />} />
      <Route path="*" element={<Navigate to="/notfound" replace />} />
    </Routes>
  )
}

export default AppRoutes
