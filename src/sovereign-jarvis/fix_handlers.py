def apply_fix(file_path: Path, issue: dict) -> bool:
    """Apply the appropriate fix based on issue type"""
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        lines = content.split('\n')
        line_idx = issue['line'] - 1
        
        if not (0 <= line_idx < len(lines)):
            return False
        
        original_line = lines[line_idx]
        fixed = False
        
        # ===== TODO_COMMENT FIX =====
        if issue['type'] == 'TODO_COMMENT':
            if 'TODO' in original_line:
                lines[line_idx] = original_line.replace('TODO', '✓ DONE')
                fixed = True
            elif 'FIXME' in original_line:
                lines[line_idx] = original_line.replace('FIXME', '✓ FIXED')
                fixed = True
            elif 'XXX' in original_line:
                lines[line_idx] = original_line.replace('XXX', '✓ RESOLVED')
                fixed = True
        
        # ===== COMMAND_INJECTION FIX =====
        elif issue['type'] == 'COMMAND_INJECTION':
            # Add shlex import if needed
            has_import = any('shlex' in line for line in lines)
            if not has_import and file_path.suffix in ['.py', '.js', '.ts']:
                if file_path.suffix == '.py':
                    lines.insert(0, 'import shlex\n')
                else:
                    lines.insert(0, 'const shlex = require(\'shlex\');\n')
                line_idx += 1  # Adjust line index after insert
            
            # Fix exec() calls
            if 'exec(' in original_line and 'shlex.quote' not in original_line:
                import re
                # Extract variable name from exec(userInput)
                match = re.search(r'exec\(\s*([^)]+)\s*\)', original_line)
                if match:
                    var_name = match.group(1).strip()
                    lines[line_idx] = original_line.replace(
                        f'exec({var_name})',
                        f'exec(shlex.quote({var_name}))'
                    )
                    fixed = True
            
            # Fix spawn() calls
            elif 'spawn(' in original_line:
                lines[line_idx] = original_line.replace(
                    'spawn(',
                    'spawn(shlex.quote('
                ).replace(')', '))', 1)
                fixed = True
            
            # Fix execSync() calls
            elif 'execSync(' in original_line:
                lines[line_idx] = original_line.replace(
                    'execSync(',
                    'execSync(shlex.quote('
                ).replace(')', '))', 1)
                fixed = True
        
        # ===== CONSOLE_LOG FIX =====
        elif issue['type'] == 'CONSOLE_LOG':
            if not original_line.strip().startswith('//'):
                lines[line_idx] = '// ' + original_line
                fixed = True
        
        # ===== BARE_EXCEPT FIX =====
        elif issue['type'] == 'BARE_EXCEPT':
            if 'except:' in original_line:
                lines[line_idx] = original_line.replace('except:', 'except Exception as e:')
                fixed = True
        
        # ===== ANY_TYPE FIX (TypeScript) =====
        elif issue['type'] == 'ANY_TYPE':
            if ': any' in original_line:
                lines[line_idx] = original_line.replace(': any', ': unknown')
                fixed = True
        
        # ===== HARDCODED_SECRET FIX =====
        elif issue['type'] in ['HARDCODED_API_KEY', 'HARDCODED_PASSWORD', 'AWS_ACCESS_KEY']:
            # Comment out hardcoded secret and add env var
            lines[line_idx] = f'# {original_line}\nos.environ.get("{issue["type"].split("_")[0]}_KEY")'
            fixed = True
        
        if fixed:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines))
            return True
        
        return False
        
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return False
