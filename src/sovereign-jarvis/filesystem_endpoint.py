# Add to main.py - Filesystem endpoints
class FileRequest(BaseModel):
    action: str
    path: str = "."
    filename: Optional[str] = None

@app.post("/api/jarvis/file")
async def file_operation(request: FileRequest):
    """REAL filesystem operations - connected to your PC"""
    import os
    from pathlib import Path
    
    WORKSPACE_ROOT = Path("G:/okiru/app builder/RezStackFinal2/RezStackFinal").resolve()
    
    try:
        # Resolve path safely
        if request.path == ".":
            base_path = WORKSPACE_ROOT
        else:
            base_path = (WORKSPACE_ROOT / request.path).resolve()
            if not str(base_path).startswith(str(WORKSPACE_ROOT)):
                return {"status": "error", "message": "Access denied"}
        
        if not base_path.exists():
            return {"status": "error", "message": "Path not found"}
        
        if request.action == "list":
            items = []
            for item in base_path.iterdir():
                if item.name.startswith('.'):
                    continue
                items.append({
                    "name": item.name,
                    "type": "directory" if item.is_dir() else "file",
                    "size": item.stat().st_size if item.is_file() else 0,
                    "modified": item.stat().st_mtime
                })
            return {
                "status": "success",
                "path": str(base_path.relative_to(WORKSPACE_ROOT)) if base_path != WORKSPACE_ROOT else ".",
                "items": items,
                "count": len(items)
            }
        
        elif request.action == "read":
            if not request.filename:
                return {"status": "error", "message": "Filename required"}
            file_path = base_path / request.filename
            if not file_path.exists():
                return {"status": "error", "message": "File not found"}
            if file_path.is_dir():
                return {"status": "error", "message": "Cannot read directory"}
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            return {
                "status": "success",
                "filename": request.filename,
                "path": str(file_path.relative_to(WORKSPACE_ROOT)),
                "content": content,
                "size": file_path.stat().st_size,
                "lines": len(content.split('\n'))
            }
        
        return {"status": "error", "message": f"Unknown action: {request.action}"}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}
