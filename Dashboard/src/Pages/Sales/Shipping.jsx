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
  TableBody,
  List,
  ListItemButton,
  Collapse,
  ListItemText,
  CircularProgress,
  useTheme,
  CardMedia,
} from "@mui/material";
import { ORDER_STATUS, PAYMENT_TYPE } from "../../helper/order-status";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import ShippingModal from "./../../Components/shippingComponents/shippingModal";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  useCreateShippingByIdMutation,
  useGetAllOrdersQuery,
  useLazyGetAllOrdersQuery,
  useLazyGetOrderByIdQuery,
  useLazyGetOrderShippingByIdQuery,
} from "../../api/order.api";

import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import ShippingModal_2 from '../../Components/shippingv2/shippingModal_v2';

import { useGetAllReposQuery, useLazyGetProductsDataQuery } from "../../api/repos.api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
 const Shipping = () => {
  const { customColors, colors } = useTheme();
  const [getOrderM,{
    data: shipping,
    isSuccess,
    isError,
    isLoading,
    error,
  } ]= useLazyGetAllOrdersQuery(
  );
  //
  const [data, setData] = useState([]);
  const [_, { language: lang }] = useTranslation();
  const [open, setOpen] = React.useState(true);
  const [openDialoge, setOpenDialoge] = useState(false);
  const { data: ReposData,
    isSuccess: ReposSuccess,
    isError: ReposError,
    isLoading: ReposLoading
  } = useGetAllReposQuery("?limit=10000")
  const [getOrder] = useLazyGetOrderShippingByIdQuery()

  const [order, setOrder] = useState({
    products: [],
    orderId: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      setData(shipping?.data);
    }
  }, [shipping?.data]);
  const handleClick = () => {
    setOpen(!open);
  };

