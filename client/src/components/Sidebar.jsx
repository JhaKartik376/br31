import useChatStore from '../store/useChatStore'

function Sidebar() {
  const isConnected = useChatStore((state) => state.isConnected)
  const resetSetup = useChatStore((state) => state.resetSetup)
  const setSidebarOpen = useChatStore((state) => state.setSidebarOpen)
  const currentPage = useChatStore((state) => state.currentPage)
  const setCurrentPage = useChatStore((state) => state.setCurrentPage)

  const handleAction = (action) => {
    action()
    setSidebarOpen(false)
  }

  return (
    <aside className="w-[260px] min-w-[260px] bg-[#12121a] border-r border-white/[0.06] flex flex-col h-screen">
      {/* Branding */}
      <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Robot Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] p-[1px]">
            <div className="w-full h-full rounded-xl bg-[#12121a] flex items-center justify-center text-lg">
              🤖
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white/90 tracking-tight font-mono">
              BR31
            </h1>
            <p className="text-[10px] text-white/25">Neural Bridge</p>
          </div>
        </div>

        {/* Close button — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <div className="p-3">
        <div className="space-y-0.5">
          <button
            onClick={() => setCurrentPage('chat')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs transition-all text-left ${
              currentPage === 'chat'
                ? 'bg-[#6c5ce7]/10 text-[#a29bfe] border border-[#6c5ce7]/20'
                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
            }`}
          >
            <span className="text-sm">💬</span>
            Chat
          </button>
          <button
            onClick={() => setCurrentPage('models')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs transition-all text-left ${
              currentPage === 'models'
                ? 'bg-[#6c5ce7]/10 text-[#a29bfe] border border-[#6c5ce7]/20'
                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
            }`}
          >
            <span className="text-sm">🧠</span>
            Models & Benefits
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="px-4 pt-1">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isConnected ? 'bg-emerald-400 animate-pulse-glow text-emerald-400' : 'bg-red-400 text-red-400'
            }`}
          />
          <span className="text-xs text-white/50">
            {isConnected ? '⚡ Connected' : '🔌 Disconnected'}
          </span>
        </div>
      </div>

      {/* Model Info */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest mb-2 px-1">
          🎯 Active Model
        </p>
        <div className="px-3.5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center text-sm">
              🧊
            </div>
            <div>
              <p className="text-xs text-white/70 font-medium">qwen3.5:0.8b</p>
              <p className="text-[10px] text-white/25">Local</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-4 mt-5">
        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest mb-2 px-1">
          🔗 Quick Links
        </p>
        <div className="space-y-0.5">
          <button
            onClick={() => handleAction(resetSetup)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs text-white/35 hover:text-white/60 hover:bg-white/[0.03] transition-all text-left"
          >
            <span className="text-sm">📖</span>
            Setup Guide
          </button>
          <a
            href="https://ollama.ai/library"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs text-white/35 hover:text-white/60 hover:bg-white/[0.03] transition-all"
          >
            <span className="text-sm">📦</span>
            Browse Models
          </a>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer with mascot */}
      <div className="p-4 border-t border-white/[0.06] text-center">
        <div className="text-2xl mb-1.5">🤖⚡🧠</div>
        <p className="text-[10px] text-white/15 font-mono">
          BR31 v0.1.0
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
