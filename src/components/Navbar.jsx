import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useUser, useClerk } from '@clerk/react'

function GhostLink({ to, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#e5e7eb' : '#9ca3af',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        textDecoration: 'none', fontSize: 13, fontWeight: 500,
        padding: '7px 12px', borderRadius: 7,
        display: 'inline-block',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </Link>
  )
}

function GhostButton({ onClick, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? '#e5e7eb' : '#9ca3af',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        fontSize: 13, fontWeight: 500,
        padding: '7px 12px', borderRadius: 7,
        border: 'none', cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  )
}

function PrimaryLink({ to, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600,
        padding: '7px 16px', borderRadius: 7,
        background: hovered ? '#2563eb' : '#1d4ed8',
        display: 'inline-block',
        transition: 'background 0.15s ease',
      }}
    >
      {children}
    </Link>
  )
}

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()

  const handleSignOut = () => signOut({ redirectUrl: '/' })

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#07070f',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 32px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: '#2563eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#fff', fontWeight: 800,
            flexShrink: 0,
          }}>◆</div>
          <span style={{ color: '#e8e8f0', fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px' }}>PrepAA</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isSignedIn ? (
            <>
              <GhostLink to="/dashboard">Dashboard</GhostLink>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '4px 10px 4px 4px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                marginLeft: 4,
              }}>
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="avatar"
                    style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: '#1d4ed8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>
                    {user?.firstName?.[0] ?? '?'}
                  </div>
                )}
                <span style={{ color: '#d1d5db', fontSize: 13, fontWeight: 500 }}>
                  {user?.firstName ?? 'User'}
                </span>
              </div>

              <GhostButton onClick={handleSignOut}>Sign Out</GhostButton>
            </>
          ) : (
            <>
              <GhostLink to="/sign-in">Sign In</GhostLink>
              <PrimaryLink to="/sign-up">Get Started</PrimaryLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