useEffect(()=>{
  getOrderM( "?limit=1000&sendToDelivery=false&status[ne]=initiated").unwrap().then((res) => { 
    setData(res?.data) }).catch(err=>{
      
  })
 

},[data])

  // فكر جديد

  // useEffect(() => {
  //   if (ReposSuccess && !ReposError) {
  //     console.log(ReposData, 'ReposData')

  //   }
  // }, [data])
  const handleShipping = (order) => {
    getOrder(order._id).then((res) => {
      let dataArray = Object.entries(res?.data?.data).map(([key, value]) => ({ id: key, items: value }));
      console.log(dataArray,'orderordesadsdadsr')

      const ResturctureOrderShipping = order?.ordersShipping?.map(ordersShipping=>{
        return{
       
          RepoId:ordersShipping?.repoId ,
          status:ordersShipping?.status,

        }
      })

      console.log(res,'resasdsaddsa')


      let NewPopulateArray = {
        order: [],
        ordersShipping: [],
        shippingInferomation:{},
        stepperRepos:[],
      }

      if (ReposSuccess && !ReposLoading && !ReposError) {
        const populateArray = dataArray?.map(orderItem => {

          const Repo = ReposData?.data?.find(item => item?._id === orderItem.id);

          if (Repo) {
            return {
              ...orderItem,
              RepoInferomation: Repo,
              orderID:order?._id
            }
          }
          return
        }).filter(item=>item!==undefined);

        const ReposArray = dataArray?.map(orderItem => {

          const Repo = ReposData?.data?.find(item => item?._id === orderItem?.id);
          if (Repo) {
            return   Repo
            
          }
          return
        }).filter(item=>item!==undefined);

         NewPopulateArray = {
          order: populateArray,
          ordersShipping: ResturctureOrderShipping||[],
          shippingInferomation:order  ,
          stepperRepos:ReposArray
        }
        console.log(NewPopulateArray,'ReposData?.data')

 if(!NewPopulateArray?.order?.length){
 
  toast.error(lang === "en" ? "there is a problem  while getting Your Repositories " :
   "  هناك مشكله في استرداد المستودعات")

  return
}
        console.log(NewPopulateArray,'NewPopulateArrayasdsad')
        setOrder(NewPopulateArray)
        setOpenDialoge(true);
        
      } else if (ReposError) {
        toast.error(lang === "en" ? "there is a problem Please check Your internet connection and Try again" : "هناك مشكله في الاتصال بالانترنت ")
      }


       
 



    }).catch(err => console.log(err));



  };



























  // فكر جديد



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

      {!isLoading && (
        <>
          <Breadcrumbs page_en={"Shipping"} page_ar={"الشحن"} />

          <Box
            sx={{
              width: { xs: "100%", md: "97%" },
              bgcolor: customColors.bg,
              p: 2,
              mx: "auto",
              borderRadius: "5px",
            }}
          >
            {/* Data shipping container */}

            <Box
              sx={{
                width: { xs: "95%", md: "100%" },
                mx: "auto",
                // border:"2px solid #80808059",
                boxShadow: "0px 0px 5px 0px #80808059",
                bgcolor: customColors.card,
                borderRadius: "5px",
                pt: open ? 2 : 0,
                mt: 2,
              }}
            >
              <Box>
                <List
                  sx={{ width: "100%" }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                  <ListItemButton
                    onClick={handleClick}
                    sx={{
                      width: "100%",
                      justifyContent: "space-between",
                      boxShadow: open ? "0px 0px 5px 0px #80808059" : "none",

                      p: 2,
                      backgroundColor: "transparent !important",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {lang === "en"
                        ? "Total Orders Not Shipping"
                        : "جميع الطلبات غير المشحونة"}
                    </Typography>
                    <ListItemText />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {/* table */}
                      {data?.length === 0 && !isError && (
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
                            {lang === "en"
                              ? "No unshipped orders"
                              : "لا يوجد طلبات غير مشحونه"}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        sx={{
                          maxWidth: { sm: "100%", xs: 340 },
                          // mx: { xs: "auto", sm: "initial" },
                          overflowX: "hidden",
                        }}
                      >
                        <Box
                          sx={{ width: "100%", mx: "auto" }}
                          mt={2}
                          position={"relative"}
                          minHeight={"20vh"}
                        >
                          {/* head */}
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow
                                  sx={{
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
                                      {lang === "en"
                                        ? "Order Number"
                                        : "رقم الطلب"}
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
                                      {lang === "en"
                                        ? "Email"
                                        : "البريد الالكتروني"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {lang === "en" ? "Phone" : " رقم الجوال"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {lang === "en" ? "Items" : "العناصر"}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {lang === "en" ? "Price" : "السعر"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {lang === "en"
                                        ? "Payment Way"
                                        : "طريقة الدفع"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {lang === "en" ? "Statue" : " الحالة"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell></TableCell>
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
                                </TableRow>
                              </TableHead>
                              {isError ? (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "60%",
                                    left: lang === "en" ? "45%" : "50%",
                                    transform:
                                      lang === "en"
                                        ? "translate(-30%, -50%)"
                                        : "translate(-50%, -50%)",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: "bold",
                                      fontSize: {
                                        xs: "20px",
                                        sm: "25px",
                                        lg: "30px",
                                      },
                                      color: colors.dangerous,
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontWeight: "bold",
                                        fontSize: {
                                          xs: "20px",
                                          sm: "25px",
                                          lg: "30px",
                                        },
                                        color: colors.dangerous,
                                      }}
                                    >
                                      {error?.status !== "FETCH_ERROR" ? (
                                        <> {error?.data[`error_${lang}`]} </>
                                      ) : (
                                        <>{error?.error}</>
                                      )}
                                    </Typography>{" "}
                                  </Typography>
                                </Box>
                              ) : (
                                <TableBody>
                                  {data?.map((item, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        ".css-1ijrop1-MuiTableCell-root": {
                                          textAlign: "center",
                                          color: customColors.text,
                                        },
                                      }}
                                    >
                                      <TableCell align="center">
                                        {index + 1}
                                      </TableCell>
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
                                      <TableCell align="center">
                                        {item.email}
                                      </TableCell>
                                      <TableCell align="center">
                                        {item.phone}
                                      </TableCell>

                                      <TableCell align="center">
                                        {item.onlineItems.items.length +
                                          item.cashItems.items.length}
                                      </TableCell>
                                      <TableCell align="center">
                                        {lang === "en"
                                          ? `${item.totalPrice} SAR`
                                          : `${item.totalPrice}ر.س`}
                                      </TableCell>
                                      <TableCell align="center">
                                        {PAYMENT_TYPE[item.paymentType][lang]}
                                      </TableCell>

                                      <TableCell align="center">
                                        <Typography
                                          sx={{
                                            backgroundColor:
                                              item.status === "initiated" ||
                                                item.status === "onGoing" ||
                                                item.status === "on going"
                                                ? "#f6eadf !important"
                                                : item.status === "created" ||
                                                  item.status === "completed"
                                                  ? "#d4f2ef !important"
                                                  : "#f4d8e4 !important",
                                            // width: { xs: "100%", sm: "80%", xl: "100%" },
                                            p: "3px 20px",
                                            color:
                                              item.status === "initiated" ||
                                                item.status === "onGoing" ||
                                                item.status === "on going"
                                                ? "#f7ce70"
                                                : item.status === "created" ||
                                                  item.status === "completed"
                                                  ? "#a5d5d6"
                                                  : "#e399b9",
                                            fontWeight: "bold",
                                            borderRadius: "25px",
                                            textAlign: "center",
                                            fontSize: {
                                              xs: "12px",
                                              sm: "14px",
                                              lg: "16px",
                                            },
                                          }}
                                        >
                                          {ORDER_STATUS[item.status][lang]}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Button
                                          size="small"
                                          onClick={() => {
                                            handleShipping(item);
                                          }}
                                          sx={{
                                            backgroundColor: `${customColors.main} !important`,
                                            color: "#fff",

                                            textTransform: "capitalize",
                                            fontWeight: "bold",
                                            borderRadius: "25px",
                                            fontSize: "12px",
                                            width: "90px",
                                            py: 1,
                                            // padding: "7px 40px",
                                          }}
                                        >
                                          {lang === "en"
                                            ? "Shipping Mangement"
                                            : " اداره الشحن"}
                                        </Button>
                                      </TableCell>
                                      <TableCell align="center">
                                        {item?.updatedAt
                                          ? item?.updatedAt.slice(0, 10)
                                          : item?.createdAt.slice(0, 10)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              )}
                            </Table>
                          </TableContainer>
                        </Box>
                      </Box>
                    </List>
                  </Collapse>
                </List>
              </Box>

            </Box>

            {/* total orders */}

            <Box
              sx={{
                width: { xs: "100%", md: "90%" },
                mx: "auto",
                mb: 5,
              }}
            >
              {/* container */}
              <Stack
                mt={10}
                direction={{ xs: "column", md: "row" }}
                sx={{
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                {/* most seller */}
                <Stack
                  py={2}
                  px={5}
                  direction={"row"}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: { xs: "100%", md: "50%" },
                    boxShadow: "0px 0px 5px 0px #80808059",
                    bgcolor: customColors.card,
                    borderRadius: "5px",
                  }}
                >
                  {/* total orders */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                      }}
                    >
                      {shipping?.data.length ? shipping?.data.length : 0}
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "14px", sm: "15px", lg: "16px" },
                      }}
                    >
                      {lang === "en" ? "Total Orders" : "جميع الطلبات"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      bgcolor: customColors.secondary,
                      borderRadius: "5px",
                      maxHeight: "46px",
                      p: 1,
                    }}
                  >
                    <MonetizationOnIcon
                      sx={{
                        color: "#00D5C5",
                        fontSize: "30px",
                      }}
                    />
                  </Box>
                </Stack>

                {/* orders */}
                <Stack
                  py={2}
                  px={5}
                  direction={"row"}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: { xs: "100%", md: "50%" },
                    // boxShadow: "0px 0px 5px 0px #80808059",
                    boxShadow: "0px 0px 5px 0px #80808059",
                    bgcolor: customColors.card,
                    borderRadius: "5px",
                  }}
                >
                  {/* price */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                      }}
                    >
                      {data?.length}
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "14px", sm: "15px", lg: "16px" },
                      }}
                    >
                      {lang === "en"
                        ? "Unshipped Orders "
                        : " الطلبات الغير مشحونة"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      bgcolor: customColors.secondary,
                      borderRadius: "5px",
                      maxHeight: "46px",
                      p: 1,
                    }}
                  >
                    <VolunteerActivismOutlinedIcon
                      sx={{
                        color: "#00D5C5",
                        fontSize: "30px",
                      }}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Box>

        </>
      )}
      <ShippingModal_2
        open={openDialoge}
        setOpen={setOpenDialoge}
        order={order}
        setOrder={setOrder}
        setData={setData}
       />
    </Box>
  );
};

export default Shipping;
