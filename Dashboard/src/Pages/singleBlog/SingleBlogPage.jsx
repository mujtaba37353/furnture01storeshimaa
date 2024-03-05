import { useTheme } from "@emotion/react";
import { Avatar, Box, CardMedia, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate, useParams } from "react-router-dom";
import BlogCommentCard from "../../Components/blogs/BlogCommentCard";
import { useGetBlogByIdQuery } from "../../api/blogsApi";
import Loader from "../../Components/globals/Loader";
import { imageBaseUrl } from "../../api/baseUrl";

const SingleBlogPage = () => {
  const { colors } = useTheme();
  const [_, { language }] = useTranslation();
  const { blogId } = useParams();
  const {
    data: blogData,
    error: blogError,
    isLoading,
  } = useGetBlogByIdQuery(blogId);
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        py: "30px",
        px: "20px",
        borderRadius: "1%",
        width: 0.99,
      }}
    >
      <Typography variant="h4" mb={"10px"}>
        {language === "en" ? "Blogs" : "المدونات"}
      </Typography>
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
            fontSize: "16px",
          }}
        >
          {language === "en" ? "blogs" : "المدونات"}
        </Typography>
        {blogData && !blogError ? (
          <>
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
              {blogData && !blogError ? blogData.data.title : undefined}
            </Typography>
          </>
        ) : undefined}
      </Stack>
      {isLoading ? (
        <Loader />
      ) : blogData && !blogError ? (
        <>
          <Box mt={"50px"}>
            <CardMedia
              alt={blogData.data.title.slice(0, 10)}
              component="img"
              src={imageBaseUrl + blogData.data.image}
              sx={{
                width: 1,
                height: 600,
                borderRadius: 4.5,
              }}
            />
            <Box
              variant="body1"
              sx={{ fontWeight: "bold", mt: "25px" }}
              dangerouslySetInnerHTML={{
                __html: blogData.data.description,
              }}
            />
          </Box>
          <Box mt={"50px"}>
            {blogData.data.comments.map((comment) => (
              <BlogCommentCard
                item={comment}
                blogId={blogId}
                key={comment._id}
              />
            ))}
          </Box>
        </>
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
            {blogError.data[`error_${language}`]}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SingleBlogPage;
