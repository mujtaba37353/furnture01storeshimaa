import { Box, Stack } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useTheme } from "@emotion/react";
function SiteContentPageOperationsLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { customColors } = useTheme();
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        // bgcolor: customColors.container,
        minHeight: "100vh",
      }}
    >
       <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumbs page_ar={"محتوي الموقع"} page_en={"Site Contents"} />
        {pathname !== "/siteContent" && (
          <ArrowBackIosIcon
            sx={{ cursor: "pointer", height: 30, color: customColors.text }}
            onClick={() => navigate(-1)}
          />
        )}
      </Stack>
      <Outlet />
    </Box>
  );
}

export default SiteContentPageOperationsLayout;
