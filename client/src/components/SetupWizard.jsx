import { useState, useEffect } from 'react'
import useChatStore from '../store/useChatStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to AetherLink',
    subtitle: 'Your private bridge to AI models running anywhere.',
  },
  {
    id: 'ollama',
    title: 'Install Ollama',
    subtitle: 'Ollama runs AI models locally on your machine.',
  },
  {
    id: 'model',
    title: 'Pull a Model',
    subtitle: 'Download an AI model to start chatting.',
  },
  {
    id: 'connect',
    title: 'Connect & Chat',
    subtitle: 'AetherLink bridges your browser to the model.',
  },
]

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i === current
              ? 'w-8 bg-[#6c5ce7]'
              : i < current
              ? 'w-4 bg-[#6c5ce7]/50'
              : 'w-4 bg-white/10'
          }`}
        />
      ))}
    </div>
  )
}

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-[#0a0a0f] border border-white/[0.06] rounded-xl px-5 py-4 font-mono text-sm text-[#a29bfe] overflow-x-auto">
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/40 hover:text-white/80 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

function StatusCheck({ label, checking, ok, error }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex-shrink-0">
        {checking ? (
          <div className="w-5 h-5 rounded-full border-2 border-[#6c5ce7]/30 border-t-[#6c5ce7] animate-spin" />
        ) : ok ? (
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : error ? (
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10" />
        )}
      </div>
      <span className={`text-sm ${ok ? 'text-white/80' : error ? 'text-red-300/80' : 'text-white/40'}`}>
        {label}
      </span>
    </div>
  )
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-8">
      {/* Logo */}
      <div className="animate-fade-in-up opacity-0">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] p-[1px]">
          <div className="w-full h-full rounded-2xl bg-[#12121a] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#a29bfe]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-3 animate-fade-in-up opacity-0 delay-200">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Welcome to <span className="text-[#a29bfe]">AetherLink</span>
        </h2>
        <p className="text-white/40 max-w-md mx-auto leading-relaxed">
          Run AI models on any machine — GPU server, desktop, or cloud — and chat with them from anywhere. Private, fast, and fully under your control.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto animate-fade-in-up opacity-0 delay-300">
        {[
          { icon: '🔒', label: 'Private', desc: 'No data leaves your network' },
          { icon: '⚡', label: 'Fast', desc: 'Direct WebSocket streaming' },
          { icon: '🌐', label: 'Remote', desc: 'Access models from anywhere' },
        ].map((f) => (
          <div key={f.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
            <div className="text-lg mb-2">{f.icon}</div>
            <div className="text-xs font-medium text-white/70 mb-0.5">{f.label}</div>
            <div className="text-[10px] text-white/30">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OllamaStep() {
  const [ollamaOk, setOllamaOk] = useState(null)
  const [checking, setChecking] = useState(false)

  const checkOllama = async () => {
    setChecking(true)
    try {
      const res = await fetch(`${API_URL}/models`)
      if (res.ok) setOllamaOk(true)
      else setOllamaOk(false)
    } catch {
      setOllamaOk(false)
    }
    setChecking(false)
  }

  useEffect(() => {
    checkOllama()
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-4 animate-fade-in-up opacity-0">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-lg">1</span>
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-medium text-white/80">Install Ollama</h4>
            <p className="text-xs text-white/40 leading-relaxed">
              Ollama is the engine that runs AI models locally. Download and install it from the official website.
            </p>
            <a
              href="https://ollama.ai/download"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#a29bfe] hover:text-[#6c5ce7] transition-colors"
            >
              ollama.ai/download
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-lg">2</span>
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-medium text-white/80">Or install via terminal</h4>
            <CodeBlock>curl -fsSL https://ollama.ai/install.sh | sh</CodeBlock>
          </div>
        </div>
      </div>

      <div className="space-y-2 animate-fade-in-up opacity-0 delay-200">
        <StatusCheck
          label={ollamaOk ? 'Ollama is running' : ollamaOk === false ? 'Ollama not detected — start it and retry' : 'Checking Ollama...'}
          checking={checking}
          ok={ollamaOk === true}
          error={ollamaOk === false}
        />
        {ollamaOk === false && (
          <button
            onClick={checkOllama}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all"
          >
            Check again
          </button>
        )}
      </div>
    </div>
  )
}

function ModelStep() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchModels = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/models`)
      const data = await res.json()
      setModels(data.models || [])
    } catch {
      setModels([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchModels()
  }, [])

  const suggestedModels = [
    { name: 'llama3.2', size: '2.0 GB', desc: 'Great all-rounder by Meta' },
    { name: 'mistral', size: '4.1 GB', desc: 'Fast and capable' },
    { name: 'qwen3.5:0.8b', size: '1.0 GB', desc: 'Lightweight, runs on anything' },
    { name: 'phi4-mini', size: '2.5 GB', desc: 'Efficient by Microsoft' },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-3 animate-fade-in-up opacity-0">
        <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">Pull a model</h4>
        <p className="text-xs text-white/35 leading-relaxed">
          Open your terminal and run one of these commands to download a model.
        </p>
      </div>

      <div className="space-y-2 animate-fade-in-up opacity-0 delay-100">
        {suggestedModels.map((m) => (
          <div key={m.name} className="group p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#a29bfe]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-white/80">{m.name}</div>
                  <div className="text-[10px] text-white/30">{m.desc} · {m.size}</div>
                </div>
              </div>
              {models.some(installed => installed.name === m.name) && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Installed
                </span>
              )}
            </div>
            <div className="mt-2.5">
              <CodeBlock>{`ollama pull ${m.name}`}</CodeBlock>
            </div>
          </div>
        ))}
      </div>

      {models.length > 0 && (
        <div className="space-y-2 animate-fade-in-up opacity-0 delay-300">
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider">Your installed models</h4>
          <div className="flex flex-wrap gap-2">
            {models.map((m) => (
              <span key={m.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6c5ce7]/10 border border-[#6c5ce7]/20 text-xs text-[#a29bfe]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {m.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="w-5 h-5 mx-auto rounded-full border-2 border-[#6c5ce7]/30 border-t-[#6c5ce7] animate-spin" />
        </div>
      )}

      {!loading && models.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <p className="text-xs text-amber-300/60 text-center">
            No models found. Pull one using the commands above, then continue.
          </p>
        </div>
      )}

      <button
        onClick={fetchModels}
        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all"
      >
        Refresh models
      </button>
    </div>
  )
}

function ConnectStep() {
  const isConnected = useChatStore((s) => s.isConnected)

  const architecture = [
    { label: 'Your Browser', icon: '🌐', color: 'from-blue-500/20 to-blue-600/20' },
    { label: 'WebSocket', icon: '↕️', color: '' },
    { label: 'Gateway Server', icon: '🔀', color: 'from-[#6c5ce7]/20 to-purple-600/20' },
    { label: 'HTTP Stream', icon: '↕️', color: '' },
    { label: 'AI Server', icon: '🧠', color: 'from-emerald-500/20 to-emerald-600/20' },
    { label: '', icon: '↕️', color: '' },
    { label: 'Ollama + Model', icon: '🤖', color: 'from-amber-500/20 to-amber-600/20' },
  ]

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up opacity-0">
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <h4 className="text-sm font-medium text-white/70">How it works</h4>
          <div className="flex flex-col items-center gap-1">
            {architecture.map((item, i) => (
              <div key={i} className={item.label ? 'w-full' : ''}>
                {item.label ? (
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${item.color ? `bg-gradient-to-r ${item.color}` : ''} border border-white/[0.06]`}>
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs text-white/60">{item.label}</span>
                  </div>
                ) : (
                  <div className="flex justify-center py-0.5">
                    <span className="text-white/20 text-xs">{item.icon}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 animate-fade-in-up opacity-0 delay-200">
        <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider">Start the servers</h4>

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] text-white/30 mb-1.5 font-medium uppercase tracking-wider">Terminal 1 — AI Server</div>
            <CodeBlock>cd ai-server && python run.py</CodeBlock>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] text-white/30 mb-1.5 font-medium uppercase tracking-wider">Terminal 2 — Gateway</div>
            <CodeBlock>cd server && npm start</CodeBlock>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up opacity-0 delay-300">
        <StatusCheck
          label={isConnected ? 'Connected to gateway — you\'re all set!' : 'Waiting for gateway connection...'}
          checking={!isConnected}
          ok={isConnected}
        />
      </div>
    </div>
  )
}

const STEP_COMPONENTS = [WelcomeStep, OllamaStep, ModelStep, ConnectStep]

export default function SetupWizard() {
  const currentStep = useChatStore((s) => s.currentStep)
  const setCurrentStep = useChatStore((s) => s.setCurrentStep)
  const completeSetup = useChatStore((s) => s.completeSetup)
  const isConnected = useChatStore((s) => s.isConnected)

  const StepComponent = STEP_COMPONENTS[currentStep]
  const isLast = currentStep === steps.length - 1
  const isFirst = currentStep === 0

  const handleNext = () => {
    if (isLast) {
      completeSetup()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (!isFirst) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#6c5ce7]/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          <StepIndicator current={currentStep} total={steps.length} />
          <span className="text-[10px] text-white/20 font-mono">
            {currentStep + 1}/{steps.length}
          </span>
        </div>

        {/* Step header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white/90 tracking-tight">
            {steps[currentStep].title}
          </h3>
          <p className="text-sm text-white/35 mt-1">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Step content */}
        <div className="mb-8" key={currentStep}>
          <StepComponent />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`px-5 py-2.5 rounded-xl text-sm transition-all ${
              isFirst
                ? 'opacity-0 pointer-events-none'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
            }`}
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            {!isLast && (
              <button
                onClick={completeSetup}
                className="px-4 py-2.5 rounded-xl text-xs text-white/25 hover:text-white/50 transition-all"
              >
                Skip setup
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5a4bd6] text-white text-sm font-medium transition-all shadow-lg shadow-[#6c5ce7]/20 hover:shadow-[#6c5ce7]/30"
            >
              {isLast ? (isConnected ? 'Start Chatting' : 'Finish Setup') : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
