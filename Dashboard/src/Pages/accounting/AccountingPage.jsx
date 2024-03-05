import {
  Box,
  Menu,
  MenuItem,
  Button,
  Stack,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useTranslation } from "react-i18next";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useGetAccountingOrdersQuery } from "../../api/order.api";
import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import useSearch from "../../hooks/useSearch";
import ReactToPrint from "react-to-print";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { PAYMENT_TYPE } from "../../helper/order-status";
import { useSelector } from "react-redux";
import { allowed } from "../../helper/roles";
import NotAllowed from "../notAllowed/NotAllowed";
const FilterMenu = () => {
  const { addToSearch, removeFromSearch } = useSearch();
  const {
    i18n: { language },
  } = useTranslation();
  const handleChange = (event) => {
    const { value, name } = event.target;
    if (value) {
      addToSearch({ key: name, value });
    } else {
      removeFromSearch(name);
    }
  };
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        justifyContent: {
          xs: "flex-start",
          md: "flex-end",
        },
        alignItems: "center",
        gap: 2,
        pb: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6">
          {language === "en" ? "from" : "من"}
        </Typography>
        <input
          className="date-gradient"
          type="date"
          name={`createdAt[gte]`}
          onChange={handleChange}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6">{language === "en" ? "to" : "الي"}</Typography>
        <input
          className="date-gradient"
          type="date"
          name={`createdAt[lte]`}
          onChange={handleChange}
        />
      </Box>
    </Stack>
  );
};

const PaymentTypeMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { addToSearch, removeFromSearch } = useSearch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = ({ key, value }) => {
    if (value === "null") {
      removeFromSearch(key);
    } else {
      addToSearch({ key, value });
    }
    setAnchorEl(null);
  };

  const {
    i18n: { language },
  } = useTranslation();

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          color: "inherit",
        }}
      >
        {language === "en" ? "Payment Type" : "طريقة الدفع"}
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() =>
            handleClose({
              key: "paymentType",
              value: "null",
            })
          }
        >
          {language === "en" ? "Reset" : "اعادة تعيين"}
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleClose({
              key: "paymentType",
              value: "cash",
            })
          }
        >
          {language === "en" ? "Cash" : "كاش"}
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleClose({
              key: "paymentType",
              value: "online",
            })
          }
        >
          {language === "en" ? "Online" : "اونلاين"}
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleClose({
              key: "paymentType",
              value: "both",
            })
          }
        >
          {language === "en" ? "Cash & Online" : "الدفع عند الاستلام وأونلاين"}
        </MenuItem>
      </Menu>
    </div>
  );
};

