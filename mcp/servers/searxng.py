#!/usr/bin/env python3
"""
SOVEREIGN MCP SERVER: SEARXNG-PROXY
Consent-gated external search — never executed without user approval
"""
import os
import json
import hashlib
import time
import httpx
from pathlib import Path
from mcp.server import Server
from mcp.types import Tool, ToolResult

server = Server("sovereign-searxng")

CONSENT_STORE = Path.home() / ".sovereign" / "consent_cache"
CONSENT_STORE.mkdir(parents=True, exist_ok=True)

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="search_web",
            description="Search the web (⚠️ REQUIRES EXPLICIT CONSENT ⚠️)",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"},
                    "consent_id": {"type": "string", "description": "Proof of user consent"}
                },
                "required": ["query", "consent_id"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> ToolResult:
    if name != "search_web":
        return ToolResult(error=f"Unknown tool: {name}")
    
    query = arguments["query"]
    consent_id = arguments.get("consent_id")
    
    # CONSTITUTIONAL GATE #1: NO CONSENT = NO SEARCH
    if not consent_id:
        # Generate consent request token
        request_id = hashlib.sha3_256(f"{query}{time.time()}".encode()).hexdigest()[:16]
        consent_file = CONSENT_STORE / f"consent_{request_id}.json"
        
        with open(consent_file, "w") as f:
            json.dump({
                "query": query,
                "timestamp": time.time(),
                "tool": "search_web",
                "status": "pending"
            }, f)
        
        return ToolResult(
            error="CONSENT REQUIRED: External search requires explicit user approval per Article I",
            consent_request={
                "id": request_id,
                "type": "external_search",
                "message": f"🔍 Allow web search for: '{query}'?",
                "details": "This will send your query to a local SearXNG instance. Results are cached deterministically."
            }
        )
    
    # CONSTITUTIONAL GATE #2: Verify consent is valid and not expired
    consent_valid = False
    for consent_file in CONSENT_STORE.glob(f"consent_*.json"):
        with open(consent_file) as f:
            data = json.load(f)
            if data.get("consent_id") == consent_id and data.get("status") == "approved":
                if time.time() - data.get("timestamp", 0) < 3600:  # 1 hour expiry
                    consent_valid = True
                    break
    
    if not consent_valid:
        return ToolResult(error="CONSENT EXPIRED OR INVALID: Please approve this search again")
    
    # EXECUTE SEARCH (with timeout)
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(
                "http://localhost:8081/search",
                params={"q": query, "format": "json"},
                headers={"User-Agent": "SovereignAI/3.1"}
            )
            
            if response.status_code == 200:
                results = response.json()
                
                # DETERMINISTIC CACHE: Hash results for Rezflow
                results_hash = hashlib.sha3_512(
                    json.dumps(results, sort_keys=True).encode()
                ).hexdigest()[:16]
                
                # Cache the results locally
                cache_file = CONSENT_STORE / f"cache_{results_hash}.json"
                with open(cache_file, "w") as f:
                    json.dump({
                        "query": query,
                        "results": results,
                        "timestamp": time.time(),
                        "hash": results_hash
                    }, f)
                
                return ToolResult(
                    content=json.dumps(results, indent=2),
                    metadata={
                        "hash": results_hash,
                        "cached": cache_file.name,
                        "expires": time.time() + 86400  # 24 hour cache
                    }
                )
            else:
                return ToolResult(error=f"Search failed: HTTP {response.status_code}")
                
    except Exception as e:
        return ToolResult(error=f"Search error: {str(e)}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(server.run())
