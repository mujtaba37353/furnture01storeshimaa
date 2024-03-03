import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import React from "react";
import { SITE_CONTENTS } from "./SiteContents";
import { useTranslation } from "react-i18next";
import { imageBaseUrl } from "../../api/baseUrl";

const SectionText = ({ title, text, colored }) => {
  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h5">{title}</Typography>
      <Typography
        variant="h6"
        sx={{
          color: !colored ? "#00D5C5" : "",
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </Box>
  );
};

function ShowPolicies({ data }) {
  const { customColors } = useTheme();
  const {
    alignment,
    description_ar,
    description_en,
    image,
    title_ar,
    title_en,
    type,
  } = data;
  const {
    i18n: { language },
  } = useTranslation();
  if (!data) return <div>invalid data</div>;
  return (
    <Paper sx={{ p: 2, gap: 5, bgcolor: customColors.bg }}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={image ? 6 : 12}>
          <SectionText
            title={language === "en" ? "Section Type" : "نوع القسم"}
            text={
              SITE_CONTENTS.find((item) => item.type === type)[
                `title_${language}`
              ]
            }
          />
          <SectionText
            title={language === "en" ? "Title" : "العنوان"}
            text={language === "en" ? title_en : title_ar}
          />
          <SectionText
            colored
            title={language === "en" ? "Description" : "الوصف"}
            text={language === "en" ? description_en : description_ar}
          />
        </Grid>
        {image && (
          <Grid item xs={12} lg={6}>
            <Box
              component={"img"}
              src={`${imageBaseUrl}${image}`}
              sx={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default ShowPolicies;
