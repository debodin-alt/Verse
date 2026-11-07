// Data-integrity regressions, not a release certification. Uses disposable Chromium contexts.
// Supply an existing Playwright module; this does not install a project dependency.
import assert from 'node:assert/strict';
import http from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modulePath = process.argv[2];
if (!modulePath) throw new Error('Usage: node scripts/review-browser.mjs /absolute/path/to/playwright/index.mjs [result-directory]');
const output = path.resolve(process.argv[3] || '/private/tmp/verse-browser-review');
await mkdir(output, {recursive:true});
const {chromium} = await import(pathToFileURL(modulePath));
const results = {baseline:'data-integrity-regressions', appSha256:createHash('sha256').update(await readFile(path.join(root,'dist/app.js'))).digest('hex'), browser:null, syntheticAudio:true, checks:[], observations:[], uncaughtPageErrors:[], consoleMessages:[], blockedOptionalRequests:[]};
const server = http.createServer(async (req,res) => {
  try {
    const name = new URL(req.url, 'http://localhost').pathname;
    if (name === '/__fixture__') { res.writeHead(200, {'Content-Type':'text/html'}); return res.end('<title>Disposable fixture</title>'); }
    const file = path.resolve(root, 'dist', '.' + (name === '/' ? '/index.html' : name));
    if (!file.startsWith(path.join(root,'dist') + path.sep)) {res.writeHead(403); return res.end();}
    const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(await readFile(file));
  } catch {res.writeHead(404); res.end();}
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const check = async (name, fn) => {console.log('Checking: '+name); try {const evidence = await fn(); results.checks.push({name,status:'pass',evidence});} catch(e) {results.checks.push({name,status:'fail',error:e.message});} console.log(results.checks.at(-1).status+': '+name);};
const makeContext = async options => {
  const c=await browser.newContext(options); c.setDefaultTimeout(10000);
  // Fonts are optional. Keep this data/recording probe local and deterministic.
  await c.route('**/*', route=>{if(route.request().url().startsWith(origin))return route.continue();results.blockedOptionalRequests.push(new URL(route.request().url()).host);return route.abort();});
  return c;
};
const trackedPage = async context => {const p=await context.newPage(); p.on('pageerror',e=>results.uncaughtPageErrors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))results.consoleMessages.push({type:m.type(),text:m.text()});});return p;};
const ready = async p => {await p.goto(origin,{waitUntil:'domcontentloaded'}); await p.waitForFunction('!!db && !!active');};
const audioHash = bytes => createHash('sha256').update(Buffer.from(bytes)).digest('hex');
const takeBytes = p => p.evaluate(async()=>Array.from(new Uint8Array(await ideas.flatMap(i=>i.takes).at(-1).blob.arrayBuffer())));
try {
  console.log('Starting disposable Chrome');
  browser = await chromium.launch({channel:'chrome',headless:true,args:['--use-fake-device-for-media-stream']});
  results.browser = browser.version();
  console.log('Opening isolated context');
  const context = await makeContext({permissions:['microphone'],viewport:{width:1280,height:1000}});
  const page = await trackedPage(context);
  console.log('Loading local app');
  await ready(page);
  await check('Capture text, save and reopen', async()=>{
    await page.locator('#newIdea').click();
    await page.locator('#title').fill('Browser review idea');
    await page.locator('#lyrics').fill('Words worth keeping through a restart');
    await page.waitForFunction('document.querySelector("#saveState").textContent === "Saved on this device"');
    await page.reload(); await page.waitForFunction('!!active');
    assert.equal(await page.locator('#lyrics').inputValue(), 'Words worth keeping through a restart');
    return 'Exact title/lyric persisted in real IndexedDB across reload.';
  });
  await check('Native MediaRecorder with synthetic microphone, running loop, save and replay after reopen', async()=>{
    await page.locator('[data-tab="play"]').click(); await page.locator('#loop').click();
    await page.waitForFunction('loopRunning && step > 1');
    const before = await page.evaluate('step');
    await page.locator('#recordLoop').click(); await page.waitForFunction('recording');
    assert.ok(await page.evaluate('step') >= before, 'Loop step must continue');
    await page.waitForFunction('recordSession.chunks.length > 0');
    await page.locator('#record').click();
    await page.waitForFunction('!recording && !recordFinalizing && active.takes.length > 0');
    assert.match(await page.locator('#recordStatus').textContent(), /saved/);
    const bytes = await takeBytes(page); assert.ok(bytes.length > 100);
    await page.reload(); await page.waitForFunction('!!active');
    await page.locator('[data-tab="takes"]').click();
    await page.locator('audio').evaluate(a=>a.play());
    await page.waitForFunction('document.querySelector("audio").currentTime > 0.05');
    await page.locator('audio').evaluate(a=>a.pause());
    assert.equal(audioHash(await takeBytes(page)), audioHash(bytes));
    return {bytes:bytes.length,sha256:audioHash(bytes),limit:'Synthetic Chromium microphone; no physical device/audio routing or audible quality evidence.'};
  });
  await check('Full downloaded backup restores real recording bytes additively', async()=>{
    const originalBytes = await takeBytes(page);
    await page.locator('#backupOpen').click();
    const pending = page.waitForEvent('download'); await page.locator('#exportAll').click();
    const download = await pending; const backup = path.join(output,'synthetic-backup.json'); await download.saveAs(backup);
    await page.locator('#backupDialog [data-close]').click();
    const content = JSON.parse(await readFile(backup,'utf8'));
    assert.equal(content.ideas.length,2);
    const restore = await makeContext(); const p = await trackedPage(restore); await ready(p);
    const existingId = await p.evaluate('active.id');
    await p.locator('#backupOpen').click(); await p.locator('#importBackup').setInputFiles(backup);
    await p.waitForFunction('ideas.length === 3');
    assert.ok(await p.evaluate(id=>ideas.some(i=>i.id===id),existingId));
    assert.equal(audioHash(await takeBytes(p)),audioHash(originalBytes));
    const timestamps = await p.evaluate(()=>ideas.find(i=>i.title==='Browser review idea').created);
    assert.equal(timestamps,content.ideas.find(i=>i.title==='Browser review idea').created,'Restored idea retains its original creation time');
    assert.equal(await p.evaluate(()=>ideas.find(i=>i.title==='Browser review idea').updated),content.ideas.find(i=>i.title==='Browser review idea').updated);
    await p.reload(); await p.waitForFunction('ideas.length === 3');
    assert.equal(audioHash(await takeBytes(p)),audioHash(originalBytes));
    await restore.close();
    return 'Two imported copies plus existing sample; original dates and audio SHA-256 preserved through restore/reload.';
  });
  await check('Additive v1→v3 database migration preserves legacy text/audio',async()=>{
    const c=await makeContext(); const p=await trackedPage(c); await p.goto(origin+'/__fixture__');
    await p.evaluate(()=>new Promise((resolve,reject)=>{
      const request=indexedDB.open('verse-notebook',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('ideas',{keyPath:'id'});
      request.onerror=()=>reject(request.error);
      request.onsuccess=()=>{const database=request.result; const tx=database.transaction('ideas','readwrite');
        tx.objectStore('ideas').put({id:'legacy',title:'Legacy fixture',kind:'Song',stage:'Seed',tags:'',lyrics:'Legacy words',notes:'',key:0,chords:['C'],sound:'soft',bpm:84,beat:Array.from({length:3},()=>Array(16).fill(false)),drums:false,beatPreset:'off',takes:[{id:'legacy-audio',name:'Old take',created:123,withLoop:false,blob:new Blob([new Uint8Array([1,2,3,4])],{type:'audio/webm'})}],star:false,archived:false,created:123,updated:123});
        tx.oncomplete=()=>{database.close();resolve();};tx.onerror=()=>reject(tx.error);};
    }));
    await ready(p); assert.equal(await p.locator('#lyrics').inputValue(),'Legacy words');
    assert.deepEqual(await takeBytes(p),[1,2,3,4]);
    assert.equal(await p.evaluate('db.version'),3); assert.ok(await p.evaluate('db.objectStoreNames.contains("sessions")'));
    await c.close(); return 'Real IndexedDB upgrade preserved fixture identity/text/bytes and added sessions; fixture audio is arbitrary bytes, not playable media.';
  });
  await check('Denied microphone leaves a usable notebook',async()=>{
    const denied=await makeContext(); const p=await trackedPage(denied); await ready(p);
    await p.locator('#record').click(); await p.waitForFunction('!recordStarting && document.querySelector("#toast").textContent.includes("denied")');
    assert.equal(await p.locator('#record').isEnabled(),true);
    await p.locator('#lyrics').fill('Still editable after denial');
    await p.waitForFunction('document.querySelector("#saveState").textContent === "Saved on this device"');
    await denied.close(); return 'Chromium context without a microphone grant rejected capture; editing and saving remained available.';
  });
  await check('Version-2 library keeps original fields and audio through upgrade',async()=>{
    const c=await makeContext(); const p=await trackedPage(c); await p.goto(origin+'/__fixture__');
    await p.evaluate(()=>new Promise((resolve,reject)=>{
      const r=indexedDB.open('verse-notebook',2);
      r.onupgradeneeded=()=>{r.result.createObjectStore('ideas',{keyPath:'id'});r.result.createObjectStore('sessions',{keyPath:'id'});};
      r.onerror=()=>reject(r.error);r.onsuccess=()=>{const d=r.result,t=d.transaction('ideas','readwrite');
        t.objectStore('ideas').put({id:'v2-original',title:'Old poem',kind:'Poem',stage:'Growing',tags:'kept, original',lyrics:'Older words',notes:'Notes kept',key:0,chords:['C'],sound:'soft',bpm:84,beat:Array.from({length:3},()=>Array(16).fill(false)),drums:false,beatPreset:'off',takes:[{id:'v2-take',name:'Named original',created:111,withLoop:false,blob:new Blob([new Uint8Array([9,8,7])],{type:'audio/webm'})}],star:true,archived:false,created:111,updated:222});
        t.oncomplete=()=>{d.close();resolve();};t.onerror=()=>reject(t.error);};
    }));
    await ready(p);
    assert.deepEqual(await p.evaluate('({id:active.id,created:active.created,updated:active.updated,tags:active.tags,star:active.star,notes:active.notes,take:active.takes[0].id})'),{id:'v2-original',created:111,updated:222,tags:'kept, original',star:true,notes:'Notes kept',take:'v2-take'});
    assert.deepEqual(await takeBytes(p),[9,8,7]);
    await p.locator('#lyrics').fill('New edit on old poem');
    await p.waitForFunction('document.querySelector("#saveState").textContent === "Saved on this device"');
    await p.reload();await p.waitForFunction('!!active');assert.deepEqual(await takeBytes(p),[9,8,7]);
    await c.close();return 'Version-2 fixture retains identity, dates, settings, take identity and audio through upgrade, edit and reload.';
  });
  await check('Final-save storage fault retains audio and recovery checkpoint',async()=>{
    await ready(page);
    await page.locator('#record').click(); await page.waitForFunction('recording');
    await page.waitForFunction('recordSession.chunks.length > 0');
    await page.evaluate('writeIdeas = async () => {throw new DOMException("Injected quota failure", "QuotaExceededError")}');
    await page.locator('#record').click(); await page.waitForFunction('!recording && !recordFinalizing');
    assert.match(await page.locator('#savedMessage').textContent(),/memory/);
    assert.ok(await page.evaluate('(async()=> (await sessionReadAll()).length > 0)()'));
    assert.ok((await takeBytes(page)).length>100);
    await page.reload(); await page.waitForFunction('!!active');
    assert.equal(await page.evaluate('active.takes.filter(t=>t.recovered).length'),1);
    await page.reload(); await page.waitForFunction('!!active');
    assert.equal(await page.evaluate('active.takes.filter(t=>t.recovered).length'),1);
    return 'Injected persistence failure, not an actual full disk; audio stayed in memory and journal recovered exactly once on reload.';
  });
  await check('Stale tab cannot overwrite newer lyrics or recordings',async()=>{
    await ready(page); await page.locator('[data-tab="write"]').click();
    const other=await trackedPage(context); await ready(other);
    await page.locator('#lyrics').fill('Newer words from first tab');
    await page.waitForFunction('document.querySelector("#saveState").textContent === "Saved on this device"');
    const beforeTakes=await page.evaluate('active.takes.length');
    await page.locator('#audioFile').setInputFiles({name:'new-take.wav',mimeType:'audio/wav',buffer:Buffer.from([7,6,5])});
    await page.waitForFunction(n=>active.takes.length===n+1,beforeTakes);
    await page.waitForFunction('document.querySelector("#saveState").textContent === "Saved on this device"');
    await other.locator('#tags').fill('stale-tab-tag');
    await other.waitForFunction('document.querySelector("#saveState").textContent.includes("another tab")');
    assert.equal(await other.locator('#tags').inputValue(),'stale-tab-tag','Unsaved copy remains available to export');
    await page.reload(); await page.waitForFunction('!!active');
    assert.equal(await page.locator('#lyrics').inputValue(),'Newer words from first tab');
    assert.equal(await page.evaluate('active.takes.length'),beforeTakes+1);
    assert.deepEqual(await takeBytes(page),[7,6,5]);
    await other.locator('#backupOpen').click();const pending=other.waitForEvent('download');await other.locator('#exportAll').click();
    const downloaded=await pending,copy=path.join(output,'stale-copy.json');await downloaded.saveAs(copy);
    assert.ok(JSON.parse(await readFile(copy,'utf8')).ideas.some(i=>i.tags==='stale-tab-tag'));
    await other.close(); return 'Stale save rejected; newer lyrics/audio survive; a downloaded backup preserves the stale tab’s unsaved tag.';
  });
  await check('Queued edits in one tab remain saveable',async()=>{
    await ready(page);
    await page.evaluate(async()=>{active.lyrics='Queued edit one';const first=save();active.lyrics='Queued edit two';const second=save();await Promise.all([first,second]);});
    await page.reload();await page.waitForFunction('!!active');
    assert.equal(await page.locator('#lyrics').inputValue(),'Queued edit two');return 'Own queued saves advance safely without a false cross-tab conflict.';
  });
  await check('An older save cannot confirm newer unsaved text',async()=>{
    await ready(page);
    await page.evaluate(async()=>{
      const original=writeIdeas;
      writeIdeas=items=>{writeIdeas=original;return new Promise((resolve,reject)=>{window.releaseSave=()=>original(items).then(resolve,reject);});};
      active.lyrics='Earlier snapshot';window.earlierSave=save();
      await Promise.resolve();await Promise.resolve();
      active.lyrics='Newest unsaved words';changed();clearTimeout(saveTimer);saveTimer=null;
      await window.releaseSave();await window.earlierSave;
    });
    assert.notEqual(await page.locator('#saveState').textContent(),'Saved on this device');
    await page.evaluate('save()');await page.reload();await page.waitForFunction('!!active');
    assert.equal(await page.locator('#lyrics').inputValue(),'Newest unsaved words');
    return 'Completion of an earlier write does not label later unsaved edits as saved.';
  });
  await check('A stale tab cannot recreate a deleted idea',async()=>{
    const c=await makeContext();const first=await trackedPage(c);await ready(first);const stale=await trackedPage(c);await ready(stale);
    first.on('dialog',d=>d.accept());await first.locator('#menuOpen').click();await first.locator('#delete').click();
    await first.waitForFunction('ideas.length === 0');
    await stale.locator('#lyrics').fill('Unsaved text from deleted idea');
    await stale.waitForFunction('document.querySelector("#saveState").textContent.includes("another tab")');
    await first.reload();await first.waitForFunction('!!db');assert.equal(await first.evaluate('ideas.length'),0);
    assert.equal(await stale.locator('#lyrics').inputValue(),'Unsaved text from deleted idea');
    await c.close();return 'Deletion remains durable; stale text is available for explicit export without silently resurrecting the idea.';
  });
  await check('Journal for a deleted idea recovers as an idempotent new copy',async()=>{
    const c=await makeContext(),p=await trackedPage(c);await ready(p);const originalId=await p.evaluate('active.id');
    await p.evaluate(async()=>{
      await sessionWrite({id:'orphan-session',ideaId:active.id,ideaTitle:'Orphan fixture',created:123,withLoop:false,mime:'audio/webm',chunks:[new Blob([new Uint8Array([3,1,4])],{type:'audio/webm'})]});
      await mutateIdeas([{id:active.id}],true);
    });
    await p.reload();await p.waitForFunction('!!active');
    assert.notEqual(await p.evaluate('active.id'),originalId);assert.equal(await p.evaluate('active.takes[0].id'),'orphan-session');
    assert.deepEqual(await takeBytes(p),[3,1,4]);const copyId=await p.evaluate('active.id');
    await p.reload();await p.waitForFunction('!!active');assert.equal(await p.evaluate('active.id'),copyId);assert.equal(await p.evaluate('ideas.length'),1);
    await c.close();return 'Original ID stays deleted; available journal bytes recover to one new idea and do not duplicate on reopen.';
  });
  await context.close();
} finally {
  await browser?.close(); await new Promise(resolve=>server.close(resolve));
  await writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
}
if(results.checks.some(c=>c.status==='fail')) process.exitCode=1;
