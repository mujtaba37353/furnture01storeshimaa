import { Badge, IconButton, Tooltip } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
const NotificationsButton = ({ unreadNots, handleClick, lng }) => {
  return (
    <IconButton
      aria-label="more"
      id="long-button"
      aria-controls={open ? 'long-menu' : undefined}
      aria-expanded={open ? 'true' : undefined}
      aria-haspopup="true"
      onClick={handleClick}
      className='icon_nav'
      sx={{
        width: {
          md: 50,
          xs: 40,
        },
        height: {
          md: 30,
          xs: 40,
        },
        // marginBottom:{md:'4px !important'},

      }}
    >
      <Tooltip
        title={lng === 'en' ? 'Notifications' : 'الإشعارات'}
        sx={{
          cursor: 'pointer',
          bgcolor: 'transparent !important',
          py: { xs: 0.5, md: 0.8 },
          px: { xs: 1, md: 1.5 },
          borderRadius: 1,
        }}
      >
        <Badge
          badgeContent={unreadNots?.length}
          color="primary"
          overlap="circular"
          sx={{
            '& > .MuiBadge-badge': {
              bgcolor: '#fff',
               width:'10px !important',
                fontSize:'13px',
               padding:'5px !important'
            },
            position:'relative'
          }}
        >
          <NotificationsIcon
            color="action"
            sx={{
              fontSize: {
                lg: '30px ',
                xs: '30px',
              },
              color: '#fff',
            }}
          />
         </Badge>
      </Tooltip>
    </IconButton>
  )
}

export default NotificationsButton
