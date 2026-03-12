import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => navigate('/dashboard'), 800)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#05050a' }}>
      {/* Left brand panel */}
      <div style={{
        display: 'none',
        width: '45%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #0d0d20 0%, #0a0a18 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        '@media (min-width: 900px)': { display: 'flex' },
      }} className="auth-panel">
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '30%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16, fontWeight: 800,
              boxShadow: '0 0 20px rgba(59,130,246,0.4)',
            }}>◆</div>
            <span style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 20 }}>PrepAI</span>
          </Link>

          {/* Middle copy */}
          <div>
            <h2 style={{ color: '#f0f0ff', fontSize: 36, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16 }}>
              Your AI Interview<br />Coach Awaits
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.7, maxWidth: 340 }}>
              Sign in to access your sessions, review feedback, and keep improving.
            </p>
          </div>

          {/* Testimonial */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '20px 22px',
          }}>
            <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7, marginBottom: 14, fontStyle: 'italic' }}>
              "PrepAI helped me land my dream job at Stripe. The voice interview practice is shockingly realistic."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 700,
              }}>A</div>
              <div>
                <div style={{ color: '#f0f0ff', fontSize: 13, fontWeight: 600 }}>Alex M.</div>
                <div style={{ color: '#6b7280', fontSize: 12 }}>Frontend Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }} className="mobile-logo">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 16, fontWeight: 800,
              }}>◆</div>
              <span style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 20 }}>PrepAI</span>
            </Link>
          </div>

          <h1 style={{ color: '#f0f0ff', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 36 }}>
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={labelStyle}>Password</label>
                <a href="#" style={{ color: '#3b82f6', fontSize: 13, textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <input
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: 6,
              background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              padding: '14px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 24px rgba(59,130,246,0.35)',
              transition: 'all 0.2s',
            }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 28, textAlign: 'center', color: '#4b5563', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/sign-up" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', color: '#9ca3af', fontSize: 13, fontWeight: 500, marginBottom: 8,
}
const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#f0f0ff', fontSize: 15, padding: '12px 16px',
  borderRadius: 10, outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}
