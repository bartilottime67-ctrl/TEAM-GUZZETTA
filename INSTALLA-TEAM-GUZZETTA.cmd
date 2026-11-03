@echo off
setlocal
title Team Guzzetta - Installazione
echo.
echo Team Guzzetta - Installazione
echo.
echo Installazione locale per Windows 10 e 11.
echo Non servono privilegi di amministratore.
echo Chiudi Team Guzzetta se e gia aperto prima di aggiornare.
set "TG_INSTALL_SOURCE=%~dp0"
powershell.exe -NoLogo -NoProfile -Command "$ErrorActionPreference='Stop'; if(-not $env:LOCALAPPDATA){throw 'Cartella dati utente Windows non disponibile.'}; $source=$env:TG_INSTALL_SOURCE; foreach($name in @('TEAM-GUZZETTA-STATISTICHE-APRI.html','TeamGuzzetta.ico','RIMUOVI-TEAM-GUZZETTA.cmd')){if(-not(Test-Path -LiteralPath (Join-Path $source $name))){throw ('File mancante: '+$name+'. Estrarre tutto lo ZIP prima di installare.')}}; $roots=@($env:ProgramFiles,${env:ProgramFiles(x86)},$env:LOCALAPPDATA)|Where-Object{$_}; $browser=$roots|ForEach-Object{Join-Path $_ 'Microsoft\Edge\Application\msedge.exe'}|Where-Object{Test-Path -LiteralPath $_}|Select-Object -First 1; if(-not $browser){$browser=$roots|ForEach-Object{Join-Path $_ 'Google\Chrome\Application\chrome.exe'}|Where-Object{Test-Path -LiteralPath $_}|Select-Object -First 1}; if(-not $browser){throw 'Microsoft Edge o Google Chrome non trovato. Installa uno dei due browser e riprova.'}; $destination=Join-Path $env:LOCALAPPDATA 'TeamGuzzetta'; New-Item -ItemType Directory -Force -Path $destination|Out-Null; $app=Join-Path $destination 'TeamGuzzetta.html'; if(Test-Path -LiteralPath $app){Copy-Item -LiteralPath $app -Destination (Join-Path $destination 'Versione-precedente.html') -Force}; Copy-Item -LiteralPath (Join-Path $source 'TEAM-GUZZETTA-STATISTICHE-APRI.html') -Destination $app -Force; Copy-Item -LiteralPath (Join-Path $source 'TeamGuzzetta.ico') -Destination (Join-Path $destination 'TeamGuzzetta.ico') -Force; Copy-Item -LiteralPath (Join-Path $source 'RIMUOVI-TEAM-GUZZETTA.cmd') -Destination (Join-Path $destination 'RIMUOVI-TEAM-GUZZETTA.cmd') -Force; $desktop=[Environment]::GetFolderPath('Desktop'); $programs=[Environment]::GetFolderPath('Programs'); if(-not $desktop -or -not $programs){throw 'Cartelle Desktop o menu Start non disponibili.'}; $menu=Join-Path $programs 'Team Guzzetta'; New-Item -ItemType Directory -Force -Path $menu|Out-Null; New-Item -ItemType Directory -Force -Path $desktop|Out-Null; $profile=Join-Path $destination 'ProfiloApp'; $q=[char]34; $url=([System.Uri]$app).AbsoluteUri; $arguments='--app='+$q+$url+$q+' --user-data-dir='+$q+$profile+$q+' --no-first-run'; $shell=New-Object -ComObject WScript.Shell; foreach($path in @((Join-Path $desktop 'Team Guzzetta.lnk'),(Join-Path $menu 'Team Guzzetta.lnk'))){$link=$shell.CreateShortcut($path);$link.TargetPath=$browser;$link.Arguments=$arguments;$link.WorkingDirectory=$destination;$link.IconLocation=(Join-Path $destination 'TeamGuzzetta.ico')+',0';$link.Description='Team Guzzetta - Clienti, provvigioni e controllo economico';$link.Save()}; $remove=$shell.CreateShortcut((Join-Path $menu 'Rimuovi Team Guzzetta.lnk')); $remove.TargetPath=Join-Path $destination 'RIMUOVI-TEAM-GUZZETTA.cmd'; $remove.WorkingDirectory=$destination; $remove.Description='Rimuove l app e le icone, conservando i dati'; $remove.Save(); Write-Host 'Installazione completata. Apri Team Guzzetta dal Desktop o dal menu Start.' -ForegroundColor Green; Write-Host 'I dati dell app restano nel tuo PC, in un profilo browser dedicato.'; Write-Host 'Se usavi una copia precedente, ripristina il backup nella nuova app.';"
if errorlevel 1 (
  echo.
  echo Operazione non completata. Leggi il messaggio di errore qui sopra.
  pause
  exit /b 1
)
echo.
pause
endlocal
