@echo off
cd /d %~dp0
start bin\httpd.exe
start chrome https://local.s911415.tk:9488/
exit
