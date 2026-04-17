import useChatStore from '../store/useChatStore'

function Header() {
  const isConnected = useChatStore((state) => state.isConnected)

  return (
    <header className="h-13 min-h-[3.25rem] bg-[#12121a]/60 border-b border-white/[0.06] backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-medium text-white/30 uppercase tracking-wider">Model</h2>
        <span className="text-xs text-white/70 font-medium bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
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
          {isConnected ? 'Online' : 'Offline'}
        </span>
      </div>
    </header>
  )
}

export default Header
