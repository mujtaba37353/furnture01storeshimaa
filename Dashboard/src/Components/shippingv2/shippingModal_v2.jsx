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
  import ShippingEdit from "../shippingComponents/shippingEdit";
  import { useCreateShippingByIdMutation } from "../../api/order.api";
  import { toast } from "react-toastify";
  import { useTranslation } from "react-i18next";
  import { useTheme } from "@emotion/react";
  import { OrderStatues } from "../shippingComponents/orderStatues";
  import { useNavigate } from "react-router-dom";
   import ShippingTabs from './handleTabs';
  export default function ShippingModal_2({ open, setOpen, order,setData}) {
    //drawer
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
    const handleClose = () => {
        setOpen(false);
      };
      console.log(order,'orderorder')
    console.log(order)
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen
        fullWidth
        // gap={3}
        sx={{ borderRadius: "10px !important" }}
        PaperProps={{
          className: "customscroll_2",
          sx: {
            // width: reposItems.moreThan?.length
            //   ? { xs: "95%", md: "80%" }
            //   : { xs: "95%", md: "80%" },
             position: "relative",
            borderRadius: "10px !important",
            background: colors.bgmain,
            boxShadow: "none",
            padding: "10px 10px",
            overflowX: "hidden",
            borderRadius:'0px'
          },
        }}
      >
        <ShippingTabs setOpen={setOpen} order={order}  setData={setData}/>
      </Dialog>
    );
  }
  