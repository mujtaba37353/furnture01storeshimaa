import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SupportForm from "./SupportForm";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  useGetAllContactMessagesQuery,
  useToggleMessageOpendMutation,
  useDeleteContactMessageByIdMutation,
} from "../../api/contact.api";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const TechnicalSupport = () => {
  const { role } = useSelector((state) => state.user);
  const { customColors, colors, palette } = useTheme();
  const { data, isError, isLoading, error } =
    useGetAllContactMessagesQuery("?limit=1000");

  const [toggleMessage, { isLoading: ToggleMessageLoading }] =
    useToggleMessageOpendMutation();
  const [deleteMessage, { isLoading: deleteMessageLoading }] =
    useDeleteContactMessageByIdMutation();
  const [technicalMessages, setTechnicalMessages] = useState([]); // [
  const [display, setDisplay] = useState("flex");
  const [dataItem, setDataItem] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [_, { language: lang }] = useTranslation();
  const handleMessage = (item) => {
    toggleMessage(item._id);
    setDisplay("none");
    setDataItem(item);
  };

  const handleDeleteMessage = (item) => {
    deleteMessage(item._id)
      .unwrap()
      .then((res) => {
        toast.success(
          lang === "en" ? "Deleted Successfully" : "تم الحذف بنجاح"
        );
      })
      .catch((error) => {
        const message =
          lang === "en" ? error?.data?.error_en : error?.data?.error_ar;
        toast.error(message);
      });
  };

  useEffect(() => {
    if (!isError) {
      setTechnicalMessages(
        data?.data.filter((item) => item.contactType === "customerService")
      );
    }
  }, [data?.data]);

  return (
    <Box
      sx={{
        direction: lang === "en" ? "ltr" : "rtl",
        p: { xs: 0, sm: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minHeight: "100vh",
      }}
    >
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "50%",
            left: lang === "en" ? "55%" : "40%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress
            sx={{
              color: "#00e3d2",
            }}
          />
        </Box>
      )}

      {!isLoading && (
        <>
          
            <Breadcrumbs page_en={"Technical Support"} page_ar={"دعم فني"} />
          
        {!isError && technicalMessages?.length === 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: lang == "en" ? "60%" : "40%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            sx={{
              color: colors.dangerous,
              fontWeight: "bold",
              fontSize: { xs: "20px", sm: "25px", lg: "30px" },
            }}
          >
            {lang === "en" ? "No Messages" : "لا يوجد رسائل"}
          </Typography>
        </Box>
      )}
          {isError ? (
            <Box
              sx={{
                display: "flex",
                position: "absolute",
                top: "50%",
                left: lang === "en" ? "50%" : "40%",
                transform:
                  lang === "en"
                    ? "translate(-30%, -50%)"
                    : "translate(-50%, -50%)",
              }}
            >
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
          ):(

          <Box
            sx={{
              width: { xs: "90%", md: "97%" },
              mx: "auto",
            }}
          >
            <Grid
              container
              spacing={2}
              sx={{
                display: display,
                pb: 2,
                // justifyContent: "center",
                // alignItems: "center",
                // flexWrap: "wrap",
              }}
            >
              {technicalMessages?.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  xl={3}
                  key={index}
                  sx={{
                    direction: lang === "en" ? "ltr" : "rtl",
                  }}
                >
                  <Card
                    sx={{
                      p: 1,
                      bgcolor: customColors.card,
                      minHeight: "210px",
                      position: "relative",
                    }}
                  >
                    <CardContent>
                      <Typography
                        sx={{
                          fontSize: { xs: "18px", lg: "20px" },
                          fontWeight: "bold",
                        }}
                        gutterBottom
                      >
                        {item.name}
                      </Typography>
                      {/* email */}
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          color={"gray"}
                          sx={{
                            fontWeight: "bold",
                            fontSize: "17px",
                          }}
                        >
                          {lang === "en" ? "Email:" : "البريد : "}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: "15px",
                          }}
                        >
                          {item.email}
                        </Typography>
                      </Stack>

                      {/* phone */}
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          color={"gray"}
                          sx={{
                            fontWeight: "bold",
                            fontSize: "17px",
                          }}
                        >
                          {lang === "en" ? "Phone:" : " رقم الجوال: "}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          sx={{
                            fontSize: "15px",
                          }}
                        >
                          {item.phone}
                        </Typography>
                      </Stack>
                    </CardContent>

                    <CardActions
                      sx={{
                        direction: lang === "en" ? "rtl" : "ltr",
                        width: "100%",
                        position: "absolute",
                        bottom: 6,
                      }}
                    >
                      {allowed({ page: "technicalSupport", role }) ? (
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: "#e35959 !important",
                              textTransform: "capitalize",
                              color: "white",
                            }}
                            disabled={deleteMessageLoading}
                            onClick={() => {
                              handleDeleteMessage(item);
                            }}
                          >
                            {lang === "en" ? "Delete" : "حذف"}
                          </Button>
                          <Button
                            disabled={ToggleMessageLoading}
                            size="small"
                            onClick={() => {
                              handleMessage(item);
                            }}
                            variant="contained"
                            sx={{
                              backgroundColor:
                                item.isOpened === false
                                  ? "#00e3d2 !important"
                                  : "#019185 !important",
                              width: {
                                xs: "35%",
                                sm: "25%",
                                md: "45%",
                                lg: "45%",
                              },
                              p: "9px 10px",
                              color: "white",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                              fontSize: { xs: "10px", lg: "12px" },
                            }}
                          >
                            {item.isOpened
                              ? lang === "en"
                                ? "Opend Message"
                                : "تمت قرائتها"
                              : lang === "en"
                              ? "Open message"
                              : "افتح الرسالة"}
                          </Button>
                        </Box>
                      ) : (
                        <></>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box
              width={{ xs: "100%", md: "96%" }}
              mx="auto"
              bgcolor={customColors.bg}
              minHeight={"80vh"}
              sx={{
                display: display === "none" ? "flex" : "none",
                justifyContent: "center",
                borderRadius: "5px",
              }}
            >
              <SupportForm data={dataItem} setDisplay={setDisplay} />
            </Box>
          </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default TechnicalSupport;
