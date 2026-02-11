@echo off
chcp 65001 >nul
cls

echo ????????????????????????????????????????????????????????????????
echo    ?? REZSTACK GIT AUTO-COMMIT & PUSH
echo ????????????????????????????????????????????????????????????????
echo.

:: Get current timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "datetime=%%I"
set "timestamp=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%%datetime:~10,2%"

:: Check if we're in a git repo
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo ? Not a git repository or git not installed
    pause
    exit /b 1
)

:: Count changes
set /a file_count=0
for /f %%F in ('git status --porcelain ^| find /c /v ""') do set /a file_count=%%F

if %file_count% equ 0 (
    echo ? No changes to commit
    pause
    exit /b 0
)

echo ?? Found %file_count% modified/untracked files
echo.

:: Show file summary (limited to 10 files)
echo Modified files (M):
git status --porcelain | findstr "^M" | head -10 || echo None
echo.

echo Untracked files (??):
git status --porcelain | findstr "^??" | head -10 || echo None
echo.

:: Auto-generate commit message based on file types
set "commit_msg="
git status --porcelain | findstr "\.py$" >nul && set "commit_msg=%commit_msg%Python scripts, "
git status --porcelain | findstr "\.ps1$" >nul && set "commit_msg=%commit_msg%PowerShell scripts, "
git status --porcelain | findstr "\.bat$" >nul && set "commit_msg=%commit_msg%Batch files, "
git status --porcelain | findstr "\.md$" >nul && set "commit_msg=%commit_msg%Documentation, "
git status --porcelain | findstr "\.json$" >nul && set "commit_msg=%commit_msg%JSON data, "
git status --porcelain | findstr "\.pkl$" >nul && set "commit_msg=%commit_msg%ML models, "
git status --porcelain | findstr "\.pth$" >nul && set "commit_msg=%commit_msg%PyTorch models, "

if "%commit_msg%"=="" set "commit_msg=Updated %file_count% files"

:: Remove trailing comma and space
set "commit_msg=%commit_msg:~0,-2%"

:: Final commit message
set "final_msg=?? %commit_msg% | %timestamp%"

echo ?? Commit message: %final_msg%
echo.

:: Confirm
echo ??  Proceed with commit and push? (Y/N)
set /p confirm=
if /i not "%confirm%"=="Y" (
    echo ?? Cancelled
    timeout /t 2 /nobreak >nul
    exit /b 0
)

:: Add all files
echo ?? Adding files to Git...
git add .

:: Commit
echo ?? Committing changes...
git commit -m "%final_msg%"

:: Push
echo ?? Pushing to GitHub...
git push origin main

:: Check if push succeeded
if errorlevel 1 (
    echo ? Push failed! Trying with force...
    git push origin main --force
)

echo.
echo ? Git operations completed!
echo ?? Message: %final_msg%
echo ?? Files: %file_count%
echo ?? Branch: main
echo ?? Remote: origin
echo.
pause
