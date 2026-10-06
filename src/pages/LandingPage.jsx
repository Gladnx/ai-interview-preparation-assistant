import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Mic, 
  ArrowRight, 
  FileText, 
  Layers, 
  Database, 
  BarChart3, 
  Code2, 
  Volume2, 
  ChevronRight,
  Scale,
  MessageSquare,
  User
} from 'lucide-react'
import Navbar from '../components/Navbar'
import ScrollReveal from '../components/ScrollReveal'

const ROLES = [
  {
    id: 'full-stack',
    title: 'Full Stack Engineer',
    icon: Layers,
    level: 'Senior / L5',
    salary: '$130k – $190k',
    tags: 'React, Node.js, PostgreSQL, Distributed Systems',
    sampleQuestion: 'How did you prevent double-charging users when payment webhooks arrived twice within a second?'
  },
  {
    id: 'ai-engineer',
    title: 'AI & Machine Learning Engineer',
    icon: Code2,
    level: 'Staff / L6',
    salary: '$160k – $240k',
    tags: 'RAG, Vector Databases, Evaluation, PyTorch',
    sampleQuestion: 'How did you stop your retrieval pipeline from feeding irrelevant context to the LLM during peak traffic?'
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    icon: Database,
    level: 'Senior',
    salary: '$140k – $200k',
    tags: 'Kafka, Spark, dbt, Snowflake, Airflow',
    sampleQuestion: 'Walk me through how you handled out-of-order events without bloating your memory watermark.'
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: BarChart3,
    level: 'Mid / Senior',
    salary: '$95k – $145k',
    tags: 'SQL, Python, Experimentation, Tableau',
    sampleQuestion: 'How did you explain to leadership that a feature showed higher conversion only because of sample ratio mismatch?'
  },
]

