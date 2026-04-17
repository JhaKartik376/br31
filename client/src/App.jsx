import { useEffect } from 'react'
import useChatStore from './store/useChatStore'
import { connectSocket, disconnectSocket } from './services/socket'
import SetupWizard from './components/SetupWizard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatBox from './components/ChatBox'
import MessageInput from './components/MessageInput'

function App() {
  const addMessage = useChatStore((state) => state.addMessage)
  const appendToLastMessage = useChatStore((state) => state.appendToLastMessage)
  const setConnected = useChatStore((state) => state.setConnected)
  const setStreaming = useChatStore((state) => state.setStreaming)
  const setupComplete = useChatStore((state) => state.setupComplete)

  useEffect(() => {
    const handleMessage = (data) => {
      switch (data.type) {
        case 'stream_start':
          addMessage({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
          })
          setStreaming(true)
          break

        case 'stream_chunk':
          appendToLastMessage(data.content)
          break

        case 'stream_end':
          setStreaming(false)
          break

        case 'response':
          addMessage({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.content,
            timestamp: Date.now(),
          })
          break

        default:
          break
      }
    }

    const handleConnect = () => setConnected(true)
    const handleDisconnect = () => {
      setConnected(false)
      setStreaming(false)
    }

    connectSocket(handleMessage, handleConnect, handleDisconnect)

    return () => {
      disconnectSocket()
    }
  }, [addMessage, appendToLastMessage, setConnected, setStreaming])

  if (!setupComplete) {
    return <SetupWizard />
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white/90">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <ChatBox />
        <MessageInput />
      </main>
    </div>
  )
}

export default App
