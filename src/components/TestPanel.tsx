// src/components/TestPanel.tsx
import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader } from 'lucide-react';
import { stressTest, TestResult } from '../tests/stress-test';

export const TestPanel: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    setRunning(true);
    setResults([]);
    const testResults = await stressTest.runAll();
    setResults(testResults);
    setRunning(false);
  };

  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 w-96 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">System Tests</h3>
        <button
          onClick={runTests}
          disabled={running}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded text-sm"
        >
          {running ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Tests
            </>
          )}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mb-3 text-sm">
          <div className={`font-semibold ${passed === total ? 'text-green-400' : 'text-yellow-400'}`}>
            {passed}/{total} passed
          </div>
        </div>
      )}

      <div className="space-y-2">
        {results.map((result, i) => (
          <div
            key={i}
            className={`p-2 rounded text-xs ${
              result.passed
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {result.passed ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 text-red-400" />
              )}
              <span className="font-medium text-white">{result.name}</span>
              <span className="ml-auto text-gray-400">{result.duration}ms</span>
            </div>
            <div className="text-gray-300 text-xs">{result.details}</div>
            {result.error && (
              <div className="text-red-400 text-xs mt-1">Error: {result.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
