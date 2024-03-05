Admins;
import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import AdminCard from "./AdminCard";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import AdminModal from "./AdminModal";
import { useGetAllAdminQuery } from "../../api/user.api";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";
import { allowed } from "../../helper/roles";

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
        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                            color: 'red',
                          }}
                        >
                          {
                            error?.status!=="FETCH_ERROR"?
                                                <>    {error?.data[`error_${lang}`]}  </>

                            :<>
                             {error?.error} 
                            </>
                           }
                        </Typography>
    </Box>
  );
};

function Admins() {
  const { role } = useSelector((state) => state.user);
  const { data, isLoading, isError, isSuccess, error } = useGetAllAdminQuery();
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

  return (
    <>
      <AdminModal open={open} setOpen={setOpen} />
      <Box
        sx={{
          bgcolor: customColors.bg,
          px: "20px",
          borderRadius: "1%",
        }}
      >
        <Grid container spacing={3} py = {2} >
          {isSuccess ? (
            data.data.length ? (
              data.data.map((admin, index) => (
                <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={index}>
                  <AdminCard data={admin} />
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
                    {language === "en" ? "No Admins" : "لا يوجد مسؤولين"}
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
                  {language === "en" ? "No Admins" : "لا يوجد مسؤولين"}
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
  );
}

export default Admins;
