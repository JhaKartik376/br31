const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:8000';

/**
 * Send a JSON payload to a WebSocket client.
 * Silently skips if the socket is no longer open.
 */
function send(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

/**
 * Forward a chat message to the Python AI server and stream the response
 * back to the WebSocket client as newline-delimited JSON chunks.
 */
async function handleChatMessage(ws, message) {
  send(ws, { type: 'stream_start' });

  let response;
  try {
    response = await fetch(`${AI_SERVER_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, stream: true }),
    });
  } catch {
    send(ws, { type: 'error', message: 'AI server not available' });
    return;
  }

  if (!response.ok) {
    send(ws, {
      type: 'error',
      message: `AI server responded with status ${response.status}`,
    });
    return;
  }

  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // The AI server sends newline-delimited JSON chunks.
      // Process every complete line sitting in the buffer.
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep the trailing incomplete fragment

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const chunk = JSON.parse(trimmed);
          if (chunk.error) {
            send(ws, { type: 'error', message: chunk.error });
          } else if (chunk.content) {
            send(ws, { type: 'stream_chunk', content: chunk.content });
          }
        } catch {
          // If a chunk isn't valid JSON, forward it as raw text.
          send(ws, { type: 'stream_chunk', content: trimmed });
        }
      }
    }

    // Flush anything left in the buffer after the stream ends.
    if (buffer.trim()) {
      try {
        const chunk = JSON.parse(buffer.trim());
        if (chunk.content) {
          send(ws, { type: 'stream_chunk', content: chunk.content });
        }
      } catch {
        send(ws, { type: 'stream_chunk', content: buffer.trim() });
      }
    }
  } catch (err) {
    send(ws, { type: 'error', message: `Stream error: ${err.message}` });
  }

  send(ws, { type: 'stream_end' });
}

/**
 * Attach connection/message/close handlers to a WebSocket.Server instance.
 */
export default function initSocketHandler(wss) {
  wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`Client connected  [${clientIp}]`);

    ws.on('message', async (raw) => {
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        send(ws, { type: 'error', message: 'Invalid JSON' });
        return;
      }

      if (data.type === 'chat' && data.message) {
        await handleChatMessage(ws, data.message);
      } else {
        send(ws, { type: 'error', message: 'Unknown message type or missing message field' });
      }
    });

    ws.on('close', () => {
      console.log(`Client disconnected  [${clientIp}]`);
    });

    ws.on('error', (err) => {
      console.error(`WebSocket error  [${clientIp}]:`, err.message);
    });
  });
}
