@echo off
cd /d %~dp0
taskkill /im httpd.exe /f /t
start bin\httpd.exe
echo Waiting for http server started
timeout 10 /nobreak
start chrome https://local.s911415.tk:9488/
exit
