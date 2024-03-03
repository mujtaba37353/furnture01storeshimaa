import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Home from "./Pages/Home/Home";
import PrivateRoute from "./PrivateRoute";
import AddProductPage from "./Pages/addProduct/AddProductPage";
import { useTranslation } from "react-i18next";
import ContactRequests from "./Pages/Support/ContactRequests";
import TechnicalSupport from "./Pages/Support/TechnicalSupport";
import UsersSales from "./Pages/Sales/UsersSales";
import OrdersSales from "./Pages/Sales/OrdersSales";
import Shipping from "./Pages/Sales/Shipping";
import AdminPage from "./Pages/AdminPage/AdminPage";
import SiteContentPage from "./Pages/SiteContent/SiteContentPage";
import CategoriesPage from "./Pages/Categories/CategoriesPage";
import SiteContentPageOperations from "./Pages/SiteContent/SiteContentPageOperations";
import SiteContentPageOperationsLayout from "./Pages/SiteContent/SiteContentPageOperationsLayout";
import SiteContentSelectPage from "./Pages/SiteContent/SiteContentSelectPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShowContentPage from "./Pages/SiteContent/ShowContentPage";
import AccountingPage from "./Pages/accounting/AccountingPage";
import darkBg from "./assets/darkBg.png";
import EditProductPage from "./Pages/editProduct/EditProductPage";
import ProfilePage from "./Pages/profile/ProfilePage";
import ProductsPage from "./Pages/products/ProductsPage";
import OrderPage from "./Pages/order/OrderPage";
import ProductDetailsPage from "./Pages/productDetails/ProductDetailsPage";
import { useDispatch } from "react-redux";
import { setRole } from "./api/slice/user.slice";
import { useGetMeQuery } from "./api/user.api";
import MetaTagsPage from "./Pages/metaTags/MetaTagsPage";
import OffersPage from "./Pages/offers/OffersPage";
import CouponPage from "./Pages/Coupon/CouponPage";
import BlogsPage from "./Pages/blogs/BlogsPage";
import AddBlogPage from "./Pages/addBlog/AddBlogPage";
import EditBlogPage from "./Pages/editBlog/EditBlogPage";
import MarketerPage from "./Pages/Marketer/MarketerPage";
import SingleBlogPage from "./Pages/singleBlog/SingleBlogPage";
import PointsSystem from "./Pages/points/PointsSystem";
import NotificationsPage from "./Pages/Notifications/index";
import MarketMessage from "./Pages/marketmessage/MarketMessage";
import SmsMessages from "./Pages/SmsMessages/smsmessages";
import Tools from "./Pages/ToolsPage/Tools";
import PointsPage from "./Pages/PointsPage";
import AbandonedCarts from "./Pages/Sales/AbandonedCarts";
import ReposPage from "./Pages/respos/reposPage";
import AttributesPage from "./Pages/attributes/AttributesPage";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallBack from "./Components/ErrorBoundary/ErrorBoundaryFallBack";
import moment from "moment-timezone";
import QualitiesPage from "./Pages/qualities/QualitiesPage";
function App() {
  moment.tz.setDefault("UTC");
  const { data, isSuccess, error } = useGetMeQuery();
  const [, { language, changeLanguage }] = useTranslation();
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode"))
  );
  const darkTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    colors: {
      main: "#00D5C5",
      bg_main: darkMode ? "#474747" : "#FAFAFA",
      dangerous: "#C75050",
      light: "#ddd",
      grey: "#7E7E7E",
      snow: "#FAFAFA",
      bg: darkMode ? "#575757" : "#FFFFFF",
      inputBorderColor: darkMode ? "#00D5C5" : "divider",
      text: darkMode ? "#fff" : "#000",
    },
    btnStyle: {
      bgcolor: "#00D5C5 !important",
      color: darkMode ? "#fff !important" : "#000 !important",
      textTransform: "capitalize",
      fontWeight: "bold",
    },
    customColors: {
      main: "#00D5C5",
      secondary: darkMode ? "#3D5A58" : "#D6F3F1",
      container: darkMode ? "#474747" : "#FAFAFA",
      bg: darkMode ? "#575757" : "#FFFFFF",
      card: darkMode ? "#474747" : "#fff",
      cardNotActive: darkMode ? "#202021" : "#f2f1f1",
      cardAddAdmin: darkMode ? "#687877" : "#f2f1f1",
      text: darkMode ? "#fff" : "#000",
      inputBorderColor: darkMode ? "#00D5C5" : "divider",
      dangerous: "#C75050",
      light: "#ddd",
      grey: "#7E7E7E",
      label: darkMode ? "#00D5C5" : "#000",
      inputField: darkMode ? "#00D5C5" : "#575757",
      notify: darkMode ? "#000" : "white",
      notifyBg: darkMode ? "#f0f2f5" : "#000",
      activeRowBg: darkMode ? "#706e6e" : "#f0f0f0",
    },
    direction: language === "en" ? "ltr" : "rtl",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    if (isSuccess) {
      dispatch(setRole(data?.data.role));
    }
  }, [isSuccess]);
  useEffect(() => {
    if (localStorage?.i18nextLng) {
      console.log(
        localStorage?.i18nextLng,
        "localStorage?.i18nextLnglocalStorage?.i18nextLng"
      );
      changeLanguage(localStorage?.i18nextLng);
    }
  }, []);
  useEffect(() => {
    document.body.style.direction = language === "en" ? "ltr" : "rtl";
  }, [language]);
 

  return (
    <div
      style={{
        backgroundImage: `url("${darkMode && darkBg}")`,
        backgroundColor: !darkMode && "#fafafa",
        backgroundSize: "100%",
        backgroundPosition: "start",
        minHeight: "100vh",
        direction: language === "ar" ? "rtl" : "ltr",
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="sign-in" element={<SignIn />} />
            <Route element={<PrivateRoute setDarkMode={setDarkMode} />}>
              <Route index element={<Home />} />
              <Route path="/products/add" element={<AddProductPage />} />
              <Route
                path="/siteContent"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <SiteContentPageOperationsLayout />
                  </ErrorBoundary>
                }
              >
                <Route index element={<SiteContentPage />} />
                <Route path="/siteContent/:id" element={<ShowContentPage />} />
                <Route
                  path="/siteContent/operation"
                  element={<SiteContentSelectPage />}
                />
                <Route
                  path="/siteContent/operation/:type"
                  element={<SiteContentPageOperations />}
                />
              </Route>
              <Route
                path="/repositories"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <ReposPage />
                  </ErrorBoundary>
                }
              />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route
                path="/categories"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <CategoriesPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/contactRequests"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <ContactRequests />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/technicalSupport"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <TechnicalSupport />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/users"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <UsersSales />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/orders"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <OrdersSales />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/abandonedCarts"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <AbandonedCarts />
                  </ErrorBoundary>
                }
              />
              <Route path="/orders/:id" element={<OrderPage />} />
              <Route
                path="/shipping"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <Shipping />
                  </ErrorBoundary>
                }
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/accounting" element={<AccountingPage />} />
              <Route
                path="/admins"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <AdminPage />
                  </ErrorBoundary>
                }
              />
              <Route path="/products/edit/:id" element={<EditProductPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/meta-tags" element={<MetaTagsPage />} />
              <Route
                path="/offers"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <OffersPage />
                  </ErrorBoundary>
                }
              />
              <Route path="/points" element={<PointsSystem />} />
              <Route path="/pointsMangement" element={<PointsPage />} />
              <Route
                path="/coupons"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <CouponPage />
                  </ErrorBoundary>
                }
              />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:blogId" element={<SingleBlogPage />} />
              <Route path="/blogs/add" element={<AddBlogPage />} />
              <Route path="/blogs/edit/:blogId" element={<EditBlogPage />} />
              <Route
                path="/marketers"
                element={
                  // <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                  <MarketerPage />
                  //</ErrorBoundary>
                }
              />
              <Route
                path="/tools"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <Tools />
                  </ErrorBoundary>
                }
              />
              <Route path="/EmailMessage" element={<MarketMessage />} />
              <Route path="/SmsMessage" element={<SmsMessages />} />
              <Route
                path="/attributes"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <AttributesPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/qualities"
                element={
                  <ErrorBoundary FallbackComponent={ErrorBoundaryFallBack}>
                    <QualitiesPage />
                  </ErrorBoundary>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