function BasicTable({ data, handlePaymentTypeChange }) {
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }} aria-label="simple table">
        <TableHead
          sx={{
            bgcolor: customColors.secondary,
            borderRadius: "5px",
          }}
        >
          <TableRow>
            <TableCell align="right">#</TableCell>
            <TableCell align="center">
              {language === "en" ? "Order Number" : "رقم الطلب"}
            </TableCell>
            <TableCell align="center">
              {language === "en" ? "Total Price" : "السعر الكلي"}
            </TableCell>
            <TableCell align="center">
              {language === "en" ? "Customer Name" : "اسم العميل"}
            </TableCell>
            <TableCell align="center">
              {language === "en" ? "Shipping Company" : "شركة الشحن"}
            </TableCell>
            <TableCell align="center">
              <PaymentTypeMenu onChange={handlePaymentTypeChange} />
            </TableCell>
          </TableRow>
        </TableHead>
        {data.length === 0 ? (
          <TableRow
              
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell align="center" colSpan={6}>
              {language === "en" ? "No Orders" : "لا يوجد طلبات"}
            </TableCell>
          </TableRow>
        ) : (
          <TableBody
            sx={{
              bgcolor: customColors.bg,
            }}
          >
            {data.map((row, index) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{index + 1}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => navigate("/orders/" + row?._id)}
                >
                  {row?._id}
                </TableCell>
                <TableCell align="center">{row?.totalPrice}</TableCell>
                <TableCell align="center">{row?.name}</TableCell>
                <TableCell align="center">
                  {language === "en" ? "Logex" : "لوجكس"}
                </TableCell>
                <TableCell align="center">
                  {PAYMENT_TYPE[row?.paymentType][language]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}

const Card = ({ number, title, icon }) => {
  const { customColors } = useTheme();
  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        bgcolor: customColors.container,
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Typography variant="h4">{number}</Typography>
          <Typography variant="h5">{title}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {cloneElement(icon, {})}
        </Box>
      </Stack>
    </Paper>
  );
};
const BottomCard = ({ number, title }) => {
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: customColors.container,
      }}
    >
      <Stack
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            py: 3,
            textAlign: "center",
            fontSize: {
              xs: "20px",
              md: "30px",
            },
          }}
        >
          {title}
        </Typography>

        <Divider
          orientation="horizontal"
          flexItem
          sx={{
            width: "100%",
            backgroundColor: customColors.main,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",

            p: {
              xs: 2,
              md: 4,
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: {
                xs: "30px",
                md: "40px",
              },
            }}
          >
            {number}
          </Typography>
          <Typography variant="h5">
            {language === "en" ? "Rial" : "ريال"}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

function AccountingPage() {
  const { customColors } = useTheme();
  const { role } = useSelector((state) => state.user);

  const {
    i18n: { language },
  } = useTranslation();
  const componentRef = useRef(null);

  const onBeforeGetContentResolve = useRef(null);

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("old boring text");

  const handleAfterPrint = useCallback(() => {
  
  }, []);

  const handleBeforePrint = useCallback(() => {
   
  }, []);

  const handleOnBeforeGetContent = useCallback(() => {
    
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = useCallback(() => {
    return (
      <Button
        sx={{
          bgcolor: "#00D5C5 !important",
          color: "#fff",
          width: "fit-content",
          py: 1,
          // px: 4,
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {language === "en" ? "Print" : "طباعة"}
      </Button>
    );
  }, []);

  const { search, addArrayToSearch } = useSearch();
  const { data, isSuccess, isError } = useGetAccountingOrdersQuery(search);

  useEffect(() => {
    addArrayToSearch([
      {
        key: "limit",
        value: "10000",
      },
      {
        key: "sendToDelivery",
        value: "true",
      },
      {
        key: "active",
        value: "true",
      },
    ]);
  }, [search]);

  const { totalCash, totalMoney, totalOnline, totalOrderSendToDelivery } =
    data?.data || {};

  if (!allowed({ page: "accounting", role })) return <NotAllowed />;
  return (
    <Box
      dir={language === "en" ? "ltr" : "rtl"}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        // bgcolor: customColors.container,
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Breadcrumbs page_en={"Accounting"} page_ar={"المحاسبة"} />
      <Paper
        elevation={1}
        sx={{
          p: 2,
          bgcolor: customColors.bg,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={4}
          pb={4}
        >
          <Card
            number={1}
            title={language === "en" ? "Shipping Companies" : "عدد شركات الشحن"}
            icon={
              <LocalShippingIcon
                sx={{
                  fontSize: "60px",
                  color: "#36e8d9",
                  backgroundColor: customColors.secondary,
                  p: 1,
                  borderRadius: "6px",
                }}
              />
            }
          />
          <Card
            number={isError ? 0 : totalOrderSendToDelivery}
            title={language === "en" ? "Total Orders" : "جميع الطلبات"}
            icon={
              <MoveToInboxIcon
                sx={{
                  fontSize: "60px",
                  color: "#36e8d9",
                  backgroundColor: customColors.secondary,
                  p: 1,
                  borderRadius: "6px",
                }}
              />
            }
          />
        </Stack>
        <Box
          ref={componentRef}
          sx={{
            m: "auto",
            maxWidth: { md: "100%", sm: "100%", xs: 280 },
            overflow: "hidden",
          }}
        >
          <FilterMenu />
          <BasicTable data={isSuccess ? data?.data?.orders : []} />
          {isSuccess && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  
                }}
              >
                <Stack direction={"row"} gap={2} alignItems={"center"} p={4}>
                  <Typography
                    variant="p"
                    sx={{ fontWeight: "bold", color: "#959595" }}
                  >
                    {language === "en" ? "Total Money" : "اجمالي المبلغ"}
                  </Typography>
                  <Typography
                    variant="p"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: customColors.main,
                      p: 1,
                      borderRadius: "6px",
                    }}
                  >
                    {totalMoney} {language === "en" ? "Rial" : "ريال"}
                  </Typography>
                </Stack>
              </Box>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={4}
                pb={4}
               
              >
                <BottomCard
                  number={isError ? 0 : totalCash}
                  title={
                    language === "en"
                      ? "Shipping Company Money"
                      : "المبالغ لدي شركة الشحن"
                  }
                />
                <BottomCard
                  number={isError ? 0 : totalOnline}
                  title={
                    language === "en" ? "Store Money" : "المبالغ المطلوبة لدي"
                  }
                />
              </Stack>
              {loading && (
                <Typography variant="h4" sx={{ textAlign: "center" }}>
                  ...
                </Typography>
              )}
            </>
          )}
        </Box>
        {isSuccess && (
          <Stack
            sx={{
              alignItems: "flex-end",
            
            }}
          >
            <ReactToPrint
              content={reactToPrintContent}
              documentTitle={new Date().toISOString()}
              onAfterPrint={handleAfterPrint}
              onBeforeGetContent={handleOnBeforeGetContent}
              onBeforePrint={handleBeforePrint}
              removeAfterPrint
              trigger={reactToPrintTrigger}
            />
          </Stack>
        )}
      </Paper>
    </Box>
  );
}

export default AccountingPage;
