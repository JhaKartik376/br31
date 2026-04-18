import { useState } from 'react'
import useChatStore from '../store/useChatStore'
import { sendMessage } from '../services/socket'

function MessageInput() {
  const [input, setInput] = useState('')
  const isStreaming = useChatStore((state) => state.isStreaming)
  const isConnected = useChatStore((state) => state.isConnected)
  const addMessage = useChatStore((state) => state.addMessage)

  const handleSend = () => {
    const text = input.trim()
    if (!text || isStreaming || !isConnected) return

    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    })

    sendMessage(text)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-3 md:p-4">
      <div className="flex items-center gap-2 md:gap-3 max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={
              !isConnected
                ? 'Waiting for connection...'
                : isStreaming
                ? 'AI is responding...'
                : 'Message BR31...'
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 md:px-4 md:py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#6c5ce7]/50 focus:ring-1 focus:ring-[#6c5ce7]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isStreaming || !input.trim() || !isConnected}
          className="bg-[#6c5ce7] hover:bg-[#5a4bd6] disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-200 text-white rounded-xl p-2.5 md:px-4 md:py-3 text-sm font-medium transition-all shadow-md shadow-[#6c5ce7]/20 hover:shadow-[#6c5ce7]/30 disabled:shadow-none flex items-center gap-2 disabled:cursor-not-allowed border border-transparent disabled:border"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <span className="hidden md:inline">Send</span>
        </button>
      </div>
      <p className="hidden md:block text-center text-[10px] text-gray-300 mt-2.5 font-mono">
        Powered by Ollama · Running locally
      </p>
    </div>
  )
}

export default MessageInput
