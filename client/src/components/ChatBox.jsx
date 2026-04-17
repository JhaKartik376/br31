import { useEffect, useRef } from 'react'
import useChatStore from '../store/useChatStore'

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#a29bfe]/60 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#a29bfe]/60 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#a29bfe]/60 animate-bounce [animation-delay:300ms]" />
    </span>
  )
}

function ChatBox() {
  const messages = useChatStore((state) => state.messages)
  const isStreaming = useChatStore((state) => state.isStreaming)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        <div className="text-center animate-fade-in-up opacity-0">
          {/* Glow orb */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-[#6c5ce7]/20 blur-xl" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#6c5ce7]/20 to-[#a29bfe]/10 border border-white/[0.06] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#a29bfe]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
          </div>
          <h3 className="text-base font-medium text-white/60 mb-1.5">
            Start a conversation
          </h3>
          <p className="text-xs text-white/25 max-w-xs mx-auto leading-relaxed">
            Type a message below to begin chatting with your local AI model.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] px-4 py-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-[#6c5ce7] text-white rounded-br-md shadow-lg shadow-[#6c5ce7]/10'
                : 'bg-white/[0.04] text-white/80 rounded-bl-md border border-white/[0.06]'
            }`}
          >
            <p className={`text-[10px] font-medium mb-1 uppercase tracking-wider ${
              msg.role === 'user' ? 'text-white/50' : 'text-[#a29bfe]/60'
            }`}>
              {msg.role === 'user' ? 'You' : 'AetherLink'}
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {msg.content}
              {msg.role === 'assistant' && isStreaming && msg.id === messages[messages.length - 1]?.id && (
                <TypingIndicator />
              )}
            </p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatBox
