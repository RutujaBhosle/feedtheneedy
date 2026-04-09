import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotificationPopup() {
  const { notifications } = useSocket()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [visible, setVisible] = useState([])

  // Show popup for each new notification
  useEffect(() => {
    if (notifications.length === 0) return
    const latest = notifications[0]

    // Add to visible popups
    setVisible(prev => {
      const exists = prev.find(n => n.listingId === latest.listingId)
      if (exists) return prev
      return [latest, ...prev].slice(0, 3)
    })

    // Auto remove after 6 seconds
    const timer = setTimeout(() => {
      setVisible(prev => prev.filter(n => n.listingId !== latest.listingId))
    }, 6000)

    return () => clearTimeout(timer)
  }, [notifications])

  // Only show for volunteers
  if (user?.role !== 'volunteer') return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px', right: '32px',
      zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      gap: '12px',
    }}>
      <AnimatePresence>
        {visible.map((n, i) => (
          <motion.div
            key={n.listingId}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0,   scale: 1 }}
            exit={{   opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              background: '#0d2137',
              border: '1px solid rgba(0,200,150,0.4)',
              borderRadius: '20px',
              padding: '20px 24px',
              minWidth: '320px',
              maxWidth: '380px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,200,150,0.15)',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigate('/listings')
              setVisible(prev => prev.filter(n2 => n2.listingId !== n.listingId))
            }}
          >
            {/* Top row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Live dot */}
                <div style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%',
                  background: '#00c896',
                  animation: 'pulse 1.5s infinite',
                }} />
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600,
                  color: '#00c896',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  Food Available Nearby!
                </span>
              </div>
              {/* Close button */}
              <button
                onClick={e => {
                  e.stopPropagation()
                  setVisible(prev => prev.filter(n2 => n2.listingId !== n.listingId))
                }}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(232,244,240,0.4)',
                  fontSize: '1.2rem', cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Food info */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{
                width: '52px', height: '52px',
                borderRadius: '14px',
                background: 'rgba(0,200,150,0.1)',
                border: '1px solid rgba(0,200,150,0.2)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem', flexShrink: 0,
              }}>
                🍽️
              </div>
              <div>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1rem', fontWeight: 700,
                  color: '#e8f4f0', marginBottom: '4px',
                }}>
                  {n.foodType}
                </div>
                <div style={{
                  fontSize: '0.82rem',
                  color: 'rgba(232,244,240,0.55)',
                  lineHeight: 1.5,
                }}>
                  {n.portions} portions available in {n.area}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div style={{
              display: 'flex', gap: '8px',
              marginTop: '14px', flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600,
                background: 'rgba(0,200,150,0.1)',
                border: '1px solid rgba(0,200,150,0.25)',
                color: '#00c896',
                padding: '3px 10px', borderRadius: '100px',
              }}>
                📍 {n.area}
              </span>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600,
                background: n.urgency === 'urgent'
                  ? 'rgba(255,107,107,0.1)'
                  : n.urgency === 'today'
                  ? 'rgba(245,166,35,0.1)'
                  : 'rgba(0,200,150,0.1)',
                border: n.urgency === 'urgent'
                  ? '1px solid rgba(255,107,107,0.25)'
                  : n.urgency === 'today'
                  ? '1px solid rgba(245,166,35,0.25)'
                  : '1px solid rgba(0,200,150,0.25)',
                color: n.urgency === 'urgent' ? '#ff6b6b'
                  : n.urgency === 'today' ? '#f5a623'
                  : '#00c896',
                padding: '3px 10px', borderRadius: '100px',
              }}>
                {n.urgency === 'urgent' ? '🔴 Urgent'
                  : n.urgency === 'today' ? '🟡 Today'
                  : '🟢 Fresh'}
              </span>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600,
                background: 'rgba(100,180,255,0.1)',
                border: '1px solid rgba(100,180,255,0.25)',
                color: '#64b4ff',
                padding: '3px 10px', borderRadius: '100px',
              }}>
                📦 {n.portions} portions
              </span>
            </div>

            {/* Click hint */}
            <div style={{
              marginTop: '14px',
              fontSize: '0.78rem',
              color: 'rgba(232,244,240,0.35)',
              textAlign: 'center',
            }}>
              Tap to view and accept pickup →
            </div>

            {/* Progress bar — auto dismiss timer */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
              style={{
                height: '2px',
                background: '#00c896',
                borderRadius: '2px',
                marginTop: '12px',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </div>
  )
}