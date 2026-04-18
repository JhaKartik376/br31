import { useState, useEffect, useRef } from 'react'
import useChatStore from '../store/useChatStore'

/* ── Animated counter ── */
function AnimatedNumber({ target, duration = 1500, suffix = '' }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(target * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{value}{suffix}</span>
}

/* ── Animated bar ── */
function AnimatedBar({ label, value, max, color, delay = 0 }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setWidth((value / max) * 100), delay)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, max, delay])

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs text-white/40 font-mono">{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

/* ── Radial chart ── */
function RadialChart({ percentage, label, sublabel, color }) {
  const [drawn, setDrawn] = useState(false)
  const ref = useRef(null)
  const circumference = 2 * Math.PI * 36

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setDrawn(true)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={drawn ? circumference * (1 - percentage / 100) : circumference}
            className="transition-all duration-1500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm md:text-base font-semibold text-white/80">{drawn ? percentage : 0}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-white/70">{label}</p>
        <p className="text-[10px] text-white/30">{sublabel}</p>
      </div>
    </div>
  )
}

/* ── Model data ── */
const models = [
  {
    name: 'Llama 3.2',
    provider: 'Meta',
    sizes: ['1B', '3B', '8B'],
    speed: 8,
    quality: 9,
    memory: '2-8 GB',
    desc: 'Best all-around open model. Great for general chat, coding, and reasoning.',
    tags: ['General', 'Coding', 'Reasoning'],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-500/10 to-blue-600/10',
  },
  {
    name: 'Mistral',
    provider: 'Mistral AI',
    sizes: ['7B'],
    speed: 9,
    quality: 8,
    memory: '4.1 GB',
    desc: 'Extremely fast inference. Excellent for quick tasks and conversation.',
    tags: ['Fast', 'Chat', 'Multilingual'],
    color: 'from-orange-500 to-amber-500',
    bgColor: 'from-orange-500/10 to-amber-500/10',
  },
  {
    name: 'Qwen 3.5',
    provider: 'Alibaba',
    sizes: ['0.8B', '3B', '7B', '14B'],
    speed: 10,
    quality: 7,
    memory: '1-10 GB',
    desc: 'Lightweight and efficient. Runs on virtually any hardware including laptops.',
    tags: ['Lightweight', 'Efficient', 'Multilingual'],
    color: 'from-violet-500 to-purple-500',
    bgColor: 'from-violet-500/10 to-purple-500/10',
  },
  {
    name: 'Phi-4 Mini',
    provider: 'Microsoft',
    sizes: ['3.8B'],
    speed: 9,
    quality: 8,
    memory: '2.5 GB',
    desc: 'Punches above its weight. Strong reasoning in a small package.',
    tags: ['Reasoning', 'Compact', 'STEM'],
    color: 'from-cyan-500 to-teal-500',
    bgColor: 'from-cyan-500/10 to-teal-500/10',
  },
  {
    name: 'Gemma 2',
    provider: 'Google',
    sizes: ['2B', '9B', '27B'],
    speed: 8,
    quality: 9,
    memory: '2-18 GB',
    desc: 'Google\'s open model. Excellent instruction following and safety.',
    tags: ['Instruction', 'Safe', 'Research'],
    color: 'from-emerald-500 to-green-500',
    bgColor: 'from-emerald-500/10 to-green-500/10',
  },
  {
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    sizes: ['1.5B', '7B', '14B', '70B'],
    speed: 7,
    quality: 10,
    memory: '1-45 GB',
    desc: 'State-of-the-art reasoning. Chain-of-thought built in.',
    tags: ['Reasoning', 'Math', 'Coding'],
    color: 'from-rose-500 to-pink-500',
    bgColor: 'from-rose-500/10 to-pink-500/10',
  },
  {
    name: 'Mixtral 8x7B',
    provider: 'Mistral AI',
    sizes: ['8x7B MoE'],
    speed: 7,
    quality: 9,
    memory: '26 GB',
    desc: 'Mixture of experts architecture. Near GPT-4 quality for complex tasks.',
    tags: ['MoE', 'High Quality', 'Complex'],
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'from-amber-500/10 to-yellow-500/10',
  },
  {
    name: 'CodeLlama',
    provider: 'Meta',
    sizes: ['7B', '13B', '34B'],
    speed: 8,
    quality: 9,
    memory: '4-20 GB',
    desc: 'Specialized for code generation, completion, and debugging.',
    tags: ['Code', 'Debug', 'Completion'],
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'from-indigo-500/10 to-blue-500/10',
  },
]

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Complete Privacy',
    desc: 'Your data never leaves your network. No logs, no training on your inputs, no third-party access. Everything runs on hardware you control.',
    stat: '100',
    statLabel: 'Data stays local',
    statSuffix: '%',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Zero Latency',
    desc: 'Direct WebSocket streaming with no intermediary cloud servers. Tokens arrive as fast as your model generates them.',
    stat: '0',
    statLabel: 'API round trips',
    statSuffix: '',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Zero Cost',
    desc: 'No per-token pricing, no monthly subscriptions, no usage caps. Run unlimited queries on your own hardware for free.',
    stat: '0',
    statLabel: 'Monthly cost',
    statSuffix: '',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    title: 'Access Anywhere',
    desc: 'Use your GPU server from a laptop, phone, or tablet. BR31 bridges the gap between where your models are and where you are.',
    stat: '∞',
    statLabel: 'Devices supported',
    statSuffix: '',
  },
]

