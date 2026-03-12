import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react'
import * as LucideIcons from 'lucide-react'
import Navbar from '../components/Navbar'
import SessionCard from '../components/SessionCard'
import { useSessions } from '../hooks/useSessions'
import { JOB_PROFILES } from '../data/jobProfiles'

function ProfileIcon({ name, size = 24, color }) {
  const Icon = LucideIcons[name]
  if (!Icon) return null
  return <Icon size={size} color={color} strokeWidth={1.75} />
}

export default function Dashboard() {
  const { user } = useUser()
  const { sessions, loading, deleteSession } = useSessions()

  const completedCount = sessions.filter(s => s.status === 'completed').length
  const inProgressCount = sessions.filter(s => s.status === 'in_progress').length

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
            width: 220, height: 220, borderRadius: '50%',
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
              Pick a role below, start a voice interview, and get instant AI feedback.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Completed', value: completedCount, color: '#10b981' },
              { label: 'In Progress', value: inProgressCount, color: '#3b82f6' },
              { label: 'Total', value: sessions.length, color: '#9ca3af' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ color: s.color, fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: '#4b5563', fontSize: 12, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Job profile cards */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ color: '#f0f0ff', fontSize: 18, fontWeight: 700 }}>Choose a Role to Practice</h2>
            <span style={{ color: '#4b5563', fontSize: 13 }}>4 roles available</span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {JOB_PROFILES.map(profile => (
              <JobProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>

        {/* Past sessions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ color: '#f0f0ff', fontSize: 18, fontWeight: 700 }}>Past Interviews</h2>
            {sessions.length > 0 && (
              <span style={{ color: '#4b5563', fontSize: 13 }}>{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#4b5563', fontSize: 14 }}>
              Loading…
            </div>
          ) : sessions.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, color: '#4b5563', fontSize: 14,
            }}>
              No interviews yet pick a role above to get started.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 18,
            }}>
              {sessions.map(session => (
                <SessionCard key={session.id} session={session} onDelete={deleteSession} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}

function JobProfileCard({ profile }) {
  const [hovered, setHovered] = useState(false)
  const [hasResume, setHasResume] = useState(false)

  useEffect(() => {
    setHasResume(!!localStorage.getItem(`prepai_resume_${profile.id}`))
  }, [profile.id])

  return (
    <Link
      to={`/job/${profile.id}`}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: hovered ? '#13131f' : '#0e0e1a',
        border: hovered ? `1px solid ${profile.color}50` : '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '24px',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 12px 40px ${profile.color}18` : '0 2px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer', height: '100%',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Icon + level */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13,
            background: `${profile.color}18`,
            border: `1px solid ${profile.color}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><ProfileIcon name={profile.icon} size={22} color={profile.color} /></div>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
            background: profile.level === 'Advanced' ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)',
            color: profile.level === 'Advanced' ? '#f59e0b' : '#3b82f6',
            border: profile.level === 'Advanced' ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(59,130,246,0.25)',
          }}>{profile.level}</span>
        </div>

        {/* Title + salary */}
        <div>
          <div style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{profile.title}</div>
          <div style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>{profile.salary}</div>
        </div>

        {/* Tech tags (first 3) */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {profile.techStack.slice(0, 3).map(t => (
            <span key={t} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#6b7280', fontSize: 11, fontWeight: 500,
              padding: '3px 9px', borderRadius: 6,
            }}>{t}</span>
          ))}
          {profile.techStack.length > 3 && (
            <span style={{ color: '#4b5563', fontSize: 11, padding: '3px 4px' }}>+{profile.techStack.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#4b5563', fontSize: 12 }}>5 questions · ~15 min</span>
            {hasResume && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                color: '#10b981', fontSize: 10, fontWeight: 600,
                padding: '2px 7px', borderRadius: 20,
              }}>✓ Resume</span>
            )}
          </div>
          <span style={{
            color: profile.color, fontSize: 13, fontWeight: 600,
            transform: hovered ? 'translateX(3px)' : 'translateX(0)',
            transition: 'transform 0.15s',
            display: 'inline-block',
          }}>View →</span>
        </div>
      </div>
    </Link>
  )
}
