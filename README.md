# AetherLink

> Connect to your own AI models running anywhere — use them like they're local.

## Overview

AetherLink lets you connect to a remote machine running large language models (LLMs) and interact with them through a clean web interface. Run models on a powerful GPU server, access them from any device, keep everything private.

## Architecture

```
Client (React + Vite)
       ↓ WebSocket
API Gateway (Node.js)
       ↓ HTTP Stream
AI Server (Python + FastAPI)
       ↓
LLM Engine (Ollama)
```

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React, Vite, Tailwind CSS, Zustand |
| Gateway | Node.js, Express, WebSocket (ws) |
| AI Server | Python, FastAPI, httpx |
| LLM | Ollama (llama3.2, mistral, etc.) |

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- [Ollama](https://ollama.ai) installed with a model pulled (`ollama pull llama3.2`)

### 1. Start the AI Server
```bash
cd ai-server
pip install -r requirements.txt
python run.py
```

### 2. Start the Gateway
```bash
cd server
npm install
npm start
```

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 and start chatting.

## Project Structure

```
aetherlink/
├── client/          # React frontend
├── server/          # Node.js WebSocket gateway
├── ai-server/       # Python FastAPI + Ollama
└── README.md
```

## License

MIT
