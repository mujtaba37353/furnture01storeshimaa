import { useState, useEffect } from 'react'

import io from 'socket.io-client'

import NotificationsMenu from './NotificationsMenu'
import { useGetNotificationsByUserIdQuery } from '../../api/NotificationsApi'
import { useLazyGetMeQuery } from '../../api/user.api'
import { notificationsUrl } from '../../api/baseUrl'
const socket = io(notificationsUrl, {
  transports: ['websocket']
}) //back end server po

const Notifications = ({ lng }) => {
  const [notifications, setNotifications] = useState([])
  // 6543a5a65e69e7b08e184e71 // Replace this with the specific user's ID
  const [receiverID, setReceiverID] = useState()
  const [getMe] = useLazyGetMeQuery()
  const { data, isLoading, isError } = useGetNotificationsByUserIdQuery()

  useEffect(() => {
    getMe()
      .unwrap()
      .then(res => {
        const receiverId = res?.data?._id
        setReceiverID(receiverId)
      })
  }, [])

  useEffect(() => {
    // Handle initial loading or error from the API
    if (isLoading) {
      console.log('Loading notifications...')
    } else if (isError) {
      console.error('Error fetching notifications')
    } else {
      setNotifications(data?.data)
    }
  }, [data?.data])

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
      <NotificationsMenu notifications={notifications} lng={lng} />
    </>
  )
}

export default Notifications
