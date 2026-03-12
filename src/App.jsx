import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import Dashboard from './pages/Dashboard'
import CreateSession from './pages/CreateSession'
import InterviewSession from './pages/InterviewSession'
import ProtectedRoute from './components/ProtectedRoute'

// Redirect already-signed-in users away from auth pages
function AuthRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return null
  if (isSignedIn) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/sign-in" element={<AuthRoute><SignInPage /></AuthRoute>} />
        <Route path="/sign-up" element={<AuthRoute><SignUpPage /></AuthRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-session" element={<ProtectedRoute><CreateSession /></ProtectedRoute>} />
        <Route path="/interview/:id" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
