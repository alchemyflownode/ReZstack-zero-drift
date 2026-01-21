import React, { useEffect, useState } from 'react';
import {
  FolderTree,
  FileCode,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronRight,
  Activity,
  Search,
  Filter,
  Brain,
  Zap
} from 'lucide-react';
import { useDependencyStore, FileUsage } from '../stores/dependency-store';

export const DependencyHealthPanel: React.FC = () => {
  const {
    files,
    health,
    isScanning,
    scanProgress,
    scanError,
    selectedFolder,
    startScan,
    scanFolder,
    setSelectedFolder,
    deleteUnusedFile
  } = useDependencyStore();
  
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['services']));
  const [filter, setFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Group files by folder
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.folder]) acc[file.folder] = [];
    acc[file.folder].push(file);
    return acc;
  }, {} as Record<string, FileUsage[]>);

  // Filter files
  const filterFiles = (files: FileUsage[]) => {
    return files.filter(f => {
      const matchesFilter = filter === 'all' || 
        (filter === 'used' && f.isUsed) || 
        (filter === 'unused' && !f.isUsed);
      const matchesSearch = !searchQuery || 
        f.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };

  const toggleFolder = (folder: string) => {
    const next = new Set(expandedFolders);
    if (next.has(folder)) {
      next.delete(folder);
    } else {
      next.add(folder);
    }
    setExpandedFolders(next);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return 'from-green-600/20 to-green-800/20 border-green-500/30';
    if (score >= 60) return 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/30';
    return 'from-red-600/20 to-red-800/20 border-red-500/30';
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="text-purple-400 mr-3" size={24} />
            <div>
              <h2 className="text-lg font-bold">WWCD: Dependency Health</h2>
              <p className="text-xs text-gray-400">What Would Claude Do? â€¢ File Usage Analysis</p>
            </div>
          </div>
          <button
            onClick={startScan}
            disabled={isScanning}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={16} className={`mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Project'}
          </button>
        </div>

        {/* Scan Progress */}
        {isScanning && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Analyzing files...</span>
              <span>{Math.round(scanProgress)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Health Score Card */}
      {health.lastScan && (
        <div className={`m-4 p-4 rounded-xl bg-gradient-to-r ${getHealthBg(health.healthScore)} border`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`text-4xl font-bold ${getHealthColor(health.healthScore)} mr-4`}>
                {health.healthScore}%
              </div>
              <div>
                <div className="text-sm font-medium">Project Health</div>
                <div className="text-xs text-gray-400">
                  Last scan: {(health.lastScan ? new Date(health.lastScan).toLocaleTimeString() : "")}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-100">{health.totalFiles}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{health.usedFiles}</div>
                <div className="text-xs text-gray-400">Used</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{health.unusedFiles}</div>
                <div className="text-xs text-gray-400">Unused</div>
              </div>
            </div>
          </div>

          {/* WWCD Insight */}
          {health.unusedFiles > 0 && (
            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="flex items-start">
                <Zap className="text-yellow-400 mr-2 mt-0.5" size={16} />
                <div>
                  <div className="text-sm font-medium text-yellow-400">ðŸ’­ Claude's Insight</div>
                  <p className="text-xs text-gray-300 mt-1">
                    Found {health.unusedFiles} unused file{health.unusedFiles > 1 ? 's' : ''}. 
                    Consider removing them to reduce bundle size and improve maintainability.
                    {health.healthScore < 70 && ' This codebase needs some cleanup!'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="px-4 pb-4 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex bg-gray-800/50 rounded-lg p-1">
          {(['all', 'used', 'unused'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                filter === f 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* File Tree */}
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(groupedFiles).map(([folder, folderFiles]) => {
          const filtered = filterFiles(folderFiles);
          const unusedCount = folderFiles.filter(f => !f.isUsed).length;
          const isExpanded = expandedFolders.has(folder);

          return (
            <div key={folder} className="border-t border-gray-800">
              {/* Folder Header */}
              <button
                onClick={() => toggleFolder(folder)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center">
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-gray-500 mr-2" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500 mr-2" />
                  )}
                  <FolderTree size={16} className="text-yellow-500 mr-2" />
                  <span className="font-medium">{folder}/</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({folderFiles.length} files)
                  </span>
                </div>
                {unusedCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-600/20 text-red-400 text-xs rounded-full">
                    {unusedCount} unused
                  </span>
                )}
              </button>

              {/* Files */}
              {isExpanded && (
                <div className="bg-gray-900/30">
                  {filtered.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No files match filter
                    </div>
                  ) : (
                    filtered.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        showDeleteConfirm={showDeleteConfirm === file.id}
                        onDeleteClick={() => setShowDeleteConfirm(file.id)}
                        onDeleteConfirm={() => {
                          deleteUnusedFile(file.id);
                          setShowDeleteConfirm(null);
                        }}
                        onDeleteCancel={() => setShowDeleteConfirm(null)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {files.length === 0 && !isScanning && (
          <div className="p-8 text-center text-gray-500">
            <Activity size={48} className="mx-auto mb-4 opacity-30" />
            <p>No scan results yet</p>
            <p className="text-sm">Click "Scan Project" to analyze dependencies</p>
          </div>
        )}
      </div>

      {/* Error */}
      {scanError && (
        <div className="m-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center text-red-400">
            <AlertTriangle size={16} className="mr-2" />
            <span>{scanError}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// File Row Component
interface FileRowProps {
  file: FileUsage;
  showDeleteConfirm: boolean;
  onDeleteClick: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

const FileRow: React.FC<FileRowProps> = ({
  file,
  showDeleteConfirm,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`border-b border-gray-800/50 ${!file.isUsed ? 'bg-red-900/10' : ''}`}>
      <div className="px-4 py-2 flex items-center justify-between hover:bg-gray-800/30">
        <div className="flex items-center flex-1 min-w-0">
          <button onClick={() => setIsExpanded(!isExpanded)} className="mr-2">
            {isExpanded ? (
              <ChevronDown size={14} className="text-gray-500" />
            ) : (
              <ChevronRight size={14} className="text-gray-500" />
            )}
          </button>
          
          <FileCode size={14} className={file.isUsed ? 'text-blue-400' : 'text-red-400'} />
          
          <span className="ml-2 text-sm truncate">{file.name}.ts</span>
          
          {file.isUsed ? (
            <CheckCircle size={14} className="ml-2 text-green-400 flex-shrink-0" />
          ) : (
            <XCircle size={14} className="ml-2 text-red-400 flex-shrink-0" />
          )}
          
          {file.lineCount && (
            <span className="ml-2 text-xs text-gray-500">{file.lineCount} lines</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!file.isUsed && !showDeleteConfirm && (
            <button
              onClick={onDeleteClick}
              className="p-1 text-gray-500 hover:text-red-400 transition-colors"
              title="Delete unused file"
            >
              <Trash2 size={14} />
            </button>
          )}
          
          {showDeleteConfirm && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-400">Delete?</span>
              <button
                onClick={onDeleteConfirm}
                className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={onDeleteCancel}
                className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-8 py-2 bg-gray-900/50 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500">Imported by:</span>
              {file.importedBy.length > 0 ? (
                <ul className="mt-1 space-y-0.5">
                  {file.importedBy.map((imp, i) => (
                    <li key={i} className="text-green-400">â†’ {imp}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-400 mt-1">No imports found</p>
              )}
            </div>
            <div>
              <span className="text-gray-500">Path:</span>
              <p className="text-gray-400 mt-1 break-all">{file.path}</p>
            </div>
          </div>
          
          {!file.isUsed && (
            <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-600/30 rounded">
              <div className="flex items-center text-yellow-400">
                <Zap size={12} className="mr-1" />
                <span>ðŸ’­ Claude suggests: This file can be safely removed or needs integration</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DependencyHealthPanel;


