import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

function NotAllowed() {
  const {
    i18n: { language },
  } = useTranslation();
  const { customColors } = useTheme();
  return (
    <Box
      sx={{
        height: "60vh",
        display: "grid",
        placeItems: "center",
        color: customColors.dangerous,
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center", mt: "2rem" }}>
        {language === "en"
          ? "You are not allowed to access this page"
          : "غير مسموح لك بالدخول الى هذه الصفحة"}
      </Typography>
    </Box>
  );
}

export default NotAllowed;
