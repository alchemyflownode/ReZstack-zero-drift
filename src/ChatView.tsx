      </main>

      {/* ============================================ */}
      {/* JARVIS TERMINAL - CORRECTLY PLACED HERE */}
      {/* ============================================ */}
      <div className="max-w-4xl mx-auto w-full px-6 mb-4">
        <div className="border border-purple-500/30 rounded-xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-purple-900/20 border-b border-purple-500/30">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono text-purple-300">JARVIS@constitutional:~$</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-500">ENHANCER READY</span>
            </div>
          </div>
          
          {/* Terminal Output - You'll need useState for this */}
          <div className="h-48 overflow-y-auto p-3 font-mono text-xs bg-gray-950/50" id="jarvis-terminal">
            <div className="text-purple-400 mb-1">╔════════════════════════════════════════╗</div>
            <div className="text-purple-400 mb-1">║     JARVIS APP ENHANCER v3.1          ║</div>
            <div className="text-purple-400 mb-3">╚════════════════════════════════════════╝</div>
            <div className="text-gray-400 mb-1">$ scan .</div>
            <div className="text-emerald-400 mb-2">✅ Scan complete: 112 files, 65 fixable issues</div>
            <div className="text-gray-400 mb-1">$ fix</div>
            <div className="text-emerald-400">✅ Fixed 65 issues • Backups created • Ready</div>
          </div>
          
          {/* Terminal Input */}
          <div className="flex items-center px-3 py-2 bg-gray-900/50 border-t border-purple-500/30">
            <span className="text-purple-400 mr-2 text-xs">$</span>
            <input
              type="text"
              id="jarvis-command"
              placeholder="Enter command (scan, fix, enhance, status)..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-gray-300 placeholder-gray-600"
              onKeyPress={async (e) => {
                if (e.key === 'Enter') {
                  const cmd = e.currentTarget.value;
                  e.currentTarget.value = '';
                  
                  // Add command to terminal
                  const terminal = document.getElementById('jarvis-terminal');
                  if (terminal) {
                    terminal.innerHTML += `<div class="text-gray-400 mt-2">$ ${cmd}</div>`;
                  }
                  
                  try {
                    const response = await fetch('http://localhost:8002/api/jarvis/enhance', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        command: cmd.trim(),
                        path: '.'
                      })
                    });
                    const data = await response.json();
                    
                    // Add response to terminal
                    if (terminal) {
                      if (data.status === 'success') {
                        terminal.innerHTML += `<div class="text-emerald-400">✅ ${data.command} complete</div>`;
                        if (data.issues_fixed) {
                          terminal.innerHTML += `<div class="text-emerald-400">   Fixed ${data.issues_fixed} issues</div>`;
                        }
                      } else {
                        terminal.innerHTML += `<div class="text-red-400">❌ Error: ${data.message || 'Unknown'}</div>`;
                      }
                      terminal.scrollTop = terminal.scrollHeight;
                    }
                  } catch (error) {
                    console.error('JARVIS error:', error);
                    if (terminal) {
                      terminal.innerHTML += `<div class="text-red-400">❌ Connection failed</div>`;
                    }
                  }
                }
              }}
            />
            <button 
              className="ml-2 p-1.5 bg-purple-600 hover:bg-purple-700 rounded"
              onClick={async () => {
                const input = document.getElementById('jarvis-command') as HTMLInputElement;
                const event = new KeyboardEvent('keypress', { key: 'Enter' });
                input.dispatchEvent(event);
              }}
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Input Area - Your existing input area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-12 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* ... your existing input code ... */}