import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STATUS = {
  pending:     { label: 'Not Started', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  completed:   { label: 'Completed',   color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
  in_progress: { label: 'In Progress', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)' },
}

const ROLE_ICONS = {
  'Frontend': '💻', 'Backend': '⚙️', 'Full': '🔧',
  'Product': '📦', 'Design': '🎨', 'Data': '📊',
  'DevOps': '🚀', 'Mobile': '📱',
}
function getRoleIcon(role = '') {
  for (const [key, icon] of Object.entries(ROLE_ICONS)) {
    if (role.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '🎯'
}

export default function SessionCard({ session, onDelete }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { id, role, company, created_at, status, question_count } = session
  const date = new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const s = STATUS[status] || STATUS.pending

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try { await onDelete(id) } catch { setDeleting(false) }
  }

  const handleCancelDelete = (e) => {
    e.stopPropagation()
    setConfirmDelete(false)
  }

  return (
    <div
      onClick={() => !confirmDelete && navigate(`/interview/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
      style={{
        cursor: confirmDelete ? 'default' : 'pointer',
        background: hovered ? '#13131f' : '#0e0e1a',
        border: hovered ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '24px',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(59,130,246,0.12)' : '0 2px 12px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', gap: 16,
        position: 'relative',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.15))',
            border: '1px solid rgba(59,130,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>
            {getRoleIcon(role)}
          </div>
          <div>
            <div style={{ color: '#f0f0ff', fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{role}</div>
            {company && (
              <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>{company}</div>
            )}
          </div>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
          background: s.bg, color: s.color, border: `1px solid ${s.border}`,
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {s.label}
        </span>
      </div>

      {/* Meta info */}
      <div style={{ display: 'flex', gap: 16 }}>
        <span style={{ color: '#4b5563', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 14 }}>📋</span>
          {question_count ?? '—'} questions
        </span>
        <span style={{ color: '#4b5563', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 14 }}>📅</span>
          {date}
        </span>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {confirmDelete ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <span style={{ color: '#f87171', fontSize: 13, flex: 1 }}>Delete this session?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: 12, fontWeight: 700,
                padding: '5px 12px', borderRadius: 7, cursor: 'pointer',
              }}>
              {deleting ? '…' : 'Yes, delete'}
            </button>
            <button
              onClick={handleCancelDelete}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#9ca3af', fontSize: 12, fontWeight: 600,
                padding: '5px 12px', borderRadius: 7, cursor: 'pointer',
              }}>
              Cancel
            </button>
          </div>
        ) : (
          <>
            <span style={{ color: '#374151', fontSize: 12 }}>Click to begin interview</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleDelete}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#4b5563', fontSize: 15, padding: '2px 4px',
                  lineHeight: 1, borderRadius: 6,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
                title="Delete session"
              >
                🗑
              </button>
              <span style={{
                color: '#3b82f6', fontSize: 13, fontWeight: 600,
                transition: 'transform 0.15s',
                transform: hovered ? 'translateX(3px)' : 'translateX(0)',
                display: 'inline-block',
              }}>
                Start →
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
