'use strict';
// App-shell readiness is independent of the notebook's truthful data-save status.
(async()=>{
  const status = document.querySelector('#offlineState');
  const unavailable = ()=>{status.textContent='Offline setup unavailable. Keep Verse open to capture and save here.';};
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {unavailable();return;}
  try {
    const registration = await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
    let request = 0;
    const refresh = async()=>{
      const sequence = ++request;
      if (registration.waiting) {status.textContent='Update ready. Save, then close all Verse tabs to update.';return;}
      if (!registration.active) return;
      const ready = await new Promise(resolve=>{
        const channel = new MessageChannel();
        const finish = value=>{clearTimeout(timer);channel.port1.close();resolve(value);};
        const timer = setTimeout(()=>finish(false),3000);
        channel.port1.onmessage=event=>finish(event.data?.ready===true);
        try {registration.active.postMessage({type:'VERSE_OFFLINE_STATUS'},[channel.port2]);}
        catch {finish(false);}
      });
      if (sequence !== request) return;
      if (ready) status.textContent=navigator.onLine?'Ready for offline capture':'Offline · capture and save on this device';
      else unavailable();
    };
    const watch = worker=>{
      if (!worker) return;
      worker.addEventListener('statechange',()=>{
        if (worker.state==='redundant' && !registration.active) unavailable();
        else refresh();
      });
    };
    watch(registration.installing);
    registration.addEventListener('updatefound',()=>watch(registration.installing));
    navigator.serviceWorker.addEventListener('controllerchange',refresh);
    window.addEventListener('online',refresh);window.addEventListener('offline',refresh);
    navigator.serviceWorker.ready.then(refresh).catch(unavailable);
    await refresh();
  } catch {unavailable();}
})();
