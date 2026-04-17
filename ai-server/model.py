"""LLM provider module for AetherLink — supports Ollama (local) and Groq (cloud)."""

import json
import os
from typing import AsyncGenerator

from dotenv import load_dotenv
import httpx

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "qwen3.5:0.8b")
DEFAULT_GROQ_MODEL = os.getenv("DEFAULT_GROQ_MODEL", "llama-3.1-8b-instant")


async def ollama_available() -> bool:
    """Check if Ollama is reachable."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            return resp.status_code == 200
    except Exception:
        return False


def groq_available() -> bool:
    """Check if Groq API key is configured."""
    return bool(GROQ_API_KEY)


async def get_active_provider() -> str:
    """Return the best available provider."""
    if await ollama_available():
        return "ollama"
    if groq_available():
        return "groq"
    return "none"


# --- Ollama ---

async def ollama_stream(prompt: str, model: str = DEFAULT_MODEL) -> AsyncGenerator[str, None]:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": True,
        "think": False,
    }
    try:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/chat", json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                        chunk = data.get("message", {}).get("content", "")
                        if chunk:
                            yield json.dumps({"content": chunk}) + "\n"
                    except json.JSONDecodeError:
                        continue
    except httpx.ConnectError:
        yield json.dumps({"error": "Cannot connect to Ollama"}) + "\n"
    except Exception as exc:
        yield json.dumps({"error": str(exc)}) + "\n"


async def ollama_generate(prompt: str, model: str = DEFAULT_MODEL) -> str:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
        "think": False,
    }
    async with httpx.AsyncClient(timeout=None) as client:
        response = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("message", {}).get("content", "")


async def ollama_models() -> list[dict]:
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
        response.raise_for_status()
        data = response.json()
        return data.get("models", [])


# --- Groq ---

async def groq_stream(prompt: str, model: str = DEFAULT_GROQ_MODEL) -> AsyncGenerator[str, None]:
    """Stream from Groq API using httpx (to avoid sync groq SDK issues)."""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": True,
    }
    try:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST", "https://api.groq.com/openai/v1/chat/completions",
                headers=headers, json=payload
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line or not line.startswith("data: "):
                        continue
                    data_str = line[6:]  # strip "data: "
                    if data_str.strip() == "[DONE]":
                        break
                    try:
                        data = json.loads(data_str)
                        chunk = data["choices"][0]["delta"].get("content", "")
                        if chunk:
                            yield json.dumps({"content": chunk}) + "\n"
                    except (json.JSONDecodeError, KeyError, IndexError):
                        continue
    except Exception as exc:
        yield json.dumps({"error": str(exc)}) + "\n"


async def groq_generate(prompt: str, model: str = DEFAULT_GROQ_MODEL) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers, json=payload,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


# --- Unified Interface ---

async def generate_stream(prompt: str, provider: str | None = None, model: str | None = None) -> AsyncGenerator[str, None]:
    """Stream response from the best available provider."""
    if provider is None:
        provider = await get_active_provider()

    if provider == "ollama":
        async for chunk in ollama_stream(prompt, model or DEFAULT_MODEL):
            yield chunk
    elif provider == "groq":
        async for chunk in groq_stream(prompt, model or DEFAULT_GROQ_MODEL):
            yield chunk
    else:
        yield json.dumps({"error": "No LLM provider available. Install Ollama or set GROQ_API_KEY."}) + "\n"


async def generate(prompt: str, provider: str | None = None, model: str | None = None) -> str:
    if provider is None:
        provider = await get_active_provider()

    if provider == "ollama":
        return await ollama_generate(prompt, model or DEFAULT_MODEL)
    elif provider == "groq":
        return await groq_generate(prompt, model or DEFAULT_GROQ_MODEL)
    else:
        raise RuntimeError("No LLM provider available")


async def list_models() -> list[dict]:
    """List models — combines Ollama local models with Groq available models."""
    models = []
    try:
        models.extend(await ollama_models())
    except Exception:
        pass

    if groq_available():
        groq_models = [
            {"name": "llama-3.1-8b-instant", "provider": "groq", "details": {"parameter_size": "8B"}},
            {"name": "llama-3.3-70b-versatile", "provider": "groq", "details": {"parameter_size": "70B"}},
            {"name": "mixtral-8x7b-32768", "provider": "groq", "details": {"parameter_size": "8x7B"}},
            {"name": "gemma2-9b-it", "provider": "groq", "details": {"parameter_size": "9B"}},
        ]
        models.extend(groq_models)

    return models
