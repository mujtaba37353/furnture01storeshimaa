import { useTheme } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useGetAllMarketersQuery } from "../../api/marketer.api";
import { allowed } from "../../helper/roles";
import MarketerCard from "./MarketerCard";
import MarketerModal from "./MarketerModal";

const OrderLoading = () => {
  const { customColors } = useTheme();
  return (
    <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
      <CircularProgress sx={{ color: customColors.main }} />
    </Box>
  );
};

const OrderError = ({ error }) => {
  const { colors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  return (
    <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
      <Typography variant={"h5"} color={colors.dangerous}>
   <>
   {   error?.status!=="FETCH_ERROR"? <>
      {language === "en" ? error?.data[`error_en`] : error?.data[`error_ar`]||'there is an server error'}
      </>:
      <>{error?.error} </>}
   </>
      </Typography>
    </Box>
  );
};

function Marketers() {
  const { role } = useSelector((state) => state.user);
  const { data, isLoading, isError, isSuccess, error } = useGetAllMarketersQuery("?type=marketing");
  const [dataMarketer, setDataMarketer] = useState();
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const [open, setOpen] = useState(false);



  if (isLoading) return <OrderLoading />;
  if (isError) return <OrderError error={error} />;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpenEdit = (marketer) => {
    setOpen(true);
    setDataMarketer(marketer);
  };

  return (

   <> {
    !isLoading&&!isError?
    <>
    <MarketerModal
      open={open}
      setOpen={setOpen}
      dataMarketer={dataMarketer}
      setDataMarketer={setDataMarketer}
    />
    <Box
      sx={{
        bgcolor: customColors.bg,
        px: "20px",
        py: "20px",
        borderRadius: "1%",
      }}
    >
      <Grid container spacing={3}>
        {isSuccess ? (
          data?.data?.marketers?.length ? (
              data?.data.marketers.map((marketer, index) => (
                <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={index}>
                  <MarketerCard
                    marketer={marketer}
                    handleOpenEdit={handleOpenEdit}
                  />
                </Grid>
              ))
          ) : (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Paper
                elevation={1}
                sx={{
                  bgcolor: customColors.card,
                  p: 2,
                  borderRadius: 5,
                  gap: 5,
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  minHeight: "236px",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography
                  variant={"h5"}
                  color={customColors.dangerous}
                  sx={{ textAlign: "center", width: "100%" }}
                >
                  {language === "en" ? "No Marketers" : "لا  يوجد مسوقين"}
                </Typography>
              </Paper>
            </Grid>
          )
        ) : (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Paper
              elevation={1}
              sx={{
                bgcolor: customColors.card,
                p: 2,
                borderRadius: 5,
                gap: 5,
                display: "flex",
                flexDirection: "row",
                width: "100%",
                minHeight: "236px",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                variant={"h5"}
                color={customColors.dangerous}
                sx={{ textAlign: "center", width: "100%" }}
              >
                {language === "en" ? "No Marketers" : "لا يوجد مسوقين"}
              </Typography>
            </Paper>
          </Grid>
        )}

        {allowed({ page: "admins", role }) ? (
          <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
            <Paper
              elevation={1}
              sx={{
                bgcolor: customColors.cardAddAdmin,
                p: 2,
                borderRadius: 5,
                gap: 5,
                display: "flex",
                flexDirection: "row",
                width: "100%",
                minHeight: "236px",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
                border: "2px dashed #00e3d2",
                cursor: "pointer",
              }}
              onClick={handleClickOpen}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddIcon
                  sx={{
                    color: "#00e3d2",
                    width: "35px",
                    height: "35px",
                    fontWeight: "bold",
                  }}
                />
                <Typography sx={{ color: "#00e3d2" }}>
                  {language === "en" ? "Adding" : "اضافة"}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ) : (
          <> </>
        )}
      </Grid>
    </Box>
  </>
    
    :<></>
  }</>
 
  );
}

export default Marketers;
