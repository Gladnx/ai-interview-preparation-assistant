import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSessions } from '../hooks/useSessions'

export default function CreateSession() {
  const navigate = useNavigate()
  const { addSession } = useSessions()
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setResumeFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resumeFile || !jobDescription.trim() || !role.trim()) return
    setLoading(true)
    setError(null)
    try {
      const session = await addSession({
        role: role.trim(),
        company: company.trim(),
        jobDescription: jobDescription.trim(),
        resumeName: resumeFile.name,
      })
      navigate(`/interview/${session.id}`)
    } catch (err) {
      console.error('Failed to create session:', err)
      setError(err?.message || 'Something went wrong. Check the console for details.')
      setLoading(false)
    }
  }

  const isValid = role.trim() && jobDescription.trim() && resumeFile

  return (
    <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff' }}>
      <Navbar />

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '96px 32px 80px' }}>
        {/* Back */}
        <Link to="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#6b7280', fontSize: 14, textDecoration: 'none', marginBottom: 36,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#f0f0ff'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}>
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
            New Session
          </div>
          <h1 style={{ color: '#f0f0ff', fontSize: 32, fontWeight: 800, letterSpacing: '-0.8px', marginBottom: 10 }}>
            Create Interview Session
          </h1>
          <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6 }}>
            Upload your resume and job description — the AI will generate personalised interview questions.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Section: Role */}
          <Section label="Role Details">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Job Title" required>
                <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer" required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Field>
              <Field label="Company" optional>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Field>
            </div>
          </Section>

          {/* Section: Resume */}
          <Section label="Your Resume" required>
            <div
              onDragEnter={handleDrag} onDragOver={handleDrag}
              onDragLeave={() => setDragActive(false)} onDrop={handleDrop}
              style={{
                position: 'relative', borderRadius: 14, padding: '36px 24px', textAlign: 'center',
                border: dragActive
                  ? '2px dashed rgba(59,130,246,0.7)'
                  : resumeFile
                  ? '2px dashed rgba(16,185,129,0.5)'
                  : '2px dashed rgba(255,255,255,0.1)',
                background: dragActive
                  ? 'rgba(59,130,246,0.06)'
                  : resumeFile
                  ? 'rgba(16,185,129,0.04)'
                  : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
            >
              <input
                type="file" accept=".pdf,.doc,.docx"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setResumeFile(f) }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              {resumeFile ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>📄</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#f0f0ff', fontSize: 14, fontWeight: 600 }}>{resumeFile.name}</div>
                    <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); setResumeFile(null) }}
                    style={{
                      marginLeft: 'auto', background: 'none', border: 'none',
                      color: '#6b7280', cursor: 'pointer', fontSize: 18, padding: 4,
                      lineHeight: 1,
                    }}>✕</button>
                </div>
              ) : (
                <div>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px',
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  }}>📁</div>
                  <div style={{ color: '#d1d5db', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                    Drop your resume here, or click to browse
                  </div>
                  <div style={{ color: '#4b5563', fontSize: 13 }}>PDF, DOC, or DOCX — max 5 MB</div>
                </div>
              )}
            </div>
          </Section>

          {/* Section: JD */}
          <Section label="Job Description" required>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here — responsibilities, requirements, and any other details..."
              required rows={9}
              style={{
                ...inputStyle, resize: 'vertical', lineHeight: 1.7,
                fontFamily: 'inherit',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            <div style={{ color: '#374151', fontSize: 12, marginTop: 6, textAlign: 'right' }}>
              {jobDescription.length} characters
            </div>
          </Section>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10, padding: '12px 16px',
              color: '#f87171', fontSize: 13, lineHeight: 1.5,
            }}>
              Error: {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={!isValid || loading} style={{
            background: isValid && !loading ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.06)',
            color: isValid && !loading ? '#fff' : '#4b5563',
            fontWeight: 700, fontSize: 16,
            padding: '15px', borderRadius: 12, border: 'none',
            cursor: isValid && !loading ? 'pointer' : 'not-allowed',
            boxShadow: isValid && !loading ? '0 0 28px rgba(59,130,246,0.35)' : 'none',
            transition: 'all 0.2s',
          }}>
            {loading ? 'Creating session…' : '🚀 Create Session'}
          </button>
        </form>
      </main>
    </div>
  )
}

function Section({ label, required, children }) {
  return (
    <div>
      <div style={{ color: '#9ca3af', fontSize: 13, fontWeight: 600, marginBottom: 12, display: 'flex', gap: 6 }}>
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, required, optional, children }) {
  return (
    <div>
      <label style={{ display: 'flex', gap: 6, color: '#9ca3af', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
        {optional && <span style={{ color: '#374151' }}>(optional)</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0ff',
  fontSize: 15, padding: '12px 16px', borderRadius: 10,
  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
}
