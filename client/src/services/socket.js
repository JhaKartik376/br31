let socket = null
let reconnectAttempts = 0
const MAX_RETRIES = 5
let reconnectTimeout = null

// In production, connect to FastAPI /ws endpoint directly
// In dev, connect to Node.js gateway on :3001 or FastAPI /ws
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws'

export function connectSocket(onMessage, onConnect, onDisconnect) {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return
  }

  try {
    socket = new WebSocket(WS_URL)
  } catch (err) {
    console.error('WebSocket creation failed:', err)
    scheduleReconnect(onMessage, onConnect, onDisconnect)
    return
  }

  socket.onopen = () => {
    console.log('WebSocket connected')
    reconnectAttempts = 0
    onConnect?.()
  }

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage?.(data)
    } catch (err) {
      console.error('Failed to parse message:', err)
    }
  }

  socket.onclose = () => {
    console.log('WebSocket disconnected')
    onDisconnect?.()
    scheduleReconnect(onMessage, onConnect, onDisconnect)
  }

  socket.onerror = (err) => {
    console.error('WebSocket error:', err)
    socket.close()
  }
}

function scheduleReconnect(onMessage, onConnect, onDisconnect) {
  if (reconnectAttempts >= MAX_RETRIES) {
    console.log('Max reconnection attempts reached')
    return
  }

  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
  reconnectAttempts++
  console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RETRIES})`)

  reconnectTimeout = setTimeout(() => {
    connectSocket(onMessage, onConnect, onDisconnect)
  }, delay)
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'chat', message }))
  } else {
    console.error('WebSocket is not connected')
  }
}

export function disconnectSocket() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
  reconnectAttempts = MAX_RETRIES // prevent reconnection
  if (socket) {
    socket.close()
    socket = null
  }
}
