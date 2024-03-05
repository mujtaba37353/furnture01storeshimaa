import { Box, Card, CardMedia, Paper, Stack, Typography } from "@mui/material";
import { imageBaseUrl } from "../../api/baseUrl";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteProduct } from "../../hooks/products.hooks";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
const ProductCard = ({
  
  item,
  handleNavigateToEditPage,
  language,
  setFilter,
}) => {
  const [deleteProduct] = useDeleteProduct();
  const { role } = useSelector((state) => state.user);
  return (
    <Box
      sx={{
        width: {
          xl: 0.23,
          lg: 0.3,
          md: 0.45,
          xs: 0.9,
        },
        overflow: "hidden",
        borderRadius: "10px",
        mb: 5,
        mx: {
          md: "initial",
          xs: "auto",
        },
        position: "relative",
        "&:hover > .actions-list ": {
          opacity: 1,
        },
      }}
    >
      <CardMedia
        component="img"
        height={300}
        src={`${imageBaseUrl}${item.images[0]}`}
      />
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography
          variant="h6"
          width={0.7}
          sx={{
            wordBreak: "break-word",
          }}
        >
          {item[`title_${language}`]}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: "18px",
            width: 0.3,
          }}
        >
          {item.finalPrice}
          {` ${language === "en" ? "SAR" : "ر.س"}`}
        </Typography>
      </Stack>
      <Box
        className="actions-list"
        sx={{
          position: "absolute",
          bgcolor: "#fff",
          right: language === "en" ? "10%" : null,
          left: language === "ar" ? "10%" : null,
          top: 0,
          px: "5px",
          height: role === "rootAdmin" ? 100 : "auto",
          borderRadius: "0 0 10px 10px",
          opacity: 0,
          py: role !== "rootAdmin" ? 1 : 0,

          transition: "all 0.4s",
        }}
      >
        {allowed({ page: "products", role }) ? (
          <EditIcon
            sx={{
              fontSize: "20px",
              display: "block",
              mt: 2,
              cursor: "pointer",
              color: "#00D5C5",
            }}
            onClick={() =>
              handleNavigateToEditPage(`/products/edit/${item._id}`)
            }
          />
        ) : null}

        <RemoveRedEyeIcon
          sx={{
            fontSize: "20px",
            display: "block",
            my: 0.5,
            cursor: "pointer",
            color: "#207AB7",
          }}
          onClick={() => handleNavigateToEditPage(`/products/${item._id}`)}
        />
        {allowed({ page: "products", role }) ? (
          <DeleteIcon
            sx={{
              fontSize: "20px",
              display: "block",
              cursor: "pointer",
              color: "#C75050",
            }}
            onClick={() => deleteProduct(item, setFilter)}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default ProductCard;
