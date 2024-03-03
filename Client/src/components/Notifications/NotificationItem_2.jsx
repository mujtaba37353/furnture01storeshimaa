import { Stack, Typography } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMarkNotificationAsReadMutation } from '../../redux/apis/NotificationsApi'
const NotifyItem_2 = ({ message, title,createdAt, read, _id, setAnchorEl,selectedNotify }) => {
  console.log(message, title,'created')
  const [, { language: lng }] = useTranslation()
  const navigate = useNavigate()
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation()
  const customMoment = (time) => {
    const custom = moment(time).locale(lng).fromNow()
    return custom
  }
  const handleMarkAsRead = (_id) => {
    markNotificationAsRead({ id: _id, payload: { read: true } })
      .unwrap()
      .then((res) => {
        console.log(res[`success_${lng === 'en' ? 'en' : 'ar'}`])
      })
      .catch((e) => {
        toast.error(e[`error_${lng === 'en' ? 'en' : 'ar'}`])
      })
  }
  console.log(selectedNotify,'selectedNotify')
  return (
    <Stack
      onClick={() => {
        localStorage.setItem('notifyId', _id)
        navigate(`/notifications`)
        {
          !read && handleMarkAsRead(_id)
        }
      }}
      className={read?'red':'sad'}
      sx={{ width: '100%',
      background:selectedNotify?._id===_id?'#d4d4d4':'#fff',
      margin:'0px !important',
      padding:'10px'
      ,
      margin:'0px',
      display: 'flex',
      textAlign:'center' ,
    }}
    alignItems={lng==="en"?'flex-start':'flex-end'}

    >
      <Stack
        direction={"row"}
        alignItems={'flex-start'}
        // spacing={1}
        sx={{ overflow: 'hidden',
 
    textAlign:'center',
        flexDirection:'column ',

    
    
    }}
            
      >
       
        <Typography sx={{  fontWeight:'bold !important', margin:'auto' ,}}>
          {`${title}`}
          </Typography>
        <Typography  sx={{
           margin:'auto',
           p:'10px'
        }}>{`${message}`}</Typography>
      </Stack>
      <Stack sx={{
  display:'flex',
  justifyContent: 'space-between',
  flexDirection:'row',
  alignItems: 'center',
  width:'100%',
  padding:'0px 10px'
 
 }}>

 <Typography
        my={1}
        sx={{ fontSize: '10px', color: '#C4A035', pl: 2 }}
      >{`${customMoment(createdAt)}`}</Typography>
      <Stack sx={{
  fontSize:'10px',
  marginRight:'10px',
  fontSize: '10px', color: '#C4A035', pl: 2
 }}>
 
 {
  lng==="en"?"read more":"رؤيه المزيد"
 }
 </Stack>
 </Stack>
    </Stack>
  )
}

export default NotifyItem_2
