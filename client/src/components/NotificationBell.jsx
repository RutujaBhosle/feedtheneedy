import { useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationBell() {
  const { notifications, clearNotifications, removeNotification } = useSocket()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const count = notifications.length

  return (
    <div style={{ position: 'relative' }}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'rgba(0,200,150,0.1)',
          border: '1px solid rgba(0,200,150,0.25)',
          borderRadius: '100px',
          padding: '8px 14px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#00c896', fontFamily: 'Outfit, sans-serif',
          fontSize: '0.85rem', fontWeight: 500,
          position: 'relative',
        }}
      >
        🔔
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: '#ff6b6b', color: 'white',
              borderRadius: '50%', width: '18px', height: '18px',
              fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'absolute', top: '-6px', right: '-6px',
            }}
          >
            {count}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', top: '44px', right: 0,
              width: '320px', zIndex: 500,
              background: '#0d2137',
              border: '1px solid rgba(0,200,150,0.2)',
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(0,200,150,0.1)',
            }}>
              <span style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1rem', fontWeight: 700,
                color: '#e8f4f0',
              }}>
                Notifications
              </span>
              {count > 0 && (
                <button onClick={clearNotifications} style={{
                  background: 'none', border: 'none',
                  color: 'rgba(232,244,240,0.4)',
                  fontSize: '0.75rem', cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                }}>
                  Clear all
                </button>
              )}
            </div>

            {/* Notifications list */}
            {count === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔔</div>
                <p style={{ color: 'rgba(232,244,240,0.4)', fontSize: '0.875rem' }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => {
                      removeNotification(n.listingId)
                      navigate('/listings')
                      setOpen(false)
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,200,150,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Urgency dot */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                        marginTop: '6px',
                        background: n.urgency === 'urgent' ? '#ff6b6b'
                          : n.urgency === 'today' ? '#f5a623' : '#00c896',
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.875rem', fontWeight: 600,
                          color: '#e8f4f0', marginBottom: '3px',
                        }}>
                          {n.title}
                        </div>
                        <div style={{
                          fontSize: '0.8rem',
                          color: 'rgba(232,244,240,0.5)',
                          lineHeight: 1.5,
                        }}>
                          {n.message}
                        </div>
                        <div style={{
                          display: 'flex', gap: '8px', marginTop: '6px',
                          flexWrap: 'wrap',
                        }}>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 600,
                            background: 'rgba(0,200,150,0.1)',
                            border: '1px solid rgba(0,200,150,0.2)',
                            color: '#00c896', padding: '2px 8px',
                            borderRadius: '100px',
                          }}>
                            📍 {n.area}
                          </span>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 600,
                            background: 'rgba(245,166,35,0.1)',
                            border: '1px solid rgba(245,166,35,0.2)',
                            color: '#f5a623', padding: '2px 8px',
                            borderRadius: '100px',
                          }}>
                            📦 {n.portions} portions
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); removeNotification(n.listingId) }}
                        style={{
                          background: 'none', border: 'none',
                          color: 'rgba(232,244,240,0.3)',
                          fontSize: '1rem', cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {count > 0 && (
              <div
                onClick={() => { navigate('/listings'); setOpen(false) }}
                style={{
                  padding: '14px 20px', textAlign: 'center',
                  borderTop: '1px solid rgba(0,200,150,0.1)',
                  color: '#00c896', fontSize: '0.85rem',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                View All Listings →
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}