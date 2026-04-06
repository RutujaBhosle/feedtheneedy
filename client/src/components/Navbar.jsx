import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import NotificationBell from './NotificationBell'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const isActive = path => location.pathname === path

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        ...S.nav,
        background: scrolled
          ? 'rgba(10,22,40,0.97)'
          : 'rgba(10,22,40,0.7)',
        padding: scrolled ? '14px 48px' : '20px 48px',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <Link to="/" style={S.logo}>
        🌾 Feed<span style={{ color: '#f5a623' }}>TheNeedy</span>
      </Link>

      <div style={S.links}>
        {[
          { to: '/listings',   label: 'Browse Food' },
          { to: '/donate',     label: 'Donate' },
          { to: '/volunteers', label: 'Volunteers' },
          { to: '/impact',     label: 'Impact' },
        ].map(({ to, label }) => (
          <Link key={to} to={to} style={{
            ...S.link,
            color: isActive(to) ? 'var(--emerald)' : 'var(--muted)',
            fontWeight: isActive(to) ? 600 : 400,
          }}>
            {label}
          </Link>
        ))}

  {user?.role === 'volunteer' && <NotificationBell />}

        {user ? (
          <>
            <Link to="/dashboard" style={S.chip}>
              👤 {user.name.split(' ')[0]}
            </Link>
            <button
              onClick={() => { logout(); navigate('/') }}
              style={S.outlineBtn}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    style={S.link}>Login</Link>
            <Link to="/register" style={S.ctaBtn}>Join Free →</Link>
          </>
        )}
      </div>
    </motion.nav>
  )
}

const S = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0,200,150,0.08)',
    transition: 'all 0.3s ease',
  },
  logo: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.4rem', fontWeight: 900,
    color: '#00c896', letterSpacing: '-0.02em',
  },
  links: { display: 'flex', gap: '28px', alignItems: 'center' },
  link:  { fontSize: '0.9rem', transition: 'color 0.2s', letterSpacing: '0.02em' },
  chip:  {
    background: 'rgba(0,200,150,0.1)',
    border: '1px solid rgba(0,200,150,0.25)',
    color: '#00c896',
    padding: '8px 18px', borderRadius: '100px',
    fontSize: '0.85rem', fontWeight: 500,
  },
  ctaBtn: {
    background: 'linear-gradient(135deg,#00c896,#00a07a)',
    color: '#0a1628',
    padding: '10px 24px', borderRadius: '100px',
    fontSize: '0.875rem', fontWeight: 700,
    boxShadow: '0 4px 20px rgba(0,200,150,0.3)',
    transition: 'all 0.2s',
  },
  outlineBtn: {
    background: 'transparent',
    border: '1px solid rgba(232,244,240,0.15)',
    color: 'var(--muted)',
    padding: '8px 18px', borderRadius: '100px',
    fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif',
  },
}