import { Box, Icon, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import {  useGetAllOrdersEachDayAndTotalMoneyQuery, useGetAllUserSignUpEachDayQuery } from "../../api/history.api";
import { useGetAllCartsQuery } from "../../api/cart.api";
const History = () => {
  const [, { language: lng }] = useTranslation();
  const { data: signUps } = useGetAllUserSignUpEachDayQuery();
  const { data: orders } = useGetAllOrdersEachDayAndTotalMoneyQuery()
  const { data: AbandonedCarts } = useGetAllCartsQuery("?limit=100000")
  const { customColors } = useTheme();

  const data = [
    {
      number: orders?.results || 0,
      title_en: "Daily orders",
      title_ar: "الطلبات اليومية",
      icon: <ShoppingCartOutlinedIcon />,
    },
    {
      number: signUps?.results || 0,
      title_en: "Daily signUps",
      title_ar: "الإشتراكات اليومية",
      icon: <PersonAddAltOutlinedIcon />,
    },
    {
      number: orders?.totalMoney || 0,
      title_en: "Daily income",
      title_ar: "الإيرادات اليومية",
      icon: <AttachMoneyOutlinedIcon />,
    },
    {
      number: AbandonedCarts?.result || 0,
      title_en: "Abandoned carts",
      title_ar: "السلات المتروكة",
      icon: <ProductionQuantityLimitsIcon />,
    },
  ];
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{ gap: 3, justifyContent: "space-evenly" }}
    >
      {data.map((item) => (
        <Stack
          direction={"row"}
          key={item.title_en}
          sx={{
            bgcolor:JSON.parse(localStorage.getItem("darkMode")) ? '#575757' : 'whitesmoke',
            ":hover": {
              borderRight: lng === "ar" && "5px solid #89f26d",
              borderLeft: lng === "en" && "5px solid #89f26d",
              color: JSON.parse(localStorage.getItem("darkMode")) ? 'lightgreen' : "darkgreen",
            },
            borderRight: lng === "ar" && "5px solid #c0f8b1",
            borderLeft: lng === "en" && "5px solid #c0f8b1",
            borderRadius: 0.9,
            py: 1,
            px: 3,
            justifyContent: "space-between",
            width: { md: "calc(99% / 3)", xs: "100%" },
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "1.5rem" }}>{item.number}</Typography>
            <Typography
              sx={{ fontSize: "0.8rem", color: customColors.text }}
            >
              {lng === "en" ? item.title_en : item.title_ar}
            </Typography>
          </Box>
          <Icon
            sx={{
              alignSelf: "center",
              bgcolor: "#d4faf7",
              p: 1,
              width: 40,
              height: 40,
              color: "#00e3d2",
            }}
          >
            {item.icon}
          </Icon>
        </Stack>
      ))}
    </Stack>
  );
};

export default History;
