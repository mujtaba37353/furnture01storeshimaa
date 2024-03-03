import {
  Dialog,
  Typography,
  Stack,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Drawer,
} from "@mui/material";
import { useEffect, useState } from "react";
import ShippingEdit from "./shippingEdit";
import { useCreateShippingByIdMutation } from "../../api/order.api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { OrderStatues } from "./orderStatues";
import { useNavigate } from "react-router-dom";
import "./index.css";
export default function ShippingModal({ open, setOpen, order }) {
  //drawer
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    // setOpenDrawer(!openDrawer)
    // console.log('!openDrawer', !openDrawer)
  };
  const [active, setActive] = useState("");
  const [order_Id, setOrderId] = useState("");
  const { colors, customColors } = useTheme();
  const [errorItems, setErrorItems] = useState([]);
  const [createShippingById, { isLoading: createShippingByIdLoading }] =
    useCreateShippingByIdMutation();
  const [product, setProduct] = useState({});
  const [, { language }] = useTranslation();
  // const [steps, setSteps] = useState([]);
  const [sumQtys, setSubQtys] = useState([]);
  const [reposItems, setReposItems] = useState({
    zero: [],
    moreThan: [],
  });
  const navigate = useNavigate();
  function removeDuplicates(arr, prop) {
    const uniqueMap = arr.reduce((acc, obj) => {
      const key = obj[prop];
      if (!acc.has(key)) {
        acc.set(key, obj);
      }
      return acc;
    }, new Map());
    return Array.from(uniqueMap.values());
  }
  const { products, orderId } = order;
  const allRepos = [
    ...products?.filter((product) => product?.IsOne === true),
    ...products?.filter((product) => product?.IsOne === false),
  ];
  useEffect(() => {
    if (open && order) {
      setOrderId(orderId);
      const concatedRepos = allRepos.reduce(
        (acc, item) => acc.concat(item.Repos),
        []
      );
      const uniqueConcatedRepos = removeDuplicates(concatedRepos, "_id");
      const concatedReposProducts = uniqueConcatedRepos.reduce(
        (acc, item) => acc.concat(item.products),
        []
      );
      const calcSums = (itemId) => {
        let filterItems = concatedReposProducts.filter(
          (repoPro) => repoPro.productId === itemId
        );
        let sumQty = filterItems.reduce((acc, item) => acc + item.quantity, 0);
        return sumQty;
      };

      setSubQtys(
        allRepos.map((item) => ({
          product: {
            _id: item.productId,
            title_en: item.product_title_en,
            title_ar: item.product_title_ar,
          },
          repoQtyAmount: calcSums(item.productId),
        }))
      );
    }
  }, [order, open, order?.products]);
  useEffect(() => {
    setReposItems(() => {
      const reposQtyZero = allRepos.filter((item) => {
        let sumFinded = sumQtys?.find(
          (qtyItem) =>
            item.product === qtyItem.product._id && qtyItem.repoQtyAmount === 0
        );
        return item.product === sumFinded?.product._id;
      });
      let reposQtyMoreZero = allRepos.filter((item) => {
        let sumFinded = sumQtys?.find(
          (qtyItem) =>
            item.product === qtyItem.product._id && qtyItem.repoQtyAmount > 0
        );
        return item.product === sumFinded?.product._id;
      });
      const NoRepo = products?.filter((product) => product?.IsNot === true);
      console.log('NoRepoNoRepo',NoRepo);
      return {
        zero: reposQtyZero.concat(NoRepo),
        moreThan: reposQtyMoreZero,
      };
    });
  }, [sumQtys, sumQtys.length, sumQtys.map((qu) => qu.id).length]);
  const handleClose = () => {
    setOpen(false);
  };
  const ToShipping = (id) => {
    createShippingById(id)
      .unwrap()
      .then((res) => {
        toast.success(
          language === "en"
            ? "Order Added Successfully"
            : "تم تأكيد الطلب بنجاح"
        );
        setOpen(false);
      })
      .catch(() => {
        toast.error(
          language === "en"
            ? "there is an error while adding Your Order"
            : "هناك مشكله في إضافة الطلب "
        );
        // toast.error(err.data[`error_${language}`]);
      });
  };

  const HandleShipping = (id) => {
    const { zero, moreThan } = reposItems;
    if (id !== "" && zero.length && !moreThan.length) {
      ToShipping(id);
    } else if (moreThan.length) {
      let check;
      let error = [];
      moreThan.forEach((item) => {
        if (item.repositories.length > 0) {
          error.push(item?.productId);

          return (check = true);
        } else {
          return (check = false);
        }
      });

      if (error.length) {
        setErrorItems(error);
      }
      check
        ? ToShipping(id)
        : toast.error(
            language === "en"
              ? "there is an error while adding Your Order"
              : "هناك مشكله في اضافه الطلب "
          );
    }
  };

  // MoreThanRepo?.length?true:false||createShippingByIdLoading
  const handleDisabled = () => {
    if (createShippingByIdLoading) {
      return true;
    } else {
      return false;
    }
  };
  // const isChangeMore = MoreThanRepo?.map(item => item?.repositories)
  // useEffect(() => {
  //   MoreThanRepo.forEach(item => {
  //     if(item.repositories.length > 0){
  //       console.log(item)
  //       setProductsOrders({
  //         ...productsOrders,
  //         SucessfullyToShipping:[].push(item)
  //       })
  //      }

  //   })
  //   console.log(productsOrders.SucessfullyToShipping)
  // }, [MoreThanRepo,isChangeMore.length])
  const activeFunction = (item) => {
    // item?._id === active ?
    // 'active' : ''?
    // item?.repositories.length ?'active':''

    if (item?._id === active || item?.repositories.length) {
      return "active";
    } else if (item?.repositories?.length) {
      return "active";
    } else {
      return "";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // gap={3}
      sx={{ borderRadius: "10px !important" }}
      PaperProps={{
        className: "customscroll_2",
        sx: {
          width: reposItems.moreThan?.length
            ? { xs: "95%", md: "80%" }
            : { xs: "95%", md: "80%" },
          maxWidth: "1000px !important",
          position: "relative",
          borderRadius: "10px !important",
          background: colors.bg_main,
          boxShadow: "none",
          padding: "10px 10px",
          overflowX: "hidden",
        },
      }}
    >
      <>
        <Stack
          className="customscroll"
          sx={{
            display: "flex !important",
            justifyContent: "space-between",
            width: "100%",
            height: "fit-conent",
            marginTop: "auto",
          }}
        >
          <Typography
            component={"h3"}
            sx={{
              textAlign: "center",
              textTransform: "upperCase",
              fontSize: { xs: "1.1rem", md: "1.2rem", lg: "1.4rem" },
              fontWeight: "bold",
              mb: 2,
              py: 1,
              position: "sticky",
              top: "0px",
            }}
          >
            {language === "en" ? "Shipping" : "الشحن"}
          </Typography>
          <Button
            sx={{
              position: "absolute",
              top: "-22px",
              zIndex: "10",
              right: "-48px",
              borderRadius: "48%",
              width: "5px !IMPORTANT",
              height: "28px !important",
              padding: "3px",
              color: "#333",
              fontSize: "22px",
            }}
          >
            x
          </Button>
        </Stack>
        {/* 3boxes container  */}
        <Stack direction={"column"} spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent={"space-between"}
          >
            {reposItems.zero?.length > 0 ? (
              <Box flex={1}>
                {reposItems.zero?.length > 0 ? (
                  <Box
                    className={"customscroll"}
                    sx={{
                      background: colors.bg_main,
                      maxHeight: "300px",
                      padding: "10px 5px",
                      borderRadius: "10px",
                      boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                      margin: "5px",
                      overflow: "auto",
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontSize: { xs: "1rem", lg: "1.2rem" },
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    >
                      {language === "en"
                        ? "Automatic Shipping"
                        : "الشحن التلقائي"}
                    </Typography>
                    {reposItems.zero?.map((item) => {
                      return (
                        <Box key={item.product} sx={{ position: "relative" }}>
                          <List
                            sx={{
                              width: "100%",
                              // maxWidth: 360,
                            }}
                          >
                            <ListItem
                              className="completed"
                              sx={{
                                // direction: 'lrt',
                                flexDirection:
                                  language === "en" ? "row-reverse" : "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                border: "1px solid #00e3d26b",
                                borderRadius: "10px",
                                padding: 1,
                                bgcolor: "transparent",
                              }}
                            >
                              <ListItemAvatar>
                                <OrderStatues
                                  item={item}
                                  text={
                                    language === "en"
                                      ? "Completed Order"
                                      : "طلب مكتمل"
                                  }
                                  number={1}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  item?.product_title_en
                                    ? item[`product_title_${language}`]
                                    : item.productDetails[`title_${language}`]
                                }
                                secondary={
                                  item?.isCash
                                    ? language === "en"
                                      ? "Cash"
                                      : "كاش"
                                    : language === "en"
                                    ? "Online"
                                    : "اونلاين"
                                }
                              />
                            </ListItem>
                          </List>
                        </Box>
                      );
                    })}
                  </Box>
                ) : null}
              </Box>
            ) : null}

            {reposItems.moreThan.length > 0 ? (
              <Box
                className={"customscroll"}
                flex={1}
                sx={{
                  background: colors.bg_main,
                  maxHeight: "300px",
                  overflow: "auto",
                  // height: 'fit-content',
                  padding: "10px 5px",
                  borderRadius: "10px",
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  margin: "5px",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: { xs: "1rem", lg: "1.2rem" },
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  {language === "en"
                    ? "Multi-Repository Products"
                    : "المنتجات المتعددة المستودعات"}
                </Typography>

                {reposItems.moreThan.map((item) => {
                  return (
                    <Box>
                      {/* product */}
                      <Stack
                        onClick={(e) => {
                          setProduct(item);
                          setActive(item?._id);
                          navigate("#Modal");
                          toggleDrawer(e);
                          setOpenDrawer(true);
                        }}
                        className={activeFunction(item)}
                        sx={{
                          padding: "10px",
                          border: "1px solid",
                          margin: "10px",
                          borderRadius: "4px",
                          cursor: "pointer ",
                          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                          "&.active": {
                            borderColor: "#00e3d26b",
                          },
                          "&:hover": {
                            borderColor: "#00e3d26b",
                          },
                        }}
                      >
                        {language === "en"
                          ? item?.product_title_en
                          : item?.product_title_ar}
                        <ListItem
                          sx={{
                            direction: "lrt",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: "10px",
                            padding: 1,
                            bgcolor: "transparent",
                            marginBottom: "10px",
                            "&.active": {
                              borderColor: "#00e3d26b",
                            },
                            "&:hover": {
                              borderColor: "#00e3d26b",
                            },
                          }}
                        >
                          {item?.repositories.length ? (
                            <OrderStatues
                              item={item}
                              text={
                                language === "en"
                                  ? "Completed Order"
                                  : "طلب مكتمل"
                              }
                              number={1}
                            />
                          ) : (
                            <OrderStatues
                              item={item}
                              text={
                                language === "en"
                                  ? "Not Completed Order"
                                  : "طلب  غير مكتمل"
                              }
                              number={2}
                            />
                          )}
                          <ListItemText
                            secondary={item?.isCash ? "Cash" : "Online"}
                          />
                        </ListItem>
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            ) : null}
          </Stack>
          {/* table  */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {reposItems.moreThan.length > 0 ? (
              <ShippingEdit
                id="Modal"
                setActive={setActive}
                orderId={order_Id}
                selectedProduct={product}
                active={active}
                isOne={reposItems.moreThan.length}
                open={open}
                setProduct={setProduct}
              />
            ) : null}
          </Box>
          <Drawer
            anchor="bottom"
            open={openDrawer}
            onClose={() => {
              setOpenDrawer(false);
            }}
            sx={{
              display: { xs: "flex", md: "none" },
              zIndex: { xs: "100000", md: "0" },
              height: "90% !important",
            }}
          >
            <ShippingEdit
              id="Modal"
              setActive={setActive}
              orderId={order_Id}
              selectedProduct={product}
              active={active}
              isOne={reposItems.moreThan.length}
              open={open}
              setProduct={setProduct}
            />
          </Drawer>
        </Stack>
      </>
      <Stack
        sx={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          mt: "20px",
          // margin: "10px",
          gap: 2,
        }}
      >
        <Button
          disabled={handleDisabled()}
          variant="contained"
          type="submit"
          sx={{
            background: "linear-gradient(15deg, #00d5c5fc, black)",
            margin: "10px auto",
            width: "fit-content",
            color: `white !important`,
            px: "70px",
          }}
          onClick={() => HandleShipping(order_Id)}
        >
          {language === "en" ? "Shipping Now" : " اشحن الان"}
        </Button>
      </Stack>
    </Dialog>
  );
}
