import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { imageBaseUrl } from "../../api/baseUrl";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteReplyFromCommentMutation } from "../../api/blogsApi";
import { toast } from "react-toastify";
import { DateDifference } from "./calcDateAgo";
import { date } from "yup";
import moment from "moment/moment";

const CommentReblyCard = ({ customColors, item, commentId, blogId }) => {
  const [_, { language: lang }] = useTranslation();
  const [deleteReplyFromComment] = useDeleteReplyFromCommentMutation();
  const handleDeleteReply = () => {
    deleteReplyFromComment({
      blogId,
      payload: {
        commentId,
        replyId: item._id,
      },
    })
      .unwrap()
      .then((res) => toast.success(res[`success_${lang}`]))
      .catch((error) => toast.error(error.data[`error_${lang}`]));
  };
  moment.locale(lang);
  return (
    <Box>
      <Stack
        sx={{
          width: 0.99,
          mr: lang === "ar" ? "auto" : 0,
          ml: lang === "en" ? "auto" : 0,
          mb: "10px",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: "7.5px",
        }}
      >
        <Avatar src={imageBaseUrl + item.user.userId.image} />
        <Box
          sx={{
            bgcolor: customColors.secondary,
            borderRadius: 4,
            p: 2,
            width: 0.96,
          }}
        >
          <Typography variant="h6" fontWeight={"bold"}>
            {item.user.userId.name}
          </Typography>
          <Typography>{item.reply}</Typography>
        </Box>
      </Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        gap={"15px"}
        mt={"10px"}
      >
        <Typography>{moment(item.createdAt).locale(lang).fromNow()}</Typography>
        <Button sx={{ minWidth: 0 }} onClick={handleDeleteReply}>
          <DeleteIcon
            sx={{
              color: "#F4673B",
              cursor: "pointer",
            }}
          />
        </Button>
      </Stack>
    </Box>
  );
};

export default CommentReblyCard;
