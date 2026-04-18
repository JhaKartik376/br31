# BR31

> Connect to your own AI models running anywhere — use them like they're local.

**[Live Demo](https://jhakartik376.github.io/br31/)**

## Why I Built This

I got tired of relying on cloud AI services that cost money, throttle usage, and have access to everything I type. I wanted something different — a way to run models on my own hardware and access them from any device without sacrificing privacy or speed.

Most people think running local AI means sitting in front of the machine it's installed on. That felt like an unnecessary limitation. Your GPU server is sitting at home — why shouldn't you be able to chat with it from your laptop at a cafe, or your phone on the couch?

BR31 is my answer to that. It's a bridge between wherever your models live and wherever you are. No API keys to manage, no usage limits, no data leaving your network. Just a clean interface connected to your own AI.

And for people who don't have a GPU or just want to try it out, it also supports Groq's free cloud API as a fallback — so anyone can use it out of the box.

## What It Does

- Chat with AI models through a clean, streaming web interface
- Connect to local models via Ollama (runs on your machine)
- Falls back to Groq's free cloud API when no local model is available
- Real-time WebSocket streaming — responses appear token by token
- Step-by-step setup wizard that guides you through everything
- Dark, minimal UI that stays out of your way

## Architecture

```
Browser (React)
    ↕ WebSocket
FastAPI Server (Python)
    ↕
Ollama (local) or Groq API (cloud)
```

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React, Vite, Tailwind CSS, Zustand |
| Backend | Python, FastAPI, WebSocket, httpx |
| LLM (local) | Ollama — llama3.2, mistral, qwen, etc. |
| LLM (cloud) | Groq API — llama-3.1-8b, mixtral, gemma |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Python](https://python.org/) 3.10+
- [Ollama](https://ollama.ai/) (optional — for local models)

### Installation

**1. Clone the repo**

```bash
git clone https://github.com/JhaKartik376/br31.git
cd br31
```

**2. Set up the backend**

```bash
cd ai-server
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `ai-server/`:

```env
# Option A: Local models (install Ollama and pull a model)
OLLAMA_BASE_URL=http://localhost:11434
DEFAULT_MODEL=llama3.2

# Option B: Cloud models (get a free key at https://console.groq.com)
GROQ_API_KEY=your_groq_api_key_here
DEFAULT_GROQ_MODEL=llama-3.1-8b-instant

PORT=8000
```

You need at least one provider — either Ollama running locally or a Groq API key.

**3. Set up the frontend**

```bash
cd ../client
npm install
```

**4. Pull a model (if using Ollama)**

```bash
ollama pull llama3.2
```

Or for a lighter model that runs on any machine:

```bash
ollama pull qwen3.5:0.8b
```

### Running

**Start the backend:**

```bash
cd ai-server
source .venv/bin/activate
python run.py
```

**Start the frontend (in a new terminal):**

```bash
cd client
npm run dev
```

Open **http://localhost:5173** — you'll see the setup wizard on first visit, then you're chatting.

## Deployment

The live demo uses:

- **Frontend** — GitHub Pages (free, auto-deploys on push)
- **Backend** — [Render](https://render.com) free tier with Groq as the LLM provider

To deploy your own:

1. Fork this repo
2. Deploy `ai-server/` to Render, Railway, or any Python host
3. Set `GROQ_API_KEY` as an environment variable on the server
4. Update `client/.env.production` with your backend URL
5. Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)

## Project Structure

```
br31/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components + setup wizard
│   │   ├── services/        # WebSocket client
│   │   └── store/           # Zustand state management
│   └── ...
├── ai-server/               # Python FastAPI backend
│   ├── main.py              # API + WebSocket endpoints
│   ├── model.py             # Ollama + Groq providers
│   └── Dockerfile
├── server/                  # Node.js gateway (dev/alternative)
├── render.yaml              # Render deployment config
└── .github/workflows/       # GitHub Pages auto-deploy
```

## License

MIT

---

Built by [Kartik Jha](https://github.com/JhaKartik376)
