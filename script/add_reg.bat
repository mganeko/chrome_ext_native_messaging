REM register Native App for MS Edge NativeMessaging

REG ADD "HKCU\Software\Microsoft\Edge\NativeMessagingHosts\kick_ping" /ve /t REG_SZ /d "C:\path\to\script\kick_ping.json" /f
