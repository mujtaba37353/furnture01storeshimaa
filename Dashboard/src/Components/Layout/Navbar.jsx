import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Avatar, Button, Menu, MenuItem, Stack } from "@mui/material";
import { useState } from "react";

export default function Navbar() {
  const [toggleProfile, seToggleProfile] = useState(null);
  const profileOpen = Boolean(toggleProfile);
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

  return (
    <Box sx={{ flexGrow: 1 ,}}>
      <AppBar position="static">
        <Toolbar>
          <Stack
            direction={"row"}
            sx={{ gap: 2, alignItems: "center", flexGrow: 1 }}
          >
            <>
              <Avatar
                sx={{ cursor: "pointer" }}
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
                <MenuItem onClick={closeProfile}>Profile</MenuItem>
                <MenuItem onClick={closeProfile}>Logout</MenuItem>
              </Menu>
            </>
            <>
              <Button
                sx={{ color: "black" }}
                id="basic-button"
                aria-controls={lngOpen ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={lngOpen ? "true" : undefined}
                onClick={openLng}
                startIcon={<ArrowDropDownIcon />}
              >
                eng
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
            >
              <MenuItem onClick={closeLng}>ar</MenuItem>
            </Menu>
          </Stack>
          <Typography variant="h6" component="div">
            welcome
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
