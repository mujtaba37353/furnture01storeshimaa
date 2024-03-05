import { Badge, IconButton, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationsButton = ({ colors, unreadNots, handleClick, lng }) => {
  return (
    <IconButton
      aria-label="more"
      id="long-button"
      aria-controls={open ? "long-menu" : undefined}
      aria-expanded={open ? "true" : undefined}
      aria-haspopup="true"
      onClick={handleClick}
    >
      <Tooltip
        title={lng === "en" ? "Notifications" : "الإشعارات"}
        sx={{
          cursor: "pointer",
          bgcolor: `${colors.bg_main}!important`,
          py: {
            md: 1,
            xs: 0.75,
          },
          px: {
            md: 1.2,
            xs: 0.8,
          },

          borderRadius: 1,
        }}
      >
        <Badge
          badgeContent={unreadNots?.length}
          color="primary"
          overlap="circular"
        >
          <NotificationsIcon color="action" fontSize="medium" />
        </Badge>
      </Tooltip>
    </IconButton>
  );
};

export default NotificationsButton;
