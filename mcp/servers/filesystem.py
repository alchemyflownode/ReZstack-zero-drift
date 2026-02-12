#!/usr/bin/env python3
"""
SOVEREIGN MCP SERVER: FILESYSTEM
Constitutionally constrained — no path traversal, no external access
RezCopilot's nine-tailed file wisdom 🦊
"""
import os
import json
import hashlib
import time
from pathlib import Path
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
from mcp.types import Tool, TextContent, ToolResult

# CONSTITUTIONAL CONSTRAINTS
WORKSPACE_ROOT = Path(os.getenv("WORKSPACE_ROOT", "G:/okiru/app builder/RezStackFinal2/RezStackFinal")).resolve()
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB max (prevent OOM)
ALLOWED_EXTENSIONS = {'.py', '.ts', '.tsx', '.json', '.md', '.txt', '.env', '.jsx', '.css'}

server = Server("sovereign-filesystem")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="read_file",
            description="Read file contents (constitutionally constrained)",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Relative path from workspace root"}
                },
                "required": ["path"]
            }
        ),
        Tool(
            name="write_file",
            description="Write file contents (requires justice approval)",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string"},
                    "content": {"type": "string"}
                },
                "required": ["path", "content"]
            }
        ),
        Tool(
            name="list_directory",
            description="List directory contents (fox-spirit wisdom)",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "default": "."}
                }
            }
        ),
        Tool(
            name="hash_file",
            description="Get deterministic hash of file (for Rezflow cache)",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string"}
                },
                "required": ["path"]
            }
        )
    ]

def _validate_path(raw_path: str) -> Path:
    """CONSTITUTIONAL GATE: Path traversal protection"""
    target = (WORKSPACE_ROOT / raw_path).resolve()
    if not str(target).startswith(str(WORKSPACE_ROOT)):
        raise PermissionError("🦊 CONSTITUTIONAL VIOLATION: Path traversal attempt blocked (Article III)")
    return target

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> ToolResult:
    try:
        if name == "read_file":
            path = _validate_path(arguments["path"])
            if not path.exists():
                return ToolResult(error=f"File not found: {arguments['path']}")
            if path.stat().st_size > MAX_FILE_SIZE:
                return ToolResult(error=f"File too large (>10MB): {arguments['path']}")
            
            content = path.read_text(encoding="utf-8", errors="replace")
            
            # Generate deterministic hash for Rezflow
            content_hash = hashlib.sha3_512(content.encode()).hexdigest()[:16]
            
            return ToolResult(
                content=content,
                metadata={
                    "hash": content_hash,
                    "size": path.stat().st_size,
                    "modified": path.stat().st_mtime
                }
            )

        elif name == "write_file":
            path = _validate_path(arguments["path"])
            
            # CONSTITUTIONAL COUNCIL GATE (simulated - real council would deliberate)
            if arguments.get("_justice_approved") != "true":
                return ToolResult(
                    error="🦊 CONSTITUTIONAL BLOCK: Write requires justice approval. Run with --approve or use Sovereign Chat.",
                    consent_request={
                        "type": "justice_review",
                        "message": f"Write {len(arguments['content'])} chars to {arguments['path']}?",
                        "tool": name,
                        "args": arguments
                    }
                )
            
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(arguments["content"], encoding="utf-8")
            
            # Generate Rezflow artifact hash
            artifact_hash = hashlib.sha3_512(arguments["content"].encode()).hexdigest()[:16]
            
            return ToolResult(
                content=f"✅ Written {len(arguments['content'])} chars | Rezflow: {artifact_hash}",
                metadata={"hash": artifact_hash, "path": str(path.relative_to(WORKSPACE_ROOT))}
            )

        elif name == "list_directory":
            path = _validate_path(arguments.get("path", "."))
            if not path.is_dir():
                return ToolResult(error=f"Not a directory: {arguments.get('path', '.')}")
            
            entries = []
            for entry in path.iterdir():
                if entry.name.startswith(".") or entry.name == "__pycache__":
                    continue
                entries.append({
                    "name": entry.name,
                    "type": "directory" if entry.is_dir() else "file",
                    "size": entry.stat().st_size if entry.is_file() else 0,
                    "hash": hashlib.sha3_512(entry.name.encode()).hexdigest()[:8] if entry.is_file() else None
                })
            
            return ToolResult(content=json.dumps(entries, indent=2))

        elif name == "hash_file":
            path = _validate_path(arguments["path"])
            if not path.exists():
                return ToolResult(error=f"File not found: {arguments['path']}")
            
            content = path.read_bytes()
            file_hash = hashlib.sha3_512(content).hexdigest()
            
            return ToolResult(
                content=file_hash[:16],
                metadata={"full_hash": file_hash, "algorithm": "sha3-512"}
            )

    except Exception as e:
        return ToolResult(error=f"🦊 Fox-spirit error: {str(e)}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(server.run())
