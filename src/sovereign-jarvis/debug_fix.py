# Add this debug block to your fix handler in main.py

@app.post("/api/jarvis/enhance")
async def jarvis_enhance(request: EnhanceRequest):
    if request.command == "fix":
        print("\n" + "="*70)
        print("🔧 FIX COMMAND DEBUG")
        print("="*70)
        print(f"Workspace: {request.workspace}")
        print(f"Path: {request.path}")
        
        scan = await jarvis_enhance(EnhanceRequest(command="scan", workspace=request.workspace))
        fixable = [i for i in scan["issues"] if i.get("fixable", False)]
        
        print(f"\n📊 Fixable issues: {len(fixable)}")
        
        fixed = 0
        failed = 0
        
        for i, issue in enumerate(fixable[:10]):  # Debug first 10 only
            print(f"\n--- Issue {i+1} ---")
            print(f"Type: {issue.get('type')}")
            print(f"File: {issue.get('file')}")
            print(f"Line: {issue.get('line')}")
            print(f"Full path: {issue.get('full_path', 'NOT PROVIDED')}")
            
            try:
                # Check if file exists
                file_path = Path(issue.get('full_path', issue['file']))
                if not file_path.is_absolute():
                    file_path = Path(request.workspace) / issue['file']
                
                print(f"Resolved path: {file_path}")
                print(f"File exists: {file_path.exists()}")
                
                if file_path.exists():
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                    print(f"File lines: {len(lines)}")
                    
                    # Check if line number is valid
                    line_idx = issue['line'] - 1
                    print(f"Line index: {line_idx}")
                    print(f"Line content: {lines[line_idx].strip() if 0 <= line_idx < len(lines) else 'INVALID'}")
                    
            except Exception as e:
                print(f"ERROR: {e}")
        
        print("\n" + "="*70)
        
        # Now run actual fix
        # ... rest of fix logic
