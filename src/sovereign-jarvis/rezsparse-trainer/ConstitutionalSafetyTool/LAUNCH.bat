@echo off
echo Starting Constitutional AI Safety Dashboard...
echo.
pip install -r requirements.txt > nul 2>&1
streamlit run constitutional_dashboard.py
