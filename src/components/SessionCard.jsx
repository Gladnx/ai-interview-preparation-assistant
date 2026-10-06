import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Layers, 
  Database, 
  Code2, 
  BarChart3, 
  Calendar, 
  HelpCircle, 
  Trash2, 
  ArrowRight,
  Briefcase
} from 'lucide-react'

function getRoleIcon(role = '') {
  const r = role.toLowerCase()
  if (r.includes('data engineer') || r.includes('database')) return Database
  if (r.includes('data analyst') || r.includes('analytics')) return BarChart3
  if (r.includes('ai') || r.includes('ml') || r.includes('machine learning')) return Code2
  if (r.includes('stack') || r.includes('frontend') || r.includes('backend') || r.includes('software')) return Layers
  return Briefcase
}

export default function SessionCard({ session, onDelete }) {
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { id, role, company, created_at, status, question_count, feedback } = session

  const IconComponent = getRoleIcon(role)
  const dateFormatted = new Date(created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  const isCompleted = status === 'completed'
  const isInProgress = status === 'in_progress'

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    try {
      await onDelete(id)
    } catch {
      setDeleting(false)
    }
  }

  const handleCancelDelete = (e) => {
    e.stopPropagation()
    setConfirmDelete(false)
  }

  return (
    <div
      onClick={() => !confirmDelete && navigate(`/interview/${id}`)}
      className="p-4 bg-[#0b281d] border border-[#134e38] hover:border-[#2ea675] flex flex-col justify-between cursor-pointer transition-colors"
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#050a08] text-[#2ea675] border border-[#134e38]">
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {role}
              </h3>
              {company && (
                <div className="text-xs text-[#a7c4b5] mt-0.5">{company}</div>
              )}
            </div>
          </div>

          <div className="text-xs font-semibold text-[#2ea675]">
            {isCompleted ? (
              <span className="text-[#2ea675] font-bold">{feedback?.overall_score ? `${feedback.overall_score}/100` : 'Completed'}</span>
            ) : isInProgress ? (
              <span className="text-[#2ea675]">In Progress</span>
            ) : (
              <span className="text-[#a7c4b5]">Ready</span>
            )}
          </div>
        </div>

        {/* Details Row */}
        <div className="flex items-center gap-4 text-xs text-[#a7c4b5] mb-4">
          <div className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{question_count || 5} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateFormatted}</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-[#134e38] flex items-center justify-between text-xs">
        {confirmDelete ? (
          <div className="flex items-center justify-between w-full" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs font-medium text-[#2ea675]">Delete session?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-2.5 py-1 text-xs font-bold bg-[#2ea675] text-[#050a08] border border-[#3fb985] hover:bg-[#3fb985] transition-colors"
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-2.5 py-1 text-xs bg-[#050a08] text-[#a7c4b5] border border-[#134e38] hover:bg-[#0e3828] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-[#a7c4b5]">
              {isCompleted ? 'Review report' : 'Resume session'}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmDelete(true)
                }}
                title="Delete session"
                className="p-1 text-[#a7c4b5] hover:text-[#2ea675] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="inline-flex items-center gap-1 text-[#2ea675] hover:text-white font-semibold">
                <span>{isCompleted ? 'Report' : 'Start'}</span>
                <ArrowRight className="w-3 h-3 text-[#2ea675]" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
