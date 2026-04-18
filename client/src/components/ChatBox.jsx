import { useEffect, useRef } from 'react'
import useChatStore from '../store/useChatStore'

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7]/40 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7]/40 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7]/40 animate-bounce [animation-delay:300ms]" />
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
      <div className="flex-1 flex items-center justify-center overflow-y-auto px-4">
        <div className="text-center animate-fade-in-up opacity-0">
          {/* Robot mascot */}
          <div className="relative mx-auto mb-5 md:mb-6">
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-[#6c5ce7]/10 blur-xl" />
            <div className="relative text-5xl md:text-6xl animate-bounce [animation-duration:3s]">
              🤖
            </div>
          </div>
          <h3 className="text-base font-medium text-gray-600 mb-1.5">
            Hey there! 👋
          </h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
            Type a message below and I'll connect you to your AI model. Let's go! 🚀
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6 space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] md:max-w-[70%] px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-[#6c5ce7] text-white rounded-br-md shadow-md shadow-[#6c5ce7]/15'
                : 'bg-white text-gray-800 rounded-bl-md border border-gray-200 shadow-sm'
            }`}
          >
            <p className={`text-[10px] font-medium mb-1 uppercase tracking-wider ${
              msg.role === 'user' ? 'text-white/70' : 'text-[#6c5ce7]/70'
            }`}>
              {msg.role === 'user' ? 'You' : 'BR31'}
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
