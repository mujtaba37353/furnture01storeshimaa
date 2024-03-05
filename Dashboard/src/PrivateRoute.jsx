import { Navigate, Outlet } from "react-router-dom";
import ResponsiveDrawer from "./Components/Layout/ResponsiveDrawer";
import ScrollToTop from "./Components/ScrollToTop";
// import Layout from "./Components/Layout/Layout";

const PrivateRoute = ({ setDarkMode }) => {
  if (localStorage.getItem("token")) {
    return (
      <ResponsiveDrawer setDarkMode={setDarkMode}>
        <ScrollToTop />
        <Outlet />
      </ResponsiveDrawer>
    );
  }
  return <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
