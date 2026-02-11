// RezStack Console Cleaner - Copy and paste into browser console

(function() {
    console.clear();
    console.log('🧹 Cleaning RezStack console spam...');
    
    // 1. Stop all intervals and timeouts
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = 0; i < highestId; i++) {
        window.clearTimeout(i);
        window.clearInterval(i);
    }
    
    // 2. Remove problematic scripts
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.src.includes('rezstack-ui-fixed') || 
            script.src.includes('react-router-fix')) {
            script.remove();
            console.log(`Removed: ${script.src || 'inline script'}`);
        }
    });
    
    // 3. Override console to filter spam
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    };
    
    const spamPatterns = [
        'RezStack UI Fix running',
        'fixAllDates',
        'Uncaught TypeError: Cannot read properties of null'
    ];
    
    function filterSpam(method, ...args) {
        const message = args.join(' ');
        const isSpam = spamPatterns.some(pattern => message.includes(pattern));
        if (!isSpam) {
            originalConsole[method].apply(console, args);
        }
    }
    
    console.log = (...args) => filterSpam('log', ...args);
    console.warn = (...args) => filterSpam('warn', ...args);
    console.error = (...args) => filterSpam('error', ...args);
    
    // 4. Add helpful commands
    window.rezstackCommands = {
        clean: () => console.clear(),
        stopSpam: () => {
            const highestId = window.setTimeout(() => {}, 0);
            for (let i = 0; i < highestId; i++) {
                window.clearTimeout(i);
                window.clearInterval(i);
            }
            console.log('All intervals cleared');
        },
        status: () => {
            console.log('RezStack Console Status:');
            console.log('- Spam filtering: ON');
            console.log('- Commands available:');
            console.log('  rezstackCommands.clean()');
            console.log('  rezstackCommands.stopSpam()');
            console.log('  rezstackCommands.status()');
        }
    };
    
    console.log('✅ RezStack console cleaned!');
    console.log('📝 Type "rezstackCommands.status()" for available commands');
})();
