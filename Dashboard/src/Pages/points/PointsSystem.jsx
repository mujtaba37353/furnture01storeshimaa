import {
  Box,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableBody,
  useTheme,
  TextField,
} from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";

import { useTranslation } from "react-i18next";

import Breadcrumbs from "../../Components/Breadcrumbs";

import { ORDER_STATUS } from "../../helper/order-status";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import PointViewModel from "./PointviewModel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";

const PointsSystem = () => {
  const { role } = useSelector((state) => state.user);
  const { colors, customColors } = useTheme();
  const [pointsData, setPointsData] = useState([]);
  const [, { language: lang }] = useTranslation();
  const { getAllThePoints, handleAcceptRequest, handleRejectRequest } =
    PointViewModel();
  const navigate = useNavigate();
  const { pointsLoading, pointsError, points, poinstsSuccess } =
    getAllThePoints();

  useEffect(() => {
    if (poinstsSuccess) {
      setPointsData(points?.data);
    }
  }, [poinstsSuccess]);
  // search function
  const handleSearch = (value) => {
    if (value === "") {
      setPointsData(points?.data);
    }
    const newData = points?.data?.filter((item) => {
      return item.name && item.name.toLowerCase().includes(value.toLowerCase());
    });
    setPointsData(newData);
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
      {pointsLoading && (
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
      {pointsError && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "50%",
            left: lang === "en" ? "55%" : "40%",
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
            {lang === "en" ? "Not Found" : "لا يوجد بيانات"}
          </Typography>
        </Box>
      )}

      <Breadcrumbs page_en={"points"} page_ar={"نظام النقاط"} />
      {!pointsError && poinstsSuccess && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* search  */}
            <Stack px={2} gap={2}>
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
                  width: { xs: "50%", md: "30%" },
                }}
              >
                <SearchIcon />
                <TextField
                  sx={{
                    width: "auto",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
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
              <Box
                sx={{
                  mr: lang === "ar" ? { xs: "0", md: "20px" } : undefined,
                  ml: lang === "en" ? { xs: "0", md: "20px" } : undefined,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "18px", sm: "20px", lg: "25px" },
                  }}
                >
                  {lang === "en" ? "Points system" : "نظام النقاط"}
                </Typography>
              </Box>
            </Stack>

            {/* table */}
            {pointsData?.length === 0 ? (
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
                  maxWidth: { md: "100%", sm: "100%", xs: "90%" },
                  mx: { xs: "auto", sm: "initial" },
                  overflow: "hidden",
                }}
              >
                <Box sx={{ width: "97%", mx: "auto" }} mt={2}>
                  {/* head */}
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            bgcolor: customColors.secondary,
                            borderRadius: "10px",
                            boxShadow: "0px 0px 10px 0px #c6d5d3",

                            "&:last-child td, &:last-child th": {
                              border: 0,
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

                          <TableCell>
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
                              {lang === "en" ? "points" : "عدد النقاط"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              {lang === "en" ? "value" : "قيمة"}
                            </Typography>
                          </TableCell>

                          {/* <TableCell>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 'bold',
                                textAlign: 'center'
                              }}
                            >
                              {lang === 'en' ? 'Statue' : ' الحالة'}
                            </Typography>
                          </TableCell> */}

                          <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                              }}
                            >
                              {lang === "en" ? " Date" : "التاريخ "}
                            </Typography>
                          </TableCell>

                          {allowed({ page: "points", role }) ? (
                            <TableCell>
                              {" "}
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: "bold",
                                }}
                              >
                                {lang === "en" ? " Actions" : "معاملات "}
                              </Typography>
                            </TableCell>
                          ) : (
                            <> </>
                          )}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {pointsData?.map((item, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              bgcolor: customColors.bg,
                              borderRadius: "10px",
                            }}
                          >
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell
                              onClick={() => {
                                navigate(`/orders/${item._id}`);
                              }}
                              sx={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              align="center"
                            >
                              {item.name}
                            </TableCell>
                            <TableCell align="center">{item?.points}</TableCell>

                            <TableCell align="center">
                              {lang === "en"
                                ? `${item.pointsValue} SAR`
                                : `${item.pointsValue}ر.س`}
                            </TableCell>
                            {/* 
                            <TableCell align='center'>
                              <Typography
                                sx={{
                                  backgroundColor:
                                    item.status === 'initiated' ||
                                    item.status === 'onGoing' ||
                                    item.status === 'on going'
                                      ? '#f6eadf !important'
                                      : item.status === 'created' ||
                                        item.status === 'completed'
                                      ? '#d4f2ef !important'
                                      : '#f4d8e4 !important',
                                  p: '3px 10px',
                                  width: 'fit-content',
                                  mx: 'auto',
                                  color:
                                    item.status === 'initiated' ||
                                    item.status === 'onGoing' ||
                                    item.status === 'on going'
                                      ? '#f7ce70'
                                      : item.status === 'created' ||
                                        item.status === 'completed'
                                      ? '#a5d5d6'
                                      : '#e399b9',
                                  fontWeight: 'bold',
                                  borderRadius: '25px',
                                  textAlign: 'center',
                                  fontSize: {
                                    xs: '12px',
                                    sm: '14px',
                                    lg: '16px'
                                  }
                                }}
                              >
                                {ORDER_STATUS[item?.status][lang]}
                              </Typography>
                            </TableCell> */}

                            <TableCell align="center">
                              {item?.createdAt.slice(0, 10)}
                            </TableCell>

                            {allowed({ page: "points", role }) ? (
                              <TableCell align="center" sx={{}}>
                                <CloseIcon
                                  sx={{
                                    color: "red",
                                    fontSize: "30px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleRejectRequest(item?._id)}
                                />
                                {
                                  <CheckIcon
                                    sx={{
                                      color: "green",
                                      fontSize: "30px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleAcceptRequest(item?._id)
                                    }
                                  />
                                }
                              </TableCell>
                            ) : (
                              <></>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default PointsSystem;
