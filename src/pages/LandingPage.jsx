import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

function PrimaryBtn({ to, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#2563eb' : '#1d4ed8',
        color: '#fff', fontWeight: 600, fontSize: 14,
        padding: '11px 24px', borderRadius: 7, textDecoration: 'none',
        display: 'inline-block',
        transition: 'background 0.15s ease',
      }}
    >
      {children}
    </Link>
  )
}

function SecondaryBtn({ to, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: hovered ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.12)',
        color: hovered ? '#e5e7eb' : '#9ca3af',
        fontWeight: 500, fontSize: 14,
        padding: '11px 24px', borderRadius: 7, textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </Link>
  )
}

const roles = ['Data Analyst', 'Data Engineer', 'Full Stack Engineer', 'AI Engineer']

const features = [
  {
    title: 'Voice interviews, not text boxes',
    desc: 'Your AI interviewer asks questions out loud and listens to your spoken answers, the same way a real interview works.',
  },
  {
    title: 'Questions pulled from your resume',
    desc: 'Upload your resume and the AI references your actual projects, tools, and experience instead of asking generic questions.',
  },
  {
    title: 'Quick personalized interview',
    desc: 'No more sifting through hundreds of questions. Get a quick interview tailored to your background and target role in under 2 minutes.',
  },
]

const steps = [
  { n: '1', title: 'Create an account', desc: 'Free, no card needed.' },
  { n: '2', title: 'Pick a role', desc: 'Data, engineering, or AI.' },
  { n: '3', title: 'Add your resume', desc: 'Optional but recommended.' },
  { n: '4', title: 'Start the interview', desc: 'Speak your answers out loud.' },
]

export default function LandingPage() {
  const width = useWindowWidth()
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 960

  const px = isMobile ? 20 : 40
  const sectionPy = isMobile ? 56 : 80

  return (
    <div style={{ minHeight: '100vh', background: '#08080e', color: '#eeeef5', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: `${isMobile ? 96 : 120}px ${px}px ${sectionPy}px` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 420px',
          gap: isMobile ? 40 : 64,
          alignItems: 'center',
        }}>
          {/* Left: copy */}
          <div>
            <h1 style={{
              fontSize: isMobile ? 36 : 'clamp(36px, 4.5vw, 60px)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-1px',
              color: '#f0f0f8',
              marginBottom: 20,
            }}>
              Practice interviews<br />
              before the one<br />
              that counts.
            </h1>
            <p style={{
              fontSize: 16,
              color: '#7c8494',
              lineHeight: 1.75,
              maxWidth: 440,
              marginBottom: 36,
            }}>
              Tell PrepAA what role you're targeting, upload your resume, and get
              interviewed by an AI that knows your background. Get scored, get
              feedback, and go in prepared.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <PrimaryBtn to="/sign-up">Try it free</PrimaryBtn>
              <SecondaryBtn to="/sign-in">Sign in</SecondaryBtn>
            </div>
            <p style={{ marginTop: 16, color: '#3d4252', fontSize: 12 }}>
              No credit card. Takes 30 seconds to set up.
            </p>
          </div>

          {/* Right: interview preview — hidden on mobile */}
          {!isMobile && (
            <div style={{
              background: '#0d0d1a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              overflow: 'hidden',
            }}>
              {/* Window bar */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3d3d3d', display: 'block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3d3d3d', display: 'block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3d3d3d', display: 'block' }} />
                </div>
                <span style={{ color: '#3d4252', fontSize: 11, marginLeft: 4 }}>Live Interview · Full Stack Engineer</span>
              </div>

              {/* Chat */}
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, flexShrink: 0,
                  }}>🤖</div>
                  <div style={{
                    background: '#131320',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '4px 10px 10px 10px',
                    padding: '10px 14px',
                    fontSize: 13, color: '#c8c8d8', lineHeight: 1.6,
                  }}>
                    You mentioned building a REST API, walk me through a design
                    decision you made and why.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, background: '#1a2a3a',
                    border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, flexShrink: 0,
                  }}>🙂</div>
                  <div style={{
                    background: '#0f1e2e',
                    border: '1px solid rgba(59,130,246,0.15)',
                    borderRadius: '10px 4px 10px 10px',
                    padding: '10px 14px',
                    fontSize: 13, color: '#94b8d4', lineHeight: 1.6,
                    fontStyle: 'italic',
                  }}>
                    Speaking... 🎤
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: 14,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ color: '#3d4252', fontSize: 11 }}>Question 3 of 5</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{
                        width: 20, height: 3, borderRadius: 2,
                        background: i <= 3 ? '#2563eb' : 'rgba(255,255,255,0.1)',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Roles strip */}
        <div style={{
          marginTop: 48,
          paddingTop: 28,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <span style={{ color: 'white', fontSize: 12, marginRight: 4 }}>Available roles:</span>
          {roles.map(r => (
            <span key={r} style={{
              background: 'blue',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white', fontSize: 12,
              padding: '4px 12px', borderRadius: 5,
            }}>{r}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: `${sectionPy}px ${px}px`, background: '#0a0a14' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: 'white', marginBottom: 6 }}>
            Built differently
          </h2>
          <p style={{ color: '#7c8494', fontSize: 14, marginBottom: 48 }}>
            Most interview tools are just flashcard quizzes. PrepAA actually puts you in the hot seat.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                display: isMobile ? 'flex' : 'grid',
                flexDirection: isMobile ? 'column' : undefined,
                gridTemplateColumns: isMobile ? undefined : '200px 1fr',
                gap: isMobile ? 8 : 40,
                padding: '28px 0',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                alignItems: 'start',
              }}>
                <div style={{ color: '#c8c8d8', fontWeight: 600, fontSize: 14, lineHeight: 1.4, paddingTop: isMobile ? 0 : 2 }}>
                  {f.title}
                </div>
                <div style={{ color: '#7c8494', fontSize: 14, lineHeight: 1.75, maxWidth: 560 }}>
                  {f.desc}
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: `${sectionPy}px ${px}px` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: '#f0f0f8', marginBottom: 40 }}>
            How it works
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? 28 : 32,
          }}>
            {steps.map((s) => (
              <div key={s.n}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#2563eb',
                  fontFamily: 'monospace', marginBottom: 10, letterSpacing: '0.5px',
                }}>
                  STEP {s.n}
                </div>
                <div style={{ color: '#dddde8', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{s.title}</div>
                <div style={{ color: '#7c8494', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: `${sectionPy}px ${px}px`, background: '#0a0a14' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: '#f0f0f8', marginBottom: 10 }}>
            Ready when you are.
          </h2>
          <p style={{ color: '#7c8494', fontSize: 14, marginBottom: 28 }}>
            Free to use. No credit card. Your first interview session takes under 2 minutes to set up.
          </p>
          <PrimaryBtn to="/sign-up">Create a free account</PrimaryBtn>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: `24px ${px}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ color: '#2a2d38', fontSize: 12 }}>
          © {new Date().getFullYear()} PrepAA
        </span>
        <span style={{ color: '#2a2d38', fontSize: 12 }}>
          Preparation Assistant AI
        </span>
      </footer>
    </div>
  )
}
