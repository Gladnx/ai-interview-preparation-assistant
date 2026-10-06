import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { 
  BarChart2, 
  Database, 
  Layers, 
  Clock, 
  FileText, 
  ChevronRight, 
  Code2, 
  BarChart3 
} from 'lucide-react'
import Navbar from '../components/Navbar'
import SessionCard from '../components/SessionCard'
import ScrollReveal from '../components/ScrollReveal'
import { useSessions } from '../hooks/useSessions'
import { JOB_PROFILES } from '../data/jobProfiles'

const ICON_MAP = {
  BarChart2: BarChart3,
  Database: Database,
  Layers: Layers,
  Code2: Code2,
}

export default function Dashboard() {
  const { user } = useUser()
  const { sessions, loading, deleteSession } = useSessions()

  const completedSessions = sessions.filter(s => s.status === 'completed')
  const inProgressSessions = sessions.filter(s => s.status === 'in_progress')
  
  const avgScore = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.feedback?.overall_score || 75), 0) / completedSessions.length)
    : null

  return (
    <div className="min-h-screen bg-[#050a08] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        
        {/* Workspace Summary Bar */}
        <ScrollReveal animation="fade-up" delay={0} bothWays={true}>
          <div className="p-6 bg-[#0b281d] border border-[#134e38] mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Interview Practice Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-[#a7c4b5] mt-1 max-w-lg">
                  Choose a role track to start a spoken simulation or review previous evaluation feedback reports.
                </p>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="px-4 py-2.5 bg-[#050a08] border border-[#134e38] min-w-[95px]">
                  <div className="text-xl font-bold text-white">{sessions.length}</div>
                  <div className="text-xs text-[#a7c4b5]">Sessions</div>
                </div>

                <div className="px-4 py-2.5 bg-[#050a08] border border-[#134e38] min-w-[95px]">
                  <div className="text-xl font-bold text-[#2ea675]">{completedSessions.length}</div>
                  <div className="text-xs text-[#a7c4b5]">Completed</div>
                </div>

                <div className="px-4 py-2.5 bg-[#050a08] border border-[#134e38] min-w-[95px]">
                  <div className="text-xl font-bold text-[#2ea675]">
                    {avgScore ? `${avgScore}%` : '—'}
                  </div>
                  <div className="text-xs text-[#a7c4b5]">Avg Score</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Specialized Job Track Profiles */}
        <div className="mb-12">
          <ScrollReveal animation="fade-up" delay={50} bothWays={true}>
            <div className="mb-4">
              <h2 className="text-base font-bold text-white tracking-tight">
                Standardized Role Tracks
              </h2>
              <p className="text-xs text-[#a7c4b5] mt-0.5">Role playbooks with predefined question banks and evaluation criteria.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {JOB_PROFILES.map((profile, idx) => (
              <ScrollReveal
                key={profile.id}
                animation="fade-up"
                delay={idx * 70}
                bothWays={true}
                className="h-full flex"
              >
                <JobProfileCard profile={profile} />
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Past Sessions History */}
        <div>
          <ScrollReveal animation="fade-up" delay={50} bothWays={true}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Session History & Feedback
                </h2>
              </div>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="p-8 bg-[#0b281d] border border-[#134e38] text-center text-xs text-[#a7c4b5]">
              Loading session history…
            </div>
          ) : sessions.length === 0 ? (
            <ScrollReveal animation="fade-up" delay={100} bothWays={true}>
              <div className="p-8 bg-[#0b281d] border border-[#134e38] text-center">
                <div className="text-xs font-bold text-white mb-1">No recorded interviews yet</div>
                <p className="text-xs text-[#a7c4b5] max-w-sm mx-auto">
                  Select one of the tracks above to launch your first spoken technical simulation.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session, idx) => (
                <ScrollReveal
                  key={session.id}
                  animation="fade-up"
                  delay={idx * 60}
                  bothWays={true}
                  className="h-full flex"
                >
                  <SessionCard session={session} onDelete={deleteSession} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}

function JobProfileCard({ profile }) {
  const IconComponent = ICON_MAP[profile.icon] || Layers

  return (
    <Link
      to={`/job/${profile.id}`}
      className="p-4 bg-[#0b281d] border border-[#134e38] hover:border-[#2ea675] flex flex-col justify-between transition-colors w-full"
    >
      <div>
        <div className="p-2 bg-[#050a08] text-[#2ea675] border border-[#134e38] w-fit mb-3">
          <IconComponent className="w-4 h-4" />
        </div>

        <h3 className="text-sm font-bold text-white mb-1">
          {profile.title}
        </h3>
        <div className="text-xs text-[#2ea675] font-semibold mb-2">
          {profile.salary}
        </div>

        <div className="text-xs text-[#a7c4b5] mb-4">
          {profile.techStack.slice(0, 3).join(', ')}
        </div>
      </div>

      <div className="pt-3 border-t border-[#134e38] flex items-center justify-between text-xs">
        <span className="text-[#a7c4b5]">5 Questions</span>

        <span className="text-xs font-semibold text-[#2ea675] hover:text-white inline-flex items-center gap-1">
          <span>Start</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#2ea675]" />
        </span>
      </div>
    </Link>
  )
}

