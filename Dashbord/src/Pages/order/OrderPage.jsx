import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useLazyTrackOrderQuery,
  useTrackOrderRepoMutation,
} from "../../api/order.api";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@emotion/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { toast } from "react-toastify";
import { ORDER_STATUS, PAYMENT_TYPE } from "../../helper/order-status";
import { Fragment, useEffect } from "react";
import { imageBaseUrl } from "../../api/baseUrl";
import TrackOrderDialoge from "./TrackOrderModal";
import { useState } from "react";
import { useGetAllReposQuery } from "../../api/repos.api";

const GRID_SPACING = 4;
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
          color: "red",
        }}
      >
        {error?.status !== "FETCH_ERROR" ? (
          <> {error?.data[`error_${language}`]} </>
        ) : (
          <>{error?.error}</>
        )}
      </Typography>
    </Box>
  );
};

const CardInfo = ({
  name,
  email,
  phone,
  paymentStatus,
  paymentType,
  sendToDelivery,
}) => {
  const map = {
    payment_paid: {
      ar: "تم الدفع",
      en: "Paid",
      color: "#50C750",
    },
    payment_not_paid: {
      ar: "لم يتم الدفع",
      en: "Not Paid",
      color: "#C75050",
    },
    payment_failed: {
      ar: "فشل الدفع",
      en: "Payment Failed",
      color: "#C75050",
    },
  };
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  return (
    <Card
      sx={{
        px: {
          xs: 1,
          md: GRID_SPACING,
        },
        py: {
          xs: 1,
          md: GRID_SPACING,
        },
        bgcolor: customColors.container,
        display: "flex",
        height: "100%",
      }}
    >
      <Box
        sx={{
          bgcolor: "#80f162",
          width: 6,
          height: "100%",
          borderRadius: 10,
          ml: language === "en" ? 0 : GRID_SPACING,
          mr: language === "en" ? GRID_SPACING : 0,
        }}
      />
      <Stack
        direction={"row"}
        flexGrow={1}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack spacing={GRID_SPACING / 2}>
          <Typography variant={"h6"} sx={{ pb: GRID_SPACING / 2 }}>
            {language === "en" ? "Customer Info" : "معلومات العميل"}
          </Typography>
          <Typography variant={"body1"} sx={{ m: "0 !important" }}>
            {language === "en" ? "Name" : "الاسم"}: {name}
          </Typography>
          <Typography variant={"body1"} sx={{ m: "0 !important" }}>
            {language === "en" ? "Email" : "البريد الالكتروني"}:{" "}
            {email ? email : "لا يوجد"}
          </Typography>
          <Typography variant={"body1"} sx={{ m: "0 !important" }}>
            {language === "en" ? "Phone" : "رقم الهاتف"}:{" "}
            {phone ? phone : "لا يوجد"}
          </Typography>
          <Stack direction={"row"} gap={GRID_SPACING}>
            {paymentType !== "cash" && (
              <Typography
                variant={"body1"}
                sx={{
                  m: "0 !important",
                  pt: 2,
                  color: map[paymentStatus]["color"],
                }}
              >
                {map[paymentStatus][language]}
              </Typography>
            )}
            {sendToDelivery && (
              <Typography
                variant={"body1"}
                sx={{
                  m: "0 !important",
                  pt: 2,
                }}
              >
                {language === "en" ? "Send to Delivery" : "تم ارساله للتوصيل"}
              </Typography>
            )}
            {!sendToDelivery && (
              <Typography
                variant={"body1"}
                sx={{
                  m: "0 !important",
                  pt: 2,
                }}
              >
                {language === "en"
                  ? "Not Send to Delivery"
                  : "لم يتم ارساله للتوصيل"}
              </Typography>
            )}
          </Stack>
        </Stack>
        <PermIdentityOutlinedIcon
          sx={{
            width: GRID_SPACING * 15,
            height: GRID_SPACING * 15,
            bgcolor: customColors.secondary,
            color: customColors.main,
            p: 1,
            borderRadius: 2,
          }}
        />
      </Stack>
    </Card>
  );
};

