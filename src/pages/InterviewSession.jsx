import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { 
  Volume2, 
  AlertCircle, 
  ArrowLeft, 
  Headphones, 
  User
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { useSessions } from '../hooks/useSessions'
import { generateInterview, generateFeedback } from '../lib/gemini'

// ─── Speech helpers ──────────────────────────────────────────────────────────

function getBestVoice() {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.name === 'Google UK English Female') ||
    voices.find(v => v.name === 'Google US English') ||
    voices.find(v => v.lang === 'en-US' && v.localService === false) ||
    voices.find(v => v.lang === 'en-US') ||
    voices[0] || null
  )
}

function speakText(text, { onEnd, onError } = {}) {
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.93
  utterance.pitch = 1.0
  utterance.volume = 1.0
  const voice = getBestVoice()
  if (voice) utterance.voice = voice
  utterance.onend = onEnd || null
  utterance.onerror = (e) => {
    if (e.error !== 'interrupted') onError?.(e)
  }
  window.speechSynthesis.speak(utterance)
}

function scoreColor(score) {
  if (score >= 80) return 'text-[#2ea675] bg-[#050a08] border-[#134e38]'
  if (score >= 60) return 'text-[#2ea675] bg-[#050a08] border-[#134e38]'
  return 'text-[#a7c4b5] bg-[#050a08] border-[#134e38]'
}

function Waveform({ active }) {
  return (
    <div className="flex items-center gap-1 h-6">
      {Array.from({ length: 24 }).map((_, i) => {
        const height = active
          ? Math.max(3, Math.sin((i / 24) * Math.PI * 2 + Date.now() / 250) * 10 + 12)
          : 3
        return (
          <div
            key={i}
            className={`w-1 transition-all ${
              active ? 'bg-[#2ea675]' : 'bg-[#134e38]'
            }`}
            style={{ height: `${height}px` }}
          />
        )
      })}
    </div>
  )
}

const PHASE = {
  LOADING: 'loading',
  PREPARING: 'preparing',
  GREETING: 'greeting',
  QUESTIONING: 'questioning',
  CLOSING: 'closing',
  GEN_FEEDBACK: 'gen_feedback',
  FEEDBACK: 'feedback',
}

