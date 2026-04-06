import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import API from '../api/axios'

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await API.post('/auth/login', form)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div style={S.page}>
      <div style={S.bg} />
      <motion.div style={S.card} initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}>
        <div style={S.cardGlow} />
        <h2 style={S.title}>Welcome Back 👋</h2>
        <p style={S.sub}>Login to your FeedTheNeedy account</p>
        {error && <div style={S.errorBox}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={S.group}>
            <label className="dark-label">Email Address</label>
            <input className="dark-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={S.group}>
            <label className="dark-label">Password</label>
            <input className="dark-input" type="password" placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Logging in...' : '🌾 Login to Account'}
          </button>
        </form>
        <p style={S.foot}>No account yet? <Link to="/register" style={{ color: '#00c896' }}>Register free →</Link></p>
      </motion.div>
    </div>
  )
}

const S = {
  page:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px', background: 'var(--g1)', position: 'relative' },
  bg:       { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(0,200,150,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  card:     { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: '28px', padding: '48px', width: '100%', maxWidth: '440px', backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden' },
  cardGlow: { position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  title:    { fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' },
  sub:      { color: 'var(--muted)', marginBottom: '32px', fontWeight: 300 },
  errorBox: { background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' },
  group:    { marginBottom: '18px' },
  foot:     { textAlign: 'center', marginTop: '28px', fontSize: '0.875rem', color: 'var(--muted)' },
}