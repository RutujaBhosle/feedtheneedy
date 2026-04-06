import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import API from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'individual', phone: '', area: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

 const handleSubmit = async e => {
  e.preventDefault()
  setLoading(true); setError('')
  try {
    let lat = null, lng = null

    // Get browser location
    if (navigator.geolocation) {
      await new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
          pos => {
            lat = pos.coords.latitude
            lng = pos.coords.longitude
            resolve()
          },
          () => resolve() // continue even if denied
        )
      })
    }

    const { data } = await API.post('/auth/register', { ...form, lat, lng })
    login(data.user, data.token)
    navigate('/dashboard')
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong')
  } finally { setLoading(false) }
}

  const roles = [
    { val: 'individual', label: '🤲 Individual / Family',  desc: 'Find food near me' },
    { val: 'restaurant', label: '🍽️ Restaurant / Caterer', desc: 'Donate surplus food' },
    { val: 'volunteer',  label: '🚴 Delivery Volunteer',   desc: 'Help with pickups'  },
    { val: 'ngo',        label: '🏛️ NGO / Shelter',        desc: 'Receive donations'  },
  ]

  return (
    <div style={S.page}>
      <div style={S.bg} />
      <motion.div style={S.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div style={S.cardGlow} />
        <h2 style={S.title}>Join FeedTheNeedy 🌾</h2>
        <p style={S.sub}>Create your free account and start making a difference</p>
        {error && <div style={S.errorBox}>{error}</div>}

        {/* Role selector */}
        <div style={S.group}>
          <label className="dark-label">I want to...</label>
          <div style={S.roleGrid}>
            {roles.map(r => (
              <div
                key={r.val}
                onClick={() => setForm({ ...form, role: r.val })}
                style={{
                  ...S.roleOption,
                  borderColor: form.role === r.val ? '#00c896' : 'rgba(0,200,150,0.15)',
                  background:  form.role === r.val ? 'rgba(0,200,150,0.1)' : 'rgba(255,255,255,0.03)',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: form.role === r.val ? '#00c896' : 'var(--text)' }}>{r.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={S.row}>
            <div style={S.group}>
              <label className="dark-label">Full Name *</label>
              <input className="dark-input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={S.group}>
              <label className="dark-label">Phone</label>
              <input className="dark-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div style={S.group}>
            <label className="dark-label">Email Address *</label>
            <input className="dark-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={S.row}>
            <div style={S.group}>
              <label className="dark-label">Password *</label>
              <input className="dark-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div style={S.group}>
              <label className="dark-label">Area / City</label>
              <input className="dark-input" placeholder="e.g. Kothrud, Pune" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating account...' : '🌾 Create Free Account →'}
          </button>
        </form>
        <p style={S.foot}>Already have an account? <Link to="/login" style={{ color: '#00c896' }}>Login →</Link></p>
      </motion.div>
    </div>
  )
}

const S = {
  page:       { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px', background: 'var(--g1)', position: 'relative' },
  bg:         { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(0,200,150,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  card:       { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: '28px', padding: '48px', width: '100%', maxWidth: '580px', backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden' },
  cardGlow:   { position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  title:      { fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' },
  sub:        { color: 'var(--muted)', marginBottom: '32px', fontWeight: 300 },
  errorBox:   { background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' },
  group:      { marginBottom: '16px' },
  row:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  roleGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  roleOption: { padding: '12px 14px', borderRadius: '12px', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s' },
  foot:       { textAlign: 'center', marginTop: '28px', fontSize: '0.875rem', color: 'var(--muted)' },
}
