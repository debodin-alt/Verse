// Supported Orca CLI browser; disposable profile and synthetic audio only.
import assert from 'node:assert/strict';
import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const run=promisify(execFile),require=createRequire(import.meta.url);
const {assets,buildWorker}=require('./prepare-offline.cjs');
const cli=process.argv[2]||'orca',output=process.argv[3]||'/private/tmp/verse-offline-orca';
const initial=Object.fromEntries(await Promise.all(assets.map(async name=>[name,await readFile(new URL('../dist/'+name,import.meta.url))])));
let revision='initial',fault=null,requests=0,responses=0,unavailable=false,faultResponses=0,profile=process.argv[4],page;
const files=()=>revision==='initial'?initial:({...initial,'index.html':Buffer.from(initial['index.html'].toString().replace('<title>Verse','<title>'+revision+' · Verse'))});
const results={provider:'Orca isolated embedded browser',syntheticAudio:true,checks:[],consoles:[],appSha256:createHash('sha256').update(initial['app.js']).digest('hex'),workerSha256:createHash('sha256').update(buildWorker(initial)).digest('hex')};
const call=async(...args)=>{
  const {stdout}=await run(cli,[...args,'--json'],{timeout:60000,maxBuffer:8*1024*1024});
  const data=JSON.parse(stdout.slice(stdout.indexOf('{')));if(data.ok===false)throw new Error(JSON.stringify(data.error));return data.result;
};
const evaluate=async expression=>{
  const data=await call('eval','--page',page,'--expression','(async()=>JSON.stringify(await ('+expression+')))()');
  return typeof data.result==='string'?(data.result===''?undefined:JSON.parse(data.result)):data.result;
};
const wait=condition=>evaluate(`(async()=>{const end=Date.now()+20000;while(Date.now()<end){if(await (${condition}))return true;await new Promise(r=>setTimeout(r,80));}throw new Error(${JSON.stringify('Timed out: '+condition)});})()`);
const control=async(name,command,value)=>{
  const snapshot=await call('snapshot','--page',page);
  const entry=Object.entries(snapshot.refs).find(([,v])=>v.name.replace(/\s+/g,' ').includes(name));
  assert.ok(entry,'Control missing: '+name);
  return call(command,'--page',page,'--element','@'+entry[0],...(value===undefined?[]:['--value',value]));
};
const open=async(offline=false)=>{
  unavailable=offline;
  const tab=await call('tab','create','--url','about:blank','--profile',profile);page=tab.browserPageId;
  await call('set','offline','--page',page,'--state',offline?'on':'off');
  await call('goto','--page',page,'--url',origin);
  await wait('typeof active!=="undefined"&&!!active&&!!db');
};
const close=async()=>{
  results.consoles.push(await call('console','--page',page,'--limit','50'));
  await call('set','offline','--page',page,'--state','off');
  await call('tab','close','--page',page);page=null;
};
const syntheticMic=()=>evaluate(`(()=>{navigator.mediaDevices.getUserMedia=async()=>{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain(),d=a.createMediaStreamDestination();g.gain.value=.08;o.connect(g);g.connect(d);o.start();await a.resume();window.syntheticAudio=a;return d.stream;};return true;})()`);
const saved=()=>wait('document.querySelector("#saveState").textContent==="Saved on this device"');
const takeHash=()=>evaluate(`(async()=>{const t=active.takes.at(-1),b=await t.blob.arrayBuffer();return {id:t.id,bytes:b.byteLength,sha256:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),x=>x.toString(16).padStart(2,'0')).join('')};})()`);
const check=async(name,fn)=>{console.log('Checking '+name);try{results.checks.push({name,status:'pass',evidence:await fn()});}catch(e){results.checks.push({name,status:'fail',error:e.message});throw e;}};
const server=http.createServer((req,res)=>{
  requests++;if(unavailable){req.socket.destroy();return;}responses++;const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
  if(fault&&name==='style.css'){
    faultResponses++;
    if(fault==='missing'){res.writeHead(404);return res.end('missing');}
    if(fault==='redirect'){res.writeHead(302,{Location:'/sign-in'});return res.end();}
    res.writeHead(200,{'Content-Type':'text/html'});return res.end('<title>Sign in</title>');
  }
  const body=name==='sw.js'?buildWorker(files()):files()[name];
  if(body===undefined){res.writeHead(404);return res.end('missing');}
  const ext=name.split('.').pop(),types={html:'text/html',js:'text/javascript',css:'text/css',webmanifest:'application/manifest+json',svg:'image/svg+xml',png:'image/png'};
  res.writeHead(200,{'Content-Type':types[ext],'Cache-Control':'no-store'});res.end(body);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
try{
  if(!profile)profile=(await call('tab','profile','create','--label','Verse offline tests','--scope','isolated')).profile.id;
  results.profile=profile;
  if(!process.argv.includes('--setup-only')){
  await open();results.userAgent=await evaluate('navigator.userAgent');
  await check('Complete pinned shell prepared online',async()=>{
    await wait('document.querySelector("#offlineState").textContent.includes("Ready for offline capture")');
    const names=await evaluate(`(async()=>{const n=(await caches.keys()).find(n=>n.startsWith('verse-shell:'));return (await(await caches.open(n)).keys()).map(r=>new URL(r.url).pathname).sort();})()`);
    assert.deepEqual(names,assets.map(n=>'/'+n).sort());return 'Exactly the eight pinned static files are cached.';
  });
  await check('Close and reopen offline; capture/save/reopen exact words',async()=>{
    await close();const before=responses;await open(true);
    await control('New idea','click');await control('Idea title','fill','Offline idea');
    await control('A line, a verse','fill','Words saved without internet');await saved();
    await close();await open(true);assert.equal(await evaluate('active.lyrics'),'Words saved without internet');
    assert.equal(responses,before,'Unavailable server must deliver no app responses');return 'All app pages closed and reopened with page offline and server connections refused; exact new words persist with no server responses.';
  });
  await check('Offline native recordings with injected synthetic audio save/reopen/play',async()=>{
    const takes=[];
    for(const backing of [false,true]){
      await syntheticMic();
      if(!backing)await control('Include loop','uncheck');
      if(backing){await control('Play','click');await control('Record over this loop','click');}
      else await control('Record voice only','click');
      await wait('recording&&recordSession.chunks.length>0');await control('Stop & save take','click');
      await wait('!recording&&!recordFinalizing');await saved();const take=await takeHash();assert.ok(take.bytes>100);takes.push(take);
      await close();await open(true);assert.deepEqual(await takeHash(),take);
      await control('Takes','click');await evaluate('document.querySelectorAll("audio")[active.takes.length-1].play()');
      await wait('document.querySelectorAll("audio")[active.takes.length-1].currentTime>.05');
      await evaluate('document.querySelectorAll("audio")[active.takes.length-1].pause()');
    }
    return {takes,limit:'Injected Web Audio signal replaces getUserMedia; native recorder/cache/IDB/playback exercised, no microphone permissions or physical routing evidence.'};
  });
  await check('Complete update waits with open app, then preserves data on activation',async()=>{
    unavailable=false;await call('set','offline','--page',page,'--state','off');revision='next';
    await syntheticMic();await control('Play','click');await control('Record over this loop','click');await wait('recording&&recordSession.chunks.length>0');
    const oldTitle=await evaluate('document.title');
    await evaluate('(async()=>{await(await navigator.serviceWorker.getRegistration()).update();return true;})()');
    await wait('(async()=>!!(await navigator.serviceWorker.getRegistration()).waiting)()');
    assert.equal(await evaluate('document.title'),oldTitle);assert.equal(await evaluate('recording'),true);
    await control('Stop & save take','click');await wait('!recording&&!recordFinalizing');await saved();const take=await takeHash();
    await close();await open();
    await wait('document.title.startsWith("next")');assert.deepEqual(await takeHash(),take);assert.equal(await evaluate('active.lyrics'),'Words saved without internet');
    return 'New shell waits during native synthetic capture without interrupting it; after saving and closing all app pages, new title and unchanged text/audio confirm safe activation.';
  });
  for(const failure of ['missing','redirect','login'])await check('Reject '+failure+' update and retain prior offline release',async()=>{
    revision='bad-'+failure;fault=failure;const before=faultResponses;
    await evaluate('(async()=>{await(await navigator.serviceWorker.getRegistration()).update();return true;})()');
    await wait('(async()=>{const r=await navigator.serviceWorker.getRegistration();return !r.installing&&!r.waiting;})()');
    assert.ok(faultResponses>before,'Attempt must fetch the faulty asset');await close();await open(true);
    assert.ok((await evaluate('document.title')).startsWith('next'));assert.equal(await evaluate('active.lyrics'),'Words saved without internet');
    assert.equal((await evaluate('caches.keys()')).filter(n=>n.startsWith('verse-shell:')).length,1);
    unavailable=false;await call('set','offline','--page',page,'--state','off');return 'Candidate rejected; previous complete app and words still reopen offline.';
  });
  }
  await check('Failed first offline preparation stays editable with honest status',async()=>{
    if(page)await close();
    profile=(await call('tab','profile','create','--label','Verse failed offline setup test','--scope','isolated')).profile.id;
    results.setupProfile=profile;revision='failed-first-setup';fault='login';await open(false);
    await wait('document.querySelector("#offlineState").textContent.includes("unavailable")');
    await control('A line, a verse','fill','Notebook usable while offline setup fails');await saved();
    assert.equal((await evaluate('caches.keys()')).filter(n=>n.startsWith('verse-shell:')).length,0);
    assert.equal(await evaluate('active.lyrics'),'Notebook usable while offline setup fails');
    return 'Fresh profile rejects a login/mismatched asset, reports offline setup unavailable, and still saves text in IndexedDB.';
  });
}catch(error){results.failure=error.message;results.failureStack=error.stack;process.exitCode=1;}
finally{
  if(page)try{await close();}catch(error){results.cleanupError=error.message;}
  await new Promise(resolve=>server.close(resolve));await mkdir(output,{recursive:true});
  await writeFile(output+'/results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
}
