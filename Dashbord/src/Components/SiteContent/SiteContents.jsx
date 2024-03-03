// سلايدر - معلومات عننا - سياسة الاستخدام - سياسة الخصوصية - سياسة الاسترجاع - سياسات عامة - بانر

import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import SiteContentCard from "./SiteContentCard";
import { useGetAllSectionsQuery } from "../../api/section.api";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";

export const SITE_CONTENTS = [
  { id: 1, title_en: "Slider", title_ar: "سلايدر", type: "slider" },
  { id: 2, title_en: "About Us", title_ar: "معلومات عننا", type: "aboutus" },
  {
    id: 3,
    title_en: "Terms of Use",
    title_ar: "سياسة الاستخدام",
    type: "usage",
  },
  {
    id: 4,
    title_en: "Privacy Policy",
    title_ar: "سياسة الخصوصية",
    type: "privacy",
  },
  {
    id: 5,
    title_en: "Return Policy",
    title_ar: "سياسة الاسترجاع",
    type: "retrieval",
  },
  {
    id: 6,
    title_en: "General Policies",
    title_ar: "سياسات عامة",
    type: "public",
  },
  { id: 7, title_en: "Banner", title_ar: "بانر", type: "banner" },
];

const Loading = () => {
  const { customColors } = useTheme();

  return (
    <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
      <CircularProgress sx={{ color: customColors.main }} />
    </Box>
  );
};

function SiteContents() {
  const { data, isLoading, isSuccess, isError, error } =
    useGetAllSectionsQuery("?limit=100");
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  if (isLoading) {
    return <Loading />;
  }

  if (isSuccess) {
    return (
      <Grid container spacing={4}>
        {data?.data?.map((content) => (
          <Grid key={content._id} item xs={12} sm={12} md={6} lg={4} xl={3}>
            <SiteContentCard {...content} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (isError) {
    return (
      <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
        {isError && (
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "20px", sm: "25px", lg: "30px" },
              color: "red",
            }}
          >
            {error?.status !== "FETCH_ERROR" ? (
              <> {error?.data[`error_${language}`]} </>
            ) : (
              <>{error?.error}</>
            )}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
}

export default SiteContents;
