@echo off
cd /d C:\Users\mayzaa\Desktop\PROJECT\api-main
echo.
echo ==============================
echo   PUSH TO GITHUB
echo ==============================
echo.
echo [1] Menambahkan file...
git add .
echo.
echo [2] Commit perubahan...
set /p msg=Masukkan pesan commit (default: Update): 
if "%msg%"=="" set msg=Update
git commit -m "%msg%"
echo.
echo [3] Push ke GitHub...
git push origin main
echo.
echo ==============================
echo   SELESAI!
echo ==============================
pause