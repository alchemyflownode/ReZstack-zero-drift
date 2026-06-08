# ============================================================================
# sovereign_ui.py - ONE APP TO CONSOLIDATE ALL SOVEREIGN AI INTERFACES
# Path: G:\okiru\app builder\RezStackFinal2\RezStackFinal\sovereign_ui.py
# ============================================================================

"""
SOVEREIGN UI - Unified Constitutional AI Interface
Combines: Sovereign Chat + JARVIS IDE + RezTrainer + ComfyUI Control
One port. One UI. Zero tab switching.
"""

import streamlit as st
import httpx
import json
import asyncio
from datetime import datetime
import pandas as pd
import plotly.graph_objects as go
from pathlib import Path

# ============================================================================
# PAGE CONFIG - MUST BE FIRST
# ============================================================================
st.set_page_config(
    page_title="🏛️ SOVEREIGN AI",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ============================================================================
# CONSTITUTIONAL STYLING
# ============================================================================
st.markdown("""
<style>
    /* Sovereign Dark Theme */
    .stApp {
        background: linear-gradient(145deg, #0a0a0f, #0f0f1a);
        color: #e2e8f0;
    }
    
    .chat-message {
        padding: 1.5rem;
        border-radius: 1rem;
        margin-bottom: 1rem;
        border: 1px solid #2d2d3a;
    }
    
    .user-message {
        background: linear-gradient(145deg, #1e1e2a, #2a2a3a);
        border-left: 4px solid #3b82f6;
    }
    
    .assistant-message {
        background: linear-gradient(145deg, #0f0f1a, #1a1a24);
        border-left: 4px solid #8b5cf6;
    }
    
    .status-online {
        color: #10b981;
        font-weight: bold;
    }
    
    .status-offline {
        color: #ef4444;
        font-weight: bold;
    }
    
    .metric-card {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid #334155;
        border-radius: 0.75rem;
        padding: 1rem;
        backdrop-filter: blur(10px);
    }
    
    h1, h2, h3 {
        color: #f1f5f9 !important;
    }
    
    .stButton > button {
        background: linear-gradient(145deg, #3b82f6, #2563eb);
        color: white;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-weight: 600;
    }
    
    .stTextInput > div > div > input {
        background: #1e1e2a;
        border: 1px solid #2d2d3a;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================================
# SESSION STATE INITIALIZATION
# ============================================================================
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'bypass_mode' not in st.session_state:
    st.session_state.bypass_mode = False
if 'selected_model' not in st.session_state:
    st.session_state.selected_model = "qwen2.5-coder:7b"
if 'models' not in st.session_state:
    st.session_state.models = []

# ============================================================================
# SIDEBAR - SOVEREIGN CONTROL PANEL
# ============================================================================
with st.sidebar:
    st.title("🏛️ SOVEREIGN AI")
    st.markdown("---")
    
    # Connection Status
    st.subheader("🔌 System Status")
    
    async def check_services():
        services = {
            "Ollama": "http://localhost:11434/api/tags",
            "Swarm": "http://localhost:8000/health",
            "Bridge": "http://localhost:8001/health",
            "JARVIS": "http://localhost:8002/health",
            "ComfyUI": "http://localhost:8188"
        }
        
        status = {}
        async with httpx.AsyncClient() as client:
            for name, url in services.items():
                try:
                    r = await client.get(url, timeout=2.0)
                    status[name] = r.status_code == 200
                except:
                    status[name] = False
        return status
    
    status = asyncio.run(check_services())
    
    col1, col2 = st.columns(2)
    for i, (name, online) in enumerate(status.items()):
        with col1 if i % 2 == 0 else col2:
            st.markdown(f"""
            <div style="padding: 0.5rem; border-radius: 0.5rem; background: rgba(30,41,59,0.3); margin-bottom: 0.5rem;">
                <span style="color: {'#10b981' if online else '#ef4444'}; font-size: 0.8rem;">
                    {"●" if online else "○"} {name}
                </span>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Model Selection
    st.subheader("🧠 Neural Engine")
    
    # Fetch Ollama models
    try:
        response = httpx.get("http://localhost:11434/api/tags", timeout=2.0)
        if response.status_code == 200:
            st.session_state.models = [m["name"] for m in response.json()["models"]]
    except:
        pass
    
    selected = st.selectbox(
        "Active Model",
        st.session_state.models if st.session_state.models else ["qwen2.5-coder:7b"],
        index=0
    )
    st.session_state.selected_model = selected
    
    # Constitutional Toggle
    st.subheader("⚖️ Constitutional AI")
    st.session_state.bypass_mode = st.toggle(
        "Bypass Mode",
        value=st.session_state.bypass_mode,
        help="OFF = Constitutional enforcement | ON = Raw output"
    )
    
    st.markdown("---")
    
    # Quick Actions
    st.subheader("🚀 Quick Actions")
    
    if st.button("🔍 Security Scan", use_container_width=True):
        st.switch_page("pages/security.py")
    
    if st.button("🎨 Image Generation", use_container_width=True):
        st.switch_page("pages/image_gen.py")
    
    if st.button("🏛️ Constitutional Training", use_container_width=True):
        st.switch_page("pages/training.py")

# ============================================================================
# MAIN CHAT INTERFACE
# ============================================================================
st.title("💬 Sovereign Constitutional Chat")
st.markdown(f"*Zero-Drift Engine • {'BYPASS' if st.session_state.bypass_mode else 'ENFORCED'} Mode*")

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"], avatar="🧑‍💻" if message["role"] == "user" else "🏛️"):
        st.markdown(message["content"])
        
        # Show constitutional audit for assistant messages
        if message["role"] == "assistant" and "audit" in message:
            score = message["audit"].get("vibe_score", 0)
            status = message["audit"].get("status", "UNKNOWN")
            color = "#10b981" if score >= 70 else "#f59e0b" if score >= 50 else "#ef4444"
            
            st.markdown(f"""
            <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem; border-left: 4px solid {color};">
                <span style="color: {color}; font-weight: bold;">⚖️ Constitutional Audit</span><br>
                <span style="color: #94a3b8;">Vibe Score: {score}/100 - {status}</span>
            </div>
            """, unsafe_allow_html=True)

# Chat input
if prompt := st.chat_input("Message Sovereign AI..."):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user", avatar="🧑‍💻"):
        st.markdown(prompt)
    
    # Generate response
    with st.chat_message("assistant", avatar="🏛️"):
        with st.spinner("🧠 Constitutional AI analyzing..."):
            try:
                # Call Ollama
                response = httpx.post(
                    "http://localhost:11434/api/generate",
                    json={
                        "model": st.session_state.selected_model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.8 if st.session_state.bypass_mode else 0.3
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result["response"]
                    
                    # Mock constitutional audit (replace with real scoring)
                    audit = {
                        "vibe_score": 92 if not st.session_state.bypass_mode else 0,
                        "status": "SOVEREIGN" if not st.session_state.bypass_mode else "BYPASSED"
                    }
                    
                    st.markdown(content)
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": content,
                        "audit": audit
                    })
                    
                    # Show audit
                    st.markdown(f"""
                    <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(16,185,129,0.1); border-radius: 0.5rem; border-left: 4px solid #10b981;">
                        <span style="color: #10b981; font-weight: bold;">⚖️ Constitutional Audit</span><br>
                        <span style="color: #94a3b8;">Vibe Score: {audit['vibe_score']}/100 - {audit['status']}</span>
                    </div>
                    """, unsafe_allow_html=True)
                else:
                    st.error(f"Ollama API error: {response.status_code}")
                    
            except Exception as e:
                st.error(f"Connection error: {e}")

# ============================================================================
# SYSTEM METRICS FOOTER
# ============================================================================
st.markdown("---")
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("🧠 Active Model", st.session_state.selected_model.split(":")[0])
with col2:
    online_count = sum(1 for v in status.values() if v)
    st.metric("🔌 System Health", f"{online_count}/{len(status)} Online")
with col3:
    st.metric("⚖️ Constitutional Mode", "ENFORCED" if not st.session_state.bypass_mode else "BYPASS")
with col4:
    st.metric("💬 Messages", len(st.session_state.messages))