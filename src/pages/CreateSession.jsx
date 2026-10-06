import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react'
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
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
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
    <div className="min-h-screen bg-[#050a08] text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        
        {/* Back navigation */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-[#a7c4b5] hover:text-[#2ea675] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Set Up a Custom Interview
          </h1>
          <p className="text-xs sm:text-sm text-[#a7c4b5] mt-1">
            Paste the job posting you are interviewing for and attach your resume. PrepAA will generate 5 questions tailored to what that company actually asks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Target Role Meta */}
          <div className="p-6 bg-[#0b281d] border border-[#134e38] space-y-4">
            <div className="text-xs font-bold text-[#2ea675] uppercase tracking-wider">
              1. Role & Company
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#a7c4b5] mb-1.5">
                  Job Title <span className="text-[#2ea675]">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#050a08] border border-[#134e38] text-sm text-white focus:outline-none focus:border-[#2ea675] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a7c4b5] mb-1.5">
                  Company Name <span className="text-[#a7c4b5]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Linear, Datadog"
                  className="w-full px-3.5 py-2.5 bg-[#050a08] border border-[#134e38] text-sm text-white focus:outline-none focus:border-[#2ea675] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="p-6 bg-[#0b281d] border border-[#134e38] space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#2ea675] uppercase tracking-wider">
                2. Your Resume <span className="text-[#2ea675]">*</span>
              </div>
              {resumeFile && (
                <span className="text-xs font-medium text-[#2ea675]">
                  Ready
                </span>
              )}
            </div>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border p-6 transition-all ${
                dragActive
                  ? 'border-[#2ea675] bg-[#0e3828]'
                  : resumeFile
                  ? 'border-[#134e38] bg-[#050a08]'
                  : 'border-[#134e38] hover:border-[#2ea675] bg-[#050a08]'
              }`}
            >
              {resumeFile ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-[#2ea675]" />
                    <div>
                      <div className="text-xs font-semibold text-white">{resumeFile.name}</div>
                      <div className="text-xs text-[#a7c4b5]">{(resumeFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="p-1.5 text-[#a7c4b5] hover:text-[#2ea675] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center text-center cursor-pointer">
                  <UploadCloud className="w-6 h-6 text-[#2ea675] mb-2" />
                  <div className="text-xs font-bold text-white mb-0.5">
                    Drop your resume here, or click to choose file
                  </div>
                  <div className="text-xs text-[#a7c4b5]">PDF or Word document format</div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) setResumeFile(f)
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="p-6 bg-[#0b281d] border border-[#134e38] space-y-4">
            <div className="text-xs font-bold text-[#2ea675] uppercase tracking-wider">
              3. Paste the Job Description <span className="text-[#2ea675]">*</span>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the requirements, responsibilities, or role details from the job post..."
              rows={8}
              required
              className="w-full px-3.5 py-2.5 bg-[#050a08] border border-[#134e38] text-sm text-white focus:outline-none focus:border-[#2ea675] transition-colors leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-4 bg-[#050a08] border border-[#134e38] text-[#2ea675] text-xs">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-3.5 bg-[#2ea675] hover:bg-[#3fb985] text-[#050a08] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Preparing Your Session…</span>
            ) : (
              <span>Start Voice Interview</span>
            )}
          </button>

        </form>

      </main>
    </div>
  )
}
