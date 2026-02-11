#!/usr/bin/env python3
"""
Update imports to use new structure
"""
import os
import re

def update_file(filepath):
    """Update imports in a Python file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update import patterns
    patterns = [
        (r'from src\.constitutional', r'from rezstack.constitutional_core'),
        (r'from constitutional_', r'from rezstack.constitutional_core.'),
        (r'import constitutional_', r'from rezstack.constitutional_core import '),
    ]
    
    updated = content
    for pattern, replacement in patterns:
        updated = re.sub(pattern, replacement, updated)
    
    if updated != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated)
        return True
    return False

# Update key files
files_to_update = [
    'quick_test.py',
    'run_rezstack.py',
    'test_rezstack.py'
]

for file in files_to_update:
    if os.path.exists(file):
        if update_file(file):
            print(f'✅ Updated: {file}')
        else:
            print(f'⚠️  No changes needed: {file}')
