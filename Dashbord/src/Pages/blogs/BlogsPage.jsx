import { useTheme } from "@emotion/react";
import { Box, Grid, Stack, Typography, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Loader from "../../Components/globals/Loader";
import BlogCard from "../../Components/blogs/BlogCard";
import AddIcon from "@mui/icons-material/Add";
import { useGetAllBlogsQuery } from "../../api/blogsApi";
import { useEffect, useState } from "react";

const BlogsPage = () => {
  const { customColors, colors } = useTheme();
  const [, { language }] = useTranslation();
  const navigate = useNavigate();
  const [dataBlogs, setDataBlogs] = useState([]);
  const { data, isLoading, error } = useGetAllBlogsQuery();
  useEffect(() => {
    setDataBlogs(data?.data);
  }, [data]);

  return (
    <Box
      sx={{
        py: "30px",
        px: "20px",
        borderRadius: "1%",
      }}
    >
      <Box py={5}>
        <Typography variant="h4" mb={"10px"}>
          {language === "en" ? "Blogs" : "المدونات"}
        </Typography>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={"50px"}
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
              {language === "en" ? "blogs" : "المدونات"}
            </Typography>
          </Stack>
        </Stack>
        {isLoading ? (
          <Loader extraStyle={{ height: "30vh" }} />
        ) : (
          <Grid container bgcolor={customColors.bg} py={5} px={2}>
            {dataBlogs?.length > 0 && !error
              ? dataBlogs?.map((blog, index) => (
                  <Grid
                    key={index}
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3} /* key={item.id} */
                  >
                    <BlogCard item={blog} />
                  </Grid>
                ))
              : null}
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2.4}>
              <Paper
                elevation={1}
                sx={{
                  bgcolor: customColors.cardAddAdmin,
                  p: 2,
                  borderRadius: 5,
                  gap: 5,
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  minHeight: "236px",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "75%",
                  border: "2px dashed #00e3d2",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/blogs/add`)}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AddIcon
                    sx={{
                      color: "#00e3d2",
                      width: "35px",
                      height: "35px",
                      fontWeight: "bold",
                    }}
                  />
                  <Typography sx={{ color: "#00e3d2" }}>
                    {language === "en" ? "Adding" : "اضافة"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default BlogsPage;
