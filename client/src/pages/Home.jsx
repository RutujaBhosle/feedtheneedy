import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

export default function Home() {
  const canvasRef = useRef(null)

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = [], animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      reset() {
        this.x  = Math.random() * canvas.width
        this.y  = Math.random() * canvas.height
        this.sz = Math.random() * 1.5 + 0.3
        this.vx = (Math.random() - 0.5) * 0.35
        this.vy = (Math.random() - 0.5) * 0.35
        this.op = Math.random() * 0.35 + 0.08
        this.col = Math.random() > 0.7 ? '0,200,150' : '232,244,240'
      }
      constructor() { this.reset() }
      update() {
        this.x += this.vx; this.y += this.vy
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height)
          this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.col},${this.op})`
        ctx.fill()
      }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle())

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      particles.forEach((p, i) => {
        particles.slice(i + 1, i + 4).forEach(p2 => {
          const d = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0,200,150,${0.05 * (1 - d / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--g1)', color: 'var(--text)' }}>

      {/* BG CANVAS */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.6, pointerEvents: 'none' }} />

      {/* ── HERO ── */}
      <section style={S.hero}>
        {/* Floating notification cards */}
        {[
          { left: '3%',  top: '22%', dot: '#00c896', text: '🍛 Dal Makhani — 20 portions · Kothrud' },
          { right: '3%', top: '30%', dot: '#f5a623', text: '🚴 Arjun confirmed pickup — 2 min ago' },
          { left: '3%',  top: '68%', dot: '#00c896', text: '🏛️ Annapurna Trust — needs 50 meals' },
          { right: '3%', top: '72%', dot: '#ff6b6b', text: '⏰ Bread expiring in 45 min — 8 left!' },
        ].map((c, i) => (
          <motion.div
            key={i}
            style={{ ...S.floatCard, left: c.left, right: c.right, top: c.top }}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
          >
            <span style={{ ...S.floatDot, background: c.dot }} />
            {c.text}
          </motion.div>
        ))}

        <motion.div
          variants={stagger} initial="hidden" animate="show"
          style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '860px' }}
        >
          {/* Live badge */}
          <motion.div variants={fadeUp} style={S.liveBadge}>
            <span style={S.liveDot} />
            23 pickups active right now in Pimpri-Chinchwad
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} style={S.h1}>
            <span style={{ display: 'block', color: 'var(--text)' }}>Every Meal</span>
            <span style={{ display: 'block', ...S.gradientText }}>Shared</span>
            <span style={{ display: 'block', fontStyle: 'italic', color: 'var(--text)' }}>Saves a Life</span>
          </motion.h1>

          <motion.p variants={fadeUp} style={S.heroSub}>
            FeedTheNeedy bridges restaurants with surplus food to volunteers,
            NGOs, and families in need — turning waste into nourishment across India.
          </motion.p>

          <motion.div variants={fadeUp} style={S.heroActions}>
            <Link to="/listings" className="btn-primary">🌾 Find Food Near Me</Link>
            <Link to="/register" className="btn-ghost">Start Donating →</Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} style={S.statsStrip}>
            {[
              { num: '24,180+', label: 'Meals Shared' },
              { num: '380',     label: 'Restaurants' },
              { num: '520',     label: 'Volunteers' },
              { num: '140',     label: 'NGO Partners' },
            ].map((s, i) => (
              <div key={i} style={S.statItem}>
                <div style={S.statNum}>{s.num}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg,#0a1628 0%,#0d2137 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="eyebrow">The Problem We Solve</div>
            <h2 className="section-h2">40% of India's food<br />is wasted every year</h2>
            <p style={{ color: 'var(--muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.8, fontWeight: 300 }}>
              While 19 crore Indians sleep hungry, restaurants discard thousands of meals daily. We fix this — together.
            </p>
          </div>
          <div style={S.probGrid}>
            {[
              { emoji: '🗑️', stat: '68 MT',    desc: 'Food wasted in India every year',  delay: 'reveal-d1' },
              { emoji: '😔', stat: '19 Cr',    desc: 'Indians facing hunger daily',        delay: 'reveal-d2' },
              { emoji: '💸', stat: '₹92K Cr',  desc: 'Economic loss from food waste',     delay: 'reveal-d3' },
              { emoji: '🌍', stat: '8%',       desc: 'Global emissions from food waste',  delay: 'reveal-d4' },
            ].map((c, i) => (
              <div key={i} className={`reveal ${c.delay}`} style={S.probCard}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{c.emoji}</div>
                <div style={S.probStat}>{c.stat}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '100px 0', background: 'var(--g1)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="eyebrow">Simple Process</div>
            <h2 className="section-h2">From surplus to smiles<br />in 3 easy steps</h2>
          </div>
          <div style={S.stepsGrid}>
            {[
              { n: '01', emoji: '🍽️', title: 'Restaurant Posts',   desc: 'List surplus food in 60 seconds. Add full address so volunteers can navigate directly to you.',     delay: 'reveal-d1' },
              { n: '02', emoji: '🚴', title: 'Volunteer Accepts',  desc: 'Nearby volunteers get notified instantly. They confirm pickup and get Google Maps directions.',      delay: 'reveal-d2' },
              { n: '03', emoji: '🤲', title: 'Community Gets Fed', desc: 'NGO or family receives food. Restaurant gets a digital impact receipt. Listings auto-expire cleanly.', delay: 'reveal-d3' },
            ].map((s, i) => (
              <div
                key={i}
                className={`reveal ${s.delay}`}
                style={S.stepCard}
                onMouseMove={e => {
                  const r = e.currentTarget.getBoundingClientRect()
                  const x = (e.clientX - r.left) / r.width  - 0.5
                  const y = (e.clientY - r.top)  / r.height - 0.5
                  e.currentTarget.style.transform = `perspective(600px) rotateY(${x*12}deg) rotateX(${-y*12}deg) translateY(-8px)`
                }}
                onMouseLeave={e => { e.currentTarget.style.transform = '' }}
              >
                <div style={S.stepN}>{s.n}</div>
                <div style={{ fontSize: '2.2rem', marginBottom: '16px' }}>{s.emoji}</div>
                <h3 style={S.stepTitle}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section style={{ padding: '100px 0', background: '#061220' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="eyebrow">Choose Your Role</div>
            <h2 className="section-h2">One platform,<br />four ways to help</h2>
          </div>
          <div style={S.rolesGrid}>
            {[
              { emoji: '🍽️', title: 'Restaurants',  desc: 'List surplus in 60 seconds. Get auto tax receipts. Build community goodwill.',      cta: 'Start Donating',  to: '/donate',    accent: '#00c896', bg: 'rgba(0,200,150,0.08)',   border: 'rgba(0,200,150,0.25)',   delay: 'reveal-d1' },
              { emoji: '🚴', title: 'Volunteers',   desc: 'Flexible hours. Real pickup addresses. Navigate via Google Maps. Earn badges.',      cta: 'Volunteer Now',   to: '/register',  accent: '#f5a623', bg: 'rgba(245,166,35,0.08)',  border: 'rgba(245,166,35,0.25)',  delay: 'reveal-d2' },
              { emoji: '🏛️', title: 'NGOs',         desc: 'Register your capacity. Receive consistent matched donations. Zero logistics.',      cta: 'Register NGO',    to: '/register',  accent: '#64b4ff', bg: 'rgba(100,180,255,0.08)', border: 'rgba(100,180,255,0.25)', delay: 'reveal-d3' },
              { emoji: '🤲', title: 'Individuals',  desc: 'Browse food near you. Reserve with one tap. No account required. Full dignity.',     cta: 'Find Food',       to: '/listings',  accent: '#ff6b6b', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.25)', delay: 'reveal-d4' },
            ].map((r, i) => (
              <div
                key={i}
                className={`reveal ${r.delay}`}
                style={{ ...S.roleCard, border: `1px solid ${r.border}` }}
                onMouseMove={e => {
                  const rc = e.currentTarget.getBoundingClientRect()
                  const x = (e.clientX - rc.left) / rc.width  - 0.5
                  const y = (e.clientY - rc.top)  / rc.height - 0.5
                  e.currentTarget.style.transform = `perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-10px)`
                  e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.3), 0 0 40px ${r.border}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div style={{ ...S.roleIcon, background: r.bg, border: `1px solid ${r.border}` }}>{r.emoji}</div>
                <h3 style={S.roleTitle}>{r.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '20px' }}>{r.desc}</p>
                <Link to={r.to} style={{ ...S.roleCta, color: r.accent }}>
                  {r.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg,#061220 0%,#0a1e0f 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="eyebrow">Real Impact</div>
            <h2 className="section-h2">Numbers that<br /><em>actually matter</em></h2>
          </div>
          <div style={S.impactGrid}>
            {[
              { emoji: '🥘', num: '24,180', label: 'Meals Shared',        delay: 'reveal-d1' },
              { emoji: '👨‍👩‍👧', num: '8,060',  label: 'Families Helped',   delay: 'reveal-d2' },
              { emoji: '🏪', num: '380',    label: 'Partner Restaurants', delay: 'reveal-d3' },
              { emoji: '🚴', num: '520',    label: 'Active Volunteers',   delay: 'reveal-d4' },
              { emoji: '🏛️', num: '140',    label: 'NGO Partners',        delay: 'reveal-d1' },
              { emoji: '🌍', num: '1,200T', label: 'CO₂ Saved (kg)',      delay: 'reveal-d2' },
            ].map((c, i) => (
              <div key={i} className={`reveal ${c.delay}`} style={S.impactCard}>
                <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{c.emoji}</div>
                <div style={S.impactNum}>{c.num}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 500 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 0', background: 'var(--g1)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="eyebrow">Community Stories</div>
            <h2 className="section-h2">Real voices,<br />real change</h2>
          </div>
          <div style={S.testGrid}>
            {[
              { init: 'R', name: 'Rajesh Patil',    role: 'Owner, The Punjabi Kitchen', grad: 'linear-gradient(135deg,#00c896,#007a5e)', text: 'Before FeedTheNeedy we threw away 30–40 portions every night. Now every meal reaches a family. The digital tax receipt is a brilliant bonus.', delay: 'reveal-d1' },
              { init: 'P', name: 'Priya Kulkarni',  role: 'Volunteer, Baner area',       grad: 'linear-gradient(135deg,#f5a623,#c47d0e)', text: 'I do 3–4 pickups a week on the way home. The Google Maps link means I never get lost. 20 minutes and a family is fed. So fulfilling.', delay: 'reveal-d2' },
              { init: 'A', name: 'Sister Ananda',   role: 'Director, Bal Aashray Shelter', grad: 'linear-gradient(135deg,#64b4ff,#1a6cb5)', text: 'We receive meals for our 65 children every day now. The platform matches our dietary needs perfectly. FeedTheNeedy has been a true blessing.', delay: 'reveal-d3' },
            ].map((t, i) => (
              <div key={i} className={`reveal ${t.delay}`} style={S.testCard}>
                <div style={S.quoteMark}>"</div>
                <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '24px', fontStyle: 'italic', fontWeight: 300 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ ...S.testAv, background: t.grad }}>{t.init}</div>
                  <div>
                    <div style={{ color: '#f5a623', fontSize: '0.8rem', marginBottom: '3px' }}>★★★★★</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={S.ctaSection}>
        <div className="reveal" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 700, marginBottom: '20px', lineHeight: 1.05 }}>
            Ready to make<br />
            <span style={S.gradientText}>a real difference?</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '48px', fontWeight: 300 }}>
            Join 900+ community members already fighting food waste in Pimpri-Chinchwad.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary">🌾 Join FeedTheNeedy Free</Link>
            <Link to="/listings" className="btn-ghost">Browse Food Near Me</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div className="container">
          <div style={S.footerGrid}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 900, color: '#00c896', marginBottom: '12px' }}>
                🌾 Feed<span style={{ color: '#f5a623' }}>TheNeedy</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '240px' }}>
                Turning surplus food into community strength across India.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Browse Food', 'Donate Surplus', 'Volunteers', 'NGOs'] },
              { title: 'Company',  links: ['About Us', 'Impact Report', 'Press', 'Careers']       },
              { title: 'Support',  links: ['Help Centre', 'Safety', 'Privacy', 'Contact']         },
            ].map((col, i) => (
              <div key={i}>
                <div style={S.footerColTitle}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={S.footerLink}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={S.footerBottom}>
            <span>© 2025 FeedTheNeedy · Built with 🌾 in Pimpri-Chinchwad</span>
            <span>Turning waste into nourishment</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

const S = {
  hero:        { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', position: 'relative', zIndex: 1, background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0,200,150,0.08) 0%, transparent 70%)' },
  floatCard:   { position: 'absolute', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: '12px', padding: '12px 16px', backdropFilter: 'blur(10px)', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 0 },
  floatDot:    { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  liveBadge:   { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00c896', fontSize: '0.8rem', fontWeight: 600, padding: '8px 20px', borderRadius: '100px', marginBottom: '32px', letterSpacing: '0.05em' },
  liveDot:     { width: '7px', height: '7px', borderRadius: '50%', background: '#00c896', display: 'inline-block', animation: 'none' },
  h1:          { fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3rem,8vw,7rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: '24px' },
  gradientText:{ background: 'linear-gradient(135deg,#00c896 0%,#7fffd4 50%,#f5a623 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%' },
  heroSub:     { fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '560px', lineHeight: 1.8, marginBottom: '48px', fontWeight: 300 },
  heroActions: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' },
  statsStrip:  { display: 'flex', gap: '0', background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: '20px', overflow: 'hidden', flexWrap: 'wrap' },
  statItem:    { flex: 1, minWidth: '120px', padding: '24px 28px', textAlign: 'center', borderRight: '1px solid rgba(0,200,150,0.1)' },
  statNum:     { fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, color: '#00c896', lineHeight: 1, marginBottom: '6px' },
  statLabel:   { fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.05em' },
  probGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' },
  probCard:    { background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '20px', padding: '36px 24px', textAlign: 'center', transition: 'all 0.3s' },
  probStat:    { fontFamily: 'Playfair Display, serif', fontSize: '2.3rem', fontWeight: 700, color: '#f5a623', lineHeight: 1, marginBottom: '8px' },
  stepsGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '24px' },
  stepCard:    { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '24px', padding: '36px 28px', transition: 'all 0.3s', transformStyle: 'preserve-3d' },
  stepN:       { fontFamily: 'Playfair Display, serif', fontSize: '5rem', fontWeight: 900, color: 'rgba(0,200,150,0.08)', lineHeight: 1, marginBottom: '8px' },
  stepTitle:   { fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' },
  rolesGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px' },
  roleCard:    { background: 'var(--card-bg)', borderRadius: '24px', padding: '36px 28px', transition: 'all 0.35s cubic-bezier(0.175,0.885,0.32,1.275)', transformStyle: 'preserve-3d' },
  roleIcon:    { width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '20px' },
  roleTitle:   { fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' },
  roleCta:     { fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', transition: 'letter-spacing 0.2s' },
  impactGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '16px' },
  impactCard:  { background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: '20px', padding: '32px 20px', textAlign: 'center', transition: 'all 0.3s' },
  impactNum:   { fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700, color: '#00c896', lineHeight: 1, marginBottom: '8px' },
  testGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '20px' },
  testCard:    { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '24px', padding: '36px', transition: 'all 0.3s' },
  quoteMark:   { fontFamily: 'Playfair Display, serif', fontSize: '5rem', color: 'rgba(0,200,150,0.2)', lineHeight: 0.6, display: 'block', marginBottom: '20px' },
  testAv:      { width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: '#0a1628', flexShrink: 0 },
  ctaSection:  { padding: '120px 48px', background: 'linear-gradient(135deg,#061220,#0a2a1a)', position: 'relative', overflow: 'hidden' },
  footer:      { background: '#040d1a', padding: '60px 0 32px', borderTop: '1px solid rgba(0,200,150,0.08)' },
  footerGrid:  { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' },
  footerColTitle: { fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(232,244,240,0.35)', marginBottom: '16px' },
  footerLink:  { fontSize: '0.875rem', color: 'rgba(232,244,240,0.3)', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.2s' },
  footerBottom:{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem', color: 'rgba(232,244,240,0.2)' },
}