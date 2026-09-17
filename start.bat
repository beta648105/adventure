@echo off
REM 로컬 개발 서버. 브라우저를 열고 8000번 포트로 서비스합니다.
cd /d "%~dp0"
start "" http://localhost:8000
python -m http.server 8000
