const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const elements = new Map();
function element(selector) {
  if (!elements.has(selector)) elements.set(selector, {
    checked: selector === '#withBacking', value: selector === '#volume' ? '70' : '',
    hidden: false, disabled: false, textContent: '',
    classList: {add(){},remove(){},toggle(){}},setAttribute(){}
  });
  return elements.get(selector);
}
class FakeRecorder {
  static isTypeSupported(type) {return type==='audio/mp4';}
  constructor(stream,opts) {this.mimeType=opts.mimeType;this.state='inactive';}
  start() {this.state='recording';}
  stop() {this.state='inactive';this.ondataavailable({data:new Blob(['voice and backing'],{type:this.mimeType})});this.onstop();}
}
const context=vm.createContext({
  crypto:require('node:crypto').webcrypto,Blob,atob,structuredClone,console,
  setTimeout,clearTimeout,setInterval,clearInterval,
  document:{querySelector:element,querySelectorAll:()=>[],body:{classList:{add(){},remove(){}}}},
  navigator:{storage:{persist:async()=>true}},MediaRecorder:FakeRecorder
});
const run=code=>vm.runInContext(code,context);
run(fs.readFileSync('dist/app.js','utf8').replace(/init\(\);\s*$/,''));
run(`
  var events=[],stored=[],failSave=false;
  active=makeIdea('Test song');ideas=[active];
  master={gain:{value:.7},connect(){events.push('connect-backing');},disconnect(){}};
  micNode={connect(){events.push('connect-mic');},disconnect(){}};
  ctx={createMediaStreamDestination(){return {stream:{}};}};
  enableMic=async()=>{events.push('mic-ready');micReady=true;};
  save=async()=>{};
  sessionWrite=async(data)=>{events.push('checkpoint:'+data.chunks.length);};
  sessionDelete=async()=>{events.push('delete-checkpoint');};
  writeIdeas=async(items)=>{if(failSave)throw new Error('Disk full');stored=structuredClone(items);events.push('persist-take');};
  startLoop=async()=>{events.push('start-loop');loopRunning=true;};
  stopLoop=()=>{events.push('stop-loop');loopRunning=false;};
  releaseMic=()=>{micReady=false;};renderTakes=()=>{};renderList=()=>{};switchTab=(t)=>{tab=t;};toast=()=>{};
`);
async function settle(){for(let i=0;i<20;i++){await new Promise(r=>setImmediate(r));if(!run('recordFinalizing'))return;}throw new Error('Recording did not settle');}
(async()=>{
  run('loopRunning=true;');
  await run('startRecording(true)');
  assert.equal(run('recording'),true);
  assert.equal(run("events.includes('stop-loop')"),false,'Starting capture must not stop the running loop');
  assert.equal(run("events.includes('start-loop')"),false,'Running loop must not restart');
  assert.equal(run('master.gain.value'),.7,'Monitor volume must remain unchanged');
  assert.equal(element('#record').textContent,'■ Stop & save take');
  run('stopRecording()');
  assert.equal(run('recordFinalizing'),true,'Block a second take until save settles');
  await settle();
  assert.equal(run('stored[0].takes.length'),1);
  assert.equal(run('stored[0].takes[0].blob.size'),17);
  assert.equal(run('stored[0].takes[0].withLoop'),true);
  assert.equal(run('tab'),'takes');
  assert.ok(run("events.indexOf('persist-take') < events.indexOf('delete-checkpoint')"),'Persist before removing recovery data');
  assert.match(element('#savedMessage').textContent,/Take 1 saved/);
  run('events=[];loopRunning=false;');
  await run('startRecording(true)');
  assert.ok(run("events.includes('start-loop')"),'Start backing automatically when stopped');
  run('failSave=true;stopRecording();');await settle();
  assert.equal(run("events.includes('delete-checkpoint')"),false,'Failed save must retain recovery data');
  assert.match(element('#savedMessage').textContent,/memory/);
  assert.equal(run('active.takes.length'),2,'Unsaved take remains downloadable');
  assert.equal(run('recordFinalizing'),false);
  console.log('Passed recording regression checks: running-loop continuity, auto-start, volume preservation, save completion, checkpoint ordering and failed-save recovery.');
})().catch(e=>{console.error(e);process.exitCode=1;});
