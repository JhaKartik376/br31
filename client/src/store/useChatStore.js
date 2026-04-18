import { create } from 'zustand'

const useChatStore = create((set) => ({
  messages: [],
  isConnected: false,
  isStreaming: false,
  setupComplete: localStorage.getItem('br31-setup-complete') === 'true',
  currentStep: 0,
  sidebarOpen: false,
  currentPage: 'chat', // 'chat' | 'models'

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  appendToLastMessage: (chunk) =>
    set((state) => {
      const messages = [...state.messages]
      if (messages.length === 0) return state
      const last = { ...messages[messages.length - 1] }
      last.content += chunk
      messages[messages.length - 1] = last
      return { messages }
    }),

  setConnected: (isConnected) => set({ isConnected }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCurrentPage: (page) => set({ currentPage: page, sidebarOpen: false }),

  setCurrentStep: (step) => set({ currentStep: step }),

  completeSetup: () => {
    localStorage.setItem('br31-setup-complete', 'true')
    set({ setupComplete: true })
  },

  resetSetup: () => {
    localStorage.removeItem('br31-setup-complete')
    set({ setupComplete: false, currentStep: 0 })
  },
}))

export default useChatStore
