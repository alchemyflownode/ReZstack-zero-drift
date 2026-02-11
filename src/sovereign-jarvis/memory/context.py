"""
Sovereign JARVIS Memory System

Git-based memory with SQLite indexing for fast context retrieval.
All state is derived from Git history — no external state management.
"""

import sqlite3
import subprocess
import json
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional, Tuple, Iterator
from dataclasses import dataclass
from contextlib import contextmanager
import re


@dataclass
class GitCommit:
    """Represents a Git commit"""
    hash: str
    author: str
    email: str
    date: datetime
    message: str
    files_changed: List[str]
    insertions: int
    deletions: int
    
    @property
    def short_hash(self) -> str:
        return self.hash[:7]


@dataclass
class TODOItem:
    """A TODO item found in code"""
    file: str
    line: int
    text: str
    author: str
    date: datetime
    commit_hash: str
    
    @property
    def id(self) -> str:
        return f"todo_{self.commit_hash}_{self.line}"


@dataclass
class CodePattern:
    """A detected pattern in the codebase"""
    pattern_type: str
    file: str
    line: int
    context: str
    confidence: str  # "high", "medium", "low"
    last_modified: datetime


class GitMemory:
    """
    Git-based memory system
    
    All knowledge is derived from Git history — no stateful memory.
    This ensures reproducibility and sovereignty.
    """
    
    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path).resolve()
        self._validate_repo()
    
    def _validate_repo(self):
        """Ensure we're in a valid Git repository"""
        git_dir = self.repo_path / ".git"
        if not git_dir.exists():
            raise ValueError(f"Not a Git repository: {self.repo_path}")
    
    def _run_git(self, args: List[str], check: bool = True) -> subprocess.CompletedProcess:
        """Run a Git command"""
        cmd = ["git", "-C", str(self.repo_path)] + args
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=check
        )
        return result
    
    def get_recent_commits(self, since: str = "7.days.ago", max_count: int = 100) -> List[GitCommit]:
        """
        Get recent commits with detailed info
        
        Args:
            since: Git date format (e.g., "7.days.ago", "2024-01-01")
            max_count: Maximum number of commits to return
        """
        # Format: hash|author|email|date|message|files|insertions|deletions
        format_str = "%H|%an|%ae|%ai|%s|%d"
        
        result = self._run_git([
            "log",
            f"--since={since}",
            f"--max-count={max_count}",
            f"--format={format_str}",
            "--shortstat"
        ])
        
        commits = []
        lines = result.stdout.strip().split("\n")
        
        i = 0
        while i < len(lines):
            line = lines[i]
            if "|" not in line:
                i += 1
                continue
            
            parts = line.split("|")
            if len(parts) >= 5:
                commit_hash = parts[0]
                author = parts[1]
                email = parts[2]
                date_str = parts[3]
                message = parts[4]
                
                # Parse date
                try:
                    date = datetime.fromisoformat(date_str.replace(" ", "T"))
                except:
                    date = datetime.now()
                
                # Get stats from next line if available
                files_changed = []
                insertions = 0
                deletions = 0
                
                if i + 1 < len(lines):
                    stat_line = lines[i + 1]
                    # Parse shortstat: "X files changed, Y insertions(+), Z deletions(-)"
                    files_match = re.search(r'(\d+) file', stat_line)
                    if files_match:
                        files_changed = [f"file_{j}" for j in range(int(files_match.group(1)))]
                    
                    insert_match = re.search(r'(\d+) insertion', stat_line)
                    if insert_match:
                        insertions = int(insert_match.group(1))
                    
                    delete_match = re.search(r'(\d+) deletion', stat_line)
                    if delete_match:
                        deletions = int(delete_match.group(1))
                    
                    i += 1
                
                commits.append(GitCommit(
                    hash=commit_hash,
                    author=author,
                    email=email,
                    date=date,
                    message=message,
                    files_changed=files_changed,
                    insertions=insertions,
                    deletions=deletions
                ))
            
            i += 1
        
        return commits
    
    def scan_for_todos(self, since: str = "30.days.ago") -> List[TODOItem]:
        """
        Scan Git history for TODO comments
        
        Args:
            since: How far back to search
        """
        todos = []
        
        # Get all commits that might contain TODOs
        result = self._run_git([
            "log",
            f"--since={since}",
            "--format=%H|%an|%ae|%ai|%s",
            "-p",  # Show patches
            "--grep=TODO",
            "--all"
        ], check=False)
        
        # Also search content for TODOs
        content_result = self._run_git([
            "grep",
            "-n",
            "-i",
            "TODO:",
            "--include=*.py",
            "--include=*.js",
            "--include=*.ts",
            "--include=*.md"
        ], check=False)
        
        if content_result.returncode == 0:
            for line in content_result.stdout.strip().split("\n"):
                if ":" in line:
                    parts = line.split(":", 2)
                    if len(parts) >= 3:
                        file_path = parts[0]
                        line_num = int(parts[1])
                        todo_text = parts[2].strip()
                        
                        # Get blame info for this line
                        blame_result = self._run_git([
                            "blame",
                            "-L", f"{line_num},{line_num}",
                            "--format=%H|%an|%ae|%ai",
                            file_path
                        ], check=False)
                        
                        author = "unknown"
                        email = ""
                        date = datetime.now()
                        commit_hash = "unknown"
                        
                        if blame_result.returncode == 0:
                            blame_parts = blame_result.stdout.strip().split("|")
                            if len(blame_parts) >= 4:
                                commit_hash = blame_parts[0].split()[0]
                                author = blame_parts[1]
                                email = blame_parts[2]
                                try:
                                    date = datetime.fromisoformat(blame_parts[3].replace(" ", "T"))
                                except:
                                    pass
                        
                        todos.append(TODOItem(
                            file=file_path,
                            line=line_num,
                            text=todo_text,
                            author=author,
                            date=date,
                            commit_hash=commit_hash
                        ))
        
        return todos
    
    def get_changed_files(self, since: str = "3.days.ago", path_filter: str = None) -> List[str]:
        """Get list of files changed since a given time"""
        args = [
            "diff",
            f"--since={since}",
            "--name-only",
            "HEAD"
        ]
        
        result = self._run_git(args, check=False)
        
        files = []
        if result.returncode == 0:
            for line in result.stdout.strip().split("\n"):
                if line:
                    if path_filter is None or path_filter in line:
                        files.append(line)
        
        return files
    
    def get_unchanged_files(self, since: str = "3.days.ago", path_filter: str = None) -> List[str]:
        """Get files in a path that haven't been modified recently"""
        # Get all files in the path
        all_files_result = self._run_git([
            "ls-files",
            path_filter or "."
        ])
        
        all_files = all_files_result.stdout.strip().split("\n") if all_files_result.returncode == 0 else []
        
        # Get recently changed files
        changed = set(self.get_changed_files(since, path_filter))
        
        # Return files not in changed set
        return [f for f in all_files if f not in changed and f]
    
    def get_file_content_at(self, filepath: str, commit: str = "HEAD") -> Optional[str]:
        """Get file content at a specific commit"""
        result = self._run_git([
            "show",
            f"{commit}:{filepath}"
        ], check=False)
        
        if result.returncode == 0:
            return result.stdout
        return None
    
    def has_recent_commit_for(self, filepath: str, since: str = "7.days.ago") -> bool:
        """Check if a file has been modified recently"""
        result = self._run_git([
            "log",
            f"--since={since}",
            "--oneline",
            "--",
            filepath
        ])
        
        return len(result.stdout.strip()) > 0


