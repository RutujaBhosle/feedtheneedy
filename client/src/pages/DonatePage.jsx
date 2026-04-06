import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import API from '../api/axios'

export default function DonatePage() {
  const [form, setForm] = useState({
    foodType: '', description: '', portions: '',
    area: '', donorAddress: '', donorPhone: '',
    pickupBy: '', urgency: 'fresh'
  })
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const set = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
  e.preventDefault()
  if (!user) return navigate('/login')
  if (user.role !== 'restaurant') return setError('Only restaurant accounts can post donations')
  setLoading(true); setError('')
  try {
    let lat = null, lng = null

    // Get current location
    if (navigator.geolocation) {
      await new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
          pos => {
            lat = pos.coords.latitude
            lng = pos.coords.longitude
            resolve()
          },
          () => resolve()
        )
      })
    }

    await API.post('/listings', { ...form, lat, lng })
    setSuccess('✅ Listing posted! Nearby volunteers have been notified instantly.')
    setForm({ foodType: '', description: '', portions: '', area: '', donorAddress: '', donorPhone: '', pickupBy: '', urgency: 'fresh' })
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong')
  } finally { setLoading(false) }
}

  const urgencyOptions = [
    { val: 'fresh',  label: '🟢 Fresh',  desc: 'Plenty of time' },
    { val: 'today',  label: '🟡 Today',  desc: 'Pickup today'   },
    { val: 'urgent', label: '🔴 Urgent', desc: 'Expires soon!'  },
  ]

  const foodTypes = [
    'Cooked Meals', 'Bread & Bakery', 'Raw Groceries',
    'Fruits & Vegetables', 'Dairy Products', 'Packaged Food'
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a1628',
      paddingTop: '80px',
      position: 'relative',
    }}>

      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 60% at 30% 30%, rgba(0,200,150,0.06) 0%, transparent 70%)',
      }} />

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '40px 48px 80px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.3fr',
        gap: '48px',
        alignItems: 'start',
        position: 'relative', zIndex: 1,
      }}>

        {/* ── LEFT INFO PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div style={{
            fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#00c896', marginBottom: '12px',
          }}>
            Donate Food
          </div>

          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem,4vw,3rem)',
            fontWeight: 700, lineHeight: 1.1,
            marginBottom: '20px', color: '#e8f4f0',
          }}>
            Turn waste into{' '}
            <span style={{
              background: 'linear-gradient(135deg,#00c896,#7fffd4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              nourishment
            </span>
          </h1>

          <p style={{
            color: 'rgba(232,244,240,0.5)',
            lineHeight: 1.8, marginBottom: '40px',
            fontWeight: 300, fontSize: '1rem',
          }}>
            Takes 90 seconds. Volunteers get notified instantly
            and navigate directly to your address.
          </p>

          {[
            { n: '01', text: 'Fill in your food details and full address' },
            { n: '02', text: 'Listing goes live instantly on the platform' },
            { n: '03', text: 'Volunteer accepts and navigates to you' },
            { n: '04', text: 'Food delivered — you get a digital receipt' },
          ].map(s => (
            <div key={s.n} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 16px', marginBottom: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,200,150,0.1)',
              borderRadius: '14px',
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#00c896,#007a5e)',
                color: '#0a1628', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
              }}>
                {s.n}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(232,244,240,0.5)' }}>
                {s.text}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── RIGHT FORM ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(0,200,150,0.2)',
            borderRadius: '28px', padding: '40px',
            backdropFilter: 'blur(20px)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '240px', height: '240px', borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(0,200,150,0.08) 0%,transparent 70%)',
            pointerEvents: 'none',
          }} />

          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.8rem', fontWeight: 700,
            color: '#e8f4f0', marginBottom: '28px',
          }}>
            Post a Donation
          </h2>

          {!user && <div style={alert('gold')}>⚠️ Please <a href="/login" style={{ color: '#00c896' }}>login</a> as a restaurant to donate.</div>}
          {user?.role !== 'restaurant' && user && <div style={alert('gold')}>⚠️ Only restaurant accounts can post donations.</div>}
          {error   && <div style={alert('red')}>{error}</div>}
          {success && <div style={alert('green')}>{success}</div>}

          <form onSubmit={handleSubmit}>

            {/* Food Type — CUSTOM DARK DROPDOWN */}
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Food Type *</label>
              <div style={{ position: 'relative' }}>
                <select
                  name="foodType"
                  value={form.foodType}
                  onChange={set}
                  required
                  style={{
                    width: '100%', padding: '13px 16px',
                    background: '#0d2137',
                    border: '1px solid rgba(0,200,150,0.2)',
                    borderRadius: '10px',
                    color: form.foodType ? '#e8f4f0' : 'rgba(232,244,240,0.4)',
                    fontSize: '0.9rem',
                    fontFamily: 'Outfit, sans-serif',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    colorScheme: 'dark',
                  }}
                >
                  <option value="" style={{ background: '#0d2137', color: 'rgba(232,244,240,0.4)' }}>
                    Select food type
                  </option>
                  {foodTypes.map(f => (
                    <option key={f} value={f} style={{ background: '#0d2137', color: '#e8f4f0' }}>
                      {f}
                    </option>
                  ))}
                </select>
                {/* Custom arrow */}
                <div style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#00c896', fontSize: '0.8rem',
                  pointerEvents: 'none',
                }}>▼</div>
              </div>
            </div>

            {/* Portions */}
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Number of Portions *</label>
              <input name="portions" type="number" value={form.portions} onChange={set} placeholder="e.g. 30" required style={inp} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Description</label>
              <input name="description" value={form.description} onChange={set} placeholder="e.g. Dal Makhani and Rotis, no allergens" style={inp} />
            </div>

            {/* Address */}
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>📍 Full Pickup Address * — Volunteers navigate here</label>
              <input
                name="donorAddress" value={form.donorAddress} onChange={set}
                placeholder="e.g. Shop 4, Paud Road, Kothrud, Pune 411038"
                required
                style={{ ...inp, borderColor: 'rgba(0,200,150,0.5)', background: 'rgba(0,200,150,0.06)' }}
              />
            </div>

            {/* Area + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={lbl}>Area / Locality *</label>
                <input name="area" value={form.area} onChange={set} placeholder="e.g. Kothrud" required style={inp} />
              </div>
              <div>
                <label style={lbl}>Contact Phone *</label>
                <input name="donorPhone" value={form.donorPhone} onChange={set} placeholder="+91 98765 43210" required style={inp} />
              </div>
            </div>

            {/* Pickup time */}
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Available Until *</label>
              <input name="pickupBy" value={form.pickupBy} onChange={set} placeholder="e.g. 9:00 PM" required style={inp} />
            </div>

            {/* Urgency */}
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Urgency Level</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                {urgencyOptions.map(u => (
                  <div
                    key={u.val}
                    onClick={() => setForm({ ...form, urgency: u.val })}
                    style={{
                      padding: '12px', borderRadius: '12px',
                      cursor: 'pointer', textAlign: 'center',
                      transition: 'all 0.2s',
                      border: `1px solid ${form.urgency === u.val ? '#00c896' : 'rgba(0,200,150,0.15)'}`,
                      background: form.urgency === u.val ? 'rgba(0,200,150,0.1)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div style={{
                      fontWeight: 600, fontSize: '0.875rem', marginBottom: '3px',
                      color: form.urgency === u.val ? '#00c896' : '#e8f4f0',
                    }}>
                      {u.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(232,244,240,0.4)' }}>
                      {u.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{
              background: 'rgba(0,200,150,0.07)',
              border: '1px solid rgba(0,200,150,0.2)',
              borderRadius: '12px', padding: '12px 16px',
              fontSize: '0.85rem', color: 'rgba(0,200,150,0.8)',
              marginBottom: '20px', lineHeight: 1.6,
            }}>
              📱 After posting, volunteers will see your full address and phone to navigate directly to you.
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading
                  ? 'rgba(0,200,150,0.4)'
                  : 'linear-gradient(135deg,#00c896,#00a07a)',
                color: '#0a1628', border: 'none',
                padding: '16px', borderRadius: '100px',
                fontSize: '1rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit, sans-serif',
                boxShadow: loading ? 'none' : '0 6px 0 #007a5e, 0 8px 30px rgba(0,200,150,0.35)',
                transition: 'all 0.25s',
              }}
            >
              {loading ? 'Posting...' : '🌾 Post Donation — Notify Volunteers'}
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  )
}

// ── Shared mini styles ──
const inp = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(0,200,150,0.2)',
  borderRadius: '10px', color: '#e8f4f0',
  fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif',
  outline: 'none', colorScheme: 'dark',
}

const lbl = {
  display: 'block', fontSize: '0.8rem',
  fontWeight: 500, color: 'rgba(232,244,240,0.5)',
  marginBottom: '8px', letterSpacing: '0.03em',
}

const alert = type => ({
  padding: '12px 16px', borderRadius: '10px',
  marginBottom: '16px', fontSize: '0.9rem',
  background: type === 'green' ? 'rgba(0,200,150,0.1)'
    : type === 'gold' ? 'rgba(245,166,35,0.1)'
    : 'rgba(255,107,107,0.1)',
  border: type === 'green' ? '1px solid rgba(0,200,150,0.3)'
    : type === 'gold' ? '1px solid rgba(245,166,35,0.3)'
    : '1px solid rgba(255,107,107,0.3)',
  color: type === 'green' ? '#00c896'
    : type === 'gold' ? '#f5a623'
    : '#ff6b6b',
})