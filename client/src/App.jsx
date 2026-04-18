import { useEffect } from 'react'
import useChatStore from './store/useChatStore'
import { connectSocket, disconnectSocket } from './services/socket'
import SetupWizard from './components/SetupWizard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatBox from './components/ChatBox'
import MessageInput from './components/MessageInput'
import ModelsPage from './components/ModelsPage'

function App() {
  const addMessage = useChatStore((state) => state.addMessage)
  const appendToLastMessage = useChatStore((state) => state.appendToLastMessage)
  const setConnected = useChatStore((state) => state.setConnected)
  const setStreaming = useChatStore((state) => state.setStreaming)
  const setupComplete = useChatStore((state) => state.setupComplete)
  const sidebarOpen = useChatStore((state) => state.sidebarOpen)
  const setSidebarOpen = useChatStore((state) => state.setSidebarOpen)
  const currentPage = useChatStore((state) => state.currentPage)

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
    <div className="flex h-screen bg-[#fafafa] text-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        {currentPage === 'models' ? (
          <ModelsPage />
        ) : (
          <>
            <ChatBox />
            <MessageInput />
          </>
        )}
      </main>
    </div>
  )
}

export default App
