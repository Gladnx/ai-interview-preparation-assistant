import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useUser } from '@clerk/react'
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

// ─── Score colour ────────────────────────────────────────────────────────────

function scoreColor(score) {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

// ─── Animated waveform ───────────────────────────────────────────────────────

function Waveform({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 32 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 99,
          background: active ? '#3b82f6' : 'rgba(59,130,246,0.2)',
          height: active
            ? `${Math.max(4, Math.sin((i / 20) * Math.PI * 2 + Date.now() / 300) * 14 + 18)}px`
            : '4px',
          transition: 'height 0.15s ease',
        }} />
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

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
  const [aiMessage, setAiMessage] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [conversation, setConversation] = useState([])
  const [error, setError] = useState(null)
  const [waveActive, setWaveActive] = useState(false)

  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')
  const conversationEndRef = useRef(null)
  const startedRef = useRef(false)

  const session = getSession(id)

  // ── Auto-scroll conversation ────────────────────────────────────────────────
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  // ── Init speech recognition ─────────────────────────────────────────────────
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
    return () => { r.abort(); window.speechSynthesis.cancel() }
  }, [])

  // ── Speak helper ────────────────────────────────────────────────────────────
  const speak = useCallback((text, onEnd) => {
    setIsSpeaking(true)
    setWaveActive(true)
    setAiMessage(text)
    // Voices may load async — small delay
    setTimeout(() => {
      speakText(text, {
        onEnd: () => { setIsSpeaking(false); setWaveActive(false); onEnd?.() },
        onError: () => { setIsSpeaking(false); setWaveActive(false); onEnd?.() },
      })
    }, 100)
  }, [])

  const addMsg = useCallback((type, text) => {
    setConversation(prev => [...prev, { type, text }])
  }, [])

  // ── Start interview once session loads ──────────────────────────────────────
  useEffect(() => {
    if (sessionsLoading || !session || startedRef.current) return

    // If already completed — show stored feedback
    if (session.status === 'completed' && session.feedback) {
      setScript({ questions: session.questions || [] })
      setAnswers(session.answers || [])
      setFeedback(session.feedback)
      setPhase(PHASE.FEEDBACK)
      startedRef.current = true
      return
    }

    startedRef.current = true

    // Check sessionStorage cache first — avoids re-calling Gemini on HMR/reload
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

  // ── Waveform animation tick ─────────────────────────────────────────────────
  const [, forceRender] = useState(0)
  useEffect(() => {
    if (!waveActive && !isListening) return
    const t = setInterval(() => forceRender(n => n + 1), 120)
    return () => clearInterval(t)
  }, [waveActive, isListening])

  // ── Handlers ─────────────────────────────────────────────────────────────────

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

  // User responds to greeting
  const handleRespondToGreeting = () => startListening()

  const handleGreetingDone = () => {
    stopListening()
    const userText = transcriptRef.current.trim() || '...'
    addMsg('user', userText)
    transcriptRef.current = ''
    setTranscript('')

    const firstQText = `${script.transition} Here's my first question: ${script.questions[0]}`
    setCurrentQ(0)
    setPhase(PHASE.QUESTIONING)
    addMsg('ai', firstQText)
    speak(firstQText)
  }

  // User starts answering
  const handleStartAnswer = () => startListening()

  // User submits answer / moves to next
  const handleNextQuestion = () => {
    stopListening()
    const answer = transcriptRef.current.trim() || '(no answer provided)'
    addMsg('user', answer)
    transcriptRef.current = ''
    setTranscript('')

    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    const next = currentQ + 1

    if (next >= script.questions.length) {
      // All done — closing
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
      // Next question
      setCurrentQ(next)
      const intro = script.question_intros?.[next - 1] || 'Thank you.'
      const qText = `${intro} ${script.questions[next]}`
      addMsg('ai', qText)
      speak(qText)
    }
  }

  // ── Render guards ─────────────────────────────────────────────────────────

  if (sessionsLoading || phase === PHASE.LOADING) {
    return (
      <div style={{ minHeight: '100vh', background: '#05050a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#4b5563', fontSize: 14 }}>Loading session…</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Session not found</h2>
        <Link to="/dashboard" style={{ color: '#3b82f6', fontSize: 14 }}>← Back to Dashboard</Link>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Something went wrong</h2>
        <p style={{ color: '#ef4444', fontSize: 14, maxWidth: 480, textAlign: 'center' }}>{error}</p>
        <Link to="/dashboard" style={{ color: '#3b82f6', fontSize: 14 }}>← Back to Dashboard</Link>
      </div>
    )
  }

  // ── Feedback screen ───────────────────────────────────────────────────────

  if (phase === PHASE.FEEDBACK && feedback) {
    return <FeedbackScreen session={session} script={script} answers={answers} feedback={feedback} navigate={navigate} />
  }

  // ── Loading / preparing ───────────────────────────────────────────────────

  if (phase === PHASE.PREPARING || phase === PHASE.GEN_FEEDBACK) {
    const msg = phase === PHASE.PREPARING
      ? 'Preparing your personalised interview…'
      : 'Analysing your responses and generating feedback…'
    return (
      <div style={{ minHeight: '100vh', background: '#05050a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(37,99,235,0.2))',
          border: '1px solid rgba(59,130,246,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
          animation: 'pulse 1.5s infinite',
        }}>🤖</div>
        <p style={{ color: '#9ca3af', fontSize: 15 }}>{msg}</p>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    )
  }

  // ── Main interview UI ─────────────────────────────────────────────────────

  const isGreeting = phase === PHASE.GREETING
  const isQuestioning = phase === PHASE.QUESTIONING
  const isClosing = phase === PHASE.CLOSING

  const showRespondBtn   = isGreeting && !isSpeaking && !isListening
  const showDoneGreeting = isGreeting && isListening
  const showStartAnswer  = isQuestioning && !isSpeaking && !isListening
  const showNextQ        = isQuestioning && isListening

  return (
    <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff' }}>
      <Navbar />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '88px 24px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ color: '#f0f0ff', fontSize: 20, fontWeight: 800, letterSpacing: '-0.4px' }}>
              {session.role}{session.company ? ` @ ${session.company}` : ''}
            </h1>
            <p style={{ color: '#4b5563', fontSize: 13, marginTop: 3 }}>
              {isQuestioning ? `Question ${currentQ + 1} of ${script?.questions?.length ?? 5}` : 'Interview in progress'}
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            color: '#10b981', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 99,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Live Session
          </div>
        </div>

        {/* Conversation transcript */}
        <div style={{
          background: '#0a0a14', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, padding: '20px', marginBottom: 16,
          maxHeight: 340, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {conversation.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12,
              flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: msg.type === 'ai'
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(37,99,235,0.2))'
                  : 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.15))',
                border: msg.type === 'ai' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(16,185,129,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>
                {msg.type === 'ai' ? '🤖' : '🙂'}
              </div>
              <div style={{
                maxWidth: '75%',
                background: msg.type === 'ai' ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.04)',
                border: msg.type === 'ai' ? '1px solid rgba(59,130,246,0.15)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: msg.type === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                padding: '10px 14px',
              }}>
                <div style={{ color: msg.type === 'ai' ? '#93c5fd' : '#6ee7b7', fontSize: 11, fontWeight: 600, marginBottom: 5 }}>
                  {msg.type === 'ai' ? 'Alex (Interviewer)' : 'You'}
                </div>
                <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={conversationEndRef} />
        </div>

        {/* AI speaking panel */}
        <div style={{
          background: '#0e0e1a', border: `1px solid ${isSpeaking ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 16, padding: '18px 20px', marginBottom: 16,
          transition: 'border-color 0.3s',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 11, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(37,99,235,0.15))',
            border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🤖</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
              {isSpeaking ? 'Alex is speaking…' : 'Alex'}
            </div>
            <Waveform active={waveActive} />
          </div>
        </div>

        {/* User response panel */}
        <div style={{
          background: '#0e0e1a', border: `1px solid ${isListening ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 16, padding: '18px 20px', marginBottom: 20,
          transition: 'border-color 0.3s', minHeight: 90,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 600 }}>
              {isListening ? '🎤 Listening…' : 'Your response'}
            </div>
            {isListening && <Waveform active={true} />}
          </div>
          <p style={{
            color: transcript ? '#d1d5db' : '#374151',
            fontSize: 14, lineHeight: 1.65, margin: 0,
            fontStyle: transcript ? 'normal' : 'italic',
          }}>
            {transcript || (isListening ? 'Start speaking now…' : 'Your spoken answer will appear here.')}
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>

          {showRespondBtn && (
            <button onClick={handleRespondToGreeting} style={btnStyle('#10b981', 'rgba(16,185,129,0.15)', 'rgba(16,185,129,0.3)')}>
              🎤 Respond to Greeting
            </button>
          )}

          {showDoneGreeting && (
            <button onClick={handleGreetingDone} style={btnStyle('#3b82f6', 'rgba(59,130,246,0.15)', 'rgba(59,130,246,0.3)')}>
              Done Responding →
            </button>
          )}

          {showStartAnswer && (
            <button onClick={handleStartAnswer} style={btnStyle('#10b981', 'rgba(16,185,129,0.15)', 'rgba(16,185,129,0.3)')}>
              🎤 Start Speaking
            </button>
          )}

          {showNextQ && (
            <button onClick={handleNextQuestion} style={btnStyle('#3b82f6', 'rgba(59,130,246,0.15)', 'rgba(59,130,246,0.3)')}>
              {currentQ + 1 >= (script?.questions?.length ?? 5) ? 'Finish Interview ✓' : 'Next Question →'}
            </button>
          )}

          {(isClosing || phase === PHASE.GEN_FEEDBACK) && (
            <div style={{ color: '#4b5563', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ animation: 'pulse 1.5s infinite', display: 'inline-block' }}>⏳</span>
              {isClosing ? 'Wrapping up…' : 'Generating feedback…'}
            </div>
          )}

          <button
            onClick={() => { window.speechSynthesis.cancel(); navigate('/dashboard') }}
            style={{ ...btnStyle('#ef4444', 'rgba(239,68,68,0.1)', 'rgba(239,68,68,0.25)'), marginLeft: 'auto' }}>
            ⏹ End Session
          </button>
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </main>
    </div>
  )
}

// ─── Feedback screen ──────────────────────────────────────────────────────────

function FeedbackScreen({ session, script, answers, feedback, navigate }) {
  const color = scoreColor(feedback.overall_score)

  return (
    <div style={{ minHeight: '100vh', background: '#05050a', color: '#f0f0ff' }}>
      <Navbar />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '96px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Interview Complete</div>
          <h1 style={{ color: '#f0f0ff', fontSize: 32, fontWeight: 800, letterSpacing: '-0.8px', marginBottom: 8 }}>
            Your Feedback
          </h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>
            {session.role}{session.company ? ` @ ${session.company}` : ''}
          </p>
        </div>

        {/* Overall score */}
        <div style={{
          background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: '32px', marginBottom: 20, textAlign: 'center',
        }}>
          <div style={{ color: color, fontSize: 72, fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>
            {feedback.overall_score}
          </div>
          <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>Overall Score / 100</div>
          <p style={{ color: '#d1d5db', fontSize: 15, lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            {feedback.overall_summary}
          </p>
        </div>

        {/* Strengths & Improvements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#0e0e1a', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '22px' }}>
            <div style={{ color: '#10b981', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>✓ Strengths</div>
            {feedback.strengths?.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#10b981', fontSize: 14, flexShrink: 0, marginTop: 1 }}>•</span>
                <span style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#0e0e1a', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, padding: '22px' }}>
            <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>↑ To Improve</div>
            {feedback.improvements?.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#f59e0b', fontSize: 14, flexShrink: 0, marginTop: 1 }}>•</span>
                <span style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Per-question breakdown */}
        <div style={{ background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px', marginBottom: 32 }}>
          <div style={{ color: '#9ca3af', fontSize: 13, fontWeight: 700, marginBottom: 20 }}>Question Breakdown</div>
          {script?.questions?.map((q, i) => {
            const qfb = feedback.questions?.[i]
            const c = scoreColor(qfb?.score ?? 70)
            return (
              <div key={i} style={{
                borderBottom: i < script.questions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                paddingBottom: i < script.questions.length - 1 ? 20 : 0,
                marginBottom: i < script.questions.length - 1 ? 20 : 0,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <div style={{ color: '#9ca3af', fontSize: 12, fontWeight: 600 }}>Q{i + 1}</div>
                  <div style={{
                    color: c, fontSize: 13, fontWeight: 700,
                    background: `${c}18`, border: `1px solid ${c}40`,
                    padding: '2px 10px', borderRadius: 20, flexShrink: 0,
                  }}>{qfb?.score ?? '—'}/100</div>
                </div>
                <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>{q}</p>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
                  <div style={{ color: '#4b5563', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>YOUR ANSWER</div>
                  <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{answers[i] || '(no answer)'}</p>
                </div>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  💬 {qfb?.feedback}
                </p>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              padding: '13px 28px', borderRadius: 12, border: 'none',
              cursor: 'pointer', boxShadow: '0 0 24px rgba(59,130,246,0.35)',
            }}>
            ← Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#9ca3af', fontWeight: 600, fontSize: 15,
              padding: '13px 28px', borderRadius: 12, cursor: 'pointer',
            }}>
            New Session
          </button>
        </div>
      </main>
    </div>
  )
}

// ─── Button style helper ──────────────────────────────────────────────────────
function btnStyle(color, bg, border) {
  return {
    flex: 1, minWidth: 160,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: bg, border: `1px solid ${border}`,
    color, fontWeight: 700, fontSize: 15,
    padding: '13px 20px', borderRadius: 12, cursor: 'pointer',
    transition: 'all 0.15s',
  }
}
