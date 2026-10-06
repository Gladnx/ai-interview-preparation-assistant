import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, useUser, useClerk } from '@clerk/react'
import { LayoutDashboard, LogOut, ArrowRight, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = () => signOut({ redirectUrl: '/' })
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/job') || location.pathname.startsWith('/interview')

  return (
    <header className="fixed top-3.5 left-3.5 right-3.5 z-50 max-w-5xl mx-auto">
      <div className="bg-[#050a08] border border-[#134e38] rounded-xl px-4 sm:px-5 h-14 flex items-center justify-between shadow-none">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#2ea675] text-[#050a08] flex items-center justify-center text-xs font-black">
            P
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">
              PrepAA
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-1">
          {isSignedIn ? (
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isDashboard ? 'text-[#2ea675] bg-[#0b281d] border border-[#134e38]' : 'text-[#a7c4b5] hover:text-[#2ea675] hover:bg-[#0b281d]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </Link>
          ) : (
            <div className="flex items-center gap-6 text-xs font-medium text-[#a7c4b5]">
              <a href="#tracks" className="hover:text-[#2ea675] transition-colors">Role Tracks</a>
              <a href="#features" className="hover:text-[#2ea675] transition-colors">Why Out Loud</a>
              <a href="#rubric" className="hover:text-[#2ea675] transition-colors">Evaluation Rubric</a>
              <a href="#how-it-works" className="hover:text-[#2ea675] transition-colors">How It Works</a>
            </div>
          )}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-[#0b281d] border border-[#134e38]">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover border border-[#134e38]"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#134e38] text-[#2ea675] flex items-center justify-center text-[10px] font-bold">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                )}
                <span className="text-xs font-medium text-white max-w-[110px] truncate hidden sm:inline">
                  {user?.firstName || 'Candidate'}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                title="Sign out"
                className="p-1.5 rounded-lg text-[#a7c4b5] hover:text-white hover:bg-[#0b281d] border border-transparent hover:border-[#134e38] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/sign-in"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#a7c4b5] hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#2ea675] hover:bg-[#3fb985] text-[#050a08] transition-colors"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#a7c4b5] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-1.5 p-3 rounded-xl bg-[#050a08] border border-[#134e38] flex flex-col gap-2">
          {isSignedIn ? (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-[#2ea675] bg-[#0b281d] border border-[#134e38]"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#2ea675]" />
              <span>Workspace</span>
            </Link>
          ) : (
            <>
              <a
                href="#tracks"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg text-xs text-[#a7c4b5] hover:text-[#2ea675]"
              >
                Role Tracks
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg text-xs text-[#a7c4b5] hover:text-[#2ea675]"
              >
                Why Out Loud
              </a>
              <a
                href="#rubric"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg text-xs text-[#a7c4b5] hover:text-[#2ea675]"
              >
                Evaluation Rubric
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg text-xs text-[#a7c4b5] hover:text-[#2ea675]"
              >
                How It Works
              </a>
              <div className="pt-2 border-t border-[#134e38] flex flex-col gap-1.5">
                <Link
                  to="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-1.5 rounded-lg text-xs font-medium text-white bg-[#0b281d] border border-[#134e38]"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-1.5 rounded-lg text-xs font-bold bg-[#2ea675] text-[#050a08]"
                >
                  Create Account
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  )
}
