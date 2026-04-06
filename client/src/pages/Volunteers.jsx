import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import API from '../api/axios'

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
  const fetchVolunteers = async () => {
    try {
      console.log('Fetching volunteers...')
      const { data } = await API.get('/users/volunteers')
      console.log('Volunteers received:', data)
      setVolunteers(data)
    } catch (err) {
      console.error('Error fetching volunteers:', err)
    } finally {
      setLoading(false)
    }
  }
  fetchVolunteers()
}, [])

  const gradients = [
    'linear-gradient(135deg,#00c896,#007a5e)',
    'linear-gradient(135deg,#f5a623,#c47d0e)',
    'linear-gradient(135deg,#64b4ff,#1a6cb5)',
    'linear-gradient(135deg,#ff6b6b,#c0392b)',
  ]

  return (
    <div style={{
      minHeight: '100vh', padding: '100px 48px 60px',
      background: '#0a1628', position: 'relative',
      fontFamily: 'Outfit, sans-serif',
    }}>

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(245,166,35,0.05) 0%, transparent 70%)',
      }} />

      {/* ── HEADER ── */}
      <motion.div
        style={{ textAlign: 'center', marginBottom: '56px', position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{
          fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#00c896', marginBottom: '12px',
        }}>
          Our Heroes
        </div>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2rem,5vw,3.5rem)',
          fontWeight: 700, color: '#e8f4f0', marginBottom: '12px',
        }}>
          Meet the Volunteers 🚴
        </h1>
        <p style={{ color: 'rgba(232,244,240,0.45)', fontSize: '1rem', fontWeight: 300 }}>
          Real people bridging restaurants and families in need — every single day
        </p>
      </motion.div>

      {/* ── LOADING ── */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '80px', position: 'relative', zIndex: 1 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '40px', height: '40px',
              border: '3px solid rgba(0,200,150,0.2)',
              borderTop: '3px solid #00c896',
              borderRadius: '50%', margin: '0 auto',
            }}
          />
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && volunteers.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '80px', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚴</div>
          <p style={{ color: 'rgba(232,244,240,0.45)', marginBottom: '16px' }}>No volunteers registered yet.</p>
          <Link to="/register" style={{ color: '#00c896', fontWeight: 600 }}>Be the first!</Link>
        </div>
      )}

      {/* ── VOLUNTEER GRID ── */}
      {!loading && volunteers.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
          gap: '20px', maxWidth: '1100px',
          margin: '0 auto 60px', position: 'relative', zIndex: 1,
        }}>
          {volunteers.map((vol, i) => (
            <motion.div
              key={vol._id}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(0,200,150,0.15)',
                borderRadius: '24px', padding: '32px 24px',
                textAlign: 'center', transition: 'all 0.3s',
                transformStyle: 'preserve-3d',
                backdropFilter: 'blur(10px)',
                cursor: 'default',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              onMouseMove={e => {
                const r = e.currentTarget.getBoundingClientRect()
                const x = (e.clientX - r.left) / r.width  - 0.5
                const y = (e.clientY - r.top)  / r.height - 0.5
                e.currentTarget.style.transform   = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`
                e.currentTarget.style.borderColor = 'rgba(0,200,150,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform   = ''
                e.currentTarget.style.borderColor = ''
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: gradients[i % gradients.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.8rem', fontWeight: 700,
                color: '#0a1628', margin: '0 auto 16px',
              }}>
                {vol.name.charAt(0).toUpperCase()}
              </div>

              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.15rem', fontWeight: 700,
                color: '#e8f4f0', marginBottom: '6px',
              }}>
                {vol.name}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'rgba(232,244,240,0.45)', marginBottom: '4px' }}>
                📍 {vol.area || 'Area not set'}
              </p>

              {vol.phone && (
                <p style={{ fontSize: '0.85rem', color: 'rgba(232,244,240,0.45)', marginBottom: '14px' }}>
                  📞 {vol.phone}
                </p>
              )}

              <div style={{
                display: 'inline-block',
                background: 'rgba(245,166,35,0.12)',
                border: '1px solid rgba(245,166,35,0.25)',
                color: '#f5a623', fontSize: '0.78rem', fontWeight: 600,
                padding: '5px 14px', borderRadius: '100px',
              }}>
                🚴 Active Volunteer
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── CTA ── */}
      <motion.div
        style={{
          background: 'linear-gradient(135deg,#061220,#0a2a1a)',
          border: '1px solid rgba(0,200,150,0.15)',
          borderRadius: '28px', padding: '60px 48px',
          textAlign: 'center', maxWidth: '700px',
          margin: '0 auto', position: 'relative', zIndex: 1,
        }}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2rem', fontWeight: 700,
          color: '#e8f4f0', marginBottom: '12px',
        }}>
          Want to become a volunteer?
        </h2>
        <p style={{ color: 'rgba(232,244,240,0.45)', marginBottom: '28px', fontWeight: 300 }}>
          Flexible hours. Real addresses. Google Maps navigation. Real impact.
        </p>
        <Link to="/register" style={{
          background: 'linear-gradient(135deg,#00c896,#00a07a)',
          color: '#0a1628', padding: '14px 32px', borderRadius: '100px',
          fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
          boxShadow: '0 4px 0 #007a5e, 0 6px 20px rgba(0,200,150,0.3)',
          fontFamily: 'Outfit, sans-serif',
        }}>
          Join as Volunteer →
        </Link>
      </motion.div>
    </div>
  )
}