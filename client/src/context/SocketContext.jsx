import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const socketRef = useRef(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Connect to socket
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
    })

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id)
      // Register immediately if already logged in as volunteer
      if (user?.role === 'volunteer') {
        console.log('🚴 Registering volunteer on connect:', user.id)
        socketRef.current.emit('register_volunteer', { userId: user.id })
      }
    })

    socketRef.current.on('connect_error', err => {
      console.error('❌ Socket error:', err.message)
    })

    // Listen for new food notification
    socketRef.current.on('new_listing_notification', data => {
      console.log('🔔 Notification received!', data)
      setNotifications(prev => [data, ...prev].slice(0, 10))
    })

    return () => socketRef.current?.disconnect()
  }, [])

  // Re-register when user logs in
  useEffect(() => {
    if (
      user?.role === 'volunteer' &&
      socketRef.current?.connected
    ) {
      console.log('🚴 Re-registering volunteer:', user.id)
      socketRef.current.emit('register_volunteer', { userId: user.id })
    }
  }, [user])

  const clearNotifications  = () => setNotifications([])
  const removeNotification  = id =>
    setNotifications(prev => prev.filter(n => n.listingId !== id))

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      notifications,
      clearNotifications,
      removeNotification,
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)