const FEATURES = [
  {
    icon: Mic,
    title: 'Voice-to-Voice Practice',
    description: 'You speak your answers out loud just like a real interview. It forces you to stop rambling and get straight to the point.',
  },
  {
    icon: FileText,
    title: 'Tailored to Your Real Resume',
    description: 'Attach your resume so the interviewer asks about the actual databases, migrations, and architectures you worked on, not generic trivia.',
  },
  {
    icon: Scale,
    title: 'Honest, Point-by-Point Feedback',
    description: 'Find out if you answered the actual question, clearly explained trade-offs, or left out important edge cases.',
  },
  {
    icon: MessageSquare,
    title: 'Realistic Follow-Up Questions',
    description: 'If your answer glosses over failure modes or concurrency issues, the interviewer pushes you to explain your reasoning.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050a08] text-white flex flex-col">
      <Navbar />

      {/* Section 1: Hero (Deep Black #050a08) with Animated Paper Texture */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-[#050a08] border-b border-[#134e38]">
        {/* Paper texture background with motion */}
        <div className="hero-paper-texture" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Main Title */}
          <ScrollReveal animation="fade-up" delay={50} bothWays={true}>
            <h1 className="font-hero text-3xl sm:text-4xl md:text-[52px] font-extrabold text-white tracking-tight leading-[1.12] mb-6 max-w-3xl">
              Say your technical answers out loud before you say them to an interviewer.
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={120} bothWays={true}>
            <p className="text-sm sm:text-base text-[#a7c4b5] leading-relaxed max-w-2xl mb-8">
              Reading interview questions in your head feels easy. Explaining distributed locks, database trade-offs, or tricky bugs out loud without freezing is where people stumble. PrepAA speaks realistic questions to you, listens to your verbal answer, and gives point-by-point coaching on how to sound clear and confident.
            </p>
          </ScrollReveal>

          {/* Action Row */}
          <ScrollReveal animation="fade-up" delay={180} bothWays={true}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-14">
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2ea675] text-[#050a08] font-bold text-xs uppercase tracking-wider hover:bg-[#3fb985] transition-colors"
              >
                <span>Try a 5-Minute Practice Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0b281d] hover:bg-[#0e3828] text-white font-semibold text-xs uppercase tracking-wider border border-[#134e38] transition-colors"
              >
                <span>Sign In to Your Workspace</span>
              </Link>
            </div>
          </ScrollReveal>

          {/* Studio Preview Card */}
          <ScrollReveal animation="zoom-in" delay={220} bothWays={true}>
            <div className="border border-[#134e38] bg-[#0b281d]">
              
              {/* Top Bar */}
              <div className="px-5 py-3 bg-[#050a08] border-b border-[#134e38] flex items-center justify-between">
                <span className="text-xs font-bold text-[#2ea675]">Live Technical Screen</span>
                <span className="text-xs text-[#a7c4b5]">Question 3 of 5</span>
              </div>

              {/* Studio Body */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Left Exchange */}
                <div className="md:col-span-8 space-y-4">
                  
                  {/* Interviewer */}
                  <div className="p-4 bg-[#050a08] border border-[#134e38]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">Alex (Lead Engineer)</span>
                      <span className="text-xs text-[#2ea675] flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-[#2ea675]" />
                        <span>Speaking</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#e5e7eb] leading-relaxed">
                      "You noted that you handled payment migrations on your resume. If Stripe delivers the exact same webhook twice at the same millisecond, how did you ensure the customer was never double-charged?"
                    </p>
                  </div>

                  {/* Candidate */}
                  <div className="p-4 bg-[#050a08] border border-[#134e38]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2ea675]">Candidate</span>
                      <span className="text-xs text-[#a7c4b5]">Transcribing Your Mic</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#e5e7eb] leading-relaxed">
                      "We used an idempotency key generated from the event hash and acquired a Redis lock with a 30-second TTL. If a duplicate arrives while the first transaction is in flight, it fails early and waits for the database row to commit..."
                    </p>
                  </div>

                </div>

                {/* Right Rubric Checklist */}
                <div className="md:col-span-4 p-4 bg-[#050a08] border border-[#134e38] flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-[#134e38]">
                      Instant Performance Breakdown
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div>
                        <div className="flex justify-between text-[#a7c4b5] mb-1 font-medium">
                          <span>Technical Accuracy</span>
                          <span className="text-[#2ea675] font-bold">92 / 100</span>
                        </div>
                        <div className="h-1.5 bg-[#0b281d] border border-[#134e38]">
                          <div className="h-full bg-[#2ea675] w-[92%]"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[#a7c4b5] mb-1 font-medium">
                          <span>Trade-off Discussion</span>
                          <span className="text-[#2ea675] font-bold">88 / 100</span>
                        </div>
                        <div className="h-1.5 bg-[#0b281d] border border-[#134e38]">
                          <div className="h-full bg-[#2ea675] w-[88%]"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[#a7c4b5] mb-1 font-medium">
                          <span>Conciseness & Clarity</span>
                          <span className="text-[#2ea675] font-bold">95 / 100</span>
                        </div>
                        <div className="h-1.5 bg-[#0b281d] border border-[#134e38]">
                          <div className="h-full bg-[#2ea675] w-[95%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#134e38] mt-4 text-xs text-[#a7c4b5]">
                    <span className="font-semibold text-white">Direct takeaway: </span>
                    Clear and structured. You immediately gave the concrete solution (Redis idempotency key) before explaining the database isolation level.
                  </div>
                </div>

              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Section 2: Popular Engineering Roles (Dark Green #0b281d) */}
      <section id="tracks" className="py-16 md:py-20 bg-[#0b281d] border-b border-[#134e38]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="fade-up" bothWays={true}>
            <div className="mb-10">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Popular Engineering Roles
              </h2>
              <p className="text-xs text-[#a7c4b5] mt-1">
                Pick a role to practice immediately, or paste a custom job posting from any company.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLES.map((role, idx) => {
              const Icon = role.icon
              return (
                <ScrollReveal
                  key={role.id}
                  animation="fade-up"
                  delay={idx * 80}
                  bothWays={true}
                  className="h-full flex"
                >
                  <div
                    className="p-5 bg-[#050a08] border border-[#134e38] flex flex-col justify-between hover:border-[#2ea675] transition-colors w-full"
                  >
                    <div>
                      <div className="p-2.5 bg-[#0b281d] text-[#2ea675] border border-[#134e38] w-fit mb-3">
                        <Icon className="w-4 h-4" />
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1">
                        {role.title}
                      </h3>
                      <div className="text-xs text-[#2ea675] font-semibold mb-2">
                        {role.salary}
                      </div>

                      <div className="text-xs text-[#a7c4b5] mb-4">
                        {role.tags}
                      </div>

                      <p className="text-xs text-[#a7c4b5] italic bg-[#0b281d] p-3 border border-[#134e38] mb-4 leading-relaxed">
                        "{role.sampleQuestion}"
                      </p>
                    </div>

                    <Link
                      to="/sign-up"
                      className="w-full inline-flex items-center justify-between py-2 px-3 bg-[#0b281d] hover:bg-[#2ea675] hover:text-[#050a08] text-xs font-semibold text-white border border-[#134e38] transition-colors group"
                    >
                      <span>Practice This Role</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#2ea675] group-hover:text-[#050a08] transition-colors" />
                    </Link>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Why Practicing Out Loud Works (Deep Black #050a08) */}
      <section id="features" className="py-16 md:py-20 bg-[#050a08] border-b border-[#134e38]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="fade-up" bothWays={true}>
            <div className="mb-10">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Why Practicing Out Loud Works
              </h2>
              <p className="text-xs text-[#a7c4b5] mt-1">
                Engineers usually don't fail interviews on raw coding skill. They fail when their verbal explanations sound disorganized or unsure.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <ScrollReveal
                  key={i}
                  animation="fade-up"
                  delay={i * 90}
                  bothWays={true}
                  className="h-full flex"
                >
                  <div className="p-5 bg-[#0b281d] border border-[#134e38] flex gap-4 items-start w-full">
                    <div className="p-2.5 bg-[#050a08] border border-[#134e38] text-[#2ea675] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1.5">{feat.title}</h3>
                      <p className="text-xs text-[#a7c4b5] leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Deep Evaluation Rubric (Dark Green #0e3828) */}
      <section id="rubric" className="py-16 md:py-20 bg-[#0e3828] border-b border-[#134e38]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="fade-up" bothWays={true}>
            <div className="mb-10">
              <div className="text-xs font-bold text-[#2ea675] uppercase tracking-wider mb-1">
                Structured Evaluation
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                How Your Spoken Responses Are Assessed
              </h2>
              <p className="text-xs text-[#a7c4b5] mt-1 max-w-xl">
                Real interviewers evaluate structured thinking, direct technical depth, and trade-off awareness. PrepAA scores you across four precise dimensions.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Direct Architecture & Code Depth', desc: 'Checks if you addressed the specific technology, data store, and concurrency mechanism required.' },
              { title: 'Edge Cases & Failure Modes', desc: 'Identifies whether you thought about downtime, timeouts, duplicate events, and network partitions.' },
              { title: 'Trade-off Articulation', desc: 'Evaluates if you explained why you chose one approach over alternatives (e.g. Postgres vs DynamoDB).' },
              { title: 'Pacing & Conciseness', desc: 'Tracks word economy, helping you get straight to the point without circular filler talk.' },
            ].map((rubric, idx) => (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 80}
                bothWays={true}
                className="h-full flex"
              >
                <div className="p-5 bg-[#050a08] border border-[#134e38] flex flex-col justify-between w-full">
                  <div>
                    <div className="text-xs font-bold text-[#2ea675] uppercase mb-2">Criteria 0{idx + 1}</div>
                    <h3 className="text-sm font-bold text-white mb-2">{rubric.title}</h3>
                    <p className="text-xs text-[#a7c4b5] leading-relaxed">{rubric.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: How It Works (Deep Black #050a08) */}
      <section id="how-it-works" className="py-16 md:py-20 bg-[#050a08] border-b border-[#134e38]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="fade-up" bothWays={true}>
            <div className="mb-10">
              <h2 className="text-xl font-bold text-white tracking-tight">
                How It Works
              </h2>
              <p className="text-xs text-[#a7c4b5] mt-1">
                Four simple steps from setup to detailed feedback.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Pick Your Role', desc: 'Choose a standard engineering track or paste any actual job description.' },
              { step: '02', title: 'Attach Resume', desc: 'Upload your resume so the interviewer asks about your real past projects.' },
              { step: '03', title: 'Speak Your Answers', desc: 'Put on headphones and answer 5 live questions out loud using your mic.' },
              { step: '04', title: 'Get Straight Feedback', desc: 'Review your full transcript, score breakdowns, and specific suggestions.' },
            ].map((s, idx) => (
              <ScrollReveal
                key={s.step}
                animation="fade-up"
                delay={idx * 80}
                bothWays={true}
                className="h-full flex"
              >
                <div className="p-5 bg-[#0b281d] border border-[#134e38] w-full">
                  <div className="text-xs font-black text-[#2ea675] mb-3">{s.step}</div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{s.title}</h3>
                  <p className="text-xs text-[#a7c4b5] leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: CTA Box (Deep Black #050a08) */}
      <section className="py-16 md:py-20 bg-[#050a08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center w-full">
          <ScrollReveal animation="zoom-in" bothWays={true}>
            <div className="p-8 sm:p-12 bg-[#0b281d] border border-[#134e38]">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                Ready to test yourself out loud?
              </h2>
              <p className="text-xs sm:text-sm text-[#a7c4b5] max-w-md mx-auto mb-6">
                Try a full 5-question voice interview right now. It takes less than 10 minutes and gives you a clear sense of what to polish.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/sign-up"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#2ea675] text-[#050a08] font-bold text-xs uppercase tracking-wider hover:bg-[#3fb985] transition-colors"
                >
                  Start Free Practice Call
                </Link>
                <Link
                  to="/sign-in"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#050a08] hover:bg-[#0e3828] text-white font-semibold text-xs uppercase tracking-wider border border-[#134e38] transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Minimal Footer (Deep Black #050a08) */}
      <footer className="mt-auto border-t border-[#134e38] py-6 bg-[#050a08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a7c4b5]">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="w-5 h-5 rounded-full bg-[#2ea675] text-[#050a08] flex items-center justify-center">
              <Mic className="w-3 h-3 text-[#050a08]" strokeWidth={2.5} />
            </div>
            <span>PrepAA</span>
          </div>
          <div>
            © {new Date().getFullYear()} PrepAA
          </div>
        </div>
      </footer>
    </div>
  )
}

