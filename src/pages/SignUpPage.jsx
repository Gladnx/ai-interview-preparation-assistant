import { SignUp } from '@clerk/react'
import { Link } from 'react-router-dom'

const clerkAppearance = {
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#0d0d1a',
    colorText: '#f0f0ff',
    colorTextSecondary: '#9ca3af',
    colorInputBackground: 'rgba(255,255,255,0.05)',
    colorInputText: '#f0f0ff',
    colorNeutral: '#6b7280',
    borderRadius: '10px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  elements: {
    rootBox: { width: '100%' },
    card: {
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
      padding: 0,
    },
    headerTitle: { color: '#f0f0ff', fontSize: '24px', fontWeight: 800 },
    headerSubtitle: { color: '#6b7280' },
    socialButtonsBlockButton: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#d1d5db',
    },
    dividerLine: { background: 'rgba(255,255,255,0.08)' },
    dividerText: { color: '#4b5563' },
    formFieldLabel: { color: '#9ca3af', fontSize: '13px' },
    formFieldInput: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#f0f0ff',
      borderRadius: '10px',
    },
    formButtonPrimary: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      boxShadow: '0 0 24px rgba(59,130,246,0.35)',
      fontWeight: 700,
    },
    footerActionLink: { color: '#3b82f6', fontWeight: 600 },
  },
}

export default function SignUpPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#05050a' }}>
      {/* Left brand panel */}
      <div className="auth-panel" style={{
        width: '45%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #0a0a18 0%, #080814 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          position: 'absolute', top: '15%', left: '20%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative', padding: '48px',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', height: '100%',
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16, fontWeight: 800,
              boxShadow: '0 0 20px rgba(59,130,246,0.4)',
            }}>◆</div>
            <span style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 20 }}>PrepAA</span>
          </Link>

          <div>
            <h2 style={{
              color: '#f0f0ff', fontSize: 36, fontWeight: 800,
              lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16,
            }}>
              Start Your<br />Interview Journey
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.7, maxWidth: 340, marginBottom: 32 }}>
              Create your free account and be interview-ready in minutes.
            </p>

            {['Free to get started', 'AI-powered voice interviews', 'Instant performance feedback', 'Tailored to your resume'].map((b) => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#93c5fd', fontSize: 11, fontWeight: 700,
                }}>✓</div>
                <span style={{ color: '#9ca3af', fontSize: 14 }}>{b}</span>
              </div>
            ))}
          </div>

          <div style={{ color: '#374151', fontSize: 13 }}>
            © {new Date().getFullYear()} PrepAA
          </div>
        </div>
      </div>

      {/* Right: Clerk SignUp */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="mobile-logo" style={{ justifyContent: 'center', marginBottom: 36 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 16, fontWeight: 800,
              }}>◆</div>
              <span style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 20 }}>PrepAA</span>
            </Link>
          </div>

          <SignUp
            appearance={clerkAppearance}
            forceRedirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  )
}
