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
    <aside className="w-[260px] min-w-[260px] bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Branding */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Robot Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] p-[1px]">
            <div className="w-full h-full rounded-xl bg-white flex items-center justify-center text-lg">
              🤖
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 tracking-tight font-mono">
              BR31
            </h1>
            <p className="text-[10px] text-gray-400">Neural Bridge</p>
          </div>
        </div>

        {/* Close button — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                ? 'bg-[#6c5ce7]/5 text-[#6c5ce7] border border-[#6c5ce7]/15'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm">💬</span>
            Chat
          </button>
          <button
            onClick={() => setCurrentPage('models')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs transition-all text-left ${
              currentPage === 'models'
                ? 'bg-[#6c5ce7]/5 text-[#6c5ce7] border border-[#6c5ce7]/15'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm">🧠</span>
            Models & Benefits
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="px-4 pt-1">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isConnected ? 'bg-emerald-500 animate-pulse-glow text-emerald-500' : 'bg-red-400 text-red-400'
            }`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? '⚡ Connected' : '🔌 Disconnected'}
          </span>
        </div>
      </div>

      {/* Model Info */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2 px-1">
          🎯 Active Model
        </p>
        <div className="px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center text-sm">
              🧊
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium">qwen3.5:0.8b</p>
              <p className="text-[10px] text-gray-400">Local</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-4 mt-5">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2 px-1">
          🔗 Quick Links
        </p>
        <div className="space-y-0.5">
          <button
            onClick={() => handleAction(resetSetup)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all text-left"
          >
            <span className="text-sm">📖</span>
            Setup Guide
          </button>
          <a
            href="https://ollama.ai/library"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            <span className="text-sm">📦</span>
            Browse Models
          </a>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer with mascot */}
      <div className="p-4 border-t border-gray-100 text-center">
        <div className="text-2xl mb-1.5">🤖⚡🧠</div>
        <p className="text-[10px] text-gray-300 font-mono">
          BR31 v0.1.0
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
