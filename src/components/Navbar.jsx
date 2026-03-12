import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ isAuthenticated = false }) {
  const navigate = useNavigate()

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(5,5,10,0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 32px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: '#fff', fontWeight: 800,
            boxShadow: '0 0 24px rgba(59,130,246,0.45)',
            flexShrink: 0,
          }}>◆</div>
          <span style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.4px' }}>
            PrepAI
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={ghostBtn}>Dashboard</Link>
              <button onClick={() => navigate('/')} style={{ ...ghostBtn, background: 'none', cursor: 'pointer' }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" style={ghostBtn}>Sign In</Link>
              <Link to="/sign-up" style={primaryBtn}>Get Started →</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

const ghostBtn = {
  color: '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500,
  padding: '8px 14px', borderRadius: 8, border: 'none', background: 'transparent',
  display: 'inline-block',
}

const primaryBtn = {
  color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600,
  padding: '8px 18px', borderRadius: 8,
  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  boxShadow: '0 0 20px rgba(59,130,246,0.35)',
  display: 'inline-block',
}
