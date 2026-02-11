#!/usr/bin/env python3
# 💬 SIMPLE CHAT-TO-TRAIN in Terminal!

import subprocess
import time

print("="*60)
print("🤖 CHAT-TO-TRAIN TERMINAL EDITION")
print("="*60)
print("\nType what you want to train, press Enter!")
print("Examples:")
print("  • train cat vs dog classifier")
print("  • build sales predictor")
print("  • create spam detector")
print("  • Type 'quit' to exit")
print("-"*60)

while True:
    user_input = input("\n🎯 You: ").strip().lower()
    
    if user_input in ['quit', 'exit', 'bye']:
        print("👋 Goodbye! Happy training!")
        break
    
    if not user_input:
        continue
    
    # Check if training request
    if any(word in user_input for word in ['train', 'build', 'create', 'make']):
        print("🤖 RezTrainer: Starting training...")
        
        # Extract model name
        words = user_input.split()
        if len(words) > 1:
            model_name = '_'.join(words[1:])
        else:
            model_name = 'custom_model'
        
        # Show progress
        print("📊 Training progress:")
        for i in range(10):
            percent = (i + 1) * 10
            bar = "█" * (i + 1) + "░" * (10 - i - 1)
            print(f"   {percent:3d}% {bar}", end='\r')
            time.sleep(0.3)
        
        # Actually train!
        print("\n🤖 Training real model...")
        try:
            result = subprocess.run(
                ['python', 'real_training.py', model_name],
                capture_output=True,
                text=True
            )
            
            # Show result
            print("\n✅ " + "="*50)
            for line in result.stdout.split('\n'):
                if line.strip():
                    print(line)
            print("="*50)
            
            # Find model file
            for line in result.stdout.split('\n'):
                if '.pkl' in line and ('Saved:' in line or 'File:' in line):
                    model_file = line.split(':')[-1].strip()
                    print(f"\n🎁 Your model is ready: {model_file}")
                    print(f"🔧 Use it in Python: model.predict(your_data)")
                    break
                    
        except Exception as e:
            print(f"❌ Error: {e}")
    
    elif 'help' in user_input:
        print("🤖 RezTrainer: I can train ML models from your text!")
        print("  Just say: 'train [what you want]'")
        print("  Examples:")
        print("    • train email spam classifier")
        print("    • build stock price predictor")
        print("    • create customer segmenter")
    
    else:
        print(f"🤖 RezTrainer: I understand you want: '{user_input}'")
        print("  Type 'train [your model]' to get started!")
        print("  Or type 'help' for examples.")

print("\n" + "="*60)
print("💼 Upgrade to RezTrainer Pro for:")
print("   • Web interface")
print("   • Team collaboration")
print("   • Advanced models")
print("👉 https://reztrainer.com/upgrade")
print("="*60)