class ContextDatabase:
    """
    SQLite index of Git history for fast context retrieval
    
    This is a derived index — the source of truth remains Git.
    The database can be rebuilt at any time from Git history.
    """
    
    def __init__(self, db_path: str = "~/.sovereign-jarvis/memory/context.db"):
        self.db_path = Path(db_path).expanduser()
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()
    
    @contextmanager
    def _get_connection(self):
        """Get database connection with proper cleanup"""
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()
    
    def _init_db(self):
        """Initialize database schema"""
        with self._get_connection() as conn:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS commits (
                    hash TEXT PRIMARY KEY,
                    short_hash TEXT,
                    author TEXT,
                    email TEXT,
                    date TIMESTAMP,
                    message TEXT,
                    insertions INTEGER DEFAULT 0,
                    deletions INTEGER DEFAULT 0,
                    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS commit_files (
                    commit_hash TEXT,
                    file_path TEXT,
                    change_type TEXT,  -- added, modified, deleted
                    PRIMARY KEY (commit_hash, file_path),
                    FOREIGN KEY (commit_hash) REFERENCES commits(hash)
                );
                
                CREATE TABLE IF NOT EXISTS todos (
                    id TEXT PRIMARY KEY,
                    file_path TEXT,
                    line_number INTEGER,
                    text TEXT,
                    author TEXT,
                    date TIMESTAMP,
                    commit_hash TEXT,
                    status TEXT DEFAULT 'open',  -- open, in_progress, done, wontfix
                    FOREIGN KEY (commit_hash) REFERENCES commits(hash)
                );
                
                CREATE TABLE IF NOT EXISTS patterns (
                    id TEXT PRIMARY KEY,
                    pattern_type TEXT,
                    file_path TEXT,
                    line_number INTEGER,
                    context TEXT,
                    confidence TEXT,
                    detected_at TIMESTAMP,
                    last_seen TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_commits_date ON commits(date);
                CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
                CREATE INDEX IF NOT EXISTS idx_patterns_type ON patterns(pattern_type);
            """)
            conn.commit()
    
    def index_commits(self, git_memory: GitMemory, since: str = "30.days.ago"):
        """Index recent commits from Git into SQLite"""
        commits = git_memory.get_recent_commits(since)
        
        with self._get_connection() as conn:
            for commit in commits:
                conn.execute("""
                    INSERT OR REPLACE INTO commits 
                    (hash, short_hash, author, email, date, message, insertions, deletions)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    commit.hash, commit.short_hash, commit.author,
                    commit.email, commit.date, commit.message,
                    commit.insertions, commit.deletions
                ))
                
                for file_path in commit.files_changed:
                    conn.execute("""
                        INSERT OR REPLACE INTO commit_files
                        (commit_hash, file_path, change_type)
                        VALUES (?, ?, ?)
                    """, (commit.hash, file_path, "modified"))
            
            conn.commit()
    
    def index_todos(self, git_memory: GitMemory, since: str = "30.days.ago"):
        """Index TODO items from Git"""
        todos = git_memory.scan_for_todos(since)
        
        with self._get_connection() as conn:
            for todo in todos:
                conn.execute("""
                    INSERT OR REPLACE INTO todos
                    (id, file_path, line_number, text, author, date, commit_hash)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    todo.id, todo.file, todo.line, todo.text,
                    todo.author, todo.date, todo.commit_hash
                ))
            
            conn.commit()
    
    def get_open_todos(self, older_than_days: int = 7) -> List[Dict]:
        """Get TODOs that haven't been addressed recently"""
        cutoff = datetime.now() - timedelta(days=older_than_days)
        
        with self._get_connection() as conn:
            cursor = conn.execute("""
                SELECT * FROM todos 
                WHERE status = 'open' AND date < ?
                ORDER BY date ASC
            """, (cutoff,))
            
            return [dict(row) for row in cursor.fetchall()]
    
    def get_recent_activity(self, days: int = 7) -> Dict:
        """Get summary of recent repository activity"""
        since = datetime.now() - timedelta(days=days)
        
        with self._get_connection() as conn:
            # Commit count
            cursor = conn.execute(
                "SELECT COUNT(*) FROM commits WHERE date > ?",
                (since,)
            )
            commit_count = cursor.fetchone()[0]
            
            # Files changed
            cursor = conn.execute("""
                SELECT COUNT(DISTINCT file_path) FROM commit_files
                WHERE commit_hash IN (SELECT hash FROM commits WHERE date > ?)
            """, (since,))
            files_changed = cursor.fetchone()[0]
            
            # Open TODOs
            cursor = conn.execute("SELECT COUNT(*) FROM todos WHERE status = 'open'")
            open_todos = cursor.fetchone()[0]
            
            # Top contributors
            cursor = conn.execute("""
                SELECT author, COUNT(*) as count FROM commits
                WHERE date > ?
                GROUP BY author
                ORDER BY count DESC
                LIMIT 5
            """, (since,))
            contributors = [dict(row) for row in cursor.fetchall()]
            
            return {
                "commits": commit_count,
                "files_changed": files_changed,
                "open_todos": open_todos,
                "contributors": contributors,
                "period_days": days
            }
    
    def update_todo_status(self, todo_id: str, status: str):
        """Update the status of a TODO item"""
        with self._get_connection() as conn:
            conn.execute(
                "UPDATE todos SET status = ? WHERE id = ?",
                (status, todo_id)
            )
            conn.commit()


class MemoryManager:
    """
    Unified interface to JARVIS memory
    
    Combines Git-based storage with SQLite indexing for optimal performance.
    """
    
    def __init__(self, repo_path: str = ".", db_path: str = "~/.sovereign-jarvis/memory/context.db"):
        self.git = GitMemory(repo_path)
        self.db = ContextDatabase(db_path)
    
    def sync(self, since: str = "30.days.ago"):
        """Sync Git history to SQLite index"""
        self.db.index_commits(self.git, since)
        self.db.index_todos(self.git, since)
    
    def get_context(self) -> Dict:
        """Get current context for decision making"""
        return {
            "recent_commits": len(self.git.get_recent_commits("7.days.ago")),
            "open_todos": len(self.db.get_open_todos()),
            "activity": self.db.get_recent_activity(7)
        }
    
    def find_opportunities(self) -> List[Dict]:
        """Find potential tasks based on repository patterns"""
        opportunities = []
        
        # Stale TODOs
        stale_todos = self.db.get_open_todos(older_than_days=7)
        for todo in stale_todos:
            opportunities.append({
                "type": "stale_todo",
                "id": todo["id"],
                "description": f"Implement: {todo['text']}",
                "file": todo["file_path"],
                "line": todo["line_number"],
                "confidence": "high",
                "requires_approval": True
            })
        
        # Documentation drift
        src_changed = self.git.get_changed_files("7.days.ago", "src/")
        docs_unchanged = self.git.get_unchanged_files("7.days.ago", "docs/")
        
        if src_changed and docs_unchanged:
            opportunities.append({
                "type": "doc_drift",
                "id": "doc_drift_001",
                "description": "Update documentation to reflect recent code changes",
                "files_changed": len(src_changed),
                "confidence": "medium",
                "requires_approval": True
            })
        
        return opportunities
