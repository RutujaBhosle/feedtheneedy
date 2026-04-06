import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const socketRef = useRef(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Connect to socket server
    socketRef.current = io('http://localhost:5000')

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected')
      // If volunteer, register socket
      if (user?.role === 'volunteer') {
        socketRef.current.emit('register_volunteer', { userId: user.id })
      }
    })

    // Listen for new listing notifications
    socketRef.current.on('new_listing_notification', (data) => {
      console.log('🔔 New notification:', data)
      setNotifications(prev => [data, ...prev].slice(0, 10)) // keep last 10
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [user])

  // Re-register when user logs in as volunteer
  useEffect(() => {
    if (user?.role === 'volunteer' && socketRef.current?.connected) {
      socketRef.current.emit('register_volunteer', { userId: user.id })
    }
  }, [user])

  const clearNotifications = () => setNotifications([])
  const removeNotification = id =>
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