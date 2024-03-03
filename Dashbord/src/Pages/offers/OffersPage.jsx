import { useTheme } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/globals/Loader";
import OfferCard from "../../Components/offerCard/OfferCard";
import { useGetAllOffersQuery } from "../../api/offers.api";
import { allowed } from "../../helper/roles";
import OfferModal from "./OfferModal";

const OffersPage = () => {
  const navigate = useNavigate();
  const [_, { language }] = useTranslation();
  const { role } = useSelector((state) => state.user);
  const { customColors, colors } = useTheme();
  const {
    data: offersData,
    error: offersError,
    isLoading: offersIsLoading,
  } = useGetAllOffersQuery();
  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState();


  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    setOpen(true);
  };
  return (
    <>
      <OfferModal
        open={open}
        setOpen={setOpen}
        selectedOffer={selectedOffer}
        setSelectedOffer={setSelectedOffer}
      />
      <Box
        sx={{
          px: "20px",
          py: "20px",
        }}
      >
        <Box py={3}>
          <Typography variant="h4" mb={"10px"}>
            {language === "en" ? "Offers" : "العروض"}
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
                {language === "en" ? "Offers" : "العروض"}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        {offersIsLoading ? (
          <Loader extraStyle={{ height: "30vh" }} />
        ) : !offersData && offersError ? (
          <>
            {allowed({ page: "offers", role }) ? (
              <Grid container>
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
                    onClick={() => setOpen(true)}
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
              </Grid>
            ) : undefined}
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: "20vh",
              }}
            >
                 <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                            color: colors.dangerous,
                          }}
                        >
                          {
                            offersError?.status!=="FETCH_ERROR"?

                                                <>                   {offersError?.data[`error_${language}`]}
                                                </>

                            :<>
                             {offersError?.error} 
                            </>
                           }
                        </Typography>
            
            </Stack>
          </>
        ) : (
          <Box
            sx={{
              bgcolor: customColors.bg,
              py: "20px",
              px: "20px",
              borderRadius: "1%",
            }}
          >
            <Grid container spacing={3}>
              {offersData && !offersError
                ? offersData?.data?.map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={4}
                      xl={3}
                      key={item._id}
                    >
                      <OfferCard
                        item={item}
                        handleSelectOffer={handleSelectOffer}
                      />
                    </Grid>
                  ))
                : undefined}

              {allowed({ page: "offers", role }) ? (
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
                    onClick={() => setOpen(true)}
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
              ) : undefined}
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
};

export default OffersPage;
