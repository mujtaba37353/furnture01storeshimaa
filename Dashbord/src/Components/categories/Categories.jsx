import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { useGetAllCategoriesQuery } from "../../api/category.api";
import CategoryCard from "./CategoryCard";
import useSearch from "../../hooks/useSearch";

const OrderLoading = () => {
  const { customColors } = useTheme();
  return (
    <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
      <CircularProgress sx={{ color: customColors.main }} />
    </Box>
  );
};

const OrderError = ({ error }) => {
  const { colors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  return (
    <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "20px", sm: "25px", lg: "30px" },
          color: "red",
        }}
      >
        {error?.status !== "FETCH_ERROR" ? (
          <> {error?.data[`error_${lang}`]} </>
        ) : (
          <>{error?.error}</>
        )}
      </Typography>
    </Box>
  );
};

function Categories() {
  const { addToSearch, search } = useSearch();
  const { data, isLoading, isError, isSuccess, error } =
    useGetAllCategoriesQuery(search);
  const {
    i18n: { language },
  } = useTranslation();
  const { customColors } = useTheme();

  useEffect(() => {
    addToSearch({ key: "limit", value: "1000" });
  }, [search]);

  console.log(error);
  if (isLoading) return <OrderLoading />;

  return (
    <>
      {!isError && isSuccess ? (
        <div>
          <TableContainer component={Paper} sx={{ minWidth: "100%" }}>
            <Table sx={{ minWidth: "100%" }}>
              <TableHead
                sx={{ bgcolor: customColors.secondary, borderRadius: "5px" }}
              >
                <TableRow>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      #
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {language === "en" ? "Icon" : "الايقونة"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {language === "en" ? "Category" : "الفئة"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {language === "en" ? "Products" : "المنتجات"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {language === "en" ? "Total" : "الاجمالي"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>

              {data?.data.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colspan="6">
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
                        {language === "en"
                          ? "No Main Categories"
                          : "لا يوجد اقسام رئيسية"}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {error && (
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "red",
                        fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                      }}
                    >
                      {error?.data[`error_${language}`]}
                    </Typography>
                  )}
                  {isSuccess &&
                    !error &&
                    data.data.map((category, index) => (
                      <CategoryCard key={index} index={index} data={category} />
                    ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Categories;
