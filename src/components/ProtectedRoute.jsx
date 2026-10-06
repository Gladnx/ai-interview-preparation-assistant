import { useAuth } from '@clerk/react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0e0f14] flex items-center justify-center text-zinc-400 text-xs">
        Loading session…
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return children
}
