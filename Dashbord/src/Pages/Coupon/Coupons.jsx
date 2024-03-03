import { useTheme } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useGetAllCouponsQuery } from "../../api/coupon.api";
import { allowed } from "../../helper/roles";
import CouponCard from "./CouponCard";
import CouponModel from "./CouponModal";

const OrderLoading = () => {
  const { customColors } = useTheme();
  return (
    <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
      <CircularProgress sx={{ color: customColors.main }} />
    </Box>
  );
};


function Coupons() {
  const { role } = useSelector((state) => state.user);
  const { data, isLoading, isSuccess ,isError } = useGetAllCouponsQuery("?sort=-active&&type=normal");
  const [dataCoupon, setDataCoupon] = useState();
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const [open, setOpen] = useState(false);



  if (isLoading) return <OrderLoading />;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setOpen(true);
    setDataCoupon(coupon);
  };

  return (
   <> {
   
    <>
    <CouponModel
      open={open}
      setOpen={setOpen}
      dataCoupon={dataCoupon}
      setDataCoupon={setDataCoupon}
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

        {
          isSuccess ? (
            data?.data?.length ? (
              data?.data.map((coupon, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                  <CouponCard
                    coupon={coupon}
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
                    {language === "en" ? "No Coupons" : "لا يوجد كوبونات"}
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
                  {language === "en" ? "No Coupons" : "لا يوجد كوبونات"}
                </Typography>
              </Paper>
            </Grid>
          )
        }

        {allowed({ page: "coupons", role }) ? (
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
    
  } </>
   
  );
}

export default Coupons;
