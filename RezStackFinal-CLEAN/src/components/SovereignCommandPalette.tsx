// src/components/SovereignCommandPalette.tsx
import React, { useState } from 'react';
import { 
  Terminal, Shield, Brain, Zap, Book, Code, 
  ChevronRight, ChevronDown, Search, Star, Sparkles,
  AlertTriangle, CheckCircle, Award, Target
} from 'lucide-react';

interface Command {
  id: string;
  category: 'filesystem' | 'security' | 'constitutional' | 'system' | 'learning';
  command: string;
  description: string;
  example: string;
  output: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  vibePoints: number;
}

export const SovereignCommandPalette: React.FC<{ 
  onExecute: (cmd: string) => void;
  className?: string;
}> = ({ onExecute, className = '' }) => {
  const [expandedCategory, setExpandedCategory] = useState<string>('learning');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const commands: Command[] = [
    // ===== FILESYSTEM =====
    {
      id: 'ls',
      category: 'filesystem',
      command: 'ls',
      description: 'List all files and folders',
      example: 'ls -la',
      output: '📁 src/  📁 public/  📄 package.json',
      difficulty: 'beginner',
      tags: ['navigate', 'explore'],
      vibePoints: 10
    },
    {
      id: 'cd',
      category: 'filesystem',
      command: 'cd <folder>',
      description: 'Change directory',
      example: 'cd src/views',
      output: '📂 ~/src/views',
      difficulty: 'beginner',
      tags: ['navigate', 'move'],
      vibePoints: 10
    },
    {
      id: 'cat',
      category: 'filesystem',
      command: 'cat <file>',
      description: 'View file contents',
      example: 'cat package.json',
      output: '{\n  "name": "sovereign-app"\n}',
      difficulty: 'beginner',
      tags: ['read', 'view'],
      vibePoints: 15
    },
    {
      id: 'grep',
      category: 'filesystem',
      command: 'grep <text>',
      description: 'Search inside files',
      example: 'grep "TODO"',
      output: 'src/views/ChatView.tsx:42 // TODO: Add error handling',
      difficulty: 'advanced',
      tags: ['search', 'pattern'],
      vibePoints: 40
    },

    // ===== SECURITY =====
    {
      id: 'scan',
      category: 'security',
      command: 'scan',
      description: 'Full security audit',
      example: 'scan',
      output: '✅ Issues: 855\n   Critical: 12\n   Fixable: 855',
      difficulty: 'beginner',
      tags: ['audit', 'security'],
      vibePoints: 50
    },
    {
      id: 'scan-critical',
      category: 'security',
      command: 'scan --critical',
      description: 'Show only critical issues',
      example: 'scan --critical',
      output: '🔴 CRITICAL: 12 issues',
      difficulty: 'intermediate',
      tags: ['filter', 'prioritize'],
      vibePoints: 45
    },
    {
      id: 'fix',
      category: 'security',
      command: 'fix',
      description: 'Auto-heal all fixable issues',
      example: 'fix',
      output: '✅ Fixed 855 issues!',
      difficulty: 'beginner',
      tags: ['heal', 'repair'],
      vibePoints: 100
    },
    {
      id: 'audit',
      category: 'security',
      command: 'audit',
      description: 'Dependency vulnerability scan',
      example: 'audit',
      output: '📦 found 0 vulnerabilities',
      difficulty: 'intermediate',
      tags: ['dependencies', 'npm'],
      vibePoints: 55
    },

    // ===== CONSTITUTIONAL =====
    {
      id: 'check',
      category: 'constitutional',
      command: 'check',
      description: 'Constitutional compliance audit',
      example: 'check',
      output: '⚖️ Score: 64%\n   Violations: 132',
      difficulty: 'beginner',
      tags: ['compliance', 'standards'],
      vibePoints: 60
    },
    {
      id: 'fix-any',
      category: 'constitutional',
      command: 'fix-any',
      description: 'Replace `any` with `unknown`',
      example: 'fix-any',
      output: '✅ Fixed 45 `any` types',
      difficulty: 'intermediate',
      tags: ['typescript', 'type-safety'],
      vibePoints: 65
    },
    {
      id: 'fix-console',
      category: 'constitutional',
      command: 'fix-console',
      description: 'Comment out console.log',
      example: 'fix-console',
      output: '✅ Commented 87 console.log',
      difficulty: 'intermediate',
      tags: ['debug', 'cleanup'],
      vibePoints: 50
    },

    // ===== SYSTEM =====
    {
      id: 'sys-npm-audit',
      category: 'system',
      command: 'sys npm audit',
      description: 'Run npm security audit',
      example: 'sys npm audit --production',
      output: '⚖️ Council: APPROVED\n   found 0 vulnerabilities',
      difficulty: 'intermediate',
      tags: ['npm', 'dependencies'],
      vibePoints: 45
    },
    {
      id: 'sys-npm-install',
      category: 'system',
      command: 'sys npm install',
      description: 'Install packages',
      example: 'sys npm install react-router-dom',
      output: '⚖️ Council: APPROVED (4/5)',
      difficulty: 'advanced',
      tags: ['npm', 'packages'],
      vibePoints: 60
    },

    // ===== LEARNING =====
    {
      id: 'learn-basics',
      category: 'learning',
      command: 'learn basics',
      description: 'Filesystem navigation tutorial',
      example: 'learn basics',
      output: '📘 MODULE 1: Navigation\n   1. ls\n   2. cd\n   3. pwd',
      difficulty: 'beginner',
      tags: ['tutorial', 'interactive'],
      vibePoints: 100
    },
    {
      id: 'learn-security',
      category: 'learning',
      command: 'learn security',
      description: 'Security vulnerabilities workshop',
      example: 'learn security',
      output: '🛡️ MODULE 2: Command Injection',
      difficulty: 'intermediate',
      tags: ['tutorial', 'security'],
      vibePoints: 150
    },
    {
      id: 'challenge',
      category: 'learning',
      command: 'challenge',
      description: 'Daily vibe coding challenge',
      example: 'challenge',
      output: '🏆 Today: Fix 3 command injections',
      difficulty: 'advanced',
      tags: ['challenge', 'practice'],
      vibePoints: 200
    },
    {
      id: 'tip',
      category: 'learning',
      command: 'tip',
      description: 'Random vibe coding pro tip',
      example: 'tip',
      output: '💡 Use scan --critical to prioritize!',
      difficulty: 'beginner',
      tags: ['tip', 'learn'],
      vibePoints: 25
    },
    {
      id: 'roadmap',
      category: 'learning',
      command: 'roadmap',
      description: 'Your path to sovereign developer',
      example: 'roadmap',
      output: '🗺️ Beginner → Intermediate → Advanced → Sovereign',
      difficulty: 'beginner',
      tags: ['path', 'learning'],
      vibePoints: 75
    }
  ];

  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = searchTerm === '' || 
      cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.tags.some(t => t.includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === 'all' || cmd.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const categories = {
    filesystem: { icon: <Terminal className="w-4 h-4" />, name: '📁 Filesystem', color: 'blue' },
    security: { icon: <Shield className="w-4 h-4" />, name: '🛡️ Security', color: 'red' },
    constitutional: { icon: <Brain className="w-4 h-4" />, name: '⚖️ Constitutional', color: 'purple' },
    system: { icon: <Zap className="w-4 h-4" />, name: '🔧 System', color: 'yellow' },
    learning: { icon: <Book className="w-4 h-4" />, name: '📘 Learning', color: 'green' }
  };

  return (
    <div className={`h-full flex flex-col bg-[#0a0a0f]/90 backdrop-blur-2xl border-r border-white/10 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="font-bold text-sm text-white">SOVEREIGN COMMANDS</h2>
          <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-full text-purple-300 ml-auto">
            v3.5
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search commands..."
            className="w-full bg-black/50 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-1 mt-3">
          {['all', 'beginner', 'intermediate', 'advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                selectedDifficulty === diff
                  ? diff === 'all' ? 'bg-purple-600 text-white' :
                    diff === 'beginner' ? 'bg-green-600 text-white' :
                    diff === 'intermediate' ? 'bg-yellow-600 text-white' :
                    'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {diff === 'all' ? 'ALL' : diff.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Command List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(categories).map(([key, category]) => {
          const categoryCommands = filteredCommands.filter(c => c.category === key);
          if (categoryCommands.length === 0) return null;

          return (
            <div key={key} className="space-y-2">
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(expandedCategory === key ? '' : key)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-${category.color}-400`}>{category.icon}</span>
                  <span className="text-xs font-semibold text-gray-300">{category.name}</span>
                  <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400">
                    {categoryCommands.length}
                  </span>
                </div>
                {expandedCategory === key ? (
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                )}
              </button>

              {/* Commands */}
              {expandedCategory === key && (
                <div className="space-y-2 ml-2">
                  {categoryCommands.map((cmd) => (
                    <div
                      key={cmd.id}
                      className="group relative bg-black/40 rounded-lg p-3 border border-white/5 hover:border-purple-500/50 transition-all cursor-pointer"
                      onClick={() => onExecute(cmd.command)}
                    >
                      {/* Difficulty Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          cmd.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          cmd.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {cmd.difficulty}
                        </span>
                      </div>

                      {/* Command */}
                      <div className="font-mono text-xs text-purple-400 mb-1">
                        $ {cmd.command}
                      </div>

                      {/* Description */}
                      <div className="text-[11px] text-gray-400 mb-2">
                        {cmd.description}
                      </div>

                      {/* Example */}
                      <div className="bg-black/60 rounded p-2 mb-2">
                        <div className="text-[10px] text-gray-500 mb-1">Example:</div>
                        <code className="text-[10px] text-yellow-400">{cmd.example}</code>
                        <div className="text-[10px] text-gray-600 mt-1">{cmd.output}</div>
                      </div>

                      {/* Tags & Vibe Points */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {cmd.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-[10px] text-yellow-500">{cmd.vibePoints}</span>
                        </div>
                      </div>

                      {/* Hover Execute */}
                      <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                          <Terminal className="w-3 h-3" />
                          Execute
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer - Vibe Stats */}
      <div className="p-4 border-t border-white/10 bg-black/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-white">Your Vibe Journey</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-purple-400">Level 7 • 2,450 XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">Beginner</span>
            <span className="text-gray-500">→ Sovereign</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-gradient-to-r from-purple-600 to-yellow-500 rounded-full" />
          </div>
        </div>

        {/* Quick Tip */}
        <div className="mt-3 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-start gap-2">
            <Sparkles className="w-3 h-3 text-purple-400 mt-0.5" />
            <div>
              <span className="text-[10px] font-medium text-purple-400">Daily Vibe Tip</span>
              <p className="text-[9px] text-gray-500 mt-0.5">
                Use `scan --critical` to focus on high-risk vulnerabilities first!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};