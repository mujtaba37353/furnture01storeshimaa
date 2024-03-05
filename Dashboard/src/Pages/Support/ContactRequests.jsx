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
  Menu,
  MenuItem,
  CircularProgress,
  Container,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SupportForm from "./SupportForm";
import SearchIcon from "@mui/icons-material/Search";
import {
  useGetAllContactMessagesQuery,
  useToggleMessageOpendMutation,
  useDeleteContactMessageByIdMutation,
} from "../../api/contact.api";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useSelector } from "react-redux";
import { allowed } from "../../helper/roles";
import { toast } from "react-toastify";

const ContactRequests = () => {
  const [paramType, setParamType] = useState("");
  const [toggleMessage] = useToggleMessageOpendMutation();
  const [deleteMessage] = useDeleteContactMessageByIdMutation();
  const { role } = useSelector((state) => state.user);
  const { data, isError, isSuccess, isLoading, error } =
    useGetAllContactMessagesQuery("?limit=1000");
  const { customColors, colors, palette } = useTheme();
  // table
  const [connectData, setConnectData] = useState([]);
  const [_, { language: lang }] = useTranslation();
  const [display, setDisplay] = useState("flex");
  const [menuWidth, setMenuWidth] = useState(null);

  const [dataItemMessage, setDataItemMessage] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
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
    if (isSuccess) {
      setConnectData(
        data?.data.filter((item) => item.contactType !== "customerService")
      );
    }
  }, [data?.data]);

  // filter menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuWidth(event.currentTarget.clientWidth);
  };
  const handleClose = (value) => {
    if (value === "All") {
      setConnectData(
        data?.data.filter((item) => item.contactType !== "customerService")
      );
    } else {
      setConnectData(data?.data.filter((item) => item.contactType === value));
    }
    setParamType(value);
    setAnchorEl(null);
  };

  const handleMessage = (item) => {
    toggleMessage(item._id);
    setDisplay("none");
    setDataItemMessage(item);
  };

  // search function
  const handleSearch = (value) => {
    if (value === "") {
      setConnectData(
        data?.data.filter((item) => item.contactType !== "customerService")
      );
    } else {
      const result = data?.data.filter((item) => {
        return (
          (item.name &&
            item.name.toLowerCase().includes(value.toLowerCase())) ||
          (item.email &&
            item.email.toLowerCase().includes(value.toLowerCase())) ||
          (item.phone && item.phone.includes(value))
        );
      });

      setConnectData(result);
    }
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

    
        <Breadcrumbs page_en={"Contact Requests"} page_ar={"طلبات التواصل"} />
     
      {!isLoading && (
        <>
          <Box
            sx={{
              display: display,

              flexDirection: "column",
            }}
          >
            {/* search and filter */}
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

                <Box>
                  <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    sx={{
                      backgroundColor: "#00e3d2 !important",
                      color: "white",
                      ml: lang === "ar" ? "20px" : undefined,
                      mr: lang === "en" ? "20px" : undefined,
                      textTransform: "capitalize",
                      p: "9px 35px",
                    }}
                  >
                    <FilterAltIcon />
                    <Typography>
                      {lang === "en" ? "Filter" : "فلتر حسب"}
                    </Typography>
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    sx={{
                      "& .MuiMenu-paper": {
                        width: menuWidth || "auto",
                      },
                    }}
                  >
                    <MenuItem onClick={() => handleClose("complaints")}>
                      {lang === "en" ? "Complaints" : "الشكاوي"}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("suggestions")}>
                      {lang == "en" ? "Suggestions" : "المقترحات"}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("All")}>
                      {lang == "en" ? "All" : "الجميع"}
                    </MenuItem>
                  </Menu>
                </Box>
              </Stack>
        

            {/* table */}

            <Box
              sx={{
                maxWidth: { md: "100%", sm: "100%", xs: 360 },
                mx: { xs: "auto", sm: "initial" },
          
              


              }}
            >
              <Box sx={{ width: "95%", mx: "auto" }} mt={2}>
                {/* head */}
                <TableContainer component={Paper} >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: customColors.secondary,
                          borderRadius: "10px",

                          "&:last-child td, &:last-child th": {
                            border: 0,
                            textAlign: "center",
                          },
                        }}
                      >
                        <TableCell>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                            }}
                          >
                           {paramType === "complaints"
                              ? lang === "en"
                                ? "Complain number"
                                : "رقم الشكوى":paramType === "suggestions"?
                               lang === "en"
                              ? "Suggestion number"
                              : "رقم المقترح":lang === "en"? "Number":"الرقم"}
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
                            {lang === "en" ? "Phone" : "رقم الجوال"}
                          </Typography>
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    {connectData?.length === 0 && !isError && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "60%",
                          left: lang === "en" ? "55%" : "42%",
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
                          {lang === "en" ? "No Data" : "لا يوجد بيانات"}
                        </Typography>
                      </Box>
                    )}

                    {isError ? (
                      <Box
                        sx={{
                          display: "flex",
                          position: "absolute",

                          top: "50%",
                          left: lang === "en" ? "50%" : "42%",
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

                    <TableBody>
                      {connectData?.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            bgcolor: customColors.bg,
                          }}
                        >
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{item.name}</TableCell>
                          <TableCell align="center">{item.email}</TableCell>
                          <TableCell align="center">{item.phone}</TableCell>
                          <TableCell align="center" sx={{ minWidth: "180px" }}>
                            {allowed({ page: "contactRequests", role }) ? (
                              <Button
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
                                    xs: "100%",
                                    sm: "80%",
                                    xl: "50%",
                                  },
                                  p: "9px 8px",
                                  color: "white",
                                  fontWeight: "bold",
                                  textTransform: "capitalize",
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
                            ) : (
                              <></>
                            )}
                          </TableCell>
                          <TableCell>
                            {allowed({ page: "contactRequests", role }) ? (
                              <Button
                                variant="contained"
                                sx={{
                                  bgcolor: "#e35959 !important",
                                  textTransform: "capitalize",
                                  color: "white",
                                }}
                                onClick={() => {
                                  handleDeleteMessage(item);
                                }}
                              >
                                {lang === "en" ? "Delete" : "حذف"}
                              </Button>
                            ) : (
                              <></>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>

          <Box
            width={{ xs: "95%", md: "96%" }}
            mx="auto"
            bgcolor={customColors.bg}
            minHeight={"80vh"}
            sx={{
              display: display === "none" ? "flex" : "none",
              justifyContent: "center",
              borderRadius: "5px",
            }}
          >
            <SupportForm data={dataItemMessage} setDisplay={setDisplay} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ContactRequests;
