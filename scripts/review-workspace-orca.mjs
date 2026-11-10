// Real isolated Orca browser journeys; generated audio replaces the microphone.
import assert from 'node:assert/strict';
import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const cli=process.argv[2]||'orca',output=process.argv[3]||'/private/tmp/verse-writing-review',run=promisify(execFile);
const names=['index.html','app.js','offline.js','style.css','sw.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
const files=Object.fromEntries(await Promise.all(names.map(async n=>[n,await readFile(new URL('../dist/'+n,import.meta.url))])));
const hash=b=>createHash('sha256').update(b).digest('hex');
const results={provider:'Orca isolated browser',syntheticAudio:true,appSha256:hash(files['app.js']),workerSha256:hash(files['sw.js']),checks:[],consoles:[],screenshots:[]};
let page,profile,unavailable=false,responses=0;
const call=async(...args)=>{const {stdout}=await run(cli,[...args,'--json'],{timeout:60000,maxBuffer:8*1024*1024});const d=JSON.parse(stdout.slice(stdout.indexOf('{')));if(d.ok===false)throw new Error(JSON.stringify(d.error));return d.result;};
const evaluate=async expression=>{const d=await call('eval','--page',page,'--expression','(async()=>JSON.stringify(await ('+expression+')))()');return typeof d.result==='string'?(d.result===''?undefined:JSON.parse(d.result)):d.result;};
const wait=condition=>evaluate(`(async()=>{const end=Date.now()+20000;while(Date.now()<end){if(await (${condition}))return true;await new Promise(r=>setTimeout(r,80));}throw new Error(${JSON.stringify('Timed out: '+condition)});})()`);
const control=async(name,command,value)=>{const s=await call('snapshot','--page',page);const e=Object.entries(s.refs).find(([,v])=>v.name.replace(/\s+/g,' ').includes(name)&&(!['Words','Play','Takes'].includes(name)||v.role==='tab')&&(!['fill','focus'].includes(command)||v.role==='textbox'));assert.ok(e,'Missing '+name);let outcome;if(command==='click'){await call('focus','--page',page,'--element','@'+e[0]);outcome=await call('keypress','--page',page,'--key','Enter');}else outcome=await call(command,'--page',page,'--element','@'+e[0],...(value===undefined?[]:['--value',value]));results.lastAction={name,command,ref:e[0],role:e[1].role,matchedName:e[1].name,activation:command==='click'?'focus + native Enter':command,effects:outcome.effects};return outcome;};
const saved=()=>wait('document.querySelector("#saveState").textContent==="Saved on this device"');
const viewport=(width,height=1100)=>call('viewport','--page',page,'--width',String(width),'--height',String(height),'--scale','1',...(width<=700?['--mobile']:[]));
const open=async(offline=false)=>{unavailable=offline;page=(await call('tab','create','--url','about:blank','--profile',profile)).browserPageId;await call('tab','switch','--page',page);await call('set','offline','--page',page,'--state',offline?'on':'off');await call('goto','--page',page,'--url',origin);await wait('typeof active!=="undefined"&&!!active&&!!db');await viewport(1440);};
const close=async()=>{results.consoles.push(await call('console','--page',page,'--limit','50'));await call('set','offline','--page',page,'--state','off');await call('tab','close','--page',page);page=null;};
const check=async(name,fn)=>{console.log('Checking '+name);try{results.checks.push({name,status:'pass',evidence:await fn()});}catch(e){results.checks.push({name,status:'fail',error:e.message});throw e;}};
const audioHash=()=>evaluate(`(async()=>{const t=active.takes.at(-1),b=await t.blob.arrayBuffer();return {id:t.id,bytes:b.byteLength,hash:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),x=>x.toString(16).padStart(2,'0')).join('')};})()`);
const rects=()=>evaluate(`(()=>{const box=id=>{const r=document.querySelector(id).getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,write:box('#write'),play:box('#play'),lyrics:box('#lyrics'),record:box('#record'),editors:document.querySelectorAll('#lyrics').length,tab};})()`);
const server=http.createServer((req,res)=>{if(unavailable){req.socket.destroy();return;}responses++;const n=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',b=files[n];if(!b){res.writeHead(404);return res.end('missing');}const ext=n.split('.').pop(),types={html:'text/html',js:'text/javascript',css:'text/css',webmanifest:'application/manifest+json',svg:'image/svg+xml',png:'image/png'};res.writeHead(200,{'Content-Type':types[ext],'Cache-Control':'no-store'});res.end(b);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
try{
  profile=(await call('tab','profile','create','--label','Verse writing workspace tests','--scope','isolated')).profile.id;results.profile=profile;
  await open();results.userAgent=await evaluate('navigator.userAgent');
  await wait('document.querySelector("#offlineState").textContent.includes("Ready for offline capture")');
  await check('Desktop Play exposes one lyrics editor beside backing',async()=>{
    await control('New idea','click');await control('Idea title','fill','Words with the music');await control('Lyrics','fill','A first line to develop');await saved();
    await control('Play','click');const r=await rects();assert.equal(r.editors,1);assert.equal(r.tab,'play');assert.ok(r.write.right<r.play.x);assert.ok(r.lyrics.width>300&&r.play.width>300);assert.ok(r.scrollWidth<=r.width);
    results.screenshots.push(await call('screenshot','--page',page));return r;
  });
  await check('Typing and switching views with a pending save preserve loop and words',async()=>{
    await evaluate('(()=>{document.addEventListener("click",e=>{window.lastClicked={id:e.target.id,tag:e.target.tagName};},true);return true;})()');await control('Play loop','click');await wait('loopRunning&&step>1');
    await evaluate('(()=>{window.originalContext=ctx;window.originalLoopTimer=loopTimer;window.originalWrite=writeIdeas;writeIdeas=items=>new Promise((resolve,reject)=>{window.releaseWrite=()=>window.originalWrite(items).then(resolve,reject);});return true;})()');
    await control('Lyrics','fill','Words revised while the same loop keeps playing');await wait('!!window.releaseWrite');
    await control('Words','click');assert.equal(await evaluate('document.querySelector("#lyrics").value'),'Words revised while the same loop keeps playing');
    await control('Play','click');assert.equal(await evaluate('loopRunning&&ctx===window.originalContext&&loopTimer===window.originalLoopTimer'),true);
    await evaluate('(()=>{writeIdeas=window.originalWrite;window.releaseWrite();return true;})()');await saved();
    return 'Real AudioContext/scheduler keep their identities; same editor value survives tab changes during a held persistence write, then commits.';
  });
  await check('Responsive workspace and visible keyboard focus',async()=>{
    const evidence=[];
    for(const width of [320,390,768,1024,1440]){
      await viewport(width,width<=700?844:1100);const r=await rects();assert.ok(r.scrollWidth<=width,JSON.stringify(r));assert.ok(r.write.height>0&&r.play.height>0);
      if(width<1200)assert.ok(r.play.y>=r.write.bottom-1);else assert.ok(r.write.right<r.play.x);
      assert.ok(r.record.x>=0&&r.record.right<=width&&r.record.bottom<=(width<=700?844:1100));
      assert.equal(await evaluate('loopRunning&&loopTimer===window.originalLoopTimer'),true);evidence.push(r);
    }
    await viewport(390,844);await control('Backing ↓','click');await control('Lyrics ↑','click');
    await control('Lyrics','focus');await call('keypress','--page',page,'--key','Tab');
    assert.equal(await evaluate('(()=>{const e=document.activeElement,r=e.getBoundingClientRect();return !!e.closest("#creativeWorkspace")&&!e.closest("[hidden]")&&r.width>0&&r.height>0;})()'),true);
    await evaluate('scrollTo(0,0)');results.screenshots.push(await call('screenshot','--page',page));await viewport(1440);return evidence;
  });
  let finalWords,take;
  await check('Offline lyric edits during native synthetic capture preserve words and take',async()=>{
    unavailable=true;await call('set','offline','--page',page,'--state','on');
    await evaluate('(()=>{navigator.mediaDevices.getUserMedia=async()=>{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain(),d=a.createMediaStreamDestination();g.gain.value=.08;o.connect(g);g.connect(d);o.start();await a.resume();return d.stream;};return true;})()');
    await control('Record over this loop','click');await wait('recording&&recordSession.chunks.length>0');
    finalWords='[Verse]\nThe same words, the same music\nA line edited during this take — keep it';
    await control('Lyrics','fill',finalWords);assert.equal(await evaluate('recording'),true);
    await control('Stop & save take','click');await wait('!recording&&!recordFinalizing');await saved();take=await audioHash();assert.ok(take.bytes>100);
    await close();const before=responses;await open(true);assert.equal(await evaluate('active.lyrics'),finalWords);assert.deepEqual(await audioHash(),take);assert.equal(responses,before);
    await control('Takes','click');await evaluate('document.querySelector("audio").play()');await wait('document.querySelector("audio").currentTime>.05');await evaluate('document.querySelector("audio").pause()');
    return {take,limit:'Injected Web Audio source, native MediaRecorder/IDB/decoding. No physical microphone/permission/routing evidence.'};
  });
  await check('Text and full-backup payloads contain canonical lyrics and take bytes',async()=>{
    unavailable=false;await call('set','offline','--page',page,'--state','off');
    await evaluate('(()=>{window.realDownload=download;download=(blob,name)=>{window.exported={blob,name};};return true;})()');
    await control('Idea options','click');await control('Export words','click');
    const text=await evaluate('window.exported.blob.text()');assert.ok(text.includes(finalWords));assert.equal(text.split(finalWords).length,2);
    await evaluate('document.querySelector("#optionsDialog").close()');await control('Backup & restore','click');await control('Download full backup','click');
    await wait('window.exported.name.endsWith(".json")');const backup=JSON.parse(await evaluate('window.exported.blob.text()'));
    const idea=backup.ideas.find(i=>i.title==='Words with the music');assert.equal(idea.lyrics,finalWords);assert.equal(idea.takes[0].id,take.id);
    assert.equal(hash(Buffer.from(idea.takes[0].audio.split(',')[1],'base64')),take.hash);
    await evaluate('(()=>{download=window.realDownload;document.querySelector("#backupDialog").close();return true;})()');
    return 'Payload captured at the unchanged download boundary: one exact lyric value and original recorded bytes; no new chord markup. File-save UI not retested here.';
  });
  await check('Combined view retains stale-tab protection',async()=>{
    const first=page;await open();const second=page;
    page=first;await control('Play','click');await control('Lyrics','fill',finalWords+'\nA newer edit in the first tab');await saved();
    page=second;await control('Tags, separated','fill','stale-copy');await wait('document.querySelector("#saveState").textContent.includes("Changed in another tab")');
    await close();page=first;await close();await open();
    assert.equal(await evaluate('active.lyrics'),finalWords+'\nA newer edit in the first tab');assert.deepEqual(await audioHash(),take);
    await control('Play','click');assert.equal((await rects()).editors,1);return 'New lyrics/take survive a stale tag save from another tab; editor remains single and consistent after reopen.';
  });
}catch(error){try{results.failureState=await evaluate('({hidden:document.hidden,visibility:document.visibilityState,lastClick:window.lastClicked,handler:String(document.querySelector("#loop").onclick),loop:loopRunning,step,context:ctx?.state,tab,loopButton:document.querySelector("#loop").textContent,toast:document.querySelector("#toast").textContent})');}catch{}results.failure=error.message;results.failureStack=error.stack;process.exitCode=1;}
finally{if(page)try{await close();}catch(e){results.cleanupError=e.message;}await new Promise(r=>server.close(r));await mkdir(output,{recursive:true});await writeFile(output+'/results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));}
