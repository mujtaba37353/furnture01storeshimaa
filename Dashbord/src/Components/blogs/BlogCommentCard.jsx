import { useTheme } from "@emotion/react";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  Button,
  InputBase,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentReblyCard from "./CommentReblyCard";
import { useTranslation } from "react-i18next";
import SendIcon from "@mui/icons-material/Send";
import { imageBaseUrl } from "../../api/baseUrl";
import {
  useAddReplyForCommentMutation,
  useDeleteCommentMutation,
} from "../../api/blogsApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import moment from "moment";
const BlogCommentCard = ({ item }) => {
  const { customColors } = useTheme();
  const [_, { language }] = useTranslation();
  const { blogId } = useParams();
  const [text, setText] = useState("");
  const [addReplyForComment] = useAddReplyForCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const handleAddReply = () => {
    addReplyForComment({
      blogId,
      payload: {
        commentId: item._id,
        reply: text,
      },
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
        setText("");
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`]);
      });
  };
  const handleDeleteComment = () => {
    deleteComment({
      blogId,
      payload: {
        commentId: item._id,
      },
    })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`]);
      });
  };

  const customMoment=(time)=>{
    const custom= moment(time).locale(language).fromNow()
   
    return custom
  }

  return (
    <Stack direction={"row"} alignItems={"flex-start"} gap={"10px"} mb={"30px"}>
      <Avatar src={imageBaseUrl + item.user.userId.image} />
      <Box
        sx={{
          width: 0.98,
        }}
      >
        <Box
          sx={{
            bgcolor: customColors.secondary,
            p: 2,
            borderRadius: 4,
          }}
        >
          <Typography variant="h6" fontWeight={"bold"}>
            {item.user.userId.name} {language === "en" ? "(User)" : "(مستخدم)"}
          </Typography>
          <Typography>{item.comment}</Typography>
        </Box>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={"15px"}
          mt={"10px"}
        >
          <Typography>{customMoment(item.createdAt)}</Typography>
          <Button sx={{ minWidth: 0 }} onClick={handleDeleteComment}>
            <DeleteIcon
              sx={{
                color: "#F4673B",
                cursor: "pointer",
              }}
            />
          </Button>
        </Stack>
        <Box mt={"10px"}>
          {item.replies.map((reply) => (
            <CommentReblyCard
              customColors={customColors}
              item={reply}
              blogId={blogId}
              commentId={item._id}
            />
          ))}
        </Box>
        <Box
          sx={{
            position: "relative",
            border: `1px solid #aaaa`,
            borderRadius: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <InputBase
            type="text"
            sx={{
              py: 1,
              px: 3,
              width: 0.97,
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode === 13 && e.target.value) {
                handleAddReply();
              }
            }}
          />
          <Button
            sx={{
              width: 0.03,
              minWidth: 0,
            }}
            onClick={handleAddReply}
          >
            <SendIcon
              sx={{
                transform: language === "ar" ? "rotate(180deg)" : "rotate(0)",
              }}
            />
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default BlogCommentCard;
