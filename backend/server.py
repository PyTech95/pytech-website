"""
Preview bridge for the PyTech Next.js app.

This pod is a FastAPI+React base image: the ingress routes every `/api/*`
request to this service on :8001, while the Next.js app (which owns the real
API route handlers) runs on :3000. This service is a thin reverse proxy that
forwards `/api/*` to the Next.js server so the unified app works unchanged.
"""
import os
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response

NEXT_ORIGIN = os.environ.get("NEXT_ORIGIN", "http://127.0.0.1:3000")

app = FastAPI(title="PyTech Preview Proxy")

# Long timeout: the AI triage chat calls Gemini and can take a while.
_client = httpx.AsyncClient(timeout=httpx.Timeout(120.0), follow_redirects=False)

# Hop-by-hop headers that must not be forwarded.
_HOP = {
    "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
    "te", "trailers", "transfer-encoding", "upgrade", "host", "content-length",
}


@app.get("/api/_proxy_health")
async def proxy_health():
    return {"proxy": "ok", "upstream": NEXT_ORIGIN}


@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
)
async def proxy(path: str, request: Request):
    url = f"{NEXT_ORIGIN}/api/{path}"
    body = await request.body()
    fwd_headers = {k: v for k, v in request.headers.items() if k.lower() not in _HOP}

    upstream = await _client.request(
        request.method,
        url,
        params=request.query_params,
        content=body,
        headers=fwd_headers,
    )

    resp_headers = {
        k: v for k, v in upstream.headers.items() if k.lower() not in _HOP
    }
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers=resp_headers,
        media_type=upstream.headers.get("content-type"),
    )


@app.on_event("shutdown")
async def _close():
    await _client.aclose()
