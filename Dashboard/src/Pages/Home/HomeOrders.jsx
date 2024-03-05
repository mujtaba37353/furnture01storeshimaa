import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useDeleteOrderByIdMutation,
  useGetAllOrdersQuery,
} from "../../api/order.api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { ORDER_STATUS, PAYMENT_TYPE } from "../../helper/order-status";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const HomeOrders = () => {
  const [deleteOrderById] = useDeleteOrderByIdMutation();
  const {role} = useSelector((state) => state.user);
  const { customColors } = useTheme();
  const { data, isSuccess } = useGetAllOrdersQuery("?limit=100");
  const [, { language: lang }] = useTranslation();
  const navigate = useNavigate();
  const handleDelete = (order) => {
    deleteOrderById(order.id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lang}`]);
      })
      .catch((err) => {
       
        toast.error(err?.data[`error_${lang}`]);
      });
  };

  return (
    isSuccess && (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: customColors.text === '#fff'
                  ? "#3d5a58"
                  : "#d4f2ef",
                borderRadius: "10px",
                // boxShadow: "0px 0px 10px 0px #c6d5d3",
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
                  {lang === "en" ? "Payment Way" : "طريقة الدفع"}
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

              <TableCell></TableCell>
            </TableRow>
          </TableHead>
            {isSuccess && data?.data?.length === 0 && (

          <TableBody>
            {data?.data?.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  bgcolor: customColors.text === '#fff'
                    ? "#575757"
                    : "white",
                  borderRadius: "10px",
                  //   boxShadow: "0px 0px 15px 0px #c6d5d3",
                  //   ".css-7klb2o-MuiTableCell-root": {
                  //     textAlign: "center",
                  //   },
                }}
              >
                <TableCell
                  align="center"
                  sx={{
                    color: customColors.text,
                  }}
                >
                  {index}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => {
                    navigate(`/orders/${item._id}`);
                  }}
                  sx={{
                    color: customColors.text,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {item.name}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: customColors.text,
                  }}
                >
                  {item.email ? item.email : lang === "en" ? "No Email" : "لا يوجد بريد الكتروني"}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: customColors.text,
                  }}
                >
                  {item.onlineItems.items.length + item.cashItems.items.length}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: customColors.text,
                  }}
                >
                  {lang === "en"
                    ? `${item.totalPrice} SAR`
                    : `${item.totalPrice}ر.س`}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: customColors.text,
                  }}
                >
                  {
                    PAYMENT_TYPE[item.paymentType][lang]
                  }
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: customColors.text,
                  }}
                >
                  <Typography
                    sx={{
                      backgroundColor:
                        item.status === "initiated"
                          ? "#f6eadf !important"
                          : item.status === "created"
                            ? "#d4f2ef !important"
                            : "#f4d8e4 !important",
                      // width: { xs: "100%", sm: "80%", xl: "100%" },
                      p: "3px 20px",
                      color:
                        item.status === "initiated"
                          ? "#f7ce70"
                          : item.status === "created"
                            ? "#a5d5d6"
                            : "#e399b9",
                      fontWeight: "bold",
                      borderRadius: "25px",
                      textAlign: "center",
                      fontSize: { xs: "12px", sm: "14px", lg: "16px" },
                    }}
                  >
                    {
                      ORDER_STATUS[item.status][lang]
                    }
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: customColors.text,
                  }}
                >
                  {item.updatedAt.slice(0, 10)}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: customColors.text,
                  }}
                >
                  {
                    allowed({ page: "admins", role }) ? (
                    <Button
                      size="small"
                      onClick={() => {
                        handleDelete(item);
                      }}
                      sx={{
                        backgroundColor: "transparent !important",

                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      <DeleteIcon />
                    </Button>) : (<></>)
                  }

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
            )}
        </Table>
      </TableContainer>
    )
  );
};

export default HomeOrders;
