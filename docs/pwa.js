// Installazione e aggiornamento PWA. I dati restano nel localStorage dell'app.
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
let installPrompt=null;
const banner=document.querySelector('#android-install');
const installButton=document.querySelector('#install-app');
const help=document.querySelector('#install-help');
function updateInstallUI(){if(!banner)return;banner.hidden=standalone()||!navigator.userAgent.includes('Android');if(installButton)installButton.textContent=installPrompt?'Installa app':'Come installare';}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;updateInstallUI();});
window.addEventListener('appinstalled',()=>{installPrompt=null;if(banner)banner.hidden=true;});
matchMedia('(display-mode: standalone)').addEventListener('change',updateInstallUI);
installButton?.addEventListener('click',async()=>{if(installPrompt){const prompt=installPrompt;installPrompt=null;try{await prompt.prompt();await prompt.userChoice;}finally{updateInstallUI();}}else if(help&&!help.open)help.showModal();});
document.querySelector('#close-install-help')?.addEventListener('click',()=>help.close());
updateInstallUI();
if('serviceWorker' in navigator&&window.isSecureContext){
 window.addEventListener('load',async()=>{
  try{
   const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
   const updateBanner=document.querySelector('#mobile-update');
   const showUpdate=()=>{if(updateBanner&&registration.waiting)updateBanner.hidden=false;};
   showUpdate();
   registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdate();});});
   let requestedUpdate=false;
   document.querySelector('#update-app')?.addEventListener('click',()=>{if(registration.waiting){requestedUpdate=true;registration.waiting.postMessage({type:'SKIP_WAITING'});}});
   navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requestedUpdate)location.reload();});
   await navigator.serviceWorker.ready;
   const status=document.querySelector('#offline-status');
   if(status)status.textContent='Pronta anche offline. Installa l’app per aprirla dalla schermata del telefono.';
  }catch{
   const status=document.querySelector('#offline-status');
   if(status)status.textContent='Modalità offline non disponibile: mantieni la connessione Internet.';
  }
 });
}
