import useChatStore from '../store/useChatStore'

function Header() {
  const isConnected = useChatStore((state) => state.isConnected)
  const toggleSidebar = useChatStore((state) => state.toggleSidebar)

  return (
    <header className="h-13 min-h-[3.25rem] bg-white/80 border-b border-gray-200 backdrop-blur-xl flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Logo — mobile only */}
        <span className="md:hidden text-sm">🤖</span>
        <span className="md:hidden text-sm font-bold text-gray-900 tracking-tight font-mono">BR31</span>

        {/* Model badge — desktop */}
        <h2 className="hidden md:block text-xs font-medium text-gray-400 uppercase tracking-wider">Model</h2>
        <span className="hidden md:block text-xs text-gray-600 font-medium bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
          qwen3.5:0.8b
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isConnected ? 'bg-emerald-500' : 'bg-red-400'
          }`}
        />
        <span
          className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${
            isConnected
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-red-50 text-red-500 border border-red-200'
          }`}
        >
          {isConnected ? '⚡ Online' : '💤 Offline'}
        </span>
      </div>
    </header>
  )
}

export default Header
