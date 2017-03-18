@echo off
cd /d %~dp0
start bin\httpd.exe -k stop
exit
