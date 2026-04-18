import useChatStore from '../store/useChatStore'

function Header() {
  const isConnected = useChatStore((state) => state.isConnected)
  const toggleSidebar = useChatStore((state) => state.toggleSidebar)

  return (
    <header className="h-13 min-h-[3.25rem] bg-[#12121a]/60 border-b border-white/[0.06] backdrop-blur-xl flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Logo — mobile only */}
        <span className="md:hidden text-sm">🤖</span>
        <span className="md:hidden text-sm font-bold text-white/80 tracking-tight font-mono">BR31</span>

        {/* Model badge — desktop */}
        <h2 className="hidden md:block text-xs font-medium text-white/30 uppercase tracking-wider">Model</h2>
        <span className="hidden md:block text-xs text-white/70 font-medium bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
          qwen3.5:0.8b
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isConnected ? 'bg-emerald-400' : 'bg-red-400'
          }`}
        />
        <span
          className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${
            isConnected
              ? 'bg-emerald-400/[0.07] text-emerald-400/80 border border-emerald-400/10'
              : 'bg-red-400/[0.07] text-red-400/80 border border-red-400/10'
          }`}
        >
          {isConnected ? '⚡ Online' : '💤 Offline'}
        </span>
      </div>
    </header>
  )
}

export default Header
