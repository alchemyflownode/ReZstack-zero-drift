@echo off
echo ?? REZTRAINER CONSTITUTIONAL AI SETUP
echo =====================================
echo.
echo This will:
echo 1. Check for Ollama (install if needed)
echo 2. Set up constitutional governance framework
echo 3. Create constitutional training scripts
echo.
echo Press Ctrl+C to cancel
echo.
pause

python constitutional_setup.py

echo.
echo ? Setup complete!
echo.
echo ?? To train with constitutional governance:
echo    python constitutional_train.py "your_model_name"
echo.
echo ?? Constitution file: constitution.ai
echo ??  Governor: constitutional_governor.py
echo ?? Trainer: constitutional_train.py
echo.
pause
