import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import { Upload, FileText, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import { getProfile } from '../data/jobProfiles'
import { useSessions } from '../hooks/useSessions'
import { extractTextFromFile } from '../lib/resumeParser'

function ProfileIcon({ name, size = 30, color }) {
  const Icon = LucideIcons[name]
  if (!Icon) return null
  return <Icon size={size} color={color} strokeWidth={1.75} />
}

const RESUME_KEY = (id) => `prepai_resume_${id}`
const RESUME_NAME_KEY = (id) => `prepai_resume_name_${id}`

export default function JobProfile() {
  const { profileId } = useParams()
  const navigate = useNavigate()
  const { addSession } = useSessions()
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState(null)

  const [resumeText, setResumeText] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadHovered, setUploadHovered] = useState(false)

  const profile = getProfile(profileId)

  useEffect(() => {
    if (!profileId) return
    setResumeText(localStorage.getItem(RESUME_KEY(profileId)) || '')
    setResumeFileName(localStorage.getItem(RESUME_NAME_KEY(profileId)) || '')
  }, [profileId])

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Profile not found</h2>
        <Link to="/dashboard" style={{ color: '#3b82f6', fontSize: 14 }}>← Back to Dashboard</Link>
      </div>
    )
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const text = await extractTextFromFile(file)
      if (!text.trim()) throw new Error('Could not extract text from this file.')
      setResumeText(text)
      setResumeFileName(file.name)
      localStorage.setItem(RESUME_KEY(profileId), text)
      localStorage.setItem(RESUME_NAME_KEY(profileId), file.name)
    } catch (err) {
      setUploadError(err.message || 'Failed to read file. Try a .txt file instead.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleRemoveResume = () => {
    setResumeText('')
    setResumeFileName('')
    localStorage.removeItem(RESUME_KEY(profileId))
    localStorage.removeItem(RESUME_NAME_KEY(profileId))
  }

  const handleStartInterview = async () => {
    setStarting(true)
    setError(null)
    try {
      const session = await addSession({
        role: profile.title,
        company: '',
        jobDescription: profile.jobDescription,
        resumeName: resumeFileName || 'N/A',
        resumeText: resumeText || null,
      })
      navigate(`/interview/${session.id}`)
    } catch (err) {
      setError(err.message)
      setStarting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff' }}>
      <Navbar />

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '96px 24px 80px' }}>

        {/* Back */}
        <Link to="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#6b7280', fontSize: 14, textDecoration: 'none', marginBottom: 36,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f0f0ff'}
        onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.05) 100%)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 20, padding: '32px 36px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, flexShrink: 0,
              background: `${profile.color}20`,
              border: `1px solid ${profile.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><ProfileIcon name={profile.icon} size={30} color={profile.color} /></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ color: '#f0f0ff', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
                  {profile.title}
                </h1>
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                  background: profile.level === 'Advanced' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                  color: profile.level === 'Advanced' ? '#f59e0b' : '#3b82f6',
                  border: profile.level === 'Advanced' ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(59,130,246,0.3)',
                }}>
                  {profile.level}
                </span>
              </div>
              <div style={{ color: '#10b981', fontSize: 14, fontWeight: 600 }}>
                💰 {profile.salary}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
            {error && (
              <div style={{ color: '#f87171', fontSize: 13, maxWidth: 260, textAlign: 'right' }}>{error}</div>
            )}
            <button
              onClick={handleStartInterview}
              disabled={starting}
              style={{
                background: starting ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: starting ? '#4b5563' : '#fff',
                fontWeight: 700, fontSize: 15,
                padding: '13px 28px', borderRadius: 12, border: 'none',
                cursor: starting ? 'not-allowed' : 'pointer',
                boxShadow: starting ? 'none' : '0 0 28px rgba(59,130,246,0.4)',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>
              {starting ? 'Starting…' : '🎤 Start Interview'}
            </button>
          </div>
        </div>

        {/* Resume Upload */}
        <div style={{
          background: '#0e0e1a',
          border: `1px solid ${resumeText ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 16, padding: '22px 24px', marginBottom: 16,
          transition: 'border-color 0.2s',
        }}>
          <SectionLabel>
            Your Resume{' '}
            <span style={{ color: '#374151', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
              optional · tailors questions to your background
            </span>
          </SectionLabel>

          {resumeText ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <FileText size={16} color="#10b981" style={{ flexShrink: 0 }} />
                <span style={{ color: '#10b981', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {resumeFileName}
                </span>
                <span style={{ color: '#4b5563', fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  · Questions tailored to your experience
                </span>
              </div>
              <button
                onClick={handleRemoveResume}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                  background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#6b7280', fontSize: 12, fontWeight: 500,
                  padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                }}>
                <X size={12} /> Remove
              </button>
            </div>
          ) : (
            <label
              onMouseEnter={() => setUploadHovered(true)}
              onMouseLeave={() => setUploadHovered(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: uploading ? 'not-allowed' : 'pointer',
                padding: '16px 18px',
                background: uploadHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px dashed ${uploadHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 10, transition: 'all 0.2s',
              }}>
              <Upload size={18} color={uploading ? '#4b5563' : '#6b7280'} />
              <div>
                <div style={{ color: uploading ? '#4b5563' : '#9ca3af', fontSize: 14, fontWeight: 500 }}>
                  {uploading ? 'Parsing resume…' : 'Upload your resume'}
                </div>
                <div style={{ color: '#374151', fontSize: 12, marginTop: 2 }}>PDF or TXT · Max ~10 pages</div>
              </div>
              <input
                type="file"
                accept=".pdf,.txt"
                style={{ display: 'none' }}
                onChange={handleResumeUpload}
                disabled={uploading}
              />
            </label>
          )}

          {uploadError && (
            <div style={{ color: '#f87171', fontSize: 13, marginTop: 10 }}>{uploadError}</div>
          )}
        </div>

        {/* Description */}
        <div style={{
          background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '24px', marginBottom: 16,
        }}>
          <SectionLabel>About This Role</SectionLabel>
          <p style={{ color: '#d1d5db', fontSize: 15, lineHeight: 1.75, margin: 0 }}>
            {profile.description}
          </p>
        </div>

        {/* Tech stack + Concepts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
            <SectionLabel>Tech Stack</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.techStack.map(t => (
                <span key={t} style={{
                  background: `${profile.color}15`,
                  border: `1px solid ${profile.color}35`,
                  color: profile.color, fontSize: 13, fontWeight: 600,
                  padding: '5px 12px', borderRadius: 8,
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
            <SectionLabel>Key Concepts</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.concepts.map(c => (
                <span key={c} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#9ca3af', fontSize: 13, fontWeight: 500,
                  padding: '5px 12px', borderRadius: 8,
                }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Interview focus */}
        <div style={{
          background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '24px', marginBottom: 24,
        }}>
          <SectionLabel>Interview Focus</SectionLabel>
          <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
            {profile.interviewFocus}
          </p>
        </div>

        {/* What to expect */}
        <div style={{
          background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: 16, padding: '22px 24px',
          display: 'flex', gap: 20, flexWrap: 'wrap',
        }}>
          {[
            { icon: '🤖', label: 'AI Interviewer', desc: 'Conversational, human-like tone' },
            { icon: '🎤', label: 'Voice Interview', desc: 'Speak your answers naturally' },
            { icon: '📋', label: '5 Questions', desc: resumeText ? 'Tailored to your resume' : 'Mixed technical & behavioral' },
            { icon: '📊', label: 'Instant Feedback', desc: 'Scored & detailed analysis' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 160px' }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div>
                <div style={{ color: '#f0f0ff', fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                <div style={{ color: resumeText && item.label === '5 Questions' ? '#10b981' : '#6b7280', fontSize: 12 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
      {children}
    </div>
  )
}
