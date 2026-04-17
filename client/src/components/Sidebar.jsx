import useChatStore from '../store/useChatStore'

function Sidebar() {
  const isConnected = useChatStore((state) => state.isConnected)
  const resetSetup = useChatStore((state) => state.resetSetup)

  return (
    <aside className="w-[260px] min-w-[260px] bg-[#12121a] border-r border-white/[0.06] flex flex-col h-screen">
      {/* Branding */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] p-[1px]">
            <div className="w-full h-full rounded-lg bg-[#12121a] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#a29bfe]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white/90 tracking-tight">
              AetherLink
            </h1>
            <p className="text-[10px] text-white/25">Private AI Bridge</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="p-4">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isConnected ? 'bg-emerald-400 animate-pulse-glow text-emerald-400' : 'bg-red-400 text-red-400'
            }`}
          />
          <span className="text-xs text-white/50">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Model Info */}
      <div className="px-4 mt-1">
        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest mb-2 px-1">
          Active Model
        </p>
        <div className="px-3.5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#a29bfe]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-white/70 font-medium">qwen3.5:0.8b</p>
              <p className="text-[10px] text-white/25">Local</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-4 mt-6">
        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest mb-2 px-1">
          Quick Links
        </p>
        <div className="space-y-0.5">
          <button
            onClick={resetSetup}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs text-white/35 hover:text-white/60 hover:bg-white/[0.03] transition-all text-left"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Setup Guide
          </button>
          <a
            href="https://ollama.ai/library"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs text-white/35 hover:text-white/60 hover:bg-white/[0.03] transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Browse Models
          </a>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        <p className="text-[10px] text-white/15 text-center font-mono">
          AetherLink v0.1.0
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
