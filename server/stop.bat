@echo off
cd /d %~dp0
bin\httpd.exe -k stop
pause
exit
