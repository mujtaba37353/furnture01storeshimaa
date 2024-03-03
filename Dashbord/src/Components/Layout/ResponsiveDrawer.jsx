import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import NavbarContent from "./NavbarContent";
import { useState } from "react";
import { links } from "./links";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button, FormControlLabel, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import lightSide from "../../assets/lightSideV2.png";
import darkSide from "../../assets/darkBgV2.png";
// import lightSide from "../../assets/lightSideV2.png";
// import darkSide from "../../assets/darkSideV2.png";
import ThemeSwitch from "./ThemeSwitch";
import { useSelector } from "react-redux";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const drawerWidth = 229;

function ResponsiveDrawer(props) {
  const { pathname } = useLocation();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [, { language }] = useTranslation();

  const [openNested, setOpenNested] = useState("");
  const { customColors } = useTheme();
  const { role } = useSelector((state) => state.user);

  function filterAndModifyLinks(links, role) {
    let updatedLinks = [...links];
    if (role === "marketer") {
      const allowedLinks = links.filter((link) =>
        ["Blogs", "Marketing", "Site settings"].includes(link.en)
      );
      updatedLinks = allowedLinks.map((link) => {
        if (link.en === "Site settings") {
          // Use object spread to create a new object with the updated nested array
          return {
            ...link,
            nested: link.nested.filter((nest) =>
              ["Products", "Categories"].includes(nest.en)
            ),
          };
        }
        return link;
      });
    }
    return updatedLinks;
  }
  const handleClick = (link) => {
    if ("nested" in link) {
      if (openNested === link.en) {
        setOpenNested("");
      } else {
        setOpenNested(link.en);
      }
    } else {
      nav(link.path);
    }
  };
  const { currentUser } = useSelector((state) => state);
  console.log('currentUsercurrentUser In APP',currentUser);
  const drawer = (
    <Box>
      <Toolbar>
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1/1",
            my: 4,
          }}
          component={"img"}
          src="/logo.png"
        />
      </Toolbar>

      <List>
        {filterAndModifyLinks(links, role).map((link, index) => (
          <>
            <ListItem
              key={`${index}+1`}
              disablePadding
              onClick={() => handleClick(link)}
              sx={{
                color: "white",
                my: 2,
              }}
            >
              <ListItemButton
                divider={"nested" in link}
                sx={{
                  backgroundImage:
                    pathname === link.path &&
                    "linear-gradient(90deg, rgba(85,118,80,1) 0%, rgba(52,115,109,1) 100%)",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "white",
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    "& span": { width: "fit-content" },
                  }}
                  primary={language === "en" ? link.en : link.ar}
                />
                {link.nested && openNested === link.en && (
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: "white",
                    }}
                  >
                    <ArrowRightIcon sx={{ transform: "rotate(90deg)" }} />
                  </ListItemIcon>
                )}
                {link.nested && openNested !== link.en && (
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: "white",
                    }}
                  >
                    <ArrowRightIcon />
                  </ListItemIcon>
                )}
              </ListItemButton>
            </ListItem>
            {link.nested &&
              openNested === link.en &&
              link.nested.map((nested, index) => (
                <ListItem
                  key={`${index}+2`}
                  disablePadding
                  onClick={() => handleClick(nested)}
                  sx={{ color: "#befff9", my: 1 }}
                >
                  <ListItemButton
                    sx={{
                      px: 4,
                      backgroundImage:
                        pathname === nested.path &&
                        "linear-gradient(90deg, rgba(85,118,80,1) 0%, rgba(52,115,109,1) 100%)",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: "white" }}>
                      {nested.icon}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ sx: { fontSize: "0.8rem" } }}
                      sx={{
                        "& span": { width: "fit-content" },
                      }}
                      primary={language === "en" ? nested.en : nested.ar}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Stack>
      <Box width={drawerWidth}>
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            // ModalProps={{
            //   keepMounted: true, // Better open performance on mobile.
            // }}
            sx={{
              display: { xs: "block", md: "none" },

              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                background: `url("${
                  JSON.parse(localStorage.getItem("darkMode"))
                    ? darkSide
                    : lightSide
                }")`,
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                direction: language === "en" ? "ltr" : "rtl",
                left: language === "en" ? "0 !important" : undefined,
                right: language === "ar" ? "0 !important" : undefined,
                overflowY: "scroll",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
            }}
          >
            {drawer}

            <FormControlLabel
              control={<ThemeSwitch />}
              sx={{
                mt: "auto",
                mb: "70px",
                display: "grid",
                placeItems: "center",
              }}
              onClick={() => {
                props.setDarkMode((prev) => {
                  localStorage.setItem("darkMode", !prev);
                  return !prev;
                });
              }}
            />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },

              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                background: `url("${
                  JSON.parse(localStorage.getItem("darkMode"))
                    ? darkSide
                    : lightSide
                }")`,
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                left: language === "en" ? "0 !important" : undefined,
                right: language === "ar" ? "0 !important" : undefined,
                //  i need to scroll without show the scroll bar
                overflowY: "scroll",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
            }}
            open
          >
            {drawer}
            <FormControlLabel
              control={<ThemeSwitch />}
              sx={{
                m: 0,
                mt: "auto",
                mb: "70px",
                display: "grid",
                placeItems: "center",
              }}
              onClick={() => {
                props.setDarkMode((prev) => {
                  localStorage.setItem("darkMode", !prev);
                  return !prev;
                });
              }}
            />
          </Drawer>
        </Box>
      </Box>
      <Box>
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: language === "en" ? { md: `${drawerWidth}px` } : null,
            mr: language === "ar" ? { md: `${drawerWidth}px` } : null,
            bgcolor: customColors.bg,
            color: "black",
            boxShadow: "none",
            direction: language === "en" ? "ltr" : "rtl",
            ".css-12i7wg6-MuiPaper-root-MuiDrawer-paper": {
              right: "0px",
            },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mx: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <NavbarContent />
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            ml: language === "en" ? { md: `${drawerWidth}px` } : null,
            mr: language === "ar" ? { md: `${drawerWidth}px` } : null,
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          {props.children}
        </Box>
      </Box>
    </Stack>
  );
}

export default ResponsiveDrawer;
