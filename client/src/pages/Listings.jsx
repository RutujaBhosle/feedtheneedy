import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Listings() {
  const [listings, setListings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [message,  setMessage]  = useState('')
  const [msgType,  setMsgType]  = useState('success')
  const [filter,   setFilter]   = useState('all')
  const { user } = useAuth()

  const fetchListings = async () => {
    try {
      const { data } = await API.get('/listings')
      setListings(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchListings() }, [])

  const showMsg = (msg, type = 'success') => {
    setMessage(msg); setMsgType(type)
    setTimeout(() => setMessage(''), 3500)
  }

  const handleClaim = async id => {
    if (!user) return showMsg('⚠️ Please login to claim food!', 'warn')
    try {
      await API.patch(`/listings/${id}/claim`)
      showMsg('✅ Food claimed! Please collect it on time.')
      fetchListings()
    } catch (err) { showMsg(err.response?.data?.message || 'Could not claim', 'error') }
  }

  const handleAccept = async id => {
    if (!user) return showMsg('⚠️ Please login first!', 'warn')
    try {
      await API.patch(`/listings/${id}/accept`)
      showMsg('🚴 Pickup accepted! Restaurant address is now visible below.')
      fetchListings()
    } catch (err) { showMsg(err.response?.data?.message || 'Could not accept', 'error') }
  }

  const urgencyColors = { urgent: '#ff6b6b', today: '#f5a623', fresh: '#00c896' }
  const urgencyLabels = { urgent: '🔴 Urgent', today: '🟡 Today', fresh: '🟢 Fresh' }

  const statusMap = {
    active:             { label: '🟢 Available',       color: '#00c896', bg: 'rgba(0,200,150,0.1)',   border: 'rgba(0,200,150,0.25)' },
    volunteer_assigned: { label: '🚴 Volunteer Coming', color: '#f5a623', bg: 'rgba(245,166,35,0.1)',  border: 'rgba(245,166,35,0.25)' },
    picked_up:          { label: '📦 Picked Up',        color: '#64b4ff', bg: 'rgba(100,180,255,0.1)', border: 'rgba(100,180,255,0.25)' },
    delivered:          { label: '✅ Delivered',         color: '#00c896', bg: 'rgba(0,200,150,0.06)', border: 'rgba(0,200,150,0.15)' },
    expired:            { label: '⏰ Expired',           color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)' },
    claimed:            { label: '✅ Claimed',           color: '#00c896', bg: 'rgba(0,200,150,0.07)', border: 'rgba(0,200,150,0.15)' },
  }

  const foodIcons = {
    'Cooked Meals': '🍛', 'Bread & Bakery': '🍞', 'Raw Groceries': '🥦',
    'Fruits & Vegetables': '🍎', 'Dairy Products': '🥛', 'Packaged Food': '📦',
  }

  const areas = ['all', ...new Set(listings.map(l => l.area).filter(Boolean))]
  const filtered = filter === 'all' ? listings : listings.filter(l => l.area === filter)

  const toastStyle = {
    success: { bg: 'rgba(0,200,150,0.12)',   border: 'rgba(0,200,150,0.35)',   color: '#00c896' },
    warn:    { bg: 'rgba(245,166,35,0.12)',  border: 'rgba(245,166,35,0.35)',  color: '#f5a623' },
    error:   { bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.35)', color: '#ff6b6b' },
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a1628',
      paddingTop: '90px',
      paddingBottom: '80px',
      position: 'relative',
      fontFamily: 'Outfit, sans-serif',
    }}>

      {/* Ambient background glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 55% 45% at 15% 20%, rgba(0,200,150,0.07) 0%, transparent 65%),
          radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,160,122,0.05) 0%, transparent 60%)
        `,
      }} />

      {/* Toast notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', top: '88px', left: '50%',
              transform: 'translateX(-50%)', zIndex: 999,
              padding: '13px 24px', borderRadius: '100px',
              background: toastStyle[msgType].bg,
              border: `1px solid ${toastStyle[msgType].border}`,
              color: toastStyle[msgType].color,
              fontSize: '0.9rem', fontWeight: 500,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>

        {/* ── HERO HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '48px' }}
        >
          <div style={{
            fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#00c896', marginBottom: '12px',
          }}>
            Browse Food
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700, lineHeight: 1.1,
              color: '#e8f4f0', margin: 0,
            }}>
              Food available{' '}
              <span style={{
                background: 'linear-gradient(135deg,#00c896,#7fffd4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                near you
              </span>
            </h1>

            {/* Live count badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '100px',
              background: 'rgba(0,200,150,0.08)',
              border: '1px solid rgba(0,200,150,0.2)',
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#00c896',
                boxShadow: '0 0 0 3px rgba(0,200,150,0.25)',
                display: 'inline-block',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{ fontSize: '0.85rem', color: '#00c896', fontWeight: 600 }}>
                {filtered.length} listing{filtered.length !== 1 ? 's' : ''} live
              </span>
            </div>
          </div>

          <p style={{
            color: 'rgba(232,244,240,0.45)',
            fontSize: '1rem', fontWeight: 300,
            lineHeight: 1.7, marginTop: '14px', maxWidth: '480px',
          }}>
            Claim surplus food from restaurants before it goes to waste. Every meal matters.
          </p>
        </motion.div>

        {/* ── AREA FILTER PILLS ── */}
        {areas.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}
          >
            {areas.map(area => (
              <button
                key={area}
                onClick={() => setFilter(area)}
                style={{
                  padding: '8px 18px', borderRadius: '100px',
                  border: `1px solid ${filter === area ? '#00c896' : 'rgba(0,200,150,0.18)'}`,
                  background: filter === area ? 'rgba(0,200,150,0.12)' : 'rgba(255,255,255,0.03)',
                  color: filter === area ? '#00c896' : 'rgba(232,244,240,0.45)',
                  fontSize: '0.83rem', fontWeight: filter === area ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  transition: 'all 0.2s',
                  textTransform: area === 'all' ? 'none' : 'capitalize',
                }}
              >
                {area === 'all' ? '📍 All Areas' : area}
              </button>
            ))}
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '320px', flexDirection: 'column', gap: '16px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: '3px solid rgba(0,200,150,0.15)',
              borderTop: '3px solid #00c896',
              animation: 'spin 0.9s linear infinite',
            }} />
            <div style={{ color: 'rgba(232,244,240,0.35)', fontSize: '0.9rem' }}>
              Fetching listings…
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(232,244,240,0.35)' }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🥘</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 500, color: 'rgba(232,244,240,0.5)', marginBottom: '8px' }}>
              No listings right now
            </div>
            <div style={{ fontSize: '0.875rem' }}>Check back soon — restaurants post regularly!</div>
          </motion.div>
        )}

        {/* ── CARDS GRID ── */}
        {!loading && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map((listing, i) => {
              const st     = statusMap[listing.status] || statusMap.active
              const isVol  = user?.role === 'volunteer'
              const isActive = listing.status === 'active'
              const urg    = listing.urgency || 'fresh'
              const icon   = foodIcons[listing.foodType] || '🍽️'

              // Volunteer assigned to THIS listing
              const isMyPickup =
                listing.status === 'volunteer_assigned' && (
                  listing.assignedVolunteer?._id === user?._id ||
                  listing.assignedVolunteer?.id  === user?._id ||
                  listing.assignedVolunteer?.name === user?.name
                )

              // Show address when:
              // - volunteer accepted (volunteer_assigned) and it's their pickup
              // - volunteer is looking at an active listing (to decide)
              const showAddress = isVol && listing.donorAddress && (isActive || isMyPickup)

              return (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  style={{
                    background: 'rgba(255,255,255,0.035)',
                    border: `1px solid ${isMyPickup ? 'rgba(0,200,150,0.4)' : 'rgba(0,200,150,0.13)'}`,
                    borderRadius: '22px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(16px)',
                    position: 'relative',
                    boxShadow: isMyPickup
                      ? '0 0 0 2px rgba(0,200,150,0.15), 0 4px 24px rgba(0,0,0,0.2)'
                      : '0 4px 24px rgba(0,0,0,0.2)',
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  {/* Top accent bar by urgency */}
                  <div style={{
                    height: '3px',
                    background: `linear-gradient(90deg, ${urgencyColors[urg]}, transparent)`,
                  }} />

                  <div style={{ padding: '24px' }}>

                    {/* Top row: icon + food type + status badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '14px',
                          background: 'rgba(0,200,150,0.1)',
                          border: '1px solid rgba(0,200,150,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.5rem', flexShrink: 0,
                        }}>
                          {icon}
                        </div>
                        <div>
                          <h3 style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '1.1rem', fontWeight: 700,
                            color: '#e8f4f0', margin: 0, lineHeight: 1.2,
                          }}>
                            {listing.foodType}
                          </h3>
                          {listing.area && (
                            <div style={{ fontSize: '0.78rem', color: 'rgba(232,244,240,0.4)', marginTop: '3px' }}>
                              📍 {listing.area}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{
                        padding: '5px 11px', borderRadius: '100px',
                        background: st.bg, border: `1px solid ${st.border}`,
                        color: st.color, fontSize: '0.72rem', fontWeight: 600,
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        {st.label}
                      </div>
                    </div>

                    {/* Description */}
                    {listing.description && (
                      <p style={{
                        fontSize: '0.85rem', color: 'rgba(232,244,240,0.5)',
                        lineHeight: 1.6, marginBottom: '14px',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {listing.description}
                      </p>
                    )}

                    {/* Chips */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {listing.remaining != null && (
                        <Chip icon="🍽️" text={`${listing.remaining} portions left`} />
                      )}
                      {listing.urgency && (
                        <Chip text={urgencyLabels[urg]} color={urgencyColors[urg]} />
                      )}
                      {listing.pickupBy && (
                        <Chip icon="⏰" text={`Until ${listing.pickupBy}`} />
                      )}
                    </div>

                    {/* Donor name teaser */}
                    {listing.donorName && (
                      <div style={{
                        fontSize: '0.8rem', color: 'rgba(232,244,240,0.38)',
                        marginBottom: '14px',
                      }}>
                        🏪 {listing.donorName}
                      </div>
                    )}

                    {/* ── ADDRESS REVEAL (volunteer only, after accepting) ── */}
                    <AnimatePresence>
                      {isMyPickup && listing.donorAddress && (
                        <motion.div
                          key="address-reveal"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          style={{ overflow: 'hidden', marginBottom: '16px' }}
                        >
                          <div style={{
                            background: 'rgba(0,200,150,0.07)',
                            border: '1px solid rgba(0,200,150,0.3)',
                            borderRadius: '14px', padding: '16px',
                          }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                              <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'linear-gradient(135deg,#00c896,#00a07a)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.9rem', flexShrink: 0,
                              }}>
                                📍
                              </div>
                              <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00c896' }}>
                                  Pickup Address Unlocked
                                </div>
                                <div style={{ fontSize: '0.73rem', color: 'rgba(0,200,150,0.6)' }}>
                                  Navigate to collect the food
                                </div>
                              </div>
                            </div>

                            {/* Address */}
                            <div style={{
                              fontSize: '0.95rem', fontWeight: 600,
                              color: '#e8f4f0', lineHeight: 1.4, marginBottom: '8px',
                            }}>
                              {listing.donorAddress}
                            </div>

                            {/* Phone */}
                            {listing.donorPhone && (
                              <div style={{
                                fontSize: '0.83rem', color: 'rgba(232,244,240,0.6)',
                                marginBottom: '12px',
                              }}>
                                📞 {listing.donorPhone}
                              </div>
                            )}

                            {/* Google Maps CTA */}
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.donorAddress)}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'linear-gradient(135deg,#00c896,#00a07a)',
                                color: '#0a1628', border: 'none',
                                padding: '10px 18px', borderRadius: '100px',
                                fontSize: '0.82rem', fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                                textDecoration: 'none',
                                boxShadow: '0 4px 16px rgba(0,200,150,0.3)',
                              }}
                            >
                              🗺️ Open in Google Maps →
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Address box for active volunteer (preview) */}
                    {isVol && isActive && listing.donorAddress && (
                      <div style={{
                        background: 'rgba(0,200,150,0.04)',
                        border: '1px solid rgba(0,200,150,0.15)',
                        borderRadius: '12px', padding: '12px 14px',
                        marginBottom: '16px',
                      }}>
                        <div style={{
                          fontSize: '0.73rem', fontWeight: 600,
                          color: 'rgba(0,200,150,0.6)', marginBottom: '5px',
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                        }}>
                          Pickup Location
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(232,244,240,0.6)', lineHeight: 1.4 }}>
                          {listing.donorAddress}
                        </div>
                      </div>
                    )}

                    <div style={{ height: '1px', background: 'rgba(0,200,150,0.08)', marginBottom: '16px' }} />

                    {/* ── ACTION BUTTONS ── */}
                    <div style={{ display: 'flex', gap: '10px' }}>

                      {/* Guest / user claiming */}
                      {!isVol && isActive && (
                        <button onClick={() => handleClaim(listing._id)} style={btnPrimary}>
                          🤲 Claim Food
                        </button>
                      )}

                      {/* Volunteer accepting pickup */}
                      {isVol && isActive && (
                        <button onClick={() => handleAccept(listing._id)} style={btnPrimary}>
                          🚴 Accept Pickup
                        </button>
                      )}

                      {/* Volunteer: assigned to this one */}
                      {isMyPickup && (
                        <div style={{
                          flex: 1, padding: '12px', borderRadius: '12px', textAlign: 'center',
                          background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)',
                          color: '#f5a623', fontSize: '0.85rem', fontWeight: 600,
                        }}>
                          🚴 You're on this delivery!
                        </div>
                      )}

                      {/* Non-actionable for non-volunteers */}
                      {!isActive && !isMyPickup && (
                        <div style={{
                          flex: 1, padding: '12px', borderRadius: '12px', textAlign: 'center',
                          background: st.bg, border: `1px solid ${st.border}`,
                          color: st.color, fontSize: '0.85rem', fontWeight: 600,
                        }}>
                          {st.label}
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(0,200,150,0.25); }
          50%       { box-shadow: 0 0 0 6px rgba(0,200,150,0.1); }
        }
      `}</style>
    </div>
  )
}

function Chip({ icon, text, color }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '100px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: '0.76rem', fontWeight: 500,
      color: color || 'rgba(232,244,240,0.55)',
    }}>
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </div>
  )
}

const btnPrimary = {
  flex: 1,
  background: 'linear-gradient(135deg,#00c896,#00a07a)',
  color: '#0a1628', border: 'none',
  padding: '12px 16px', borderRadius: '12px',
  fontSize: '0.88rem', fontWeight: 700,
  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
  boxShadow: '0 4px 0 #007a5e, 0 6px 20px rgba(0,200,150,0.25)',
  transition: 'all 0.2s',
  letterSpacing: '0.02em',
}