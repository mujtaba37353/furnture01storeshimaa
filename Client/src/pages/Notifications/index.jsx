import { useParams } from 'react-router'
import { useLazyGetNotificationsByUserIdQuery } from '../../redux/apis/NotificationsApi'
import { Box, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { Container } from '@mui/system'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import NotifyItem from '../../components/Notifications/NotifyItem'
import { useNavigate } from 'react-router-dom'
import NotifyItem_2 from '../../components/Notifications/NotificationItem_2'
const NotificationsPage = () => {
  const [, { language: lng }] = useTranslation()
  const [getNots, { isLoading, isError, isSuccess, error }] =
    useLazyGetNotificationsByUserIdQuery()
  const [nots, setNots] = useState([])
  const [selectedNotify, setSelectedNotify] = useState({})
  const notifyId = localStorage.getItem('notifyId')
  const navigate = useNavigate()
  // Find the index of the third "/"
  const thirdSlashIndex = selectedNotify.link?.indexOf(
    '/',
    selectedNotify.link.indexOf('/', selectedNotify.link.indexOf('/') + 1) + 1
  )
  // Slice the URL after the third "/"
  const slicedURL = selectedNotify.link?.slice(thirdSlashIndex + 1)
  useEffect(() => {
    getNots()
      .unwrap()
      .then((res) => {
        console.log('res', res)
        setNots(res?.data)
        setSelectedNotify(res?.data?.find((notify) => notify._id === notifyId))
      })
      .catch((err) => {
        console.log('err', err)
      })
  }, [])
  return (
    <Box sx={{ py: 5, minHeight: '100vh', width: '100%' }}>
      {isLoading && <span className="loader"></span>}
      {isError && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <Typography
            fontSize={'1.5rem'}
            my={10}
            textAlign={'center'}
            color="error"
          >
            {error?.data && error?.data[`error_${lng}`]}
          </Typography>
        </Box>
      )}
      {isSuccess && (
        <Stack
          direction={lng === 'en' ? 'row' : 'row-reverse'}
          sx={{
            margin: 'auto',
            justifyContent: 'center',
            width: '90%',
            flexWrap: 'wrap',
            
          }}
          spacing={2}
        >
          <Box
            id="box_nooo"
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 1,
              maxHeight: 600,
              overflowY: 'auto',
              padding: '0px',
              scrollbarGutter: 'stable',
              width: { xs: 1, sm: 0.45 },

              'box-shadow':
                'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
              '&::-webkit-scrollbar': {
                width: '12px',
              },
       
            }}
          >
            <Typography
              variant="h5"
              sx={{
                textAlign: lng === 'ar' ? 'right' : 'left',
                fontWeight: 'bold',
                fontSize: '20px',
                mb: 3,
                color: 'black',
                padding: '20px',
              }}
            >
              {lng === 'en' ? 'Notifications' : 'الاشعارات'}
            </Typography>
            {nots?.map((notify) => (
              <Stack
                sx={{ mb: 0, cursor: 'pointer' }}
                key={notify._id}
                onClick={() => {
                  // Create a copy of nots
                  const updatedNots = nots.map((n) =>
                    n._id === notify._id ? { ...n, read: true } : n
                  )

                  // Update the state with the modified array
                  setNots(updatedNots)
                  setSelectedNotify({ ...notify, read: true })
                }}
              >
                <Stack direction={'row'} alignItems={'center'}>
                  <NotifyItem_2
                    message={notify?.message}
                    title={notify?.title}
                    createdAt={notify?.createdAt}
                    read={notify?.read}
                    _id={notify?._id}
                    selectedNotify={selectedNotify}
                  />
                </Stack>
              </Stack>
            ))}
          </Box>
          <Box
          className={'sadaNotify'}
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 1,
              p: 3,
              width: { xs: 1, sm: 0.45 },
              height: { xs: 300, sm: 500 },
              'box-shadow':
                'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
              marginTop: { xs: '10px', sm: '10px', md: '0px' },
              '&::-webkit-scrollbar-track': {
                background: '#C4A035',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#C4A035',
                borderRadius: 1,
              },
              
              /* Handle */
          " &::-webkit-scrollbar-thumb ":{
            background: '#C4A035',
          } 
            }}
            id="notiiii"
          >
            <Typography
              mb={2}
              variant="h5"
              sx={{
                display: 'flex',
                flexDirection: lng === 'ar' ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {selectedNotify?.title}
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#61616152',
                }}
              >
                {`${moment(selectedNotify?.createdAt).locale(lng).fromNow()}`}
              </Typography>
            </Typography>
            <Box>
              <Typography my={1}>{selectedNotify?.message}</Typography>
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  )
}

export default NotificationsPage
