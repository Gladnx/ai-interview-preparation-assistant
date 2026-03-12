import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: '🎙️',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    title: 'Live Voice Interviews',
    desc: 'AI interviewer Alex speaks questions aloud and listens to your answers in real time just like the real thing.',
  },
  {
    icon: '📄',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    title: 'Resume-Tailored Questions',
    desc: 'Upload your PDF or TXT resume and the AI generates questions that reference your actual projects and experience.',
  },
  {
    icon: '💼',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    title: '4 Real Job Roles',
    desc: 'Choose from Data Analyst, Data Engineer, Full Stack Engineer, or AI Engineer — each with real job descriptions.',
  },
]

const steps = [
  { num: '1', title: 'Sign Up Free', desc: 'Create your account (no credit card, no setup required)' },
  { num: '2', title: 'Pick a Role', desc: 'Choose from 4 curated job profiles with real tech stacks and salary ranges.' },
  { num: '3', title: 'Upload Your Resume', desc: 'Optionally add your resume so questions are tailored to your background.' },
  { num: '4', title: 'Start the Interview', desc: 'AI interviewer will asks questions and you can answer with your voice.' },
]


export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', paddingTop: 148, paddingBottom: 100, textAlign: 'center', overflow: 'hidden' }}>
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)',
          pointerEvents: 'none', filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', top: 200, right: '8%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(60px)',
        }} />

        <div style={{ position: 'relative', maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
            color: '#93c5fd', fontSize: 13, fontWeight: 500,
            padding: '6px 16px', borderRadius: 99, marginBottom: 32,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#3b82f6',
              boxShadow: '0 0 8px #3b82f6',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            AI-Powered Interview Practice
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 800,
            lineHeight: 1.08, letterSpacing: '-2px',
            marginBottom: 24,
          }}>
            <span style={{ color: '#f0f0ff' }}>Ace Your</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Next Interview
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 18, color: '#6b7280', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto 40px',
          }}>
            Pick a job role, upload your resume, and get interviewed by AI in real time.
            Score your answers, review your transcript, and walk in ready.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/sign-up" style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#fff', fontWeight: 700, fontSize: 16,
              padding: '14px 32px', borderRadius: 12, textDecoration: 'none',
              boxShadow: '0 0 32px rgba(59,130,246,0.4)',
              display: 'inline-block',
            }}>
              Start for Free →
            </Link>
            <Link to="/sign-in" style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#d1d5db', fontWeight: 600, fontSize: 16,
              padding: '14px 32px', borderRadius: 12, textDecoration: 'none',
              display: 'inline-block',
            }}>
              Sign In
            </Link>
          </div>

          {/* Floating mock card */}
          <div style={{
            marginTop: 64, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto',
            background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: 28, textAlign: 'left',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -1, left: 40, right: 40, height: 2,
              background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
              borderRadius: 2,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(37,99,235,0.2))',
                border: '1px solid rgba(59,130,246,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>🤖</div>
              <div>
                <div style={{ color: '#f0f0ff', fontWeight: 600, fontSize: 14 }}>Alex — AI Interviewer</div>
                <div style={{ color: '#6b7280', fontSize: 12 }}>Full Stack Engineer · Question 3 of 5</div>
              </div>
              <div style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
                color: '#10b981', fontSize: 12, fontWeight: 600,
                background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 99,
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                Live
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '16px 18px',
              marginBottom: 14,
            }}>
              <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Current Question
              </div>
              <div style={{ color: '#e0e0ff', fontSize: 14, lineHeight: 1.6 }}>
                "You mentioned building a REST API in your resume — walk me through a challenging design decision you made and how you handled it."
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                flex: 1, background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff', fontSize: 13, fontWeight: 600,
                padding: '10px 0', borderRadius: 8, textAlign: 'center',
                opacity: 0.7,
              }}>
                🎤 Listening...
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#9ca3af', fontSize: 13, fontWeight: 600,
                padding: '10px 16px', borderRadius: 8, opacity: 0.7,
              }}>
                ⏭ Skip
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
              Why PrepAI
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#f0f0ff', letterSpacing: '-1px', marginBottom: 14 }}>
              Everything you need to prepare
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Powerful AI tools to help you walk into every interview with confidence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {features.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
              How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#f0f0ff', letterSpacing: '-1px' }}>
              Interview-ready in 4 steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.1))',
                  border: '1px solid rgba(59,130,246,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#93c5fd', fontWeight: 800, fontSize: 20,
                }}>
                  {s.num}
                </div>
                <div style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</div>
                <div style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          maxWidth: 760, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.08) 100%)',
          border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: 24, padding: '60px 40px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 400, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#f0f0ff', letterSpacing: '-1px', marginBottom: 14 }}>
            Ready to land your dream job?
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 16, marginBottom: 32 }}>
            Free to use. No credit card. Start your first mock interview in under a minute.
          </p>
          <Link to="/sign-up" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff', fontWeight: 700, fontSize: 16,
            padding: '14px 36px', borderRadius: 12, textDecoration: 'none',
            boxShadow: '0 0 32px rgba(59,130,246,0.4)',
          }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '32px 24px', textAlign: 'center',
        color: '#374151', fontSize: 14,
      }}>
        © {new Date().getFullYear()} PrepAI. All rights reserved.
      </footer>
    </div>
  )
}

function FeatureCard({ feature }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#111120' : '#0d0d1a',
        border: hovered ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 28,
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 13, marginBottom: 20,
        background: feature.gradient, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 22,
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
      }}>
        {feature.icon}
      </div>
      <div style={{ color: '#f0f0ff', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{feature.title}</div>
      <div style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.65 }}>{feature.desc}</div>
    </div>
  )
}

