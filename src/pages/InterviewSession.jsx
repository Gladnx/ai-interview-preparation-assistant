import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function InterviewSession() {
  const { id } = useParams()

  return (
    <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff' }}>
      <Navbar />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '96px 32px 80px' }}>
        <Link to="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#6b7280', fontSize: 14, textDecoration: 'none', marginBottom: 36,
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#f0f0ff'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}>
          ← Back to Dashboard
        </Link>

        {/* Header bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 32,
        }}>
          <div>
            <h1 style={{ color: '#f0f0ff', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Interview Room
            </h1>
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Session #{id}</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            color: '#10b981', fontSize: 13, fontWeight: 600,
            padding: '6px 14px', borderRadius: 99,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Live Session
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* AI Interviewer */}
          <div style={{
            background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, padding: '28px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(37,99,235,0.2))',
                border: '1px solid rgba(59,130,246,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>🤖</div>
              <div>
                <div style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 14 }}>AI Interviewer</div>
                <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Gemini · Powered by AI</div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 12, padding: '16px 18px',
            }}>
              <div style={{ color: '#4b5563', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                Current Question
              </div>
              <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7 }}>
                AI-generated questions will appear here once Gemini is integrated in Step 4.
              </p>
            </div>
          </div>

          {/* Your response */}
          <div style={{
            background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, padding: '28px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.15))',
                border: '1px solid rgba(16,185,129,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>🎤</div>
              <div>
                <div style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 14 }}>Your Response</div>
                <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Voice recognition · Active</div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 12, padding: '16px 18px', minHeight: 80,
              display: 'flex', alignItems: 'center',
            }}>
              <p style={{ color: '#4b5563', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>
                Voice recognition will be active here in Step 4. Speak your answer clearly...
              </p>
            </div>
          </div>
        </div>

        {/* Waveform / visualizer placeholder */}
        <div style={{
          background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, padding: '24px', marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          minHeight: 80,
        }}>
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} style={{
              width: 4, borderRadius: 99,
              background: 'rgba(59,130,246,0.25)',
              height: `${Math.max(6, Math.sin((i / 32) * Math.PI * 3) * 24 + 28)}px`,
            }} />
          ))}
          <span style={{ color: '#4b5563', fontSize: 13, marginLeft: 16 }}>Waiting to start…</span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button disabled style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)',
            color: '#3b82f6', fontWeight: 700, fontSize: 15,
            padding: '14px', borderRadius: 12, cursor: 'not-allowed', opacity: 0.7,
          }}>
            🎤 Start Speaking
          </button>
          <button disabled style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            color: '#6b7280', fontWeight: 700, fontSize: 15,
            padding: '14px', borderRadius: 12, cursor: 'not-allowed', opacity: 0.7,
          }}>
            ⏭ Next Question
          </button>
          <button disabled style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444', fontWeight: 700, fontSize: 15,
            padding: '14px 24px', borderRadius: 12, cursor: 'not-allowed', opacity: 0.7,
          }}>
            ⏹ End
          </button>
        </div>

        <p style={{ color: '#374151', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
          Voice &amp; AI integration coming in Step 4 — this is the interview room layout preview.
        </p>
      </main>
    </div>
  )
}
