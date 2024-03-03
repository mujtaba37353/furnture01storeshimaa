import { useTheme } from "@emotion/react";
import { Box, InputBase, Pagination, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductsFilteration from "../../Components/product/ProductsFilteration";
import SearchIcon from "@mui/icons-material/Search";
import { useFetchProducts } from "../../hooks/products.hooks";
import Loader from "../../Components/globals/Loader";
import ProductCard from "../../Components/product/ProductCard";
const ProductsPage = () => {
  const { colors } = useTheme();
  const [, { language }] = useTranslation();
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    title: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    page: 1,
    limit: 12,
  });
  const handleChangeFilter = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handeChangePagination = (_, value) => {
    setFilter({
      ...filter,
      page: value,
    });
  };

  useEffect(() => {
    setFilter({
      ...filter,
      subCategory: "",
      subSubCategory: "",
    });
  }, [filter.category]);
  useEffect(() => {
    setFilter({
      ...filter,
      subSubCategory: "",
    });
  }, [filter.subCategory]);
  const [queries, setQueries] = useState("");
  const { products, isLoading } = useFetchProducts(
    queries ? `?${queries}` : null
  );
  const handleNavigateToEditPage = (route) => navigate(route);
  useEffect(() => {
    const fetching = setTimeout(() => {
      const fields = Object.keys(filter).filter((key) => filter[key]);
      const joinedFields = fields
        .map((item) => {
          switch (item) {
            case "title":
              return `keyword[title_${language}]=${filter.title}`;
            case "page":
              return `${item}=${filter.page}`;
            case "limit":
              return `${item}=${filter.limit}`;
            default:
              return `${item}=${filter[item]}`;
          }
        })
        .join("&");
      setQueries(joinedFields);
    }, 500);
    return () => clearTimeout(fetching);
  }, [filter]);
  const checkRenderPagiantion =
    (products.data[0] && !products.error) ||
    (!products.data[0] && products.error && filter.page > 1);
  return (
    <Box
      sx={{
        py: {
          lg: 3,
          md: 2.5,
          xs: 2,
        },
        px: {
          lg: 4,
          md: 2.5,
          xs: 2,
        },
      }}
    >
      <Box
        sx={{
          width: 0.97,
        }}
      >
        <Box py={5}>
          <Typography variant="h4" mb={"10px"}>
            {language === "en" ? "products" : "المنتجات"}
          </Typography>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack direction={"row"} alignItems={"center"} gap={"10px"}>
              <Typography
                variant="h6"
                onClick={() => navigate("/")}
                sx={{
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {language === "en" ? "Home" : "الصفحة الرئيسية"}
              </Typography>
              <ArrowForwardIosIcon
                sx={{
                  transform: language === "ar" ? "rotateY(180deg)" : 0,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: colors.main,
                  fontSize: "16px",
                }}
              >
                {language === "en" ? "products" : "المنتجات"}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Stack direction={"row"} justifyContent={"flex-end"}>
          <ProductsFilteration
            language={language}
            filter={filter}
            handleChangeFilter={handleChangeFilter}
          />
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          px={2}
          sx={{
            background:
              " linear-gradient(90deg,rgba(207, 249, 170, 1) 0%,rgba(117, 219, 209, 1) 100%)",
            borderRadius: "15px",
            height: "40px",
            width: { xs: 1, md: 300 },
            mt: 5,
            mb: 7,
          }}
        >
          <SearchIcon />
          <InputBase
            sx={{
              width: "auto",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent !important",
                outline: "none !important",
                backgroundColor: "transparent !important",
              },
            }}
            placeholder={language === "en" ? "Search" : "ابحث هنا"}
            onChange={(event) => handleChangeFilter(event)}
            value={filter.title}
            name={"title"}
          />
        </Stack>
        {isLoading ? (
          <Loader />
        ) : products.data[0] && !products.error ? (
          <Stack
            direction={"row"}
            flexWrap={"wrap"}
            sx={{
              gap: {
                xl: "2.65%",
                lg: "5%",
                md: "10%",
                xs: 0,
              },
            }}
          >
            {products.data.map((item, index) => (
              <ProductCard
                key={index}
                item={item}
                language={language}
                handleNavigateToEditPage={handleNavigateToEditPage}
                setFilter={setFilter}
              />
            ))}
          </Stack>
        ) : (
          <Box py={5}>
            <Typography
              align={"center"}
              sx={{
                color: colors.dangerous,
                fontSize: {
                  md: "30px",
                  xs: "25px",
                },
              }}
            >
              {products.error}
            </Typography>
          </Box>
        )}
        {!isLoading ? (
          checkRenderPagiantion ? (
            <Stack direction={"row"} my={"30px"} justifyContent={"center"}>
              <Pagination
                onChange={(_, value) => handeChangePagination(_, value)}
                count={products.totalPages}
                value={filter.page}
                name="page"
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          ) : null
        ) : null}
      </Box>
    </Box>
  );
};

export default ProductsPage;
