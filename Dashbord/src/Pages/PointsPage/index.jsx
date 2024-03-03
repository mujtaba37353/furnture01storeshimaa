import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PointModal from "./pointmodal";
import { useTranslation } from "react-i18next";
import { useGetPointQuery } from "../../api/pointsMangement";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function PointsPage() {
  const { customColors } = useTheme();

  const [_, { language }] = useTranslation();
  const { data, isError, error, isLoading } = useGetPointQuery();
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState({});
  const [transformData, setTransformData] = useState({});
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
      {language === "en" ? "Points Mangement" : "ادره النقاط"}
    </Typography>,
  ];
  useEffect(() => {
    if (data) {
      setPoints(data);
      const transformingdata = {
        points: {
          title_en: "points",
          title_ar: "(المنتج)عدد النقاط لكل ريال سعودي ",
          value: data?.data?.noOfPointsInOneUnit,
        },
        totalPointConversionForOneUnit: {
          title_en: "total Point Conversion For One Unit",
          title_ar: " عدد النقاط مقابل الريال السعودي  ",
          value: data?.data?.totalPointConversionForOneUnit,
        },
        min: {
          title_en: "min",
          title_ar: "الحد الادني للنقاط",
          value: data?.data?.min,
        },
        max: {
          title_en: "max",
          title_ar: "الحد الاعلي للنقاط",
          value: data?.data?.max,
        },
        status: {
          title_en: "Status",
          title_ar: "الحالة",
          value: data?.data?.status,
        },
      };
      setTransformData(transformingdata);
    }
  }, [data]);
  const arabicStatus = {
    dynamic: "ديناميك",
    static: "يدوى",
  };
  console.log("check state f asas", transformData);
  return (
    <>
      {error?.status === "FETCH_ERROR" ? (
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "20px", sm: "25px", lg: "30px" },
            color: "red",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {error?.error}
        </Typography>
      ) : isLoading ? (
        <div className="loader"></div>
      ) : (
        <div>
          <Box sx={{ py: "20px", px: "40px" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {language === "en" ? "Points Mangement" : "اداره النقاط"}
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
          <Box>
            {data &&
              !error &&
              Object.keys(transformData).map((key) => {
                return (
                  <Grid
                    container
                    sx={{
                      padding: "20px",
                      background: customColors.bg,
                      display: "flex",
                      justifyContent: " space-between",
                      alignItems: "center",
                      width: { sx: "100%", md: " 70%" },
                      margin: "10px auto",
                      borderRadius: "10px",
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    }}
                  >
                    <Grid
                      item
                      xs={10}
                      sx={{
                        textTransform: "capitalize",
                      }}
                    >
                      {transformData[key][`title_${language}`]}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "end" }}>
                      {key !== "status"
                        ? transformData[key]["value"]
                        : language === "en"
                        ? transformData[key]["value"]
                        : arabicStatus[transformData[key]["value"]]}
                    </Grid>
                  </Grid>
                );
              })}
          </Box>
          <Button
            sx={{
              margin: "15px auto ",
              width: "220px  ",
              display: "flex",
              background: customColors.main,
              color: "#fff",
              height: "39px",
              textTransform: "capitalize",
              transition: "0.5s all ease-in-out ",
              "&:hover": {
                background: "linear-gradient(45deg, #484b479e, #47745c)",
              },
            }}
            onClick={() => setOpen(!open)}
          >
            {points && !isError ? (
              <>{language === "en" ? "Edit" : "تعديل"}</>
            ) : (
              <>{language === "en" ? " Add Points +" : "اضافه"}</>
            )}
          </Button>
          <PointModal
            point={!isError && points}
            open={open}
            setOpen={setOpen}
          />
        </div>
      )}
    </>
  );
}
