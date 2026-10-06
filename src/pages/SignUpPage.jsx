import { SignUp } from '@clerk/react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const clerkAppearance = {
  variables: {
    colorPrimary: '#2ea675',
    colorBackground: '#0b281d',
    colorText: '#ffffff',
    colorTextSecondary: '#a7c4b5',
    colorInputBackground: '#050a08',
    colorInputText: '#ffffff',
    colorNeutral: '#134e38',
    borderRadius: '0px',
    fontFamily: "'Instrument Sans', sans-serif",
  },
  elements: {
    rootBox: { width: '100%' },
    card: {
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
      padding: 0,
      borderRadius: '0px',
    },
    headerTitle: { color: '#ffffff', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' },
    headerSubtitle: { color: '#a7c4b5', fontSize: '13px' },
    socialButtonsBlockButton: {
      background: '#050a08',
      border: '1px solid #134e38',
      color: '#ffffff',
      borderRadius: '0px',
      boxShadow: 'none',
    },
    dividerLine: { background: '#134e38' },
    dividerText: { color: '#a7c4b5', fontSize: '11px', textTransform: 'uppercase' },
    formFieldLabel: { color: '#a7c4b5', fontSize: '12px', fontWeight: 600 },
    formFieldInput: {
      background: '#050a08',
      border: '1px solid #134e38',
      color: '#ffffff',
      borderRadius: '0px',
      boxShadow: 'none',
    },
    formButtonPrimary: {
      background: '#2ea675',
      color: '#050a08',
      boxShadow: 'none',
      fontWeight: 700,
      borderRadius: '0px',
      fontSize: '13px',
    },
    footerActionLink: { color: '#2ea675', fontWeight: 600 },
  },
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-[#050a08] text-white">
      
      {/* Left Product Hero Showcase */}
      <div className="auth-panel w-[48%] relative bg-[#0b281d] border-r border-[#134e38] flex-col justify-between p-12 hidden">
        
        {/* Top Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#2ea675] text-[#050a08] flex items-center justify-center text-xs font-black">
            P
          </div>
          <span className="font-bold text-sm tracking-tight text-white">
            PrepAA
          </span>
        </Link>

        {/* Center Copy */}
        <div className="my-auto py-12">
          <div className="text-xs font-semibold text-[#2ea675] uppercase tracking-wider mb-2">
            Get Started Free
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-4">
            Practice answering technical questions out loud.
          </h2>
          <p className="text-xs sm:text-sm text-[#a7c4b5] leading-relaxed mb-6 max-w-sm">
            Create a free account to practice voice mock interviews tailored to your target company, role, and resume history.
          </p>

          <div className="space-y-2.5 text-xs text-[#e5e7eb]">
            <div className="flex items-center gap-2">
              <span className="text-[#2ea675] font-bold">—</span>
              <span>Full spoken technical & behavioral sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#2ea675] font-bold">—</span>
              <span>Live microphone transcription</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#2ea675] font-bold">—</span>
              <span>Point-by-point feedback on how to improve</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-[#a7c4b5]">
          PrepAA © {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Clerk Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          
          {/* Mobile Back Link & Brand */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#a7c4b5] hover:text-[#2ea675] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>

            <div className="mobile-logo">
              <span className="font-bold text-sm text-white">PrepAA</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-[#0b281d] border border-[#134e38]">
            <SignUp
              appearance={clerkAppearance}
              forceRedirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </div>
        </div>
      </div>

    </div>
  )
}
