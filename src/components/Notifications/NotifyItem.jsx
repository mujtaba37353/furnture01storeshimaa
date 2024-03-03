import { Stack, Typography } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMarkNotificationAsReadMutation } from '../../redux/apis/NotificationsApi'
const NotifyItem = ({ message, title,createdAt, read, _id, setAnchorEl }) => {
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
      background:read?'#fff ':'#d4d4d4',
      margin:'0px !important',
       display: 'flex',
        borderBottom:'1px solid #d8d8d8',
        padding:'10px ',

     }}
    alignItems={lng==="en"?'flex-start':'flex-end'}

    >
      <Stack
          // spacing={1}
        sx={{ overflow: 'visable',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
        margin:'auto',
        flexDirection:'column',
        
        }}
        
      >
        

        <Typography sx={{  fontWeight:'bold !important',  fontSize:'13px',
      width:'100%'}}>
          {`${title.slice(0,30)}`}..
          </Typography>
        <Typography sx={{
         fontWeight: 'normal', 
          wordBreak: 'break-word',
         overflow: 'hidden',
         textAlign: 'center',
         wordWrap: 'break-word',
         display: {   md: 'block' },
         px: 2,
         fontSize:'11px',
         marginRight:'4px',
         'text-wrap': 'balance',

        }} >{`${message?.slice(0,50)}`}</Typography>
      </Stack>
 <Stack sx={{
  display:'flex',
  justifyContent: 'space-between',
  flexDirection:'row',
  alignItems: 'center',
  width:'100%',
  padding:'0px 10px',
  
 }}>

 <Typography
        my={1}
        sx={{ fontSize: '10px', color: '#727272', pl: 2 }}
      >{`${customMoment(createdAt)}`}</Typography>
      <Stack sx={{
  fontSize:'10px',
  marginRight:'10px',
  fontSize: '10px', color: '#727272', pl: 2
 }}>
 
 {
  lng==="en"?"read more":"رؤيه المزيد"
 }
 </Stack>
 </Stack>


 
    </Stack>
  )
}

export default NotifyItem
