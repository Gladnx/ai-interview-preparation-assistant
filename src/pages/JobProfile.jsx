import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  BarChart2, 
  Database, 
  Layers, 
  UploadCloud, 
  FileText, 
  X, 
  ArrowLeft, 
  Mic, 
  Code2, 
  BarChart3
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { getProfile } from '../data/jobProfiles'
import { useSessions } from '../hooks/useSessions'
import { extractTextFromFile } from '../lib/resumeParser'

const ICON_MAP = {
  BarChart2: BarChart3,
  Database: Database,
  Layers: Layers,
  Code2: Code2,
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

  const profile = getProfile(profileId)
  const IconComponent = profile ? (ICON_MAP[profile.icon] || Layers) : Layers

  useEffect(() => {
    if (!profileId) return
    setResumeText(localStorage.getItem(RESUME_KEY(profileId)) || '')
    setResumeFileName(localStorage.getItem(RESUME_NAME_KEY(profileId)) || '')
  }, [profileId])

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#092328] text-[#e6f4ec] flex flex-col items-center justify-center gap-4">
        <h2 className="text-base font-bold text-[#8BBB92]">Track Profile Not Found</h2>
        <Link to="/dashboard" className="text-xs text-[#88b8a5] hover:text-[#8BBB92]">
          ← Return to Workspace
        </Link>
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
      setUploadError(err.message || 'Failed to parse file. Try a .txt or standard PDF format.')
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
    <div className="min-h-screen bg-[#050a08] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        
        {/* Navigation Breadcrumb */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-[#a7c4b5] hover:text-[#2ea675] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>

        {/* Hero Track Card */}
        <div className="p-6 bg-[#0b281d] border border-[#134e38] mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#050a08] border border-[#134e38] text-[#2ea675] shrink-0">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight mb-1">
                  {profile.title}
                </h1>
                <div className="text-xs text-[#2ea675] font-medium">
                  Target Salary: {profile.salary}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={starting}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2ea675] hover:bg-[#3fb985] text-[#050a08] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {starting ? (
                <span>Initializing Studio…</span>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Start Spoken Interview</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-[#050a08] border border-[#134e38] text-[#2ea675] text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Resume Grounding Container */}
        <div className="p-5 bg-[#0b281d] border border-[#134e38] mb-6">
          <div className="mb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Attach Your Resume (Optional)
            </h2>
            <p className="text-xs text-[#a7c4b5]">
              When you upload a resume, questions reference your actual past jobs, migrations, and tech stack instead of generic theory.
            </p>
          </div>

          {resumeText ? (
            <div className="p-3.5 bg-[#050a08] border border-[#134e38] flex items-center justify-between gap-4 mt-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-[#2ea675] shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">{resumeFileName}</div>
                  <div className="text-xs text-[#a7c4b5]">
                    Resume attached. Questions will target your real project history.
                  </div>
                </div>
              </div>

              <button
                onClick={handleRemoveResume}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#134e38] hover:bg-[#2ea675] text-xs font-medium text-white hover:text-[#050a08] transition-colors border border-[#2ea675]"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          ) : (
            <label className="border border-[#134e38] hover:border-[#2ea675] p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[#050a08] transition-colors mt-3">
              <UploadCloud className="w-6 h-6 text-[#2ea675] mb-2" />
              <div className="text-xs font-bold text-white mb-0.5">
                {uploading ? 'Reading resume text…' : 'Upload Your Resume (PDF or TXT)'}
              </div>
              <div className="text-xs text-[#a7c4b5]">
                Click or drop your file here
              </div>
              <input
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={handleResumeUpload}
                disabled={uploading}
              />
            </label>
          )}

          {uploadError && (
            <div className="mt-3 text-xs text-[#2ea675]">
              {uploadError}
            </div>
          )}
        </div>

        {/* Track Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Tech Stack */}
          <div className="p-5 bg-[#0b281d] border border-[#134e38]">
            <h3 className="text-xs font-bold text-[#2ea675] uppercase tracking-wider mb-2">
              Primary Technologies
            </h3>
            <p className="text-xs text-[#a7c4b5]">
              {profile.techStack.join(', ')}
            </p>
          </div>

          {/* Concepts Evaluated */}
          <div className="p-5 bg-[#0b281d] border border-[#134e38]">
            <h3 className="text-xs font-bold text-[#2ea675] uppercase tracking-wider mb-2">
              Core Topics Covered
            </h3>
            <p className="text-xs text-[#a7c4b5]">
              {profile.concepts.join(', ')}
            </p>
          </div>

        </div>

        {/* Scope & Hiring Focus */}
        <div className="p-5 bg-[#0b281d] border border-[#134e38] mb-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
            What the Interviewer Looks For
          </h3>
          <p className="text-xs sm:text-sm text-[#e5e7eb] leading-relaxed mb-3">
            {profile.interviewFocus}
          </p>
          <p className="text-xs text-[#a7c4b5] leading-relaxed bg-[#050a08] p-3.5 border border-[#134e38]">
            {profile.description}
          </p>
        </div>

      </main>
    </div>
  )
}
