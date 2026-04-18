"""BR31 AI Server — FastAPI backend with WebSocket support."""

import json
import os

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from model import (
    DEFAULT_MODEL,
    DEFAULT_GROQ_MODEL,
    generate,
    generate_stream,
    get_active_provider,
    groq_available,
    list_models,
    ollama_available,
)

app = FastAPI(title="BR31", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    stream: bool = True
    model: str | None = None
    provider: str | None = None  # "ollama" | "groq" | None (auto)


@app.get("/health")
async def health():
    provider = await get_active_provider()
    return {
        "status": "ok",
        "provider": provider,
        "ollama": await ollama_available(),
        "groq": groq_available(),
        "default_model": DEFAULT_MODEL if provider == "ollama" else DEFAULT_GROQ_MODEL,
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    if request.stream:
        return StreamingResponse(
            generate_stream(request.message, provider=request.provider, model=request.model),
            media_type="application/x-ndjson",
        )
    try:
        response_text = await generate(request.message, provider=request.provider, model=request.model)
        return {"response": response_text}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@app.get("/models")
async def models():
    try:
        available = await list_models()
        return {"models": available}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@app.get("/provider")
async def provider_info():
    """Return info about available providers."""
    return {
        "active": await get_active_provider(),
        "ollama": await ollama_available(),
        "groq": groq_available(),
    }


# --- WebSocket endpoint (replaces the need for Node.js gateway) ---

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "message": "Invalid JSON"})
                continue

            if data.get("type") == "chat" and data.get("message"):
                await websocket.send_json({"type": "stream_start"})
                try:
                    async for chunk_line in generate_stream(
                        data["message"],
                        provider=data.get("provider"),
                        model=data.get("model"),
                    ):
                        chunk = json.loads(chunk_line.strip())
                        if "error" in chunk:
                            await websocket.send_json({"type": "error", "message": chunk["error"]})
                        elif "content" in chunk:
                            await websocket.send_json({"type": "stream_chunk", "content": chunk["content"]})
                except Exception as exc:
                    await websocket.send_json({"type": "error", "message": str(exc)})
                await websocket.send_json({"type": "stream_end"})
            else:
                await websocket.send_json({"type": "error", "message": "Send {type: 'chat', message: '...'}"})
    except WebSocketDisconnect:
        pass
