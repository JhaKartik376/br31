import 'dotenv/config';
import express from 'express';
import http from 'node:http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import initSocketHandler from './websocket/socketHandler.js';

const PORT    = Number(process.env.PORT)    || 3000;
const WS_PORT = Number(process.env.WS_PORT) || 3001;

// ── Express HTTP server ─────────────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`HTTP  server listening on http://localhost:${PORT}`);
});

// ── WebSocket server ────────────────────────────────────────────────────────

const wss = new WebSocketServer({ port: WS_PORT });

initSocketHandler(wss);

console.log(`WS   server listening on ws://localhost:${WS_PORT}`);

// ── Graceful shutdown ───────────────────────────────────────────────────────

function shutdown(signal) {
  console.log(`\n${signal} received — shutting down`);

  wss.clients.forEach((client) => {
    client.close(1001, 'Server shutting down');
  });
  wss.close();

  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  // Force exit if cleanup takes too long.
  setTimeout(() => process.exit(1), 5000);
}

process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
