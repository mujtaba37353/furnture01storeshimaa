import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MetaCard from "../../Components/metaCard/MetaCard";
 import Loader from "../../Components/globals/Loader";
import { useTheme } from "@emotion/react";
import { useLazyGetAllMetaTagsQuery } from "../../api/meta.api";

const MetaTagsPage = () => {
  const [_, { language }] = useTranslation();
  const { customColors, colors } = useTheme();
  const [getAllMetaTags, { isLoading }] = useLazyGetAllMetaTagsQuery();
  const navigate = useNavigate();
  const [metaTags, setMetaTags] = useState({
    data: [],
    error: "",
  });
  useEffect(() => {
    getAllMetaTags()
      .unwrap()
      .then((res) => {
        setMetaTags({
          data: res.data,
          error: "",
        });
      })
      .catch((error) => {
        setMetaTags({
          data: [],
          error: error.data[`error_${language}`],
        });
      });
  }, []);

  return (
    <Box
      sx={{
        py: "40px",
        px: "20px",
        borderRadius: "1%",
      }}
    >
      <Box>
        <Typography variant="h4" mb={"10px"}>
          {language === "en" ? "Meta Tags" : "العلامات الوصفية"}
        </Typography>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack direction={"row"} alignItems={"center"} gap={"10px"}>
            <Typography
              variant="h6"
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {language === "en" ? "Home" : "الصفحة الرئيسية"}
            </Typography>
            <ArrowForwardIosIcon
              sx={{
                transform: language === "ar" ? "rotateY(180deg)" : 0,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: colors.main,
                fontSize: "16px",
              }}
            >
              {language === "en" ? "Meta tags" : "العلامات الوصفية"}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {isLoading ? (
        <Loader extraStyle={{ height: "30vh" }} />
      ) : !metaTags.data[0] && metaTags.error ? (
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "40vh",
          }}
        >
          <Typography sx={{
            color: customColors.dangerous,
          }} variant="h5">{metaTags.error}</Typography>
        </Stack>
      ) : (
        <Box py={8}>
          <Box bgcolor={customColors.bg} p={2}>
            <Grid container spacing={3}>
              {metaTags.data.map((item) => (
                <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={item.id}>
                  <MetaCard item={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MetaTagsPage;
