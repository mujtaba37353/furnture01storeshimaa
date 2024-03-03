import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { useGetAllProductsQuery } from "../../api/product.api";
import { useTranslation } from "react-i18next";
import { imageBaseUrl } from "../../api/baseUrl";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";

const MostSellingHome = () => {
  const { data, isSuccess } = useGetAllProductsQuery("?limit=100&sort=-sales");
  const { customColors } = useTheme();

  const [, { language: lng }] = useTranslation();
  const nav = useNavigate();
  return (
    <Box sx={{ my: 5, bgcolor: customColors.bg, borderRadius: "5px" }}>
      <Typography variant="h5" sx={{ py: "20px" }}>
        {lng === "en" ? "Most selling" : "الأكثر مبيعًا"}
      </Typography>
      <Divider sx={{ height: "3px" }}></Divider>
      <Stack sx={{ gap: 3 }}>
        {isSuccess &&
          data.data.map(
            (item) =>
              item.sales > 0 && (
                <Stack
                  key={item._id}
                  direction={"row"}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    m: 3,
                    cursor: "pointer",
                  }}
                  onClick={() => nav(`/products/${item._id}`)}
                >
                  <Stack direction={"row"} gap={2} alignItems={"center"}>
                    <img
                      src={imageBaseUrl + item.images[0]}
                      width={100}
                      height={100}
                    />
                    <Box>
                      <Typography>{item[`title_${lng}`]}</Typography>
                      <Typography>
                        {item.priceAfterDiscount > 0
                          ? item.priceAfterDiscount
                          : item.priceBeforeDiscount}{" "}
                        <Box
                          component={"span"}
                          sx={{
                            textDecoration: "line-through",
                            fontSize: "0.8rem",
                          }}
                        >
                          {item.priceAfterDiscount > 0 &&
                            item.priceBeforeDiscount}
                        </Box>
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography>
                    {item.sales} {lng === "en" ? "Sales" : "مبيعات"}
                  </Typography>
                </Stack>
              )
          )}
      </Stack>
    </Box>
  );
};

export default MostSellingHome;
