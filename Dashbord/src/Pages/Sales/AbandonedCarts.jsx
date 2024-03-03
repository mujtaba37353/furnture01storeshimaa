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
  TextField,
  useTheme,
} from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { toast } from "react-toastify";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
import {
  useDeleteCartByIdMutation,
  useDeleteManyCartsMutation,
  useGetAllCartsQuery,
} from "../../api/cart.api";
import ConfirmDeleteModal from "../../Components/ConfirmDeleteModal/ConfirmDeleteModal";
const AbandonedCarts = () => {
  const { data, isSuccess, isError, isLoading, error } =
    useGetAllCartsQuery("?limit=1000");
  const { role } = useSelector((state) => state.user);
  const [deleteCartById, { isLoading: deleteCartByIdLoading }] =
    useDeleteCartByIdMutation();
  const [dataCarts, setDataCarts] = useState([]);
  const { customColors, colors } = useTheme();

  useEffect(() => {
    {
      isSuccess && setDataCarts(data?.data);
    }
  }, [data]);
  const [, { language: lang }] = useTranslation();
  const handleDelete = (cart) => {
    setDataCarts(dataCarts.filter((item) => item._id !== cart._id));
    deleteCartById(cart._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lang}`]);
      })
      .catch((err) => {
        setDataCarts(data?.data);
        toast.error(err?.data[`error_${lang}`]);
      });
  };

  // search function
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };
  useEffect(() => {
    if (searchText === "") {
      setDataCarts(data?.data);
    }
    const newData = data?.data?.filter((item) => {
      return (
        (item?.user?.name &&
          item?.user?.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (item?.user?.email &&
          item?.user?.email.toLowerCase().includes(searchText.toLowerCase()))
      );
    });
    setDataCarts(newData);
  }, [searchText]);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [deleteManyCarts, { isLoading: deleteManyLoading }] =
    useDeleteManyCartsMutation();
  const checkboxRef = useRef();
  const [selectedItems, setSelectedItems] = useState([]);
  const handleSelectItems = (event, item) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedItems([...selectedItems, item._id]);
    } else {
      setSelectedItems((prevItems) => {
        return prevItems.filter((selectedId) => selectedId !== item._id);
      });
    }
  };
  const handleSelectAllItems = (event) => {
    const { checked } = event.target;
    !checked
      ? setSelectedItems([])
      : setSelectedItems(() => {
          let ids = dataCarts?.map((cart) => cart._id);
          return ids;
        });
  };
  const handleRemoveSelectedItems = () => {
    deleteManyCarts(selectedItems)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lang}`]);
        setOpenConfirmModal(false);
        setSelectedItems([]);
        setSearchText("");
        checkboxRef.current.checked = false;
        setDataCarts((prevCarts) => {
          return prevCarts.filter((cart) => !selectedItems.includes(cart._id));
        });
      })
      .catch((err) => {
        toast.error(err.data[`error_${lang}`]);
      });
  };
  useEffect(() => {
    if (!openConfirmModal) {
      setSelectedItems([]);
      if (checkboxRef?.current?.checked) {
        checkboxRef.current.checked = false;
      }
    }
  }, [openConfirmModal]);
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
          <Breadcrumbs
            page_en={"Abandoned Carts"}
            page_ar={"السلات المتروكه"}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* search  */}
            <Stack
              px={2}
              gap={2}
              direction={"row"}
              justifyContent={
                selectedItems?.length > 0 && allowed({ page: "cart", role })
                  ? "space-between"
                  : "flex-end"
              }
            >
              {selectedItems?.length > 0 && allowed({ page: "cart", role }) ? (
                <Stack direction={"row"} alignItems={"center"}>
                  <ConfirmDeleteModal
                    open={openConfirmModal}
                    setOpen={setOpenConfirmModal}
                    deleteLoading={deleteManyLoading}
                    handleDelete={handleRemoveSelectedItems}
                  />
                  <Typography>
                    {lang === "en"
                      ? `${selectedItems?.length} selected`
                      : `${selectedItems?.length} تم اختارهم`}
                  </Typography>
                </Stack>
              ) : undefined}
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
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Stack>
            </Stack>

            {/* table */}

            <Box
              sx={{
                maxWidth: { md: "100%", sm: "100%", xs: 340 },
                mx: { xs: "auto", sm: "initial" },
                overflow: "hidden",
              }}
            >
              <Box sx={{ width: "97%", mx: "auto" }} mt={2}>
                {/* head */}
                <TableContainer>
                  <Table
                    sx={{
                      borderCollapse: "separate",
                      borderSpacing: "0px 20px",
                    }}
                  >
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
                          <input
                            type="checkbox"
                            ref={checkboxRef}
                            onChange={(ev) => handleSelectAllItems(ev)}
                            style={{
                              height: "20px",
                              width: "30px",
                              accentColor: customColors.main,
                            }}
                          />
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
                            {lang === "en" ? " Date" : "التاريخ "}
                          </Typography>
                        </TableCell>

                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    {dataCarts?.length === 0 && !isError && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "61%",
                          left: lang === "en" ? "55%" : "45%",
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
                          top: "61%",
                          left: lang === "en" ? "55%" : "45%",
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
                            color: colors.dangerous,
                          }}
                        >
                          {error?.status !== "FETCH_ERROR" ? (
                            <> {error?.data[`error_${lang}`]} </>
                          ) : (
                            <>{error?.error}</>
                          )}
                        </Typography>
                      </Box>
                    ) : (
                      <TableBody>
                        {dataCarts?.map((item, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              bgcolor: selectedItems?.includes(item._id)
                                ? customColors.activeRowBg
                                : customColors.bg,
                              borderRadius: "10px",
                            }}
                          >
                            <TableCell align="center">
                              <input
                                type="checkbox"
                                onChange={(ev) => handleSelectItems(ev, item)}
                                checked={selectedItems?.includes(item._id)}
                                style={{
                                  height: "17.5px",
                                  width: "17.5px",
                                  accentColor: customColors.main,
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              {item?.user?.name}
                            </TableCell>
                            <TableCell align="center">
                              {item?.user?.email ||
                                (lang === "en" ? "No Email" : "لا يوجد بريد")}
                            </TableCell>

                            <TableCell align="center">
                              {item?.cartItems?.length}
                            </TableCell>
                            <TableCell align="center">
                              {lang === "en"
                                ? `${item.totalCartPrice} SAR`
                                : `${item.totalCartPrice}ر.س`}
                            </TableCell>

                            <TableCell align="center">
                              {item.createdAt.slice(0, 10)}
                            </TableCell>

                            <TableCell align="center">
                              {allowed({ page: "cart", role }) ? (
                                <Button
                                  size="small"
                                  onClick={() => {
                                    handleDelete(item);
                                  }}
                                  disabled={deleteCartByIdLoading}
                                  sx={{
                                    backgroundColor: "transparent !important",
                                    color: colors.dangerous,
                                    fontWeight: "bold",
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              ) : (
                                <> </>
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
        </>
      )}
    </Box>
  );
};

export default AbandonedCarts;
