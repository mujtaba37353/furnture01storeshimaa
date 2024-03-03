import {
  Box,
  ButtonBase,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import Error from "../../assets/warning-error-svgrepo-com.svg";
import { useTranslation } from "react-i18next";
const ErrorBoundaryFallBack = ({ error, resetErrorBoundary }) => {
  const [_, { language: lang }] = useTranslation();
  const { customColors } = useTheme();

  return (
    <Box
      sx={{
        position: "relative",

        height: "92vh",
      }}
    >
      <Box
        sx={{
          width: { xs: "200px", md: "250px" },
          height: { xs: "200px", md: "250px" },
          position: "absolute",
          top: { xs: "40%", md: "25%" },
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <CardMedia component="img" src={Error} width="100%" height="100%" />
      </Box>
      <Box
        textAlign={"center"}
        sx={{
          position: "absolute",
          top: { xs: "60%", md: "60%" },
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "2rem", md: "3.6rem" },
            fontWeight: "bold",
          }}
        >
          Error 500
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.8rem" },
            fontWeight: "bold",
          }}
        >
          {lang === "en" ? "Internal Server Error" : "خطأ داخلي في الخادم"}
        </Typography>
        <ButtonBase
          onClick={() => resetErrorBoundary()}
          sx={{
            mt: 2,
            padding: "10px",
            bgcolor: customColors.main,
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#fff",
              width: "fit-content",
            }}
          >
            {lang === "en" ? "Try again " : "اعادة المحاوله"}
          </Typography>
        </ButtonBase>
      </Box>
    </Box>
  );
};

export default ErrorBoundaryFallBack;