export default function InterviewSession() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()
  const { getSession, updateSession, loading: sessionsLoading } = useSessions()

  const [phase, setPhase] = useState(PHASE.LOADING)
  const [script, setScript] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [conversation, setConversation] = useState([])
  const [error, setError] = useState(null)
  const [waveActive, setWaveActive] = useState(false)

  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')
  const conversationEndRef = useRef(null)
  const startedRef = useRef(false)

  const session = getSession(id)

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.continuous = true
    r.interimResults = true
    r.lang = 'en-US'
    r.onresult = (e) => {
      let final = ''
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' '
        else interim += e.results[i][0].transcript
      }
      if (final) {
        transcriptRef.current += final
        setTranscript(transcriptRef.current + interim)
      } else {
        setTranscript(transcriptRef.current + interim)
      }
    }
    r.onend = () => setIsListening(false)
    recognitionRef.current = r
    return () => {
      r.abort()
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((text, onEnd) => {
    setIsSpeaking(true)
    setWaveActive(true)
    setTimeout(() => {
      speakText(text, {
        onEnd: () => {
          setIsSpeaking(false)
          setWaveActive(false)
          onEnd?.()
        },
        onError: () => {
          setIsSpeaking(false)
          setWaveActive(false)
          onEnd?.()
        },
      })
    }, 100)
  }, [])

  const addMsg = useCallback((type, text) => {
    setConversation(prev => [...prev, { type, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
  }, [])

  useEffect(() => {
    if (sessionsLoading || !session || startedRef.current) return

    if (session.status === 'completed' && session.feedback) {
      setScript({ questions: session.questions || [] })
      setAnswers(session.answers || [])
      setFeedback(session.feedback)
      setPhase(PHASE.FEEDBACK)
      startedRef.current = true
      return
    }

    startedRef.current = true

    const cacheKey = `prepai_script_${id}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        const s = JSON.parse(cached)
        setScript(s)
        setPhase(PHASE.GREETING)
        addMsg('ai', s.greeting)
        speak(s.greeting)
        return
      } catch {}
    }

    setPhase(PHASE.PREPARING)

    const resumeText = session.resume_text || ''
    generateInterview({
      role: session.role,
      company: session.company,
      jobDescription: session.job_description,
      candidateName: user?.firstName,
      resumeText,
    })
      .then((s) => {
        sessionStorage.setItem(cacheKey, JSON.stringify(s))
        setScript(s)
        updateSession(id, {
          questions: s.questions,
          status: 'in_progress',
          question_count: s.questions.length,
        })
        setPhase(PHASE.GREETING)
        addMsg('ai', s.greeting)
        speak(s.greeting)
      })
      .catch((err) => setError(err.message))
  }, [sessionsLoading, session?.id])

  const [, forceRender] = useState(0)
  useEffect(() => {
    if (!waveActive && !isListening) return
    const t = setInterval(() => forceRender(n => n + 1), 120)
    return () => clearInterval(t)
  }, [waveActive, isListening])

  const startListening = () => {
    transcriptRef.current = ''
    setTranscript('')
    setIsListening(true)
    try { recognitionRef.current?.start() } catch {}
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const handleRespondToGreeting = () => startListening()

  const handleGreetingDone = () => {
    stopListening()
    const userText = transcriptRef.current.trim() || "I'm ready, let's begin."
    addMsg('user', userText)
    transcriptRef.current = ''
    setTranscript('')

    const firstQText = `${script.transition} Let's dive in: ${script.questions[0]}`
    setCurrentQ(0)
    setPhase(PHASE.QUESTIONING)
    addMsg('ai', firstQText)
    speak(firstQText)
  }

  const handleStartAnswer = () => startListening()

  const handleNextQuestion = () => {
    stopListening()
    const answer = transcriptRef.current.trim() || '(No spoken response captured)'
    addMsg('user', answer)
    transcriptRef.current = ''
    setTranscript('')

    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    const next = currentQ + 1

    if (next >= script.questions.length) {
      setPhase(PHASE.CLOSING)
      addMsg('ai', script.closing)
      speak(script.closing, () => {
        setPhase(PHASE.GEN_FEEDBACK)
        generateFeedback({
          role: session.role,
          company: session.company,
          questions: script.questions,
          answers: newAnswers,
        })
          .then((fb) => {
            setFeedback(fb)
            updateSession(id, {
              answers: newAnswers,
              feedback: fb,
              status: 'completed',
            })
            setPhase(PHASE.FEEDBACK)
          })
          .catch((err) => setError(err.message))
      })
    } else {
      setCurrentQ(next)
      const intro = script.question_intros?.[next - 1] || 'Got it.'
      const qText = `${intro} Next question: ${script.questions[next]}`
      addMsg('ai', qText)
      speak(qText)
    }
  }

  if (sessionsLoading || phase === PHASE.LOADING) {
    return (
      <div className="min-h-screen bg-[#050a08] text-[#a7c4b5] flex items-center justify-center text-xs">
        Setting up your interview studio…
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#050a08] text-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-base font-bold text-white">Interview Session Not Found</h2>
        <Link to="/dashboard" className="text-xs text-[#a7c4b5] hover:text-[#2ea675]">
          ← Return to Workspace
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050a08] text-white flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-[#2ea675]" />
        <h2 className="text-base font-bold text-white">Something went wrong</h2>
        <p className="text-xs text-[#a7c4b5] max-w-md">{error}</p>
        <Link to="/dashboard" className="text-xs text-[#a7c4b5] hover:text-[#2ea675]">
          ← Return to Workspace
        </Link>
      </div>
    )
  }

  if (phase === PHASE.FEEDBACK && feedback) {
    return <FeedbackScreen session={session} script={script} answers={answers} feedback={feedback} navigate={navigate} />
  }

  if (phase === PHASE.PREPARING || phase === PHASE.GEN_FEEDBACK) {
    const isPrep = phase === PHASE.PREPARING
    return (
      <div className="min-h-screen bg-[#050a08] text-white flex flex-col items-center justify-center gap-4 px-4">
        <div className="p-6 bg-[#0b281d] border border-[#134e38] text-center max-w-md">
          <div className="text-sm font-bold text-white mb-1">
            {isPrep ? 'Reviewing Your Resume & Role Requirements' : 'Analyzing Your Spoken Answers'}
          </div>
          <div className="text-xs text-[#a7c4b5]">
            {isPrep 
              ? 'Formulating realistic technical questions based on your background…' 
              : 'Checking technical depth, clarity, and trade-offs…'}
          </div>
        </div>
      </div>
    )
  }

  const isGreeting = phase === PHASE.GREETING
  const isQuestioning = phase === PHASE.QUESTIONING
  const totalQuestions = script?.questions?.length || 5

  const showRespondBtn   = isGreeting && !isSpeaking && !isListening
  const showDoneGreeting = isGreeting && isListening
  const showStartAnswer  = isQuestioning && !isSpeaking && !isListening
  const showNextQ        = isQuestioning && isListening

  return (
    <div className="min-h-screen bg-[#050a08] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        
        {/* Studio Top Bar */}
        <div className="p-4 bg-[#0b281d] border border-[#134e38] mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-white">
              {session.role} {session.company ? `at ${session.company}` : ''}
            </h1>
            <div className="text-xs text-[#a7c4b5] mt-0.5">
              {isQuestioning ? `Question ${currentQ + 1} of ${totalQuestions}` : isGreeting ? 'Warm-up & Greeting' : 'Wrapping Up'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#a7c4b5]">
              Live Spoken Session
            </span>

            <button
              onClick={() => {
                window.speechSynthesis.cancel()
                navigate('/dashboard')
              }}
              className="px-3 py-1 text-xs bg-[#050a08] hover:bg-[#0e3828] text-white border border-[#134e38] transition-colors"
            >
              Exit Studio
            </button>
          </div>
        </div>

        {/* Question Step Blocks */}
        {isQuestioning && (
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1 transition-all ${
                  idx <= currentQ
                    ? 'bg-[#2ea675]'
                    : 'bg-[#134e38]'
                }`}
              />
            ))}
          </div>
        )}

        {/* Audio Visualizer Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          {/* Interviewer Box */}
          <div className="p-4 bg-[#0b281d] border border-[#134e38]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#2ea675]" />
                <span className="text-xs font-bold text-white">Alex (Lead Engineer)</span>
              </div>
              <span className="text-xs text-[#a7c4b5]">
                {isSpeaking ? 'Speaking' : 'Listening'}
              </span>
            </div>
            <div className="flex justify-center py-1">
              <Waveform active={waveActive} />
            </div>
          </div>

          {/* Candidate Box */}
          <div className="p-4 bg-[#0b281d] border border-[#134e38]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#2ea675]" />
                <span className="text-xs font-bold text-white">{user?.firstName || 'Candidate'} (Your Mic)</span>
              </div>
              <span className="text-xs text-[#a7c4b5]">
                {isListening ? 'Listening…' : 'Muted'}
              </span>
            </div>
            <div className="flex justify-center py-1">
              <Waveform active={isListening} />
            </div>
          </div>

        </div>

        {/* Live Transcript Exchange Feed */}
        <div className="p-4 bg-[#0b281d] border border-[#134e38] mb-4 flex flex-col h-72 overflow-hidden">
          <div className="text-xs font-bold text-white uppercase tracking-wider mb-3 pb-1 border-b border-[#134e38]">
            Live Conversation Transcript
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] p-3 text-xs leading-relaxed border ${
                  msg.type === 'user'
                    ? 'bg-[#050a08] border-[#134e38] text-white'
                    : 'bg-[#050a08] border-[#134e38] text-[#a7c4b5]'
                }`}>
                  <div className="flex items-center justify-between gap-3 text-xs text-[#a7c4b5] mb-1">
                    <span className="font-semibold text-[#2ea675]">{msg.type === 'ai' ? 'Alex (Interviewer)' : 'You'}</span>
                    <span className="text-[11px]">{msg.time}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Live speech preview */}
            {isListening && transcript && (
              <div className="flex flex-col items-end">
                <div className="max-w-[85%] p-3 text-xs leading-relaxed border bg-[#050a08] border-[#2ea675] text-white">
                  <div className="text-xs text-[#2ea675] mb-1">Transcribing speech in real-time…</div>
                  <p>{transcript}</p>
                </div>
              </div>
            )}

            <div ref={conversationEndRef} />
          </div>
        </div>

        {/* Control Dock */}
        <div className="p-4 bg-[#0b281d] border border-[#134e38] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#a7c4b5]">
            {isSpeaking ? (
              <span>Alex is speaking. Listen carefully to the question.</span>
            ) : isListening ? (
              <span className="text-[#2ea675] font-medium">Your mic is live. Speak your response, then click below when finished.</span>
            ) : isGreeting ? (
              <span>Say hello or let Alex know you are ready to start.</span>
            ) : (
              <span>Take a breath, gather your thoughts, and click "Start Speaking" when ready.</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            {showRespondBtn && (
              <button
                onClick={handleRespondToGreeting}
                className="px-4 py-2 bg-[#2ea675] hover:bg-[#3fb985] text-[#050a08] font-bold uppercase tracking-wider transition-colors"
              >
                Respond to Greeting
              </button>
            )}

            {showDoneGreeting && (
              <button
                onClick={handleGreetingDone}
                className="px-4 py-2 bg-[#2ea675] hover:bg-[#3fb985] text-[#050a08] font-bold uppercase tracking-wider transition-colors"
              >
                Proceed to Q1 →
              </button>
            )}

            {showStartAnswer && (
              <button
                onClick={handleStartAnswer}
                className="px-4 py-2 bg-[#2ea675] hover:bg-[#3fb985] text-[#050a08] font-bold uppercase tracking-wider transition-colors"
              >
                Start Speaking Answer
              </button>
            )}

            {showNextQ && (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-[#2ea675] hover:bg-[#3fb985] text-[#050a08] font-bold uppercase tracking-wider transition-colors"
              >
                {currentQ + 1 >= totalQuestions ? 'Finish Interview' : 'Submit Answer & Next →'}
              </button>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}

// ─── Diagnostic Feedback Screen ──────────────────────────────────────────────

function FeedbackScreen({ session, script, answers, feedback, navigate }) {
  const score = feedback?.overall_score || 80

  return (
    <div className="min-h-screen bg-[#050a08] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#a7c4b5] hover:text-[#2ea675] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspace</span>
          </Link>

          <span className="text-xs text-[#a7c4b5] font-semibold">
            Interview Completed
          </span>
        </div>

        {/* Scorecard Hero */}
        <div className="p-6 bg-[#0b281d] border border-[#134e38] mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-bold text-[#2ea675] uppercase tracking-wider mb-1">
                Interview Feedback · {session.role}
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mb-2">
                Performance Breakdown
              </h1>
              <p className="text-xs sm:text-sm text-[#a7c4b5] leading-relaxed max-w-lg">
                {feedback.overall_summary}
              </p>
            </div>

            {/* Score Box */}
            <div className="p-4 border border-[#134e38] bg-[#050a08] text-center min-w-[120px]">
              <div className="text-3xl font-extrabold text-[#2ea675] mb-0.5">
                {score}
              </div>
              <div className="text-xs uppercase tracking-wider text-[#a7c4b5] font-semibold">
                Score / 100
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Growth Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Strengths */}
          <div className="p-5 bg-[#0b281d] border border-[#134e38]">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              What You Did Well
            </div>
            <ul className="space-y-2.5">
              {feedback.strengths?.map((str, idx) => (
                <li key={idx} className="text-xs text-[#e5e7eb] flex items-start gap-2 leading-relaxed">
                  <span className="text-[#2ea675] font-bold">—</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Growth Areas */}
          <div className="p-5 bg-[#0b281d] border border-[#134e38]">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              What to Work On
            </div>
            <ul className="space-y-2.5">
              {feedback.improvements?.map((imp, idx) => (
                <li key={idx} className="text-xs text-[#e5e7eb] flex items-start gap-2 leading-relaxed">
                  <span className="text-[#2ea675] font-bold">—</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Question Breakdown Diagnostics */}
        <div className="p-5 bg-[#0b281d] border border-[#134e38] mb-6">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-[#134e38]">
            Question by Question Review
          </h2>

          <div className="space-y-6">
            {script?.questions?.map((q, i) => {
              const qfb = feedback.questions?.[i]
              const qScore = qfb?.score || 70

              return (
                <div key={i} className="pt-4 first:pt-0 border-t first:border-t-0 border-[#134e38]">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <span className="text-xs font-bold text-[#2ea675]">
                      Question {i + 1}
                    </span>
                    <span className="text-xs font-bold text-[#2ea675]">
                      {qScore} / 100
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 leading-snug">
                    {q}
                  </h3>

                  {/* Candidate Answer */}
                  <div className="p-3 bg-[#050a08] border border-[#134e38] mb-2">
                    <div className="text-xs font-medium text-[#a7c4b5] uppercase mb-1">
                      Your Spoken Answer:
                    </div>
                    <p className="text-xs text-[#e5e7eb] italic leading-relaxed">
                      "{answers[i] || 'No speech recorded.'}"
                    </p>
                  </div>

                  {/* Reviewer Advice */}
                  <div className="text-xs text-[#a7c4b5] leading-relaxed bg-[#050a08] border border-[#134e38] p-3">
                    <span className="font-bold text-[#2ea675]">Reviewer Advice: </span>
                    {qfb?.feedback || 'Good structural explanation. Keep focusing on concrete system trade-offs.'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-[#2ea675] hover:bg-[#3fb985] text-[#050a08] font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Return to Workspace
          </button>
        </div>

      </main>
    </div>
  )
}
