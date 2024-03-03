import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Avatar, Button, Menu, MenuItem, Stack } from "@mui/material";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { imageBaseUrl } from "../../api/baseUrl";
import { useGetMeQuery } from "../../api/user.api";
import Notifications from "../Notifications/Notifications";
export default function NavbarContent() {
  const { data: profile } = useGetMeQuery();
  const [toggleProfile, seToggleProfile] = useState(null);
  const navigate = useNavigate();
  const profileOpen = Boolean(toggleProfile);
  const [, { language, changeLanguage }] = useTranslation();
  const openProfile = (event) => {
    seToggleProfile(event.currentTarget);
  };
  const closeProfile = () => {
    seToggleProfile(null);
  };
  const [togglelng, seToggleLng] = useState(null);
  const lngOpen = Boolean(togglelng);
  const openLng = (event) => {
    seToggleLng(event.currentTarget);
  };
  const closeLng = () => {
    seToggleLng(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.open("/sign-in", "_self");
  };

  const { customColors } = useTheme();

  return (
    <Stack direction={"row"} sx={{ flexGrow: 1, alignItems: "center" }}>
      <Stack
        direction={"row"}
        sx={{ gap: 2, alignItems: "center", flexGrow: 0.4 }}
      >
        <>
          <Avatar
            src={`${imageBaseUrl}${profile?.data.image}`}
            sx={{ cursor: "pointer", width: "35px", height: "35px" }}
            id="profile"
            aria-controls={profileOpen ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={profileOpen ? "true" : undefined}
            onClick={openProfile}
          />
          <Menu
            id="profile"
            anchorEl={toggleProfile}
            open={profileOpen}
            onClose={closeProfile}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                closeProfile();
                navigate("/profile");
              }}
            >
              {language === "en" ? "Profile" : "الملف الشخصي"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeProfile();
                handleSignOut();
              }}
            >
              {language === "en" ? "Sign out" : "تسجيل الخروج"}
            </MenuItem>
          </Menu>
        </>
        <>
          <Button
            sx={{ color: customColors.text }}
            id="basic-button"
            aria-controls={lngOpen ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={lngOpen ? "true" : undefined}
            onClick={openLng}
            startIcon={<ArrowDropDownIcon />}
          >
            {language === "en" ? "English" : "العربيه"}
          </Button>
        </>
        <Menu
          id="basic-menu"
          anchorEl={togglelng}
          open={lngOpen}
          onClose={closeLng}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          // onClick={() => }
        >
          <MenuItem
            onClick={() => (
              closeLng(), changeLanguage(language === "en" ? "ar" : "en")
            )}
          >
            {language !== "en" ? "English" : "العربيه"}
          </MenuItem>
        </Menu>
        <Notifications lng={language} />
      </Stack>
      <Typography
        variant="h6"
        component="div"
        sx={{
          flexGrow: 0.5,
          display: { xs: "none", md: "initial" },
          color: customColors.text,
          fontSize: {
            md: "initial",
            xs: "16px",
          },
        }}
      >
        {language === "en"
          ? "Developed by Sari-Tech"
          : "هذا الموقع تم تطويره بواسطة Sari-Tech"}
      </Typography>
      <Typography
        variant="h6"
        component="div"
        sx={{
          color: customColors.text,
          fontSize: {
            md: "initial",
            xs: "12px",
          },
        }}
      >
        {language === "en" ? "Welcome back" : "اهلا بعودتك"}
      </Typography>
    </Stack>
  );
}
