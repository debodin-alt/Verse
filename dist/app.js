'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>typeof crypto.randomUUID==='function'?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
let db,ideas=[],active=null,filter='all',tab='write',saveTimer,savePending=Promise.resolve(),objectURLs=[];
let writeQueue=Promise.resolve(),editGeneration=0;
const knownRevisions=new Map(),conflictedIdeas=new Set();
let ctx,master,loopBus,mixDest,loopTimer=null,nextTime=0,step=0,loopRunning=false,visualTimers=[],nodes=new Set();
let recorder=null,micStream=null,micNode=null,recording=false,recordStarting=false,recordFinalizing=false,micReady=false,recordSession=null,journalPending=Promise.resolve(),wakeLock=null,meter=null,meterFrame=null,recordClock,recordStart=0,recordOwner,recordChunks=[],recognition;
const notes=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const presets=[[0,7,9,5],[9,5,0,7],[0,5,0,7],[0,0,0,0,5,5,0,0,7,5,0,7]];
const blankBeat=()=>Array.from({length:3},()=>Array(16).fill(false));
function makeIdea(title=''){return {id:uid(),title,kind:'Song',stage:'Seed',tags:'',lyrics:'',notes:'',key:0,chords:['C','G','Am','F'],sound:'soft',bpm:84,beat:blankBeat(),drums:false,beatPreset:'off',takes:[],star:false,archived:false,created:Date.now(),updated:Date.now()};}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),4500);}
function openDB(){return new Promise((resolve,reject)=>{const request=indexedDB.open('verse-notebook',3);request.onupgradeneeded=()=>{for(const name of ['ideas','sessions','revisions'])if(!request.result.objectStoreNames.contains(name))request.result.createObjectStore(name,{keyPath:'id'});};request.onblocked=()=>toast('Save or export work in other Verse tabs, then close them so storage can update safely.');request.onsuccess=()=>{request.result.onversionchange=()=>{request.result.close();toast('A Verse update is waiting. Export unsaved work before reloading this tab.');};resolve(request.result);};request.onerror=()=>reject(request.error);});}
function readAll(){return new Promise((resolve,reject)=>{
  const tx=db.transaction(['ideas','revisions']),items=tx.objectStore('ideas').getAll(),revisions=tx.objectStore('revisions').getAll();
  tx.oncomplete=()=>{const versions=new Map(revisions.result.map(x=>[x.id,x.revision]));knownRevisions.clear();for(const item of items.result)knownRevisions.set(item.id,versions.get(item.id)||0);resolve(items.result);};
  tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Read interrupted'));
});}
function conflictError(id){conflictedIdeas.add(id);const error=new Error('This idea changed in another tab. Export your copy before reloading.');error.name='ConflictError';return error;}
function mutateIdeas(items,deleting=false){
  // Serialise this tab's writes. Cross-tab comparison and mutation share one IDB transaction.
  writeQueue=writeQueue.catch(()=>{}).then(()=>new Promise((resolve,reject)=>{
    const tx=db.transaction(['ideas','revisions'],'readwrite'),store=tx.objectStore('ideas'),versions=tx.objectStore('revisions'),committed=[];
    let failure;
    for(const item of items){
      const expected=knownRevisions.get(item.id)||0,revision=versions.get(item.id),existing=store.get(item.id);
      let remaining=2;
      const check=()=>{
        if(--remaining||failure)return;
        if(conflictedIdeas.has(item.id)||revision.result?.deleted||(revision.result?.revision||0)!==expected||(!knownRevisions.has(item.id)&&existing.result)){
          failure=conflictError(item.id);tx.abort();return;
        }
        const next=expected+1;
        if(deleting)store.delete(item.id);else store.put(item);
        versions.put({id:item.id,revision:next,deleted:deleting});committed.push([item.id,next]);
      };
      revision.onsuccess=check;existing.onsuccess=check;
    }
    tx.oncomplete=()=>{for(const [id,revision] of committed)knownRevisions.set(id,revision);resolve();};
    tx.onerror=()=>reject(failure||tx.error||new Error('Could not write data'));tx.onabort=()=>reject(failure||tx.error||new Error('Save interrupted'));
  }));
  return writeQueue;
}
function writeIdeas(items){return mutateIdeas(items);}
function save(){if(!active||!db)return Promise.resolve();clearTimeout(saveTimer);saveTimer=null;const snapshot=structuredClone(active),generation=editGeneration;$('#saveState').textContent='Saving…';savePending=savePending.catch(()=>{}).then(()=>writeIdeas([snapshot])).then(()=>{if(active?.id===snapshot.id&&generation===editGeneration)$('#saveState').textContent='Saved on this device';}).catch(err=>{$('#saveState').textContent=err.name==='ConflictError'?'Changed in another tab • export your copy':'Not saved • download backup';toast(err.name==='ConflictError'?err.message:'Could not save. Download a backup before closing.');throw err;});savePending.catch(()=>{});return savePending;}
function changed(){if(!active)return;editGeneration++;active.updated=Date.now();$('#saveState').textContent='Saving…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>{save();renderList();},350);}
function renderList(){const query=$('#search').value.trim().toLowerCase();let list=ideas.filter(x=>(filter==='archive'?x.archived:!x.archived)&&(filter!=='star'||x.star)&&[x.title,x.lyrics,x.tags,x.notes].join(' ').toLowerCase().includes(query)).sort((a,b)=>b.updated-a.updated);$('#ideaCount').textContent=ideas.filter(x=>!x.archived).length;$('#ideaList').innerHTML=list.length?list.map(x=>`<button class="idea ${active?.id===x.id?'active':''}" data-id="${x.id}"><span class="idea-title">${x.star?'✧ ':''}${escapeHTML(x.title||'Untitled idea')}</span><span class="idea-preview">${escapeHTML(x.lyrics.trim().split('\n').filter(Boolean).slice(0,2).join(' / ')||'A little room for something new.')}</span><span class="idea-meta">${escapeHTML(x.kind.toUpperCase())} · ${escapeHTML(x.stage)}${x.takes.length?' · '+x.takes.length+' take'+(x.takes.length===1?'':'s'):''}</span></button>`).join(''):'<p class="hint">No ideas here yet.</p>';$$('.idea').forEach(b=>b.onclick=()=>selectIdea(b.dataset.id));}
function selectIdea(id){if(recording||recordStarting||recordFinalizing){toast('Finish your recording before switching ideas.');return;}stopLoop();stopDictation();if(active)save();active=ideas.find(x=>x.id===id)||null;$('#library').classList.remove('open');renderEditor();renderList();}
function renderEditor(){$('#workspace').hidden=!active;$('#empty').hidden=!!active;if(!active)return;for(const field of ['title','tags','kind','stage','lyrics','notes','sound','bpm'])$('#'+field).value=active[field];$('#key').value=active.key;$('#drums').checked=active.drums;$('#beatPreset').value=active.beatPreset;$('#star').textContent=active.star?'★':'☆';$('#star').setAttribute('aria-pressed',String(active.star));$('#takeCount').textContent=active.takes.length;wordCount();renderChords();renderBeats();renderTakes();switchTab(tab);}
function switchTab(t){tab=t;$$('.panel').forEach(p=>p.hidden=p.id!==t);$$('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===t);b.setAttribute('aria-selected',String(b.dataset.tab===t));});}
function wordCount(){const words=active?.lyrics.trim().split(/\s+/).filter(Boolean)||[];$('#wordCount').textContent=words.length+' words';}
function newIdea(){if(recording||recordStarting||recordFinalizing)return toast('Finish your recording first.');const idea=makeIdea();ideas.push(idea);selectIdea(idea.id);switchTab('write');save();$('#title').focus();}
function chordNotes(name){const match=/^([A-G])(#?)(m|7|maj7|m7)?$/.exec(name);if(!match)return [];const root=notes.indexOf(match[1]+match[2]);const q=match[3]||'';const intervals=q==='m'?[0,3,7]:q==='7'?[0,4,7,10]:q==='maj7'?[0,4,7,11]:q==='m7'?[0,3,7,10]:[0,4,7];return intervals.map(i=>48+root+i);}
function renderChords(){$('#progression').innerHTML=active.chords.length?active.chords.map((c,i)=>`<div class="chord" data-index="${i}"><button class="remove" data-remove="${i}" aria-label="Remove chord ${i+1}">×</button><button class="audition" data-chord="${escapeHTML(c)}" aria-label="Play ${escapeHTML(c)}">${escapeHTML(c)}</button><small>BAR ${i+1}</small></div>`).join(''):'<p class="hint">Add a chord or choose a starting point below.</p>';$$('[data-chord]').forEach(b=>b.onclick=async()=>{await audioReady();playChord(b.dataset.chord,ctx.currentTime+.02,.8,master);});$$('[data-remove]').forEach(b=>b.onclick=()=>{stopLoop();active.chords.splice(+b.dataset.remove,1);renderChords();changed();});}
async function audioReady(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=Number($('#volume').value)/100;master.connect(ctx.destination);loopBus=ctx.createGain();loopBus.connect(master);mixDest=ctx.createMediaStreamDestination();}if(ctx.state!=='running')await ctx.resume();}
function tone(midi,t,duration,destination,mode='soft'){const freq=440*2**((midi-69)/12);const gain=ctx.createGain();const osc=ctx.createOscillator();osc.type=mode==='warm'?'triangle':'sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(mode==='pluck'?.18:.12,t+(mode==='warm'?.14:.015));gain.gain.exponentialRampToValueAtTime(.001,t+Math.max(.2,duration));osc.connect(gain);gain.connect(destination);osc.start(t);osc.stop(t+duration+.05);nodes.add(osc);osc.onended=()=>{nodes.delete(osc);gain.disconnect();};if(mode==='pluck'){const overtone=ctx.createOscillator(),g=ctx.createGain();overtone.type='sine';overtone.frequency.value=freq*2;g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);overtone.connect(g);g.connect(destination);overtone.start(t);overtone.stop(t+.24);nodes.add(overtone);overtone.onended=()=>{nodes.delete(overtone);g.disconnect();};}}
function playChord(name,t,duration,destination){chordNotes(name).forEach((n,i)=>tone(n,t+i*.025,duration,destination,active?.sound||'soft'));}
function drum(row,t){if(row===0){const osc=ctx.createOscillator(),g=ctx.createGain();osc.frequency.setValueAtTime(130,t);osc.frequency.exponentialRampToValueAtTime(45,t+.14);g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);osc.connect(g);g.connect(loopBus);osc.start(t);osc.stop(t+.26);nodes.add(osc);osc.onended=()=>{nodes.delete(osc);g.disconnect();};}else{const duration=row===1?.14:.045;const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),d=buffer.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const src=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();src.buffer=buffer;f.type='highpass';f.frequency.value=row===1?1300:7000;g.gain.setValueAtTime(row===1?.23:.12,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);src.connect(f);f.connect(g);g.connect(loopBus);src.start(t);nodes.add(src);src.onended=()=>{nodes.delete(src);g.disconnect();f.disconnect();};}}
function schedule(){if(!loopRunning||!active)return;const seconds=60/active.bpm/4;while(nextTime<ctx.currentTime+.15){const s=step%16;const bar=Math.floor(step/16)%Math.max(1,active.chords.length);if(s===0&&active.chords.length)playChord(active.chords[bar],nextTime,seconds*15,loopBus);if(active.drums)active.beat.forEach((r,i)=>{if(r[s])drum(i,nextTime);});const timer=setTimeout(()=>{visualTimers=visualTimers.filter(x=>x!==timer);if(!loopRunning)return;$$('.chord').forEach((el,i)=>el.classList.toggle('current',i===bar));$$('.step').forEach(el=>el.classList.toggle('beat-now',+el.dataset.step===s));$('#playingChord').textContent=(active.chords[bar]||'Drums')+' · '+(Math.floor(s/4)+1)+' / 4';},Math.max(0,(nextTime-ctx.currentTime)*1000));visualTimers.push(timer);nextTime+=seconds;step++;}}
async function startLoop(){await audioReady();if(loopRunning)return;loopRunning=true;step=0;nextTime=ctx.currentTime+.06;$('#loop').textContent='■ Stop loop';syncRecordUI();schedule();loopTimer=setInterval(schedule,25);}
function stopLoop(){loopRunning=false;clearInterval(loopTimer);visualTimers.forEach(clearTimeout);visualTimers=[];nodes.forEach(n=>{try{n.stop();}catch{}});nodes.clear();$$('.current,.beat-now').forEach(el=>el.classList.remove('current','beat-now'));$('#loop').textContent='▶ Play loop';$('#playingChord').textContent='Ready when you are.';syncRecordUI();}
function renderBeats(){$('#beatGrid').innerHTML=['Kick','Snare','Hat'].map((name,row)=>`<div class="beat-row"><span>${name}</span>${active.beat[row].map((on,s)=>`<button class="step ${on?'on':''}" aria-label="${name} step ${s+1}" aria-pressed="${on}" data-row="${row}" data-step="${s}"></button>`).join('')}</div>`).join('');$$('.step').forEach(b=>b.onclick=()=>{const r=+b.dataset.row,s=+b.dataset.step;active.beat[r][s]=!active.beat[r][s];active.drums=true;active.beatPreset='custom';$('#drums').checked=true;$('#beatPreset').value='custom';b.classList.toggle('on',active.beat[r][s]);b.setAttribute('aria-pressed',String(active.beat[r][s]));changed();});}
function applyBeat(name){active.beatPreset=name;if(name==='custom')return;if(name==='off'){active.drums=false;}else{active.beat=blankBeat();const patterns={simple:[[0,8],[4,12],[0,2,4,6,8,10,12,14]],hiphop:[[0,6,10],[4,12],[0,2,4,6,8,10,11,14]],four:[[0,4,8,12],[4,12],[2,6,10,14]]};patterns[name].forEach((steps,r)=>steps.forEach(s=>active.beat[r][s]=true));active.drums=true;}$('#drums').checked=active.drums;renderBeats();changed();}
function setAudioSession(type){try{if(navigator.audioSession)navigator.audioSession.type=type;}catch{}}
function syncRecordUI(){
  const busy=recordStarting||recordFinalizing;
  $('#record').disabled=busy;
  $('#recordLoop').disabled=busy;
  $('#micCheck').disabled=busy||recording;
  $('#releaseMic').hidden=!micReady||recording||busy;
  $('#withBacking').disabled=recording||busy;
  $('#record').textContent=recordFinalizing?'Saving take…':recordStarting?'Opening microphone…':recording?'■ Stop & save take':$('#withBacking').checked?'● Record with loop':'● Record voice only';
  $('#recordLoop').textContent=recordFinalizing?'Saving take…':recordStarting?'Opening microphone…':recording?'■ Stop & save take':'● Record over this loop';
  $('#micCheck').textContent=micReady?'✓ Microphone ready':'Enable mic & check sound';
  $('#loop').disabled=recording||busy;
  $('#captureMeter').hidden=!micReady;
}
function sessionWrite(data){return new Promise((resolve,reject)=>{const tx=db.transaction('sessions','readwrite');tx.objectStore('sessions').put(data);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Checkpoint interrupted'));});}
function sessionDelete(id){return new Promise((resolve,reject)=>{const tx=db.transaction('sessions','readwrite');tx.objectStore('sessions').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
function sessionReadAll(){return new Promise((resolve,reject)=>{const req=db.transaction('sessions').objectStore('sessions').getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function recoverSessions(){
  const sessions=await sessionReadAll();let recovered=0;
  for(const session of sessions){
    if(!session.chunks?.length){await sessionDelete(session.id);continue;}
    let owner=ideas.find(x=>x.takes.some(t=>t.id===session.id))||ideas.find(x=>x.id===session.ideaId);
    if(!owner){owner=makeIdea(session.ideaTitle||'Recovered idea');ideas.push(owner);}
    if(!owner.takes.some(t=>t.id===session.id)){
      const blob=new Blob(session.chunks,{type:session.mime||session.chunks[0].type});
      owner.takes.push({id:session.id,name:'Recovered take · '+new Date(session.created).toLocaleTimeString(),created:session.created,blob,withLoop:session.withLoop,recovered:true,duration:0});
      owner.updated=Date.now();await writeIdeas([owner]);recovered++;
    }
    await sessionDelete(session.id);
  }
  return recovered;
}
function startMeter(){
  if(!micNode)return;meter=ctx.createAnalyser();meter.fftSize=256;micNode.connect(meter);
  const data=new Uint8Array(meter.fftSize);
  function paint(){if(!meter)return;meter.getByteTimeDomainData(data);const rms=Math.sqrt(data.reduce((sum,v)=>sum+((v-128)/128)**2,0)/data.length);$('#micLevel').value=Math.min(1,rms*4);meterFrame=requestAnimationFrame(paint);}
  paint();
}
async function enableMic(){
  if(micReady&&micStream?.getTracks().some(t=>t.readyState==='live'))return;
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw new Error('Recording needs Safari or Chrome over HTTPS. You can also import an audio clip.');
  stopDictation();setAudioSession('play-and-record');
  // Resume during the gesture, then again after the OS changes its audio route.
  await audioReady();
  micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
  setAudioSession('play-and-record');await audioReady();
  micNode=ctx.createMediaStreamSource(micStream);micReady=true;startMeter();
  for(const track of micStream.getTracks())track.onended=()=>{if(recording)stopRecording('Microphone disconnected');else releaseMic();};
  syncRecordUI();
}
function releaseMic(){
  if(recording||recordFinalizing)return;
  cancelAnimationFrame(meterFrame);meter?.disconnect();meter=null;
  micNode?.disconnect();micNode=null;
  micStream?.getTracks().forEach(t=>{t.onended=null;t.stop();});micStream=null;micReady=false;
  setAudioSession('playback');$('#micLevel').value=0;syncRecordUI();
}
async function soundCheck(){
  recordStarting=true;syncRecordUI();
  try{await enableMic();$('#recordStatus').textContent='Mic ready. Set a comfortable loop volume.';toast('Mic is on for sound check, not recording. Adjust phone volume now.');}
  catch(err){releaseMic();toast(err.name==='NotAllowedError'?'Allow microphone access in your browser settings, or import audio.':err.message);}
  finally{recordStarting=false;syncRecordUI();}
}
async function startRecording(forceLoop=false){
  if(recordStarting||recording||recordFinalizing)return;
  if(forceLoop)$('#withBacking').checked=true;
  const owner=active,withLoop=$('#withBacking').checked;
  recordStarting=true;recordOwner=owner;syncRecordUI();
  try{
    await save();await enableMic();
    if(!withLoop)stopLoop();
    // Preserve an already-playing loop. Never reduce monitor gain here.
    mixDest=ctx.createMediaStreamDestination();
    micNode.connect(mixDest);
    if(withLoop)master.connect(mixDest);
    const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
    const currentRecorder=new MediaRecorder(mixDest.stream,mime?{mimeType:mime}:undefined);
    recorder=currentRecorder;recordChunks=[];
    const session={id:uid(),ideaId:owner.id,ideaTitle:owner.title,created:Date.now(),withLoop,mime:currentRecorder.mimeType||mime||'audio/webm',chunks:[]};
    recordSession=session;await sessionWrite(session);journalPending=Promise.resolve();
    let checkpointWarning=false;
    currentRecorder.ondataavailable=e=>{
      if(!e.data.size)return;
      recordChunks.push(e.data);session.chunks.push(e.data);
      const checkpoint={...session,chunks:[...session.chunks]};
      journalPending=journalPending.catch(()=>{}).then(()=>sessionWrite(checkpoint)).catch(()=>{
        if(!checkpointWarning){checkpointWarning=true;toast('Recovery checkpoint failed. Keep Verse open and download this take when finished.');}
      });
    };
    currentRecorder.onstop=()=>finishRecording(session,owner,currentRecorder.mimeType);
    currentRecorder.onerror=()=>stopRecording('Recording interrupted');
    recordStart=Date.now();currentRecorder.start(2000);recording=true;
    document.body.classList.add('recording');$('#takeSaved').hidden=true;
    if(withLoop&&!loopRunning)await startLoop();
    navigator.storage?.persist?.().catch(()=>{});
    navigator.wakeLock?.request('screen').then(lock=>{if(recording)wakeLock=lock;else lock.release();}).catch(()=>{});
    $('#recordStatus').textContent='Recording 0:00';
    $('#recordHint').textContent=withLoop?'Your voice + this loop. Keep Verse open.':'Voice only. Keep Verse open.';
    recordClock=setInterval(()=>{const seconds=Math.floor((Date.now()-recordStart)/1000);$('#recordStatus').textContent='Recording '+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');},400);
  }catch(err){
    if(recording){stopRecording('Audio interrupted');}
    else{disconnectRecording();releaseMic();toast(err.name==='NotAllowedError'?'Microphone access denied. Allow it in Safari settings, or import audio.':err.message||'Could not start recording. Your loop is unchanged.');}
  }finally{recordStarting=false;syncRecordUI();}
}
function stopRecording(reason=''){
  if(!recording||recordFinalizing)return;
  recordFinalizing=true;clearInterval(recordClock);stopLoop();
  $('#recordStatus').textContent='Saving your take…';syncRecordUI();
  if(reason)toast(reason+'. Saving the captured audio.');
  if(recorder.state!=='inactive')recorder.stop();
}
function disconnectRecording(){
  clearInterval(recordClock);stopLoop();
  try{master?.disconnect(mixDest);}catch{}
  try{micNode?.disconnect(mixDest);}catch{}
  wakeLock?.release().catch(()=>{});wakeLock=null;
  recording=false;document.body.classList.remove('recording');
}
async function finishRecording(session,owner,mime){
  recordFinalizing=true;syncRecordUI();
  const blob=new Blob(session.chunks,{type:mime||session.mime});
  const take={id:session.id,name:'Take '+(owner.takes.length+1),created:session.created,duration:(Date.now()-recordStart)/1000,blob,withLoop:session.withLoop};
  disconnectRecording();
  let persisted=false;
  try{
    await journalPending;
    if(!blob.size){await sessionDelete(session.id);throw new Error('No audio was captured. Check microphone access and try again.');}
    owner.takes.push(take);owner.updated=Date.now();clearTimeout(saveTimer);
    await savePending.catch(()=>{});await writeIdeas([owner]);persisted=true;
    // Remove recovery data only AFTER the complete take is committed.
    await sessionDelete(session.id).catch(()=>{});
    $('#saveState').textContent='Saved on this device';
    $('#recordStatus').textContent='✓ '+take.name+' saved';
    $('#savedMessage').textContent=take.name+' saved to “'+(owner.title||'Untitled idea')+'”.';
    toast('Take saved. Press play below to listen.');
  }catch(err){
    $('#saveState').textContent='Take not saved • download audio now';
    $('#recordStatus').textContent='Save failed. Download your take.';
    $('#savedMessage').textContent=blob.size?'This take is in memory. Download it now before closing Verse.':err.message;
    toast(err.message||'Storage failed. Download the audio now.');
  }finally{
    recordFinalizing=false;recordSession=null;releaseMic();syncRecordUI();
    $('#recordHint').textContent=persisted?'Saved in Takes. Back up to keep a second copy.':'Download audio from Takes before closing.';
    renderTakes();renderList();$('#takeCount').textContent=owner.takes.length;
    $('#takeSaved').hidden=false;switchTab('takes');
  }
}
function renderTakes(){objectURLs.forEach(URL.revokeObjectURL);objectURLs=[];if(!active)return;$('#takesList').innerHTML=active.takes.length?active.takes.map(t=>{const url=URL.createObjectURL(t.blob);objectURLs.push(url);const extension=t.blob.type.includes('mp4')?'m4a':t.blob.type.includes('ogg')?'ogg':'webm';return `<article class="take"><div class="take-header"><input aria-label="Take name" data-take-name="${t.id}" value="${escapeHTML(t.name)}"><a href="${url}" download="${escapeHTML((active.title||'idea')+'-'+t.name)}.${extension}">Save audio</a><button class="icon" data-delete-take="${t.id}" aria-label="Delete ${escapeHTML(t.name)}">×</button></div><audio controls src="${url}" preload="metadata"></audio><small>${new Date(t.created).toLocaleDateString()} · ${t.withLoop?'Voice + backing':'Audio take'}${t.recovered?' · Recovered after interruption; may be incomplete':''}</small></article>`;}).join(''):'<div class="take"><p class="hint">No takes yet. Your first melody can be just a few seconds long.</p></div>';$$('[data-take-name]').forEach(el=>el.oninput=()=>{active.takes.find(t=>t.id===el.dataset.takeName).name=el.value;changed();});$$('[data-delete-take]').forEach(b=>b.onclick=()=>{if(!confirm('Delete this recording? This cannot be undone.'))return;active.takes=active.takes.filter(t=>t.id!==b.dataset.deleteTake);changed();renderTakes();$('#takeCount').textContent=active.takes.length;});}
function download(blob,name){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function blobData(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob);});}
async function exportItems(items){toast('Preparing your backup…');try{await save().catch(()=>{});const data=[];for(const idea of items){const copy={...idea,takes:[]};for(const take of idea.takes){const {blob,...rest}=take;copy.takes.push({...rest,audio:await blobData(blob)});}data.push(copy);}download(new Blob([JSON.stringify({app:'verse-notebook',version:1,exported:new Date().toISOString(),ideas:data})],{type:'application/json'}),'verse-'+new Date().toISOString().slice(0,10)+'.json');toast('Backup downloaded. Keep it somewhere safe.');}catch{toast('Backup failed. Try exporting one idea at a time.');}}
function validateImport(idea){if(!idea||typeof idea!=='object'||typeof idea.title!=='string'||typeof idea.lyrics!=='string')throw new Error('Invalid idea');const fresh=makeIdea(idea.title);fresh.created=importTimestamp(idea.created,fresh.created);fresh.updated=importTimestamp(idea.updated,fresh.created);for(const key of ['lyrics','notes','tags'])fresh[key]=typeof idea[key]==='string'?idea[key]:'';fresh.kind=['Song','Poem','Fragment'].includes(idea.kind)?idea.kind:'Song';fresh.stage=['Seed','Growing','Finished'].includes(idea.stage)?idea.stage:'Seed';fresh.key=Number.isInteger(idea.key)&&idea.key>=0&&idea.key<12?idea.key:0;fresh.bpm=Math.min(200,Math.max(40,Number(idea.bpm)||84));fresh.sound=['soft','warm','pluck'].includes(idea.sound)?idea.sound:'soft';fresh.chords=Array.isArray(idea.chords)?idea.chords.filter(c=>typeof c==='string'&&chordNotes(c).length).slice(0,64):fresh.chords;if(Array.isArray(idea.beat)&&idea.beat.length===3&&idea.beat.every(r=>Array.isArray(r)&&r.length===16))fresh.beat=idea.beat.map(r=>r.map(Boolean));fresh.drums=!!idea.drums;fresh.beatPreset=['off','simple','hiphop','four','custom'].includes(idea.beatPreset)?idea.beatPreset:'custom';fresh.star=!!idea.star;fresh.archived=!!idea.archived;fresh.takes=(idea.takes||[]).map(t=>{if(typeof t.audio!=='string'||!/^data:audio\/[a-z0-9.+;= -]+;base64,/i.test(t.audio))throw new Error('Invalid audio');const [head,encoded]=t.audio.split(',');const binary=atob(encoded),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return {id:uid(),name:typeof t.name==='string'?t.name:'Imported take',created:Number(t.created)||Date.now(),withLoop:!!t.withLoop,duration:Number(t.duration)||0,blob:new Blob([bytes],{type:head.slice(5).split(';base64')[0]})};});return fresh;}
async function importBackup(file){if(!file)return;if(recording||recordStarting||recordFinalizing)return toast('Finish your recording before importing.');try{if(file.size>250*1024*1024)throw new Error('This backup is too large (250 MB limit).');const data=JSON.parse(await file.text());if(data.app!=='verse-notebook'||data.version!==1||!Array.isArray(data.ideas))throw new Error('Choose a Verse backup file.');const incoming=data.ideas.map(validateImport);await save().catch(()=>{});await writeIdeas(incoming);ideas.push(...incoming);$('#backupDialog').close();if(incoming.length)selectIdea(incoming[0].id);renderList();toast(incoming.length+' ideas imported as new copies.');}catch(err){toast('Import failed: '+err.message);}}
function importTimestamp(value,fallback){const time=typeof value==='number'?value:typeof value==='string'&&value.trim()?Number(value):NaN;return Number.isFinite(time)&&time>=0?time:fallback;}
function stopDictation(){if(recognition){recognition.stop();recognition=null;}$('#dictate').textContent='◉ Dictate';}
function dictate(){if(recording||recordStarting||recordFinalizing)return toast('Finish recording before dictating.');if(recognition){stopDictation();return;}const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech)return toast('Use the microphone on your phone keyboard to dictate into the Words field.');const speech=new Speech();recognition=speech;speech.lang='en-AU';speech.continuous=true;speech.interimResults=false;const target=active;speech.onresult=e=>{let text='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)text+=e.results[i][0].transcript+' ';target.lyrics+=(target.lyrics&&!target.lyrics.endsWith('\n')?' ':'')+text.trim();$('#lyrics').value=target.lyrics;wordCount();changed();};speech.onerror=()=>{toast('Dictation unavailable. Try your phone keyboard’s microphone.');stopDictation();};speech.onend=()=>{recognition=null;$('#dictate').textContent='◉ Dictate';};try{speech.start();$('#dictate').textContent='■ Stop dictation';}catch{stopDictation();toast('Could not start dictation. Use your keyboard microphone.');}}
const prompts=['Describe a place you miss without saying its name.','Write a chorus around something you almost said.','Give an ordinary object a secret it has been keeping.','Write four lines that move from darkness into light.','Tell the same moment from two different points of view.','Start with “I used to think…” and let the last line disagree.','Hum three notes. Repeat them, changing only the last note.','Write a verse using only things you can see, hear or touch.','Turn a small frustration into an absurdly dramatic love song.','Write a goodbye that never uses the word goodbye.'];
const rhymeBank={'Light':'night · bright · flight · sight · tonight · ignite · alright','Home':'roam · foam · chrome · alone (near) · unknown (near)','Stay':'away · day · play · grey · sway · yesterday','Blue':'through · true · new · knew · grew · undo','Rain':'again · remain · train · refrain · explain · terrain','Heart':'start · apart · art · depart · chart · restart'};
function nextPrompt(){$('#prompt').textContent=prompts[Math.floor(Math.random()*prompts.length)];}
function bind(){for(const field of ['title','tags','lyrics','notes'])$('#'+field).oninput=()=>{active[field]=$('#'+field).value;wordCount();changed();};for(const field of ['kind','stage','sound'])$('#'+field).onchange=()=>{active[field]=$('#'+field).value;changed();};$('#bpm').onchange=()=>{active.bpm=Math.max(40,Math.min(200,Number($('#bpm').value)||84));$('#bpm').value=active.bpm;changed();};$('#key').innerHTML=notes.map((n,i)=>`<option value="${i}">${n} major</option>`).join('');$('#chordAdd').innerHTML=notes.flatMap(n=>['','m','7','maj7','m7'].map(s=>`<option>${n+s}</option>`)).join('');$('#key').onchange=()=>{stopLoop();const key=+$('#key').value,delta=key-active.key;active.chords=active.chords.map(c=>{const m=/^([A-G]#?)(.*)$/.exec(c);return notes[(notes.indexOf(m[1])+delta+12)%12]+m[2];});active.key=key;renderChords();changed();};$('#addChord').onclick=()=>{if(active.chords.length>=64)return toast('Keep this sketch to 64 bars or fewer.');active.chords.push($('#chordAdd').value);renderChords();changed();};$('#clearChords').onclick=()=>{stopLoop();active.chords=[];renderChords();changed();};$$('[data-preset]').forEach(b=>b.onclick=()=>{stopLoop();const index=+b.dataset.preset;active.chords=presets[index].map(n=>notes[(n+active.key)%12]+(index===3?'7':n===9?'m':''));renderChords();changed();});$('#loop').onclick=()=>loopRunning?stopLoop():startLoop().catch(()=>toast('Could not play audio. Tap again or check your browser audio settings.'));$('#volume').oninput=()=>{if(master)master.gain.value=+$('#volume').value/100;};$('#beatPreset').onchange=()=>applyBeat($('#beatPreset').value);$('#drums').onchange=()=>{active.drums=$('#drums').checked;changed();};$('#newIdea').onclick=newIdea;$('#emptyNew').onclick=newIdea;$('#star').onclick=()=>{active.star=!active.star;$('#star').textContent=active.star?'★':'☆';$('#star').setAttribute('aria-pressed',String(active.star));changed();};$('#search').oninput=renderList;$$('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;$$('[data-filter]').forEach(el=>el.classList.toggle('active',el===b));renderList();});$$('[data-tab]').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));$('#openLibrary').onclick=()=>$('#library').classList.add('open');$('#closeLibrary').onclick=()=>$('#library').classList.remove('open');$('#record').onclick=()=>recording?stopRecording():startRecording();$('#recordLoop').onclick=()=>recording?stopRecording():startRecording(true);$('#withBacking').onchange=syncRecordUI;$('#micCheck').onclick=soundCheck;$('#releaseMic').onclick=()=>{releaseMic();$('#recordStatus').textContent='Microphone off.';};$('#installOpen').onclick=()=>$('#installDialog').showModal();$('#audioFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(file.size>50*1024*1024){toast('Please use an audio clip under 50 MB.');e.target.value='';return;}if(!file.type.startsWith('audio/')){toast('Choose an audio file.');return;}active.takes.push({id:uid(),name:file.name,created:Date.now(),blob:file,withLoop:false,duration:0});await save().catch(()=>{});renderTakes();renderList();$('#takeCount').textContent=active.takes.length;e.target.value='';};$('#dictate').onclick=dictate;$('#menuOpen').onclick=()=>$('#optionsDialog').showModal();$('#backupOpen').onclick=()=>$('#backupDialog').showModal();$('#inspireOpen').onclick=()=>{nextPrompt();$('#inspireDialog').showModal();};$$('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('#nextPrompt').onclick=nextPrompt;$('#rhymeFamily').innerHTML=Object.keys(rhymeBank).map(k=>`<option>${k}</option>`).join('');$('#rhymeFamily').onchange=()=>$('#rhymes').textContent=rhymeBank[$('#rhymeFamily').value];$('#rhymeFamily').onchange();$('#duplicate').onclick=async()=>{if(recording||recordStarting||recordFinalizing)return toast('Finish recording first.');await save().catch(()=>{});const copy=structuredClone(active);copy.id=uid();copy.title=(copy.title||'Untitled idea')+' (copy)';copy.updated=Date.now();copy.takes.forEach(t=>t.id=uid());ideas.push(copy);selectIdea(copy.id);save();$('#optionsDialog').close();};$('#exportText').onclick=()=>download(new Blob([`${active.title||'Untitled idea'}\n${active.kind} · ${active.stage}\n\n${active.lyrics}\n\nSCRATCHPAD\n${active.notes}\n\nCHORDS\n${active.chords.join(' | ')}\n${active.bpm} BPM`],{type:'text/plain'}),(active.title||'idea')+'.txt');$('#exportIdea').onclick=()=>exportItems([active]);$('#exportAll').onclick=()=>exportItems(ideas);$('#importBackup').onchange=e=>{importBackup(e.target.files[0]);e.target.value='';};$('#archive').onclick=()=>{if(recording||recordStarting||recordFinalizing)return toast('Finish recording first.');active.archived=!active.archived;changed();renderList();$('#optionsDialog').close();toast(active.archived?'Idea archived. Find it in Archive.':'Idea restored.');};$('#delete').onclick=async()=>{if(recording||recordStarting||recordFinalizing)return toast('Finish recording first.');if(!confirm('Delete this idea and all its recordings? Export it first if you want a copy.'))return;clearTimeout(saveTimer);await savePending.catch(()=>{});const id=active.id;try{await mutateIdeas([{id}],true);ideas=ideas.filter(x=>x.id!==id);active=null;selectIdea(ideas.find(x=>!x.archived)?.id);$('#optionsDialog').close();}catch(err){toast(err.name==='ConflictError'?err.message:'Could not delete this idea.');}};document.addEventListener('visibilitychange',()=>{if(document.hidden){if(recording&&recorder.state==='recording')stopRecording('App moved to the background');else{stopLoop();releaseMic();}stopDictation();save();}});window.addEventListener('pagehide',()=>save());window.addEventListener('beforeunload',e=>{if(recording||recordFinalizing){e.preventDefault();e.returnValue='';}});}
async function init(){bind();try{db=await openDB();ideas=await readAll();const recovered=await recoverSessions();if(!ideas.length&&!localStorage.getItem('verse-started')){const example=makeIdea('Where the light lands');example.tags='sample, acoustic, morning';example.stage='Growing';example.lyrics='[Verse]\nThere’s a little light left on the windowsill\nAnd a half-made promise that I’m keeping still\n\n[Chorus idea]\nMaybe home is where the light lands\nMaybe time is softer in your hands';example.notes='A sample to explore. Make it your own, or start a new idea.\nTry a slower tempo and hum over the chords.';ideas=[example];await writeIdeas(ideas);localStorage.setItem('verse-started','1');}$('#saveState').textContent='Saved on this device';selectIdea(ideas.filter(x=>!x.archived).sort((a,b)=>b.updated-a.updated)[0]?.id);if(recovered){toast(recovered+' interrupted take(s) recovered. Check Takes.');switchTab('takes');}syncRecordUI();}catch{$('#saveState').textContent='Storage unavailable';toast('Your browser could not open storage. Try a regular Safari or Chrome window.');$('#newIdea').disabled=true;$('#emptyNew').disabled=true;$('#empty').hidden=false;}}
init();
