@echo off
setlocal
title Team Guzzetta - Installazione
echo.
echo Team Guzzetta - Installazione
echo.
echo Prima estrai TUTTI i file dallo ZIP.
echo Chiudi Team Guzzetta prima di aggiornare.
echo.
set "TG_INSTALL_SOURCE=%~dp0"
set "TG_INSTALL_LOG=%TEMP%\TeamGuzzetta-installazione.log"
echo Team Guzzetta - Installazione > "%TG_INSTALL_LOG%"
echo Data: %DATE% %TIME% >> "%TG_INSTALL_LOG%"
powershell.exe -NoLogo -NoProfile -Command "$ErrorActionPreference='Stop'; $stage='Avvio'; try {$ErrorActionPreference='Stop'; if(-not $env:LOCALAPPDATA){throw 'Cartella dati utente Windows non disponibile.'}; $source=$env:TG_INSTALL_SOURCE; $stage='File del pacchetto'; Write-Output '[1/5] Controllo dei file estratti'; foreach($name in @('TEAM-GUZZETTA-STATISTICHE-APRI.html','TeamGuzzetta.ico','RIMUOVI-TEAM-GUZZETTA.cmd')){if(-not(Test-Path -LiteralPath (Join-Path $source $name))){throw ('File mancante: '+$name+'. Estrarre tutto lo ZIP prima di installare.')}}; $stage='Ricerca Edge o Chrome'; Write-Output '[2/5] Ricerca del browser'; $roots=@($env:ProgramFiles,${env:ProgramFiles(x86)},$env:LOCALAPPDATA)|Where-Object{$_}; $browser=$roots|ForEach-Object{Join-Path $_ 'Microsoft\Edge\Application\msedge.exe'}|Where-Object{Test-Path -LiteralPath $_}|Select-Object -First 1; if(-not $browser){$browser=$roots|ForEach-Object{Join-Path $_ 'Google\Chrome\Application\chrome.exe'}|Where-Object{Test-Path -LiteralPath $_}|Select-Object -First 1}; if(-not $browser){throw 'Microsoft Edge o Google Chrome non trovato. Installa uno dei due browser e riprova.'}; $stage='Cartella applicazione'; Write-Output '[3/5] Preparazione della cartella applicazione'; $destination=Join-Path $env:LOCALAPPDATA 'TeamGuzzetta'; New-Item -ItemType Directory -Force -Path $destination|Out-Null; $app=Join-Path $destination 'TeamGuzzetta.html'; if(Test-Path -LiteralPath $app){Copy-Item -LiteralPath $app -Destination (Join-Path $destination 'Versione-precedente.html') -Force}; $stage='Copia applicazione'; Write-Output '[4/5] Copia del programma'; Copy-Item -LiteralPath (Join-Path $source 'TEAM-GUZZETTA-STATISTICHE-APRI.html') -Destination $app -Force; Copy-Item -LiteralPath (Join-Path $source 'TeamGuzzetta.ico') -Destination (Join-Path $destination 'TeamGuzzetta-Casa.ico') -Force; Copy-Item -LiteralPath (Join-Path $source 'RIMUOVI-TEAM-GUZZETTA.cmd') -Destination (Join-Path $destination 'RIMUOVI-TEAM-GUZZETTA.cmd') -Force; $desktop=[Environment]::GetFolderPath('Desktop'); $programs=[Environment]::GetFolderPath('Programs'); if(-not $desktop -or -not $programs){throw 'Cartelle Desktop o menu Start non disponibili.'}; $menu=Join-Path $programs 'Team Guzzetta'; New-Item -ItemType Directory -Force -Path $menu|Out-Null; New-Item -ItemType Directory -Force -Path $desktop|Out-Null; $appProfile=Join-Path $destination 'ProfiloApp'; $q=[char]34; $url=([System.Uri]$app).AbsoluteUri; $arguments='--app='+$q+$url+$q+' --user-data-dir='+$q+$appProfile+$q+' --no-first-run'; $stage='Creazione icone Desktop e menu Start'; Write-Output '[5/5] Creazione delle icone'; $shell=New-Object -ComObject WScript.Shell; foreach($path in @((Join-Path $desktop 'Team Guzzetta.lnk'),(Join-Path $menu 'Team Guzzetta.lnk'))){$link=$shell.CreateShortcut($path);$link.TargetPath=$browser;$link.Arguments=$arguments;$link.WorkingDirectory=$destination;$link.IconLocation=(Join-Path $destination 'TeamGuzzetta-Casa.ico')+',0';$link.Description='Team Guzzetta - Clienti, provvigioni e controllo economico';$link.Save()}; $remove=$shell.CreateShortcut((Join-Path $menu 'Rimuovi Team Guzzetta.lnk')); $remove.TargetPath=Join-Path $destination 'RIMUOVI-TEAM-GUZZETTA.cmd'; $remove.WorkingDirectory=$destination; $remove.Description='Rimuove l app e le icone, conservando i dati'; $remove.Save(); Write-Host 'Installazione completata. Apri Team Guzzetta dal Desktop o dal menu Start.' -ForegroundColor Green; Write-Host 'I dati dell app restano nel tuo PC, in un profilo browser dedicato.'; Write-Host 'Se usavi una copia precedente, ripristina il backup nella nuova app.';} catch {Write-Host ('ERRORE ['+$stage+']: '+$_.Exception.Message) -ForegroundColor Red; exit 1}" >> "%TG_INSTALL_LOG%" 2>&1
set "TG_INSTALL_RESULT=%ERRORLEVEL%"
type "%TG_INSTALL_LOG%"
echo.
if not "%TG_INSTALL_RESULT%"=="0" (
  copy /Y "%TG_INSTALL_LOG%" "%~dp0ERRORE-INSTALLAZIONE.txt" >nul 2>&1
  echo INSTALLAZIONE NON COMPLETATA.
  echo Cerca ERRORE-INSTALLAZIONE.txt nella stessa cartella di questo file.
  echo Se non trovi il file, il registro e in: %TG_INSTALL_LOG%
  echo Puoi inviare una foto di questa finestra o copiare il messaggio ERRORE.
  pause
  exit /b 1
)
echo Apri Team Guzzetta dall icona sul Desktop o dal menu Start.
pause
endlocal
