import { Stack, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import moment from "moment";
import { useMarkNotificationAsReadMutation } from "../../api/NotificationsApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
const NotifyItem = ({ message, createdAt, read, _id, setAnchorEl }) => {
  const [, { language: lng }] = useTranslation();
  const navigate = useNavigate();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const handleMarkAsRead = (_id) => {
    markNotificationAsRead({ id: _id, payload: { read: true } })
      .unwrap()
      .then((res) => {
        console.log(res[`success_${lng === "en" ? "en" : "ar"}`]);
      })
      .catch((e) => {
        toast.error(e[`error_${lng === "en" ? "en" : "ar"}`]);
      });
  };
  const { colors } = useTheme();
  return (
    <Stack
      onClick={() => {
        localStorage.setItem("notifyId", _id);
        navigate(`/notifications`);
        {
          !read && handleMarkAsRead(_id);
        }
        setAnchorEl(null);
      }}
      sx={{ width: "100%" }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={1}
        sx={{ overflow: "hidden" }}
      >
        <FiberManualRecordIcon
          sx={{
            fontSize: "11px",
            color: read ? colors.light : "#007aff",
          }}
        />
        <Typography
          sx={{ fontSize: "17px", color: colors.notify }}
        >{`${message}`}</Typography>
      </Stack>
      <Typography
        sx={{ fontSize: "12px", color: colors.light, pl: 2 }}
      >{`${moment(createdAt).fromNow()}`}</Typography>
    </Stack>
  );
};

export default NotifyItem;
