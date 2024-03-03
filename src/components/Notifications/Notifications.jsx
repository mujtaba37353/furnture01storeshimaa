import { useState, useEffect } from 'react'

import io from 'socket.io-client'
import { useLazyGetMeQuery } from '../../redux/apis/UserApis'
import {
  useGetNotificationsByUserIdQuery,
  useLazyGetNotificationsByUserIdQuery,
} from '../../redux/apis/NotificationsApi'
import NotificationsMenu from './NotificationsMenu'
import { useSelector } from 'react-redux'
import { notificationsUrl } from '../../constants/baseUrl'
const socket = io(notificationsUrl, {
  transports: ['websocket'],
}) //back end server po

const Notifications = ({ lng, iconColor, bgColorBtn }) => {
  const [notifications, setNotifications] = useState([])
  // 6543a5a65e69e7b08e184e71 // Replace this with the specific user's ID
  const [receiverID, setReceiverID] = useState()
  // const [getMe] = useLazyGetMeQuery()
  const [useNotification, { data, isLoading, isSuccess, isError, error }] =
    useLazyGetNotificationsByUserIdQuery()
const { currentUser } = useSelector(state => state)
  useEffect(() => {
    if (currentUser?._id) {
      setReceiverID(currentUser?._id)
    } else {
      setReceiverID('')
      setNotifications([])
    }
  }, [currentUser?._id])

  useEffect(() => {
    // Handle initial loading or error from the API
    //

    if (currentUser && currentUser?._id) {
      useNotification()
        .unwrap()
        .then(res => {
          setNotifications(res?.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [data?.data, currentUser, currentUser?._id])

  useEffect(() => {
    if (receiverID) {
      socket.on(receiverID, data => {
        setNotifications(prevNotifications => [data, ...prevNotifications])
      })
    }
    return () => {
      if (receiverID) {
        socket.emit('leaveRoom', receiverID)
        socket.disconnect()
      }
    }
  }, [receiverID])

  return (
    <>
      <NotificationsMenu
        notifications={notifications}
        lng={lng}
        iconColor={'#fff'}
        bgColorBtn={'#fff'}
      />
    </>
  )
}

export default Notifications
