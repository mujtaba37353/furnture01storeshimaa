import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Categories from "../../Components/categories/Categories";
import CategoryModal from "../../Components/categories/CategoryModal";
import { useEffect, useState, useRef } from "react";
import useSearch from "../../hooks/useSearch";
import { useTheme } from "@emotion/react";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";

function CategoriesPage() {
  const {
    i18n: { language },
  } = useTranslation();
  const { role } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const { addArrayToSearch, removeArrayFromSearch } = useSearch();
  const [inputSearch, setInputSearch] = useState("");
  const { customColors } = useTheme();
  useEffect(() => {
    const id = setTimeout(() => {
      if (inputSearch) {
        addArrayToSearch([
          {
            key: "keyword[name_en]",
            value: inputSearch,
          },
          {
            key: "keyword[name_ar]",
            value: inputSearch,
          },
        ]);
      } else {
        removeArrayFromSearch(["keyword[name_en]", "keyword[name_ar]"]);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [inputSearch]);
  const handleClickOpen = () => {
    setOpen(true);
  };
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
      {language === "en" ? "Categories" : "الاقسام"}
    </Typography>,
  ];
  return (
    <>
      <CategoryModal open={open} setOpen={setOpen} />
      <Box sx={{ minHeight: "100vh", direction: "rtl" }}>
        <Box sx={{ py: "20px", px: "40px" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {language === "en" ? "Categories" : "الاقسام"}
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

        <Box sx={{ py: "40px", px: "20px" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent={"space-between"}
            px={2}
            gap={2}
          >
            <Stack
              direction={"row"}
              className="date-gradient"
              alignItems={"center"}
              sx={{
                borderRadius: "15px",
                height: "40px",
                width: { xs: "100%", md: "auto" },
                px: 2,
              }}
            >
              <SearchIcon sx={{ color: "black" }} />
              <TextField
                sx={{
                  width: "auto",
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent !important",
                    outline: "none !important",
                    backgroundColor: "transparent !important",
                  },
                  "& input::placeholder": {
                    color: "black",
                  },
                  color: "black",
                }}
                placeholder={language === "en" ? "Search" : "ابحث هنا"}
                name="search"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </Stack>
            {allowed({ page: "categories", role }) ? (
              <Button
                sx={{
                  backgroundColor: "#00e3d2 !important",
                  color: "white",
                  textTransform: "capitalize",
                  minWidth: "130px",
                }}
                onClick={handleClickOpen}
              >
                <Typography>
                  {language === "en" ? "Add Main Category" : "اضافة قسم رئيسي"}
                </Typography>
              </Button>
            ) : (
              <></>
            )}
          </Stack>

          <Box
            sx={{
              py: 4,
              px: { md: "20px", xs: 1 },
              m: "auto",
              maxWidth: { md: "100%", sm: "100%", xs: 320 },
              overflow: "hidden",
            }}
          >
            <Categories />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default CategoriesPage;
