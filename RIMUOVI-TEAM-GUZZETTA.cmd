@echo off
setlocal
title Team Guzzetta - Rimozione
echo.
echo Team Guzzetta - Rimozione
echo.
echo Chiudi prima tutte le finestre di Team Guzzetta.
echo I dati non saranno eliminati.
choice /C SN /N /M "Rimuovere l app e le icone? [S/N] "
if errorlevel 2 exit /b 0
powershell.exe -NoLogo -NoProfile -Command "$ErrorActionPreference='Stop'; if(-not $env:LOCALAPPDATA){throw 'Cartella dati utente Windows non disponibile.'}; $destination=Join-Path $env:LOCALAPPDATA 'TeamGuzzetta'; $desktop=[Environment]::GetFolderPath('Desktop'); $menu=Join-Path ([Environment]::GetFolderPath('Programs')) 'Team Guzzetta'; foreach($file in @((Join-Path $desktop 'Team Guzzetta.lnk'),(Join-Path $menu 'Team Guzzetta.lnk'),(Join-Path $menu 'Rimuovi Team Guzzetta.lnk'),(Join-Path $destination 'TeamGuzzetta.html'),(Join-Path $destination 'TeamGuzzetta.ico'),(Join-Path $destination 'TeamGuzzetta-Casa.ico'))){if(Test-Path -LiteralPath $file){Remove-Item -LiteralPath $file -Force}}; if ((Test-Path -LiteralPath $menu) -and -not (Get-ChildItem -LiteralPath $menu -Force|Select-Object -First 1)){Remove-Item -LiteralPath $menu}; Write-Host 'App e collegamenti rimossi.' -ForegroundColor Green; Write-Host 'Dati e versione precedente conservati nella cartella utente TeamGuzzetta.'; Write-Host 'Reinstallando nello stesso percorso puoi recuperare il profilo. Conserva anche il backup JSON.';"
if errorlevel 1 (
  echo.
  echo Operazione non completata. Leggi il messaggio di errore qui sopra.
  pause
  exit /b 1
)
echo.
pause
endlocal
