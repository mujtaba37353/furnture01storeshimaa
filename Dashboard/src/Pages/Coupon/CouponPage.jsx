import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import Coupons from "./Coupons.jsx";

function CouponPage() {
  const {
    i18n: { language },
  } = useTranslation();
  const { customColors } = useTheme();
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/"
      style={{ textDecoration: "none", color: customColors.text }}
    >
      {language === "en" ? "Home" : "الرئيسية"}
    </Link>,
    <Typography key="3" color="text.primary" sx={{ color: "#00e3d2" }}>
      {language === "en" ? "Coupons" : "الكوبونات"}
    </Typography>,
  ];
  return (
    <Box sx={{ px: "20px", minHeight: "100vh" }}>
      <Box sx={{ py: "40px" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {language === "en" ? "Coupons" : "الكوبونات"}
        </Typography>
        <Breadcrumbs
          separator={
            language === "en" ? (
              <NavigateNextIcon fontSize="small" />
            ) : (
              <NavigateBeforeIcon fontSize="small" />
            )
          }
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Box>

      <Box sx={{ py: 4 }}>
        <Coupons />
      </Box>
    </Box>
  );
}

export default CouponPage;
