import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Paper,
  TableBody,
  Button,
  Tooltip,
  tooltipClasses,
  InputBase,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useRemoveProductFromRepoMutation,
  useUpdateQuantityForRepoMutation,
} from "../../api/repos.api";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
// import { useTheme } from "@emotion/react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  width: "100%",
  maxWidth: "720px!important",
};

export default function RepoProductsModal({
  open,
  setOpen,
  openedItem,
  setOpenedItem,
}) {
  const handleClose = () => {
    setOpen(false);
    setOpenedItem();
    setModalProducts([]);
    setSelectedEdited();
  };
  const { role } = useSelector((state) => state.user);
  const { customColors, colors } = useTheme();
  const [_, { language }] = useTranslation();
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));
  const [removeProductFromRepo] = useRemoveProductFromRepoMutation();

  const handleRemoveProductFromRepo = (item) => {
    removeProductFromRepo({
      repoId: openedItem._id,
      productId: item.productId._id,
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
        setModalProducts(
          modalProducts.filter((el) => el.productId._id !== item.productId._id)
        );
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`]);
      });
  };
  const [selectedEdited, setSelectedEdited] = useState();
  const [modalProducts, setModalProducts] = useState([]);
  React.useEffect(() => {
    if (openedItem && open) {
      setModalProducts(openedItem.products);
    }
  }, [open, openedItem]);
  const [quantity, setQuantity] = useState(0);
  const [updateQuantityForRepo] = useUpdateQuantityForRepoMutation();
  const handleUpdateQuantity = (item) => {
    updateQuantityForRepo({
      repoId: openedItem._id,
      productId: item.productId._id,
      quantity,
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
        setSelectedEdited();
        setModalProducts(
          modalProducts.map((el) => {
            return el._id === item._id ? { ...item, quantity } : el;
          })
        );
        setQuantity(0);
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`]);
      });
  };
  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack>
          <Typography sx={{ color: colors.main }}>
            {language === "en" ? "products for repo" : "منتجات المستودع"}
          </Typography>
        </Stack>
        <Divider
          orientation="horizontal"
          flexItem
          sx={{
            width: "100%",
            backgroundColor: "#b2f6f1",
            my: "20px",
            color: "grey",
          }}
        />
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                sx={{ bgcolor: customColors.secondary, borderRadius: "5px" }}
              >
                <TableRow>
                  <TableCell
                    px={2}
                    sx={{ width: 0.05, fontWeight: "bold" }}
                    align={"center"}
                  >
                    #
                  </TableCell>
                  <TableCell
                    px={2}
                    sx={{ width: 0.5, fontWeight: "bold" }}
                    align={"center"}
                  >
                    {language === "en" ? "Products" : "المنتجات"}
                  </TableCell>
                  <TableCell
                    px={2}
                    sx={{ width: 0.25, fontWeight: "bold" }}
                    align={"center"}
                  >
                    {language === "en" ? "Quanitty" : "الكمية"}
                  </TableCell>
                  <TableCell
                    px={2}
                    sx={{ width: 0.25, fontWeight: "bold" }}
                    align={"center"}
                  ></TableCell>
                </TableRow>
              </TableHead>
              {modalProducts.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colspan="5" sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100px",
                          width: "100%",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ textAlign: "center", width: "100%" }}
                        >
                          {language === "en" ? "No Products" : "لا توجد منتجات"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {modalProducts.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {item.productId[`title_${language}`]}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {/* {selectedEdited && selectedEdited._id === item._id ? (
                          <InputBase
                            value={quantity}
                            onChange={(e) => setQuantity(+e.target.value)}
                            type="number"
                            sx={{
                              border: 1,
                              borderColor: colors.inputBorderColor,
                              width: "40px",
                              textAlign: "center",
                              borderRadius: 2,
                            }}
                          />
                        ) : (
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "bold",
                            }}
                          >
                            {item.quantity}
                          </Typography>
                        )} */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      {allowed({ page: "repositories", role }) ? (
                        <TableCell align="center">
                          {/* {selectedEdited && selectedEdited._id === item._id ? (
                            <Stack direction={"row"} justifyContent={"center"}>
                              <BootstrapTooltip
                                title={
                                  language === "en"
                                    ? "Save quantity"
                                    : "حفظ الكمية"
                                }
                              >
                                <Button
                                  variant="raised"
                                  sx={{
                                    ":hover": {
                                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                                    },
                                    p: "2px",
                                    minWidth: "0px",
                                  }}
                                  onClick={() => {
                                    handleUpdateQuantity(item);
                                  }}
                                >
                                  <CheckCircleIcon
                                    sx={{
                                      color: "#00e3d2",
                                      cursor: "pointer",
                                    }}
                                  />
                                </Button>
                              </BootstrapTooltip>
                              <BootstrapTooltip
                                title={language === "en" ? "Close" : "الغاء"}
                              >
                                <Button
                                  variant="raised"
                                  sx={{
                                    ":hover": {
                                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                                    },
                                    p: "2px",
                                    minWidth: "0px",
                                  }}
                                >
                                  <HighlightOffIcon
                                    sx={{
                                      color: colors.dangerous,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => setSelectedEdited()}
                                  />
                                </Button>
                              </BootstrapTooltip>
                            </Stack>
                          ) : (
                            <Stack direction={"row"} justifyContent={"center"}>
                              <BootstrapTooltip
                                title={
                                  language === "en"
                                    ? "Edit quantity"
                                    : "تعديل الكمية"
                                }
                              >
                                <Button
                                  variant="raised"
                                  sx={{
                                    ":hover": {
                                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                                    },
                                    p: "2px",
                                    minWidth: "0px",
                                  }}
                                >
                                  <EditIcon
                                    sx={{
                                      color: "#00e3d2",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setSelectedEdited(item);
                                      setQuantity(item.quantity);
                                    }}
                                  />
                                </Button>
                              </BootstrapTooltip>
                              <BootstrapTooltip
                                title={
                                  language === "en"
                                    ? "Delete this product"
                                    : "حذف هذا المنتج"
                                }
                              >
                                <Button
                                  variant="raised"
                                  sx={{
                                    ":hover": {
                                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                                    },
                                    p: "2px",
                                    minWidth: "0px",
                                  }}
                                >
                                  <DeleteIcon
                                    sx={{
                                      color: colors.dangerous,
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleRemoveProductFromRepo(item)
                                    }
                                  />
                                </Button>
                              </BootstrapTooltip>
                            </Stack>
                          )} */}
                          <Stack direction={"row"} justifyContent={"center"}>
                            <BootstrapTooltip
                              title={
                                language === "en"
                                  ? "Delete this product"
                                  : "حذف هذا المنتج"
                              }
                            >
                              <Button
                                variant="raised"
                                sx={{
                                  ":hover": {
                                    backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                                  },
                                  p: "2px",
                                  minWidth: "0px",
                                }}
                              >
                                <DeleteIcon
                                  sx={{
                                    color: colors.dangerous,
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleRemoveProductFromRepo(item)
                                  }
                                />
                              </Button>
                            </BootstrapTooltip>
                          </Stack>
                        </TableCell>
                      ) : undefined}
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>

        <Stack
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            mt: "20px",
            gap: 2,
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              bgcolor: colors.main,
              color: "white",
              textTransform: "capitalize",
              "&:hover": { bgcolor: customColors.main },
            }}
          >
            {language === "en" ? "Close" : "أغلاق"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
