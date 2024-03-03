import { Box, Button, CardMedia, Stack, Typography } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { imageBaseUrl } from "../../api/baseUrl";

import { useDeleteBlogMutation } from "../../api/blogsApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const BlogCard = ({ item }) => {
  const [deleteBlog] = useDeleteBlogMutation();
  const [, { language: lang }] = useTranslation();
  const navigate = useNavigate();
  const handleDelete = () => {
    deleteBlog(item._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lang}`]);
      })
      .catch((error) => {
        toast.error(error.data[`error_${lang}`]);
      });
  };
  return (
    <Box
      elevation={1}
      sx={{
        wordBreak: "break-word",
        gap: 5,
        bgcolor: "transparent",
        height: "600px",
        width: {
          lg: 0.9,
          md: 0.95,
          xs: 1,
        },
        mx: "auto",
        mb: "60px",
      }}
    >
      <Link to={`/blogs/${item._id}`}>
        <CardMedia
          component={"img"}
          src={imageBaseUrl + item.image}
          sx={{
            height: "70%",
            borderRadius: 2,
            border: `1px solid #aaa`,
          }}
        />
      </Link>
      <Box
        sx={{
          height: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mt: "10px", textAlign: "left" }}
        >
          {item.title.split(" ").length > 10
            ? item.title.trim().split(/\s+/).slice(0, 15).join(" ")
            : item.title}
        </Typography>
        <Box
          sx={{
            textAlign: "left",
            direction: "ltr",
            height: 200,
          }}
          dangerouslySetInnerHTML={{
            __html:
              item?.description.split(" ").length > 10
                ? `${item.description
                    .trim()
                    .split(/\s+/)
                    .slice(0, 15)
                    .join(" ")}...`
                : item.description,
          }}
        />
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-start"}
          gap={"10px"}
          mb={"7px"}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "transparent !important",
              textTransform: "capitalize",
              color: "#00E3D2",
              border: 1,
              borderColor: "#00E3D2",
            }}
            onClick={() => navigate(`/blogs/edit/${item._id}`)}
          >
            {lang === "en" ? "Edit" : "تعديل"}
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#e35959 !important",
              textTransform: "capitalize",
              color: "white",
            }}
            onClick={handleDelete}
          >
            {lang === "en" ? "delete" : "حذف"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default BlogCard;