function BasicTable({ data, orderShipping }) {

  const { data: ReposData,
    isSuccess: ReposSuccess,
    isError: ReposError,
    isLoading: ReposLoading
  } = useGetAllReposQuery("?limit=10000")
  
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState([])
  const [order, setOrder] = useState({});
  const [TrackOrderM] = useTrackOrderRepoMutation();
  const { id } = useParams();
  const [statues,setStatus]=useState({})
  console.log(id, 'id')

  useEffect(() => {
    setOrder(data);
  if(ReposSuccess&&!ReposError){
  const OrderDatas = ReposData?.data?.map(item=>{
    console.log( item._id,orderShipping,'asd')


    const RepoData= orderShipping?.data?.ordersShipping?.find(({repoId})=>{
      return repoId===item?._id  })
      if(RepoData){
        return{
          ...RepoData,
          BranchInforemotion:item
        }
      }
      return


  }).filter(item=>item!==undefined);
  console.log()
   setOrder(OrderDatas)
 }
  }, [orderShipping,data,data?.data,ReposData])
  const openDialoge = (
    orderStatus
  ) => {
    console.log(orderStatus, 'orderorder')
    TrackOrderM({
      orderId: orderStatus?.shippingId,
      id

    }).unwrap().then(res => { 
      console.log(res,'resresres')
       setStatus(res);
      setOpen(true)
    }).catch(err => {


      toast.error(language === "en" ? err?.data?.error_en : err?.data?.error_ar)
      console.log(err)
    })
  }
  return (
    <>


      <TableContainer
        component={Paper}
        sx={{
          mt: GRID_SPACING,
        }}
      >
        <Table sx={{ width: "100%" }} aria-label="simple table">
          <TableHead
            sx={{
              bgcolor: customColors.secondary,
              borderRadius: "5px",
            }}
          >
            <TableRow>
              <TableCell align={language === "en" ? "left" : "right"}>
                #
              </TableCell>
              <TableCell align={language === "en" ? "left" : "right"}>
                {language === "en" ? "Product" : "المنتج"}
              </TableCell>
              <TableCell align={language === "en" ? "left" : "right"}>
                {language === "en" ? "Price" : "السعر"}
              </TableCell>
              <TableCell align={language === "en" ? "left" : "right"}>
                {language === "en" ? "Quantity" : "الكمية"}
              </TableCell>
              <TableCell align={language === "en" ? "left" : "right"}>
                {language === "en" ? "Total" : "الاجمالي"}
              </TableCell>
         
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              bgcolor: customColors.bg,
            }}
          >
            {
              console.log(orderData, 'orderData')
            }
            {data?.map((row, index) => (
              <Fragment key={index}>
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align={language === "en" ? "left" : "right"}>
                    {index + 1}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      display: "flex",
                      gap: GRID_SPACING,
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                      }}
                      src={`${imageBaseUrl}${row?.product?.images[0]}`}
                      alt="product image"
                    />
                    <Typography variant={"body1"} sx={{ m: "0 !important" }}>
                      {language === "en"
                        ? row?.product?.title_en
                        : row?.product?.title_ar}
                    </Typography>
                  </TableCell>
                  <TableCell align={language === "en" ? "left" : "right"}>
                    {row?.totalPrice / row?.quantity}
                  </TableCell>
                  <TableCell align={language === "en" ? "left" : "right"}>
                    {row?.quantity}
                  </TableCell>
                  <TableCell align={language === "en" ? "left" : "right"}>
                    {row?.totalPrice}
                  </TableCell>
             
                </TableRow>
                {row?.properties.length > 0 ? (
                  <TableRow>
                    <TableCell
                      align={language === "en" ? "left" : "right"}
                      colspan="5"
                    >
                      <Accordion sx={{ backgroundColor: customColors.card }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>
                            {language === "en" ? "Properties" : "خصائص"}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Table>
                            <TableHead sx={{ bgcolor: customColors.secondary }}>
                              <TableRow>
                                <TableCell align="center">
                                  {language === "en" ? "Property" : "الخاصية"}
                                </TableCell>
                                <TableCell align="center">
                                  {language === "en" ? "Value" : "القيمة"}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody sx={{ bgcolor: customColors.bg }}>
                              {row.properties.map((property, index) => (
                                <TableRow key={index}>
                                  <TableCell align="center">
                                    {language === "en"
                                      ? property?.key_en
                                      : property?.key_ar}
                                  </TableCell>
                                  <TableCell align="center">
                                    {language === "en"
                                      ? property?.value_en
                                      : property?.value_ar}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                ) : (
                  <></>
                )}
                {row?.repositories?.length > 0 ? (
                  <TableRow>
                    <TableCell
                      align={language === "en" ? "left" : "right"}
                      colspan="5"
                    >
                      <Accordion sx={{ backgroundColor: customColors.card }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>
                            {language === "en" ? "Repositories" : "مستودعات"}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Table>
                            <TableHead sx={{ bgcolor: customColors.secondary }}>
                              <TableRow>
                                <TableCell align="center">
                                  {language === "en" ? "Repository" : "المستودع"}
                                </TableCell>
                                <TableCell align="center">
                                  {language === "en" ? "Quantity" : "الكمية"}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody sx={{ bgcolor: customColors.bg }}>
                              {row?.repositories?.map((repository, index) => (
                                <TableRow key={index}>
                                  <TableCell align="center">
                                    {language === "en"
                                      ? repository?.repository?.name_en
                                      : repository?.repository.name_ar}
                                  </TableCell>
                                  <TableCell align="center">
                                    {repository?.quantity}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                ) : (
                  <></>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

{
  console.log(order,'orderorder')
}
<Grid container  


sx={{
  margin:'20px auto'
}}>
{
  order?.length? order?.map(Branch=>{


    return(<Grid item xs={12} md={3} key={Branch?.BranchInforemotion?.name_en}  sx={{
      margin:'10px',
      padding:'10px'
     }}>
    
      <Grid container sx={{
        justifyContent:'space-between',
        display:'flex'
      }}>
<Grid item xs={6} sm={6} md={6} sx={{
  margin:'10px 0px',
}}>
{language==="en"?"name":"الاسم"}:
</Grid>
<Grid item xs={6} sm={6} md={6} sx={{
  margin:'10px 0px',
}}>
{language==="en"?Branch?.BranchInforemotion?.name_en:Branch?.BranchInforemotion?.name_ar}
</Grid>
<Grid item xs={6} sm={6} md={6} sx={{
  margin:'10px 0px',
}}>
{language==="en"?"city":"المدينه"}:
</Grid>
<Grid item xs={6} sm={6} md={6} sx={{
  margin:'10px 0px',
}}>
{language==="en"?Branch?.BranchInforemotion?.city
:Branch?.BranchInforemotion?.city
}
</Grid>
<Card
                  
                  sx={{
                    bgcolor: customColors.container,
                    cursor: "pointer",
                    padding:'20px',
                    height:'30px',
                    display:'flex',
                    alignItems:'center',
                    margin:'10px',
                    width:'100%',
                    textAlign:'center',
                    justifyContent: 'center',

                  }}
                  onClick={()=>openDialoge(Branch)}
 >
                  <Typography
                    variant={"p"}
                    sx={{
                     
                      color: customColors.text,
                    }}
                    textAlign={"center"}

                  >
                    {language === "en"
                      ? "Order Tracking  "
                      : "  تتبع الطلب"}
                   </Typography>
                </Card>
      </Grid>
    </Grid>)
 
  }):null
}
</Grid>

      <TrackOrderDialoge order={statues} setOpen={setOpen} open={open} />
    </>
  );
}
{/* <Card
             component={Button}
            sx={{
              color: customColors.text,
              bgcolor: customColors.container,
              cursor: "pointer",
              minWidth: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Typography variant={"h6"} textAlign={"center"}>
              {language === "en" ? "Track Order" : "تتبع الطلب"}
            </Typography>
          </Card> */}
const CardAddress = ({ address, area, city, postalCode }) => {
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  return (
    <Card
      sx={{
        px: {
          xs: 1,
          md: GRID_SPACING,
        },
        py: {
          xs: 1,
          md: GRID_SPACING,
        },
        bgcolor: customColors.container,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Stack spacing={GRID_SPACING / 2}>
        <Typography variant={"h6"} sx={{ pb: GRID_SPACING / 2 }}>
          {language === "en" ? "Saved Address" : "العنوان المسجل"}
        </Typography>
        <Typography variant={"body1"} sx={{ m: "0 !important" }}>
          {language === "en" ? "Address" : "العنوان"}: {address}
        </Typography>
        <Typography variant={"body1"} sx={{ m: "0 !important" }}>
          {language === "en" ? "Area" : "المنطقة"}: {area}
        </Typography>
        <Typography variant={"body1"} sx={{ m: "0 !important" }}>
          {language === "en" ? "City" : "المدينة"}: {city}
        </Typography>
        <Typography variant={"body1"} sx={{ m: "0 !important" }}>
          {language === "en" ? "Postal Code" : "الرمز البريدي"}: {postalCode}
        </Typography>
      </Stack>
      <NearMeOutlinedIcon
        sx={{
          width: GRID_SPACING * 15,
          height: GRID_SPACING * 15,
          bgcolor: customColors.secondary,
          color: customColors.main,
          p: 1,
          borderRadius: 2,
        }}
      />
    </Card>
  );
};

function OrderPage() {
  const { id } = useParams();
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const { data, isLoading, isError, error } = useGetOrderByIdQuery(`${id}`);

  const [trackOrder] = useLazyTrackOrderQuery();
  const handleTracking = () => {
    trackOrder(id)
      .unwrap()
      .then((res) => {
        const message = language === "en" ? res?.success_en : res?.success_ar;
        const status = res?.data?.status;
        toast.success(`${message} (${status})`);
      })
      .catch((err) => {
        const message =
          language === "en" ? err?.data?.error_en : err?.data?.error_ar;
        toast.error(message);
      });
  };

  if (isLoading) return <OrderLoading />;
  if (isError) return <OrderError error={error} />;
  const {
    cashItems,
    address,
    area,
    city,
    postalCode,
    name,
    onlineItems,
    paymentStatus,
    paymentType,
    phone,
    sendToDelivery,
    status,
    totalPrice,
    email,
    tracking,
  } = data?.data;
  return (
    <Box
      sx={{
        px: {
          xs: 0,
          md: GRID_SPACING,
        },
        py: GRID_SPACING,
      }}
    >
      <Box mb={GRID_SPACING}>
        <Breadcrumbs page_ar={"الطلب"} page_en={"Order"} />
      </Box>
      <Grid
        container
        spacing={{
          xs: 0,
          md: GRID_SPACING,
        }}
        gap={{
          xs: GRID_SPACING,
          md: 0,
        }}
        px={{
          xs: 1,
          md: 0,
        }}
      >
        <Grid item xs={12} lg={6}>
          <CardInfo
            paymentType={paymentType}
            name={name}
            email={email}
            phone={phone}
            paymentStatus={paymentStatus}
            sendToDelivery={sendToDelivery}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CardAddress
            address={address}
            area={area}
            city={city}
            postalCode={postalCode}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          width: { xs: "370px", md: "100%" },
          mx: "auto",
          px: 1,
        }}
      >
        <BasicTable
          data={[...(onlineItems?.items || []), ...(cashItems?.items || [])]}
          orderShipping={data}
        />
      </Box>
 

      <Stack gap={GRID_SPACING / 2} pt={GRID_SPACING} mx={1}>
        <Typography variant={"h6"}>
          {language === "en" ? "Total Online" : "المبلغ الاونلاين"}:{" "}
          {onlineItems?.totalPrice} {language === "en" ? "SAR" : "ريال سعودي"}
        </Typography>
        <Typography variant={"h6"}>
          {language === "en" ? "Total Cash" : "المبلغ الكاش"}:{" "}
          {cashItems?.totalPrice} {language === "en" ? "SAR" : "ريال سعودي"}
        </Typography>
        <Typography variant={"h6"}>
          {language === "en" ? "Total" : "الاجمالي"}: {totalPrice}{" "}
          {language === "en" ? "SAR" : "ريال سعودي"}
        </Typography>
        <Typography variant={"h5"}>
          {language === "en" ? "Payment Type" : "طريقة الدفع"}:{" "}
          {PAYMENT_TYPE[paymentType][language]}
        </Typography>
        <Typography variant={"h5"}>
          {language === "en" ? "Order Status" : "حالة الطلب"}:{" "}
          {ORDER_STATUS[status][language]}
        </Typography>
      </Stack>
    </Box>
  );
}

export default OrderPage;
