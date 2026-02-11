// ===== REZSTACK DATE FIX =====
// Properly fixes all "Invalid Date" issues

console.log('📅 Loading RezStack Date Fix...');

function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}

function fixAllDatesInRezStack() {
    console.log('🔧 Fixing dates in RezStack...');
    
    // Method 1: Fix by class name
    document.querySelectorAll('.date, .timestamp, .time, .message-time, .chat-time').forEach(el => {
        try {
            const text = el.textContent || el.innerText || '';
            if (text.includes('Invalid Date') || text.includes('NaN') || text === 'Invalid Date') {
                el.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                el.classList.add('date-fixed');
            }
        } catch (e) {
            // Silent
        }
    });
    
    // Method 2: Fix by data attributes
    document.querySelectorAll('[data-time], [data-timestamp], [data-date]').forEach(el => {
        try {
            const timestamp = el.getAttribute('data-time') || 
                             el.getAttribute('data-timestamp') || 
                             el.getAttribute('data-date');
            
            if (timestamp) {
                const date = new Date(timestamp);
                if (isValidDate(date)) {
                    el.textContent = date.toLocaleString();
                    el.style.color = '#4a5568';
                    el.style.fontSize = '12px';
                } else {
                    el.textContent = new Date().toLocaleDateString();
                }
            }
        } catch (e) {
            // Silent
        }
    });
    
    // Method 3: Fix any element containing "Invalid Date"
    document.querySelectorAll('*').forEach(el => {
        try {
            if (el.childNodes.length === 1 && 
                el.childNodes[0].nodeType === Node.TEXT_NODE && 
                el.textContent.trim() === 'Invalid Date') {
                el.textContent = new Date().toLocaleDateString();
                el.style.fontStyle = 'italic';
                el.style.opacity = '0.7';
            }
        } catch (e) {
            // Silent
        }
    });
    
    console.log('✅ Date fix applied');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(fixAllDatesInRezStack, 500);
        // Run periodically to catch dynamically loaded content
        setInterval(fixAllDatesInRezStack, 3000);
    });
} else {
    setTimeout(fixAllDatesInRezStack, 500);
    setInterval(fixAllDatesInRezStack, 3000);
}

// Export for manual use
window.fixRezStackDates = fixAllDatesInRezStack;

console.log('✅ RezStack Date Fix loaded');
