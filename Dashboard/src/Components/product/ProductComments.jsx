import { useTheme } from "@emotion/react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  useDeleteCommentFromProductByAdminMutation,
  useGetAllCommentsForProductQuery,
} from "../../api/comment.api";
import { imageBaseUrl } from "../../api/baseUrl";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import moment from "moment";
const CommentCard = ({ item, language, colors }) => {
  const [deleteCommentFromProductByAdmin] =
    useDeleteCommentFromProductByAdminMutation();
  const handleRemoveComment = () => {
    deleteCommentFromProductByAdmin(item._id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
      })
      .catch((err) => {
        toast.success(err.data[`error_${language}`]);
      });
  };
  const customMoment = () => {
    const checkCommentChange = item.createdAt !== item.updatedAt;
    const Custom = moment(checkCommentChange ? item.updatedAt : item.createdAt)
      .locale(language)
      .fromNow();
    return Custom;
  };
  return (
    <Box
      border={1}
      borderColor={"divider"}
      mb={"20px"}
      p={"15px"}
      position={"relative"}
    >
      <Stack direction={"row"} alignItems={"flex-start"} gap={"10px"}>
        <Avatar src={imageBaseUrl + item.user.image} />
        <Box>
          <Typography
            sx={{
              fontSize: "17px",
            }}
            fontWeight={"bold"}
          >
            {item.user.name}
          </Typography>
          <Typography variant={"body1"}>{item.comment}</Typography>
        </Box>
      </Stack>

      <CloseIcon
        sx={{
          position: "absolute",
          top: 0,
          left: language === "ar" ? 0 : undefined,
          right: language === "en" ? 0 : undefined,
          color: colors.dangerous,
          cursor: "pointer",
        }}
        onClick={handleRemoveComment}
      />
      <Typography
        sx={{
          position: "absolute",
          top: 0,
          left: language === "ar" ? "40px" : undefined,
          right: language === "en" ? "40px" : undefined,
        }}
      >
        {customMoment()}
      </Typography>
    </Box>
  );
};

const ProductComments = ({ productId }) => {
  const { colors } = useTheme();
  const [_, { language }] = useTranslation();
  const { data, isLoading } = useGetAllCommentsForProductQuery(productId);
  if (isLoading) {
    return;
  }

  return (
    <Box
      sx={{
        p: 2,
        width: {
          md: 0.75,
          xs: 1,
        },
        mx: "auto",
        direction: language === "en" ? "ltr" : "rtl",
        mb: "50px",
        pb: "40px",
        border: 1,
        borderColor: "divider",
        mt: "30px",
      }}
    >
      <Box py={"15px"} mb={"15px"}>
        <Typography
          variant="h6"
          sx={{
            color: colors.text,
            textAlign: "center",
          }}
        >
          {language === "en" ? "product comments" : "تعليقات المنتج"}
        </Typography>
      </Box>

      {data?.data.length > 0 ? (
        data?.data.map((item) => (
          <CommentCard
            item={item}
            key={item._id}
            colors={colors}
            language={language}
          />
        ))
      ) : (
        <Typography variant="h5" color={colors.dangerous} align="center">
          {language === "en" ? "There are no comments" : "لا توجد تعليقات"}
        </Typography>
      )}
    </Box>
  );
};

export default ProductComments;
