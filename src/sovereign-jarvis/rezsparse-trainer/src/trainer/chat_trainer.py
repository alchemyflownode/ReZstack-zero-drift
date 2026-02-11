#!/usr/bin/env python3
# 🎯 CHAT-TO-TRAIN: Type, click, get model!

from flask import Flask, render_template_string, request, jsonify
import subprocess
import threading
import time
import json

app = Flask(__name__)

# Simple chat history
chat_history = []

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>🤖 Chat to Train - RezTrainer</title>
    <style>
        body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
        .chat-container { border: 2px solid #4CAF50; border-radius: 10px; padding: 20px; }
        .chat-messages { height: 400px; overflow-y: auto; border-bottom: 1px solid #ccc; padding: 10px; }
        .message { margin: 10px 0; padding: 10px; border-radius: 10px; }
        .user-message { background: #e3f2fd; text-align: right; }
        .bot-message { background: #f1f8e9; }
        .input-area { display: flex; margin-top: 20px; }
        input { flex: 1; padding: 10px; font-size: 16px; }
        button { background: #4CAF50; color: white; border: none; padding: 10px 20px; cursor: pointer; }
        .training { background: #fff3cd; }
        .success { background: #d4edda; }
        .error { background: #f8d7da; }
        .model-link { color: #007bff; text-decoration: none; }
    </style>
</head>
<body>
    <h1>🤖 Chat to Train</h1>
    <p><i>Type what you want to train, get a model in seconds!</i></p>
    
    <div class="chat-container">
        <div class="chat-messages" id="chatMessages">
            <!-- Messages will appear here -->
        </div>
        
        <div class="input-area">
            <input type="text" id="userInput" placeholder="Type: 'train cat vs dog classifier' or 'build sales predictor'..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">Train! 🚀</button>
        </div>
    </div>
    
    <script>
        let chatId = 1;
        
        function addMessage(sender, text, type='') {
            const chat = document.getElementById('chatMessages');
            const message = document.createElement('div');
            message.className = 'message ' + (sender === 'user' ? 'user-message' : 'bot-message ' + type);
            message.innerHTML = `<strong>${sender === 'user' ? '👤 You' : '🤖 RezTrainer'}:</strong> ${text}`;
            chat.appendChild(message);
            chat.scrollTop = chat.scrollHeight;
        }
        
        function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            if (!message) return;
            
            addMessage('user', message);
            input.value = '';
            
            // Show "thinking" message
            addMessage('bot', 'Thinking...', 'training');
            
            // Send to server
            fetch('/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: message})
            })
            .then(response => response.json())
            .then(data => {
                // Remove "thinking" message
                const chat = document.getElementById('chatMessages');
                chat.removeChild(chat.lastChild);
                
                // Add actual response
                if (data.error) {
                    addMessage('bot', 'Error: ' + data.error, 'error');
                } else {
                    addMessage('bot', data.response, data.type || '');
                    
                    if (data.model_file) {
                        addMessage('bot', 
                            `✅ Model ready! Download: 
                            <a href="/download/${data.model_file}" class="model-link">
                                ${data.model_file}
                            </a>`, 'success');
                    }
                }
            });
        }
        
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
        
        // Add welcome message
        window.onload = function() {
            addMessage('bot', 'Hello! I\'m your AI training assistant. Tell me what model you want to train! Examples:<br>' +
                              '• "train cat vs dog classifier"<br>' +
                              '• "build sales prediction model"<br>' +
                              '• "create spam email detector"', '');
        };
    </script>
</body>
</html>
'''

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '').lower()
    
    # Store in history
    chat_history.append({'user': user_message, 'time': time.time()})
    
    # Check what user wants
    if 'train' in user_message or 'build' in user_message or 'create' in user_message:
        # Extract model name
        words = user_message.split()
        model_name = '_'.join(words[1:]) if len(words) > 1 else 'custom_model'
        
        # Start training in background
        thread = threading.Thread(target=run_training, args=(model_name,))
        thread.start()
        
        return jsonify({
            'response': f'🚀 Starting training for: {model_name}<br>📊 I\'ll train a real model for you...',
            'type': 'training'
        })
    
    elif 'help' in user_message:
        return jsonify({
            'response': 'I can train ML models from your text! Just tell me what to train.<br>' +
                       'Examples:<br>' +
                       '• "train sentiment analyzer"<br>' +
                       '• "build customer churn predictor"<br>' +
                       '• "create image classifier"',
            'type': ''
        })
    
    else:
        return jsonify({
            'response': 'I understand you want: "' + user_message + '"<br>' +
                       'Type "train [your model]" to get started!',
            'type': ''
        })

def run_training(model_name):
    """Actually train a model"""
    try:
        # Run our real training script
        result = subprocess.run(
            ['python', 'real_training.py', model_name],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        # Extract model filename from output
        for line in result.stdout.split('\n'):
            if '.pkl' in line and 'Saved:' in line:
                model_file = line.split('Saved:')[-1].strip()
                print(f"Model saved: {model_file}")
                break
    except Exception as e:
        print(f"Training error: {e}")

@app.route('/download/<filename>')
def download_file(filename):
    # In real app, serve the file
    return f"Download would start for: {filename}"

if __name__ == '__main__':
    print("🚀 Starting Chat-to-Train server...")
    print("🌐 Open: http://localhost:5000")
    print("💬 Type what model you want to train!")
    app.run(debug=True, port=5000)
