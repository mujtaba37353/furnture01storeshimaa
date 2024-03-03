import { Box, useTheme } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { useGetAllStatusDetailsQuery } from "../../api/history.api";
import { useTranslation } from "react-i18next";

const PolarChart = () => {
  const { data } = useGetAllStatusDetailsQuery();
  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();


  const statusArabic = {
    completed: "تم التسليم",
    created: "تم الإنشاء",
    initiated: "طلب غير مكتمل",
    onDelivered: "في الشحن",
    onGoing: "قيد التنفيذ",
    refund: "مرفوض",
  };
  let statusDetailsShow = {};
  if(language === "ar" && data?.statusDetails){
    statusDetailsShow = Object.keys(data?.statusDetails).reduce((acc, key) => {
      acc[statusArabic[key]] = data?.statusDetails[key];
      return acc;
    }, {});
  }
  else{
    statusDetailsShow = data?.statusDetails;
  }

  const state = {
    series: data?.statusDetails && Object.values(data?.statusDetails),
    options: {
      labels: data?.statusDetails && Object.keys(statusDetailsShow),

      chart: {
        type: "polarArea",
      },
      stroke: {},
      fill: {
        opacity: 1,
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    data?.statusDetails && (
      <Box
        component={ReactApexChart}
        options={state.options}
        series={state.series}
        type="polarArea"
        height={{ lg: 400, md: 400, sm: 300, xs: 300 }}
        width={{ lg: 400, md: 400, sm: 300, xs: "100%" }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: customColors.text === "#fff" ? "#575757" : "whitesmoke",
          m: 3,
        }}
      />
    )
  );
};

export default PolarChart;

