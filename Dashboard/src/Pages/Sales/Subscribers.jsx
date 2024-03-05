import {
  Box,
  Stack,
  Table,
  TableCell,
  TableContainer,
  Button,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableBody,
  TextField,
  CircularProgress,
  Container,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  useGetAllSubscribersWithFiltrationQuery,
  useDeleteSubscriberByIdMutation
} from "../../api/subscriber.api";
import { toast } from "react-toastify";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
const Subscribers = () => {
  const {
    data: subscribers,
    isSuccess,
    isError,
    isLoading,
    error,
  } = useGetAllSubscribersWithFiltrationQuery("limit=10000");
  const { role } = useSelector((state) => state.user);
  const [deleteSubscriberById] = useDeleteSubscriberByIdMutation();
  const { customColors, colors, palette } = useTheme();
  const [subscribersData, setSubscribersData] = useState([]);
  useEffect(() => {
    if (isSuccess) {
      setSubscribersData(subscribers.data);
    }
  }, [subscribers]);

  // table

  const [, { language: lang }] = useTranslation();


  // delete subscriber
  const handleDelete = (subscriber) => {
    deleteSubscriberById(subscriber._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lang}`]);
      })
      .catch((err) => {
        toast.error(err.data[`error_${lang}`]);
      });
  };

  // search function
  const handleSearch = (value) => {
    if (value === "") {
      setSubscribersData(subscribers?.data);
    }
    const newData = subscribers?.data.filter((item) => {
      return (
        (item.email && item.email.toLowerCase().includes(value.toLowerCase()))
      );
    });
    setSubscribersData(newData);
  };

  return (
    <Box
      sx={{
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
      {!isLoading && !isError && (
        <>
          <Container>
            <Breadcrumbs page_en={"Subscribers"} page_ar={"المشتركين"} />
          </Container>

          {/* search  */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent={"space-between"}
            px={2}
            gap={2}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              px={2}
              sx={{
                background:
                  " linear-gradient(90deg,rgba(207, 249, 170, 1) 0%,rgba(117, 219, 209, 1) 100%)",
                borderRadius: "15px",
                height: "40px",
                mr: lang === "ar" ? { xs: "0", md: "20px" } : undefined,
                ml: lang === "en" ? { xs: "0", md: "20px" } : undefined,
                width: { xs: "50%", md: "auto" },
              }}
            >
              <SearchIcon />
              <TextField
                sx={{
                  width: "auto",
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent !important",
                    outline: "none !important",
                    backgroundColor: "transparent !important",
                  },
                }}
                placeholder={lang === "en" ? "Search" : "ابحث هنا"}
                name="search"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Stack>
          </Stack>
        </>
      )}

      {isError && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "50%",
            left: lang === "en" ? "50%" : "40%",
            transform:
              lang === "en" ? "translate(-30%, -50%)" : "translate(-50%, -50%)",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "20px", sm: "25px", lg: "30px" },
              color: colors.dangerous,
            }}
          >
            {error?.data[`error_${lang}`]}
          </Typography>
        </Box>
      )}
      {!isError && isSuccess && (
        <>
          <Box
            sx={{
              display: "flex",

              flexDirection: "column",
            }}
          >
            {/* table */}
            {subscribersData?.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                  
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                    color: colors.dangerous,
                  }}
                >
                  {lang === "en" ? "No Data" : "لا يوجد بيانات"}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  maxWidth: { md: "100%", sm: "100%", xs: 340 },
                  mx: { xs: "auto", sm: "initial" },
                  overflowX: "hidden",
                }}
              >
                <Box
                  sx={{ width: { xs: "100%", md: "95%" }, mx: "auto" }}
                  mt={2}
                >
                  {/* head */}
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            bgcolor: customColors.secondary,
                            borderRadius: "10px",
                            boxShadow:
                              palette.mode === "dark"
                                ? "none"
                                : "0px 0px 15px 0px #c6d5d3",
                            "&:last-child td, &:last-child th": {
                              textAlign: "center",
                            },
                          }}
                        >
                          <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              #
                            </Typography>
                          </TableCell>

                          {/* <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              {lang === "en" ? "Name" : "الاسم"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              {lang === "en" ? "Phone" : "رقم الجوال"}
                            </Typography>
                          </TableCell> */}

                          <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              {lang === "en" ? "Email" : "البريد الالكتروني"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              {lang === "en" ? "Join Date" : "تاريخ الانضمام"}
                            </Typography>
                          </TableCell>

                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {subscribersData?.map((item, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              bgcolor: customColors.bg,
                            }}
                          >
                            <TableCell align="center">{index + 1}</TableCell>

                            <TableCell align="center">
                              {item.email
                                ? item.email
                                : lang === "en"
                                ? "No Email"
                                : "لا يوجد بريد الكتروني"}
                            </TableCell>
                            <TableCell align="center">
                              {new Date(item.updatedAt).toLocaleDateString(
                                lang === "ar" ? "ar-EG" : "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </TableCell>

                            <TableCell
                              sx={{
                                color: "gray",
                              }}
                            >
                              {allowed({ page: "users", role }) ? (
                                <Button
                                  size="small"
                                  onClick={() => {
                                    handleDelete(item);
                                  }}
                                  sx={{
                                    backgroundColor: "transparent !important",
                                    // width: { xs: "100%", sm: "80%", xl: "65%" },
                                    // p: "9px 20px",
                                    color: colors.dangerous,
                                    fontWeight: "bold",
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              ) : (
                                <></>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            )}
{/* 
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: { xs: "96%", sm: "50%" },

                  boxShadow: 24,
                  p: 4,
                  borderRadius: "10px",
                }}
              >
              </Box>
            </Modal> */}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Subscribers;
