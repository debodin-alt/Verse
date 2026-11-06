// Baseline investigation, not a release certification. Uses disposable Chromium contexts.
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
const results = {baseline:'c6fb551', appSha256:createHash('sha256').update(await readFile(path.join(root,'dist/app.js'))).digest('hex'), browser:null, syntheticAudio:true, checks:[], observations:[], uncaughtPageErrors:[], consoleMessages:[], blockedOptionalRequests:[]};
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
  browser = await chromium.launch({channel:'chrome',headless:true,args:['--use-fake-device-for-media-stream']});
  results.browser = browser.version();
  const context = await makeContext({permissions:['microphone'],viewport:{width:1280,height:1000}});
  const page = await trackedPage(context);
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
    results.observations.push({name:'Restore resets idea creation timestamp',changed:timestamps!==content.ideas.find(i=>i.title==='Browser review idea').created});
    await p.reload(); await p.waitForFunction('ideas.length === 3');
    assert.equal(audioHash(await takeBytes(p)),audioHash(originalBytes));
    await restore.close();
    return 'Two imported copies plus existing sample; audio SHA-256 preserved across restore and reload. Idea chronology is a separate observed defect.';
  });
  await check('Additive v1→v2 database migration preserves legacy text/audio',async()=>{
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
    assert.equal(await p.evaluate('db.version'),2); assert.ok(await p.evaluate('db.objectStoreNames.contains("sessions")'));
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
  await check('Concurrent-tab risk reproduction',async()=>{
    await ready(page); await page.locator('[data-tab="write"]').click();
    const other=await trackedPage(context); await ready(other);
    await page.locator('#lyrics').fill('Newer words from first tab');
    await page.waitForFunction('document.querySelector("#saveState").textContent === "Saved on this device"');
    await other.locator('#tags').fill('stale-tab-tag');
    await other.waitForFunction('document.querySelector("#saveState").textContent === "Saved on this device"');
    await page.reload(); await page.waitForFunction('!!active');
    const lost=(await page.locator('#lyrics').inputValue())!=='Newer words from first tab';
    results.observations.push({name:'Stale tab overwrites newer lyric',reproduced:lost});
    assert.equal(lost,true,'This investigation expects to reproduce the baseline defect; update it when behaviour changes.');
    await other.close(); return 'Reproduced data-loss defect; a successful reproduction is not a product-quality pass.';
  });
  await context.close();
} finally {
  await browser?.close(); await new Promise(resolve=>server.close(resolve));
  await writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
}
if(results.checks.some(c=>c.status==='fail')) process.exitCode=1;
