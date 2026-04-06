import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Impact() {
  const stats = [
    { emoji: '🥘', num: '24,180', label: 'Total Meals Shared',  col: '#00c896', bg: 'rgba(0,200,150,0.08)',   border: 'rgba(0,200,150,0.2)'   },
    { emoji: '👨‍👩‍👧', num: '8,060',  label: 'Families Helped',     col: '#f5a623', bg: 'rgba(245,166,35,0.08)',  border: 'rgba(245,166,35,0.2)'  },
    { emoji: '🏪', num: '380',    label: 'Partner Restaurants', col: '#64b4ff', bg: 'rgba(100,180,255,0.08)', border: 'rgba(100,180,255,0.2)' },
    { emoji: '🚴', num: '520',    label: 'Active Volunteers',   col: '#00c896', bg: 'rgba(0,200,150,0.08)',   border: 'rgba(0,200,150,0.2)'   },
    { emoji: '🏛️', num: '140',    label: 'NGO Partners',        col: '#f5a623', bg: 'rgba(245,166,35,0.08)',  border: 'rgba(245,166,35,0.2)'  },
    { emoji: '🌍', num: '1,200T', label: 'Kilograms CO₂ Saved', col: '#64b4ff', bg: 'rgba(100,180,255,0.08)', border: 'rgba(100,180,255,0.2)' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', paddingTop: '80px', fontFamily: 'Outfit, sans-serif' }}>

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(0,200,150,0.06) 0%, transparent 70%)',
      }} />

      {/* ── HERO ── */}
      <section style={{
        padding: '60px 48px 80px',
        background: 'linear-gradient(135deg,#061220,#0a2a1a)',
        position: 'relative', overflow: 'hidden',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <div style={{
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#00c896', marginBottom: '12px',
          }}>
            Our Impact
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem,6vw,4.5rem)',
            fontWeight: 700, color: '#e8f4f0',
            lineHeight: 1.05, marginBottom: '20px',
          }}>
            Every number is a<br />
            <span style={{
              background: 'linear-gradient(135deg,#00c896,#7fffd4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              real human story
            </span>
          </h1>
          <p style={{
            color: 'rgba(232,244,240,0.5)', fontSize: '1.1rem',
            maxWidth: '540px', margin: '0 auto', fontWeight: 300, lineHeight: 1.8,
          }}>
            Since launching in Pimpri-Chinchwad, FeedTheNeedy has created
            measurable, lasting change in our community.
          </p>
        </motion.div>
      </section>

      {/* ── STATS GRID ── */}
      <section style={{ padding: '80px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: '20px', maxWidth: '1200px', margin: '0 auto',
        }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              style={{
                background: s.bg, border: `1px solid ${s.border}`,
                borderRadius: '24px', padding: '36px 24px',
                textAlign: 'center', cursor: 'default',
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, boxShadow: `0 24px 60px rgba(0,0,0,0.3), 0 0 30px ${s.border}` }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{s.emoji}</div>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2.5rem', fontWeight: 700,
                color: s.col, lineHeight: 1, marginBottom: '8px',
              }}>
                {s.num}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(232,244,240,0.5)', fontWeight: 500 }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SDG SECTION ── */}
      <section style={{ padding: '0 48px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(0,200,150,0.15)',
          borderRadius: '28px', padding: '48px',
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          gap: '48px', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#00c896', marginBottom: '12px',
            }}>
              UN Sustainable Goals
            </div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.8rem', fontWeight: 700,
              color: '#e8f4f0', marginBottom: '16px', lineHeight: 1.2,
            }}>
              We're working towards<br />a hunger-free India
            </h2>
            <p style={{
              color: 'rgba(232,244,240,0.5)',
              lineHeight: 1.8, marginBottom: '28px', fontWeight: 300,
            }}>
              FeedTheNeedy directly contributes to SDG 2 (Zero Hunger),
              SDG 12 (Responsible Consumption), and SDG 13 (Climate Action).
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['🎯 SDG 2 — Zero Hunger', '♻️ SDG 12 — Responsible Consumption', '🌱 SDG 13 — Climate Action'].map(g => (
                <span key={g} style={{
                  background: 'rgba(0,200,150,0.1)',
                  border: '1px solid rgba(0,200,150,0.25)',
                  color: '#00c896', fontSize: '0.8rem', fontWeight: 600,
                  padding: '6px 14px', borderRadius: '100px',
                }}>
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[['24,180', 'Meals'], ['1,200T', 'CO₂ Saved'], ['8,060', 'Families']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '2rem', fontWeight: 700,
                  color: '#00c896', lineHeight: 1, marginBottom: '4px',
                }}>
                  {n}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(232,244,240,0.45)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin: '0 48px 80px',
        background: 'linear-gradient(135deg,rgba(0,200,150,0.08),rgba(0,200,150,0.03))',
        border: '1px solid rgba(0,200,150,0.15)',
        borderRadius: '28px', padding: '60px 48px',
        position: 'relative', zIndex: 1, overflow: 'hidden',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem,4vw,3rem)',
            color: '#e8f4f0', marginBottom: '16px',
          }}>
            Want to add to these numbers?
          </h2>
          <p style={{
            color: 'rgba(232,244,240,0.5)',
            marginBottom: '32px', fontWeight: 300,
          }}>
            Every donation, delivery, and claim makes a real difference.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg,#00c896,#00a07a)',
              color: '#0a1628', padding: '14px 32px', borderRadius: '100px',
              fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
              boxShadow: '0 4px 0 #007a5e, 0 6px 20px rgba(0,200,150,0.3)',
              fontFamily: 'Outfit, sans-serif',
            }}>
              Join FeedTheNeedy →
            </Link>
            <Link to="/listings" style={{
              background: 'transparent',
              border: '1px solid rgba(0,200,150,0.35)',
              color: '#00c896', padding: '14px 32px', borderRadius: '100px',
              fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
              fontFamily: 'Outfit, sans-serif',
            }}>
              Browse Food
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}