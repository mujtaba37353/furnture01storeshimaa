import { Box, useTheme } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { useGetAllOrdersEachMonthQuery } from "../../api/history.api";
const AreaChart = () => {
  const [, { language }] = useTranslation();
  const { data } = useGetAllOrdersEachMonthQuery();
  const monthsArray =
    data?.months &&
    Object.entries(data?.months).map(([month, value]) => ({
      x: month,
      y: value,
    }));
  const { customColors } = useTheme();

  const MainTitle = language === "en" ? "Fundamental Analysis of Stocks" : "التحليل الأساسي للأسهم" ;
  const SubTitle = language === "en" ? "Price Movements" : "حركات الأسعار";


  const state = {
    series: [
      {
        name: "Sellings",
        data: monthsArray,
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 5,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 5,
        fill: {
          type: "solid",
          colors: ["#00e3d2"],
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["#00e3d2", "#e5fcfa"], // optional, if not defined - uses the shades of same color in series
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.3,
          stops: [0, 100],
          colorStops: [],
        },
      },
      title: {
        text: MainTitle,
        align: "center",
        style: { color: customColors.text },
      },
      subtitle: {
        text: SubTitle,
        align: "center",
        style: { color: customColors.text },
      },
      labels: ["test", "test2", "test3", "test4"],

      xaxis: {
        type: "category",
        labels: {
          style: {
            colors: customColors.text ,
          }
        }
      },
      yaxis: {
        opposite: language === "en" ? true : false,
        labels: {
          style: {
            colors: customColors.text ,
          }
        }
      },
      legend: {
        horizontalAlign: "center",
      },

    },
  };

  return (
    <Box
      component={ReactApexChart}
      options={state.options}
      series={state.series}
      type="area"
      // height={500}
      width={{ lg: 600, xs: "100%" }}
      sx={{
        height:400,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: customColors.text === "#fff" ? "#000" : "#fff",
        bgcolor:customColors.text === '#fff'? '#575757':'whitesmoke',
        m:3,
        p:{md:2, xs:0.5}
      }}
    />
  );
};

export default AreaChart;
