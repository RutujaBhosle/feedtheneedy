import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import API from '../api/axios'

export default function Dashboard() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [myListings,  setMyListings]  = useState([])
  const [myPickups,   setMyPickups]   = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => { if (!loading && !user) navigate('/login') }, [user, loading])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        if (user.role === 'restaurant') {
          const { data } = await API.get('/listings/mine')
          setMyListings(data)
        }
        if (user.role === 'volunteer') {
          const { data } = await API.get('/listings/my-pickups')
          setMyPickups(data)
        }
      } catch (err) { console.error(err) }
      finally { setDataLoading(false) }
    }
    load()
  }, [user])

  if (loading || !user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--g1)' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,200,150,0.2)', borderTop: '3px solid #00c896', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  const roleInfo = {
    restaurant: { emoji: '🍽️', label: 'Restaurant Partner', grad: 'linear-gradient(135deg,#00c896,#007a5e)' },
    volunteer:  { emoji: '🚴', label: 'Delivery Volunteer', grad: 'linear-gradient(135deg,#f5a623,#c47d0e)' },
    ngo:        { emoji: '🏛️', label: 'NGO / Shelter',      grad: 'linear-gradient(135deg,#64b4ff,#1a6cb5)' },
    individual: { emoji: '🤲', label: 'Community Member',   grad: 'linear-gradient(135deg,#ff6b6b,#c0392b)' },
  }
  const info = roleInfo[user.role] || roleInfo.individual

  const statusLabel = {
    active:             { text: '🟢 Active',           color: '#00c896', bg: 'rgba(0,200,150,0.1)',   border: 'rgba(0,200,150,0.25)' },
    volunteer_assigned: { text: '🚴 Volunteer Coming', color: '#f5a623', bg: 'rgba(245,166,35,0.1)',  border: 'rgba(245,166,35,0.25)' },
    picked_up:          { text: '📦 Picked Up',        color: '#64b4ff', bg: 'rgba(100,180,255,0.1)', border: 'rgba(100,180,255,0.25)' },
    delivered:          { text: '✅ Delivered',         color: '#00c896', bg: 'rgba(0,200,150,0.06)',  border: 'rgba(0,200,150,0.15)' },
    expired:            { text: '⏰ Expired',           color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)' },
  }

  return (
    <div style={S.page}>
      <div style={S.bg} />
      <div style={S.inner}>

        {/* Welcome card */}
        <motion.div style={S.welcomeCard} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ ...S.roleGrad, background: info.grad }} />
          <div style={S.welcomeLeft}>
            <div style={S.roleBadge}>{info.emoji} {info.label}</div>
            <h1 style={S.welcomeTitle}>Welcome back,<br />{user.name}! 👋</h1>
            <p style={S.welcomeSub}>{user.email} · {user.area || 'No area set'}</p>
          </div>
          <div style={S.welcomeStats}>
            {user.role === 'restaurant' && (
              <>
                <div style={S.wStat}><div style={S.wStatN}>{myListings.filter(l => l.status === 'active').length}</div><div style={S.wStatL}>Active</div></div>
                <div style={S.wStat}><div style={S.wStatN}>{myListings.filter(l => l.status === 'delivered').length}</div><div style={S.wStatL}>Delivered</div></div>
                <div style={S.wStat}><div style={S.wStatN}>{myListings.reduce((a, l) => a + (l.portions - l.remaining), 0)}</div><div style={S.wStatL}>Meals Donated</div></div>
              </>
            )}
            {user.role === 'volunteer' && (
              <>
                <div style={S.wStat}><div style={S.wStatN}>{myPickups.length}</div><div style={S.wStatL}>Active Pickups</div></div>
              </>
            )}
          </div>
        </motion.div>

        {/* Restaurant: My listings */}
        {user.role === 'restaurant' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={S.sectionHead}>
              <h2 style={S.sectionTitle}>My Donations</h2>
              <Link to="/donate" style={S.addBtn}>+ New Donation</Link>
            </div>
            {dataLoading ? <div style={S.loadingText}>Loading...</div> :
              myListings.length === 0 ? (
                <div style={S.emptyCard}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍽️</div>
                  <p style={{ color: 'var(--muted)' }}>No donations yet. <Link to="/donate" style={{ color: '#00c896' }}>Post your first one →</Link></p>
                </div>
              ) : (
                <div style={S.listCol}>
                  {myListings.map(l => {
                    const st = statusLabel[l.status] || statusLabel.active
                    return (
                      <div key={l._id} style={S.listRow}>
                        <div style={S.listEmoji}>{l.foodType.includes('Bread') ? '🍞' : l.foodType.includes('Fruit') ? '🍎' : '🍛'}</div>
                        <div style={{ flex: 1 }}>
                          <div style={S.listName}>{l.foodType}</div>
                          <div style={S.listMeta}>📍 {l.area} · ⏰ Until {l.pickupBy} · 📦 {l.remaining}/{l.portions} portions</div>
                          {l.status === 'volunteer_assigned' && l.assignedVolunteer?.name && (
                            <div style={S.volNotice}>
                              🚴 <strong>{l.assignedVolunteer.name}</strong> is on the way!
                              {l.assignedVolunteer.phone && ` · 📞 ${l.assignedVolunteer.phone}`}
                            </div>
                          )}
                          {/* Progress */}
                          <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(1 - l.remaining / l.portions) * 100}%`, background: '#00c896', borderRadius: '2px' }} />
                          </div>
                        </div>
                        <span style={{ ...S.statusPill, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                          {st.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            }
          </motion.div>
        )}

        {/* Volunteer: My pickups */}
        {user.role === 'volunteer' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={S.sectionHead}>
              <h2 style={S.sectionTitle}>My Active Pickups</h2>
              <Link to="/listings" style={S.addBtn}>Find More →</Link>
            </div>
            {dataLoading ? <div style={S.loadingText}>Loading...</div> :
              myPickups.length === 0 ? (
                <div style={S.emptyCard}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚴</div>
                  <p style={{ color: 'var(--muted)' }}>No active pickups. <Link to="/listings" style={{ color: '#00c896' }}>Browse available food →</Link></p>
                </div>
              ) : (
                <div style={S.listCol}>
                  {myPickups.map(l => {
                    const st = statusLabel[l.status] || statusLabel.active
                    return (
                      <div key={l._id} style={S.listRow}>
                        <div style={S.listEmoji}>🚴</div>
                        <div style={{ flex: 1 }}>
                          <div style={S.listName}>{l.foodType} — {l.donorName}</div>
                          <div style={S.listMeta}>📍 {l.donorAddress}</div>
                          {l.donorPhone && <div style={S.listMeta}>📞 {l.donorPhone}</div>}
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.donorAddress)}`} target="_blank" rel="noreferrer" style={S.mapsLink}>
                            🗺️ Open in Google Maps →
                          </a>
                        </div>
                        <span style={{ ...S.statusPill, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                          {st.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            }
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 style={S.sectionTitle}>Quick Actions</h2>
          <div style={S.actGrid}>
            {[
              user.role === 'restaurant' && { emoji: '🍱', label: 'Post Donation',  sub: 'List surplus food',    to: '/donate'     },
              { emoji: '🥘', label: 'Browse Food',    sub: 'All active listings',   to: '/listings'   },
              { emoji: '🚴', label: 'Volunteers',     sub: 'See who is active',     to: '/volunteers' },
              { emoji: '📊', label: 'Impact Stats',   sub: 'Community numbers',     to: '/impact'     },
            ].filter(Boolean).map((a, i) => (
              <Link key={i} to={a.to} style={S.actCard}>
                <div style={S.actIcon}>{a.emoji}</div>
                <div style={S.actLabel}>{a.label}</div>
                <div style={S.actSub}>{a.sub}</div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 style={S.sectionTitle}>Your Profile</h2>
          <div style={S.profileCard}>
            {[
              { k: 'Name',  v: user.name },
              { k: 'Email', v: user.email },
              { k: 'Role',  v: `${info.emoji} ${info.label}` },
              { k: 'Phone', v: user.phone || 'Not set' },
              { k: 'Area',  v: user.area  || 'Not set' },
            ].map(({ k, v }) => (
              <div key={k} style={S.profileRow}>
                <span style={S.profileKey}>{k}</span>
                <span style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { logout(); navigate('/') }} style={S.logoutBtn}>
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  )
}

const S = {
  page:        { minHeight: '100vh', padding: '100px 48px 60px', background: 'var(--g1)', position: 'relative' },
  bg:          { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(0,200,150,0.05) 0%, transparent 70%)', pointerEvents: 'none' },
  inner:       { maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative', zIndex: 1 },
  welcomeCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: '28px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', position: 'relative', overflow: 'hidden', flexWrap: 'wrap' },
  roleGrad:    { position: 'absolute', top: '-80px', left: '-80px', width: '260px', height: '260px', borderRadius: '50%', opacity: 0.12, pointerEvents: 'none' },
  welcomeLeft: { flex: 1 },
  roleBadge:   { display: 'inline-block', background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.25)', color: '#00c896', fontSize: '0.8rem', fontWeight: 600, padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' },
  welcomeTitle:{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, marginBottom: '8px' },
  welcomeSub:  { fontSize: '0.875rem', color: 'var(--muted)' },
  welcomeStats:{ display: 'flex', gap: '24px' },
  wStat:       { textAlign: 'center' },
  wStatN:      { fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: '#00c896', lineHeight: 1 },
  wStatL:      { fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' },
  sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  sectionTitle:{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' },
  addBtn:      { background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.25)', color: '#00c896', padding: '8px 18px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 },
  loadingText: { color: 'var(--muted)', fontSize: '0.9rem' },
  emptyCard:   { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', textAlign: 'center' },
  listCol:     { display: 'flex', flexDirection: 'column', gap: '12px' },
  listRow:     { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,150,0.1)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px' },
  listEmoji:   { fontSize: '1.6rem', flexShrink: 0, marginTop: '2px' },
  listName:    { fontWeight: 600, color: 'var(--text)', marginBottom: '4px', fontSize: '0.95rem' },
  listMeta:    { fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '3px' },
  volNotice:   { fontSize: '0.82rem', color: '#f5a623', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', padding: '8px 12px', borderRadius: '8px', marginTop: '8px' },
  statusPill:  { fontSize: '0.75rem', fontWeight: 600, padding: '5px 12px', borderRadius: '100px', whiteSpace: 'nowrap', flexShrink: 0 },
  mapsLink:    { display: 'inline-block', fontSize: '0.82rem', color: '#00c896', fontWeight: 600, marginTop: '6px', textDecoration: 'none' },
  actGrid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '16px' },
  actCard:     { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,150,0.12)', borderRadius: '20px', padding: '24px', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.25s' },
  actIcon:     { fontSize: '2rem', marginBottom: '12px' },
  actLabel:    { fontWeight: 600, color: 'var(--text)', marginBottom: '4px', fontSize: '0.95rem' },
  actSub:      { fontSize: '0.8rem', color: 'var(--muted)' },
  profileCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,150,0.12)', borderRadius: '20px', padding: '24px', marginBottom: '20px' },
  profileRow:  { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' },
  profileKey:  { color: 'var(--muted)', fontWeight: 500 },
  logoutBtn:   { background: 'transparent', border: '1px solid rgba(232,244,240,0.15)', color: 'var(--muted)', padding: '10px 24px', borderRadius: '100px', fontSize: '0.875rem', fontFamily: 'Outfit, sans-serif' },
}