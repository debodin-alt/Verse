// Boundary/failure checks, not proof of browser offline lifecycle or device audio.
const assert = require('node:assert/strict');
const vm = require('node:vm');
const {webcrypto} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const {assets,buildWorker} = require('../scripts/prepare-offline.cjs');
const files = Object.fromEntries(assets.map(name=>[name,Buffer.from('fixture '+name)]));
const source = buildWorker(files);
const base = 'https://verse.test/notebook/';
const prefix = 'verse-shell:/notebook/:';
const previous = prefix+'previous';
async function harness(mode='ok') {
  const handlers={}, stores=new Map([[previous,new Map()],['unrelated-cache',new Map()]]), calls=[];
  const caches={
    has:async name=>stores.has(name),keys:async()=>[...stores.keys()],delete:async name=>stores.delete(name),
    open:async name=>{
      if(!stores.has(name)) stores.set(name,new Map());
      const data=stores.get(name);
      return {match:async key=>data.get(String(key))?.clone(),put:async(key,value)=>{
        if(mode==='quota' && data.size===2) throw new Error('Injected cache quota failure');
        data.set(String(key),value.clone());
      }};
    }
  };
  const context=vm.createContext({URL,Uint8Array,Promise,Set,crypto:webcrypto,caches,
    self:{location:{href:base+'sw.js'},clients:{claim:async()=>{calls.push('claim');}},addEventListener:(name,fn)=>{handlers[name]=fn;}},
    fetch:async(url,options)=>{
      calls.push({url:String(url),options});
      const name=new URL(String(url)).pathname.split('/').pop();
      if(mode==='missing' && name==='style.css') return new Response('missing',{status:404});
      if(mode==='login' && name==='index.html') return new Response('<title>Sign in</title>');
      if(mode==='redirect' && name==='index.html') throw new TypeError('Redirect blocked');
      return new Response(files[name]||'network-only');
    }
  });
  vm.runInContext(source,context);
  const lifecycle=async type=>{let task;handlers[type]({waitUntil:p=>{task=p;}});await task;};
  return {stores,calls,handlers,lifecycle};
}
(async()=>{
  for (const mode of ['missing','login','redirect','quota']) {
    const h=await harness(mode);
    await assert.rejects(h.lifecycle('install'));
    assert.deepEqual([...h.stores.keys()],[previous,'unrelated-cache'],mode+': failed install preserves previous/other caches and removes its partial cache');
  }
  const h=await harness();await h.lifecycle('install');
  const current=[...h.stores.keys()].find(x=>x!==previous&&x.startsWith(prefix));
  assert.equal(h.stores.get(current).size,assets.length);
  assert.ok(h.calls.every(x=>x.options.redirect==='error'&&x.options.cache==='no-store'));
  assert.equal(h.calls.includes('claim'),false,'Installing does not activate or claim clients');
  // A byte-identical reinstall reuses the complete cache rather than risking it.
  const callCount=h.calls.length;await h.lifecycle('install');assert.equal(h.calls.length,callCount);
  await h.lifecycle('activate');
  assert.equal(h.stores.has(previous),false);assert.equal(h.stores.has('unrelated-cache'),true);
  for(const url of [base+'api/ideas',base+'index.html?code=private',base+'recording.webm','https://fonts.test/font.css']) {
    let intercepted=false;h.handlers.fetch({request:new Request(url),respondWith:()=>{intercepted=true;}});
    assert.equal(intercepted,false,'No interception/cache for '+url);
  }
  let intercepted=false;h.handlers.fetch({request:new Request(base,{method:'POST',body:'words'}),respondWith:()=>{intercepted=true;}});
  assert.equal(intercepted,false);
  let task;h.handlers.fetch({request:new Request(base),respondWith:p=>{task=p;}});
  assert.equal(await (await task).text(),files['index.html'].toString());
  let reply;const report=async()=>{let done;h.handlers.message({data:{type:'VERSE_OFFLINE_STATUS'},ports:[{postMessage:x=>{reply=x;}}],waitUntil:p=>{done=p;}});await done;return reply.ready;};
  assert.equal(await report(),true);
  h.stores.get(current).delete(base+'app.js');
  assert.equal(await report(),false,'Evicted/incomplete cache must not report offline-ready');
  const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'verse-offline-check-'));
  try {
    fs.mkdirSync(path.join(fixture,'dist'));fs.mkdirSync(path.join(fixture,'scripts'));
    for(const name of assets)fs.writeFileSync(path.join(fixture,'dist',name),files[name]);
    for(const name of ['prepare-offline.cjs','service-worker.js'])fs.copyFileSync(path.join(__dirname,'../scripts',name),path.join(fixture,'scripts',name));
    const prepare=path.join(fixture,'scripts/prepare-offline.cjs');
    const run=(...args)=>spawnSync(process.execPath,[prepare,...args],{encoding:'utf8'}).status;
    assert.equal(run('--check'),1,'Missing generated worker fails the delivery gate');
    assert.equal(run(),0);assert.equal(run('--check'),0);
    fs.appendFileSync(path.join(fixture,'dist/app.js'),'changed');
    assert.equal(run('--check'),1,'Editing an app asset without repinning fails the delivery gate');
    assert.equal(run(),0);assert.equal(run('--check'),0);
  } finally {fs.rmSync(fixture,{recursive:true,force:true});}
  console.log('Passed offline worker boundaries: incomplete/login/redirect/quota rejection, exact shell, safe reinstall/cleanup, request isolation and eviction readiness. Browser lifecycle is tested separately.');
})().catch(error=>{console.error(error);process.exitCode=1;});
