import { useAuth } from '@clerk/react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh', background: '#05050a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 18, fontWeight: 800,
            boxShadow: '0 0 24px rgba(59,130,246,0.4)',
          }}>◆</div>
          <div style={{ color: '#4b5563', fontSize: 14 }}>Loading…</div>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return children
}
