@echo off

SET NEWLINE=^& echo.

cd /d %~dp0
echo Installing Microsoft Visual C++ 2015 Redistributable...
start /wait vc_redist.2015.x86.exe /install /passive /norestart

rem echo Installing Google Chrome...
rem start /wait GoogleChromeStandaloneEnterprise.msi /quiet /passive /norestart

echo Setting HOSTS files
FIND /C /I "local.s911415.tk" %WINDIR%\system32\drivers\etc\hosts
IF %ERRORLEVEL% NEQ 0 ECHO %NEWLINE%^127.0.0.1 local.s911415.tk>>%WINDIR%\System32\drivers\etc\hosts

exit
