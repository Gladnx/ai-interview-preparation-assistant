import { Link } from 'react-router-dom'
import { useUser } from '@clerk/react'
import Navbar from '../components/Navbar'
import SessionCard from '../components/SessionCard'
import { useSessions } from '../hooks/useSessions'

export default function Dashboard() {
  const { user } = useUser()
  const { sessions, loading, deleteSession } = useSessions()

  const totalSessions  = sessions.length
  const completedCount = sessions.filter((s) => s.status === 'completed').length
  const pendingCount   = sessions.filter((s) => s.status === 'pending').length

  return (
    <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff' }}>
      <Navbar />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px 64px' }}>

        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.06) 100%)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 20, padding: '32px 36px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20, marginBottom: 40,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div>
            <div style={{ color: '#93c5fd', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              👋 Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
            </div>
            <h1 style={{ color: '#f0f0ff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
              Your Interview Dashboard
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              Track your sessions, review feedback, and keep improving.
            </p>
          </div>
          <Link to="/create-session" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff', fontWeight: 700, fontSize: 14,
            padding: '12px 22px', borderRadius: 10, textDecoration: 'none',
            boxShadow: '0 0 24px rgba(59,130,246,0.35)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            New Session
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40,
        }}>
          {[
            { label: 'Total Sessions', value: totalSessions,  icon: '📁', color: '#3b82f6' },
            { label: 'Completed',      value: completedCount, icon: '✅', color: '#10b981' },
            { label: 'Pending',        value: pendingCount,   icon: '⏳', color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '22px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${stat.color}18`,
                border: `1px solid ${stat.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{stat.label}</div>
                <div style={{ color: '#f0f0ff', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section heading */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ color: '#f0f0ff', fontSize: 18, fontWeight: 700 }}>
            Recent Sessions
          </h2>
          <span style={{ color: '#4b5563', fontSize: 13 }}>
            {totalSessions} session{totalSessions !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Session grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#4b5563', fontSize: 14 }}>
            Loading sessions…
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 18,
          }}>
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} onDelete={deleteSession} />
            ))}

            {/* Create new card */}
            <Link to="/create-session" style={{ textDecoration: 'none' }}>
              <div style={{
                height: '100%', minHeight: 180,
                background: 'transparent',
                border: '2px dashed rgba(255,255,255,0.07)',
                borderRadius: 16,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 10,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'
                e.currentTarget.style.background = 'rgba(59,130,246,0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.background = 'transparent'
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#3b82f6', fontSize: 22, fontWeight: 300,
                }}>+</div>
                <span style={{ color: '#6b7280', fontSize: 14, fontWeight: 500 }}>New Session</span>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '80px 24px',
      background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
    }}>
      <div style={{ fontSize: 52, marginBottom: 20 }}>🎤</div>
      <h3 style={{ color: '#f0f0ff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No sessions yet</h3>
      <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 28 }}>
        Create your first mock interview to get started.
      </p>
      <Link to="/create-session" style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: '#fff', fontWeight: 700, fontSize: 14,
        padding: '12px 24px', borderRadius: 10, textDecoration: 'none',
        boxShadow: '0 0 20px rgba(59,130,246,0.3)',
      }}>
        Create Session →
      </Link>
    </div>
  )
}
