import streamlit as st
import httpx
import asyncio
import json
from datetime import datetime
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
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
# API CLIENT
# ============================================================================
class SovereignAPI:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
    
    async def health(self):
        async with httpx.AsyncClient() as client:
            try:
                r = await client.get(f"{self.base_url}/health", timeout=2.0)
                return r.json() if r.status_code == 200 else None
            except:
                return None
    
    async def chat(self, message, model=None, bypass=False):
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(
                f"{self.base_url}/chat",
                json={"message": message, "model": model, "bypass": bypass}
            )
            return r.json()
    
    async def models(self):
        async with httpx.AsyncClient() as client:
            try:
                r = await client.get(f"{self.base_url}/models")
                return r.json() if r.status_code == 200 else {"models": []}
            except:
                return {"models": []}
    
    async def metrics(self):
        async with httpx.AsyncClient() as client:
            try:
                r = await client.get(f"{self.base_url}/metrics")
                return r.json() if r.status_code == 200 else {}
            except:
                return {}

api = SovereignAPI()

# ============================================================================
# SESSION STATE
# ============================================================================
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'bypass' not in st.session_state:
    st.session_state.bypass = False
if 'models' not in st.session_state:
    st.session_state.models = []
if 'active_tab' not in st.session_state:
    st.session_state.active_tab = "chat"

# ============================================================================
# SIDEBAR
# ============================================================================
with st.sidebar:
    st.title("🏛️ SOVEREIGN AI")
    st.caption("v3.0 - Lean & Constitutional")
    
    # System Status
    st.subheader("🔌 System Status")
    health = asyncio.run(api.health())
    
    if health and health.get("ollama"):
        st.success("🟢 All Systems Online")
    else:
        st.error("🔴 System Offline - Start sovereign_api.py")
    
    # Model Selection
    st.subheader("🧠 Neural Engine")
    if not st.session_state.models:
        models_data = asyncio.run(api.models())
        st.session_state.models = models_data.get("models", [])
    
    selected_model = st.selectbox(
        "Active Model",
        st.session_state.models if st.session_state.models else ["sovereign-constitutional:latest"],
        index=0
    )
    
    # Constitutional Toggle
    st.subheader("⚖️ Constitutional AI")
    st.session_state.bypass = st.toggle(
        "Bypass Mode",
        value=st.session_state.bypass,
        help="OFF = Constitutional enforcement | ON = Raw output"
    )
    
    # ============================================================================
    # FIXED NAVIGATION - THIS IS THE CRITICAL FIX!
    # ============================================================================
    st.subheader("🧭 Navigation")
    
    tab_options = ["💬 Chat", "🎨 Images", "🛡️ Security", "📊 Metrics"]
    tab_keys = ["chat", "images", "security", "metrics"]
    
    current_tab = st.session_state.get("active_tab", "chat")
    try:
        current_index = tab_keys.index(current_tab)
    except ValueError:
        current_index = 0
        st.session_state.active_tab = "chat"
    
    selected_tab = st.radio(
        "Go to",
        tab_options,
        index=current_index
    )
    
    selected_index = tab_options.index(selected_tab)
    st.session_state.active_tab = tab_keys[selected_index]

# ============================================================================
# MAIN CONTENT
# ============================================================================

# Chat Mode
if st.session_state.active_tab == "chat":
    st.title("💬 Sovereign Constitutional Chat")
    st.caption(f"Zero-Drift Engine • {'BYPASS' if st.session_state.bypass else 'ENFORCED'} Mode")
    
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"], avatar="🧑‍💻" if msg["role"] == "user" else "🏛️"):
            st.markdown(msg["content"])
    
    if prompt := st.chat_input("Message Sovereign AI..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user", avatar="🧑‍💻"):
            st.markdown(prompt)
        
        with st.chat_message("assistant", avatar="🏛️"):
            with st.spinner("🧠 Constitutional AI analyzing..."):
                response = asyncio.run(api.chat(
                    prompt,
                    model=selected_model,
                    bypass=st.session_state.bypass
                ))
                
                if response.get("status") == "success":
                    content = response["response"]
                    st.markdown(content)
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": content
                    })

# Images Mode
elif st.session_state.active_tab == "images":
    st.title("🎨 Sovereign Image Factory")
    st.caption("Coming soon - ComfyUI integration")

# Security Mode
elif st.session_state.active_tab == "security":
    st.title("🛡️ JARVIS Constitutional Security")
    st.caption("Coming soon - Security auditing")

# Metrics Mode
elif st.session_state.active_tab == "metrics":
    st.title("📊 System Intelligence")
    st.caption("Real-time constitutional metrics")
    
    metrics = asyncio.run(api.metrics())
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("🧠 Active Models", 
                 len(st.session_state.models) if st.session_state.models else 25)
    with col2:
        st.metric("⚖️ Council Members", 
                 metrics.get('council', {}).get('members', 5) if metrics else 5)
    with col3:
        st.metric("📦 Rezflow Artifacts", 
                 metrics.get('artifacts', 0) if metrics else 0)
    
    st.subheader("🏛️ Constitutional Compliance")
    st.info("System operational - metrics loading...")

# ============================================================================
# FOOTER
# ============================================================================
st.markdown("---")
st.caption("🏛️ SOVEREIGN AI v3.0 - Constitutional • Local • RTX 3060")