/* ── Comparison data ── */
const comparison = [
  { feature: 'Privacy', br31: 10, cloud: 3 },
  { feature: 'Speed', br31: 9, cloud: 7 },
  { feature: 'Cost', br31: 10, cloud: 4 },
  { feature: 'Flexibility', br31: 9, cloud: 6 },
  { feature: 'Offline Use', br31: 10, cloud: 0 },
  { feature: 'Model Choice', br31: 10, cloud: 5 },
]

/* ── Model Card ── */
function ModelCard({ model, index }) {
  return (
    <div
      className="animate-fade-in-up opacity-0 group p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.bgColor} flex items-center justify-center`}>
            <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${model.color}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">{model.name}</h3>
            <p className="text-[10px] text-white/30">{model.provider}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {model.sizes.map((s) => (
            <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-white/40 border border-white/[0.06]">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-white/40 leading-relaxed mb-3">{model.desc}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/30">Speed</span>
            <span className="text-[10px] text-white/50 font-mono">{model.speed}/10</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${model.color}`} style={{ width: `${model.speed * 10}%` }} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/30">Quality</span>
            <span className="text-[10px] text-white/50 font-mono">{model.quality}/10</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${model.color}`} style={{ width: `${model.quality * 10}%` }} />
          </div>
        </div>
      </div>

      {/* Tags + Memory */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {model.tags.map((tag) => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#6c5ce7]/10 text-[#a29bfe]/70 border border-[#6c5ce7]/10">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-white/25 font-mono flex-shrink-0 ml-2">{model.memory}</span>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function ModelsPage() {
  const setCurrentPage = useChatStore((s) => s.setCurrentPage)

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] md:w-[800px] h-[300px] md:h-[400px] bg-[#6c5ce7]/[0.06] rounded-full blur-[100px] md:blur-[150px]" />
        </div>

        <div className="relative px-4 md:px-8 pt-8 md:pt-12 pb-6 md:pb-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up opacity-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6c5ce7]/10 border border-[#6c5ce7]/20 text-[10px] md:text-xs text-[#a29bfe] mb-4 md:mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7] animate-pulse" />
                Open Source AI Models
              </span>
            </div>
            <h1 className="animate-fade-in-up opacity-0 delay-100 text-2xl md:text-4xl font-bold text-white tracking-tight mb-3 md:mb-4">
              Run <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe]">Any Model</span>, Anywhere
            </h1>
            <p className="animate-fade-in-up opacity-0 delay-200 text-sm md:text-base text-white/35 max-w-xl mx-auto leading-relaxed mb-8 md:mb-10">
              BR31 works with every model Ollama supports. From tiny 0.8B models on laptops to massive 70B models on GPU servers — pick what fits your hardware.
            </p>

            {/* Animated stats */}
            <div className="animate-fade-in-up opacity-0 delay-300 grid grid-cols-3 gap-3 md:gap-6 max-w-md mx-auto">
              <div className="p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xl md:text-3xl font-bold text-[#a29bfe] mb-0.5">
                  <AnimatedNumber target={50} suffix="+" />
                </div>
                <div className="text-[10px] md:text-xs text-white/30">Models</div>
              </div>
              <div className="p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xl md:text-3xl font-bold text-emerald-400 mb-0.5">
                  <AnimatedNumber target={100} suffix="%" />
                </div>
                <div className="text-[10px] md:text-xs text-white/30">Private</div>
              </div>
              <div className="p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xl md:text-3xl font-bold text-amber-400 mb-0.5">
                  $<AnimatedNumber target={0} />
                </div>
                <div className="text-[10px] md:text-xs text-white/30">Cost</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="px-4 md:px-8 py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-semibold text-white/90 mb-1.5">Compatible Models</h2>
            <p className="text-xs md:text-sm text-white/35">Every model here works out of the box with BR31 via Ollama.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {models.map((model, i) => (
              <ModelCard key={model.name} model={model} index={i} />
            ))}
          </div>

          <div className="mt-4 p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
            <p className="text-xs text-white/30">
              + dozens more on <a href="https://ollama.ai/library" target="_blank" rel="noopener noreferrer" className="text-[#a29bfe] hover:underline">ollama.ai/library</a>
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-4 md:px-8 py-6 md:py-10 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-lg md:text-2xl font-semibold text-white/90 mb-1.5">Why Local AI?</h2>
            <p className="text-xs md:text-sm text-white/35 max-w-md mx-auto">The case for running models on your own hardware instead of renting from cloud APIs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="animate-fade-in-up opacity-0 p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] transition-all"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0 text-[#a29bfe]">
                    {b.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-semibold text-white/80">{b.title}</h3>
                      <span className="text-lg md:text-xl font-bold text-[#a29bfe]">{b.stat}{b.statSuffix}</span>
                    </div>
                    <p className="text-xs text-white/35 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="px-4 md:px-8 py-6 md:py-10 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-lg md:text-2xl font-semibold text-white/90 mb-1.5">BR31 vs Cloud APIs</h2>
            <p className="text-xs md:text-sm text-white/35">How local-first AI compares to services like ChatGPT, Claude API, etc.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Bar chart */}
            <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#6c5ce7]" />
                  <span className="text-[10px] text-white/50">BR31</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-white/20" />
                  <span className="text-[10px] text-white/50">Cloud APIs</span>
                </div>
              </div>
              <div className="space-y-4">
                {comparison.map((item, i) => (
                  <div key={item.feature} className="space-y-2">
                    <span className="text-xs text-white/50">{item.feature}</span>
                    <div className="space-y-1">
                      <AnimatedBar label="" value={item.br31} max={10} color="bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe]" delay={i * 150} />
                      <AnimatedBar label="" value={item.cloud} max={10} color="bg-white/20" delay={i * 150 + 75} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Radial charts */}
            <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/60 mb-6 text-center">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <RadialChart percentage={100} label="Data Privacy" sublabel="Fully local" color="#6c5ce7" />
                <RadialChart percentage={95} label="Uptime" sublabel="No cloud dependency" color="#10b981" />
                <RadialChart percentage={100} label="Cost Savings" sublabel="vs cloud APIs" color="#f59e0b" />
                <RadialChart percentage={85} label="Flexibility" sublabel="Any model, any size" color="#8b5cf6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Benefit */}
      <div className="px-4 md:px-8 py-6 md:py-10 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg md:text-2xl font-semibold text-white/90 mb-1.5">How It All Connects</h2>
            <p className="text-xs md:text-sm text-white/35">A simple, powerful architecture that keeps you in control.</p>
          </div>

          <div className="p-5 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              {[
                { label: 'Your Device', sub: 'Browser / Phone / Tablet', icon: '🌐', color: 'from-blue-500/20 to-blue-600/20' },
                { label: '', icon: '→', color: '' },
                { label: 'BR31', sub: 'WebSocket Bridge', icon: '🔗', color: 'from-[#6c5ce7]/20 to-purple-600/20' },
                { label: '', icon: '→', color: '' },
                { label: 'Your Server', sub: 'GPU / Desktop / Cloud', icon: '🖥️', color: 'from-emerald-500/20 to-emerald-600/20' },
                { label: '', icon: '→', color: '' },
                { label: 'AI Model', sub: 'Ollama / Groq', icon: '🧠', color: 'from-amber-500/20 to-amber-600/20' },
              ].map((item, i) => (
                <div key={i} className={item.label ? 'flex-1 w-full md:w-auto' : 'hidden md:block'}>
                  {item.label ? (
                    <div className={`p-3 md:p-4 rounded-xl bg-gradient-to-br ${item.color} border border-white/[0.06] text-center`}>
                      <span className="text-xl md:text-2xl mb-1.5 block">{item.icon}</span>
                      <p className="text-xs md:text-sm font-medium text-white/70">{item.label}</p>
                      <p className="text-[9px] md:text-[10px] text-white/30">{item.sub}</p>
                    </div>
                  ) : (
                    <span className="text-white/15 text-lg">{item.icon}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 md:px-8 py-8 md:py-14 border-t border-white/[0.04]">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-lg md:text-2xl font-semibold text-white/90 mb-2">Ready to try?</h2>
          <p className="text-xs md:text-sm text-white/35 mb-6">Start chatting with your own AI model in seconds.</p>
          <button
            onClick={() => setCurrentPage('chat')}
            className="px-6 py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5a4bd6] text-white text-sm font-medium transition-all shadow-lg shadow-[#6c5ce7]/20 hover:shadow-[#6c5ce7]/30"
          >
            Open Chat
          </button>
        </div>
      </div>

      {/* Footer spacer */}
      <div className="h-4" />
    </div>
  )
}
