import os
import subprocess
from pathlib import Path
from typing import Callable, List, Literal
from dataclasses import dataclass

@dataclass(frozen=True)
class ConstitutionalRule:
    id: str
    domain: Literal["code_implementation", "documentation", "dependency_management", "test_automation", "diagnostics"]
    enforcement: Callable[[str, Path], bool]
    description: str

def _is_git_tracked(path: Path) -> bool:
    """Check if file or directory is Git-tracked."""
    try:
        # For directories (scan operations), allow scanning if it's the workspace
        if path.is_dir():
            return True  # Allow scanning directories
        
        # For files, check if they're in Git
        result = subprocess.run(
            ["git", "ls-files", "--error-unmatch", str(path)],
            cwd=path.parent,
            capture_output=True,
            text=True
        )
        return result.returncode == 0
    except:
        return False

def _is_in_git_workspace(path: Path) -> bool:
    """Check if path is within a Git workspace."""
    try:
        current = path
        while current != current.parent:
            if (current / ".git").exists():
                return True
            current = current.parent
        return False
    except:
        return False

def _no_credential_paths(path: Path) -> bool:
    """Block credential-related paths."""
    blocked_keywords = ["password", "secret", "key", "credential", "token", ".env", "config", "auth"]
    path_str = str(path).lower()
    return not any(keyword in path_str for keyword in blocked_keywords)

# --- Rule Definitions ---
def git_001_enforcement(action: str, target: Path) -> bool:
    """git-001: Only operate on Git-tracked content."""
    if action in ["scan", "status", "audit"]:
        # Read operations are allowed on any Git workspace content
        return _is_in_git_workspace(target)
    
    # Write operations require exact Git tracking
    return _is_git_tracked(target)

def domain_001_enforcement(action: str, target: Path) -> bool:
    """domain-001: Never touch credential storage."""
    return _no_credential_paths(target)

def scan_001_enforcement(action: str, target: Path) -> bool:
    """scan-001: Scan only allowed for diagnostics domain."""
    if action == "scan":
        # Only scan files/directories in the workspace
        workspace = Path.cwd()
        try:
            # Resolve relative to workspace
            return target.resolve().is_relative_to(workspace.resolve())
        except:
            return False
    return True

# --- Constitutional Rules ---
RULES = [
    ConstitutionalRule(
        id="git-001",
        domain="code_implementation",
        enforcement=git_001_enforcement,
        description="Only operate on Git-tracked content"
    ),
    ConstitutionalRule(
        id="domain-001", 
        domain="code_implementation",
        enforcement=domain_001_enforcement,
        description="Never touch credential storage"
    ),
    ConstitutionalRule(
        id="scan-001",
        domain="diagnostics",
        enforcement=scan_001_enforcement,
        description="Scan only within workspace boundaries"
    ),
]

def enforce_constitution(action: str, target_path: Path) -> None:
    """Enforce all constitutional rules."""
    violations = []
    target_path = target_path.resolve()
    
    for rule in RULES:
        if not rule.enforcement(action, target_path):
            violations.append(f"[{rule.id}] Action '{action}' on '{target_path}' violates constitutional domain '{rule.domain}'")
    
    if violations:
        from .exceptions import ConstitutionalViolation
        raise ConstitutionalViolation("\n".join(violations))

def get_constitution() -> List[ConstitutionalRule]:
    """Return all constitutional rules."""
    return RULES
