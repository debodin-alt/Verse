# Verse

A phone-friendly songwriting notebook. Capture lyrics and voice ideas, develop them with chords and drum loops, and keep your works in progress together.

## Run

Requires Node 20 or later for development and tests. No package installation or build step is needed.

```sh
npm run dev    # http://localhost:5173
npm run check  # syntax, core and recording regression checks
```

Deploy the `dist/` directory to any HTTPS static host. Microphone recording needs HTTPS (localhost also qualifies) and browser permission. The current private ChatGPT Site provides the access gate; a different host must supply its own access restrictions if required.

## Record over a loop

1. Open Play and choose chords and/or a drum pattern.
2. Press Play loop to experiment. Press **Record over this loop** when ready. A running loop continues rather than restarting.
3. Allow microphone access. For iPhone, use **Sound check → Enable mic & check sound** first if opening the microphone changes volume. Set comfortable device volume after permission is granted. Use headphones to avoid recording the backing twice through the microphone.
4. Press **Stop & save take**. Wait for the saved banner; Takes opens automatically for playback and download.
5. For an unaccompanied idea, turn off **Include loop** and use **Record voice only**.

The app requests the browser's play-and-record audio session before mic capture, resumes its audio context after the route transition, and restores playback mode after releasing the mic. Browser and OS routing (especially Bluetooth) cannot be guaranteed by JavaScript. No automatic gain boost is applied. This change needs physical iPhone verification.

## Data safety

Existing `verse-notebook` IndexedDB data is preserved by an additive schema upgrade from version 1 to 2. Each recording writes a recovery checkpoint when MediaRecorder supplies a chunk (requested every two seconds; timing is browser-controlled). A complete take is saved before its checkpoint is removed. Reopening recovers any available interrupted audio once; incomplete media may not play in every browser. Closing/force-quitting before the first chunk is emitted can still lose that audio. No background-recording guarantee is made.

Full backups include text, settings and recording bytes. Import is additive. Clearing browser data deletes local work. Use **Backup & restore** regularly. Safari and the Home Screen app may have separate storage, so export/import when switching.

## Phone use

Open in Safari and choose **Share → Add to Home Screen**. A manifest and app icons provide a standalone window. This release does not cache the private app for offline startup or sync between devices.

## Included

- Ideas with song/poem/fragment types, progress, tags, search, stars and archive.
- Lyrics, scratchpad, optional browser speech recognition and keyboard dictation fallback.
- Synthesised chords, transposition, four progression presets, three timbres, tempo and volume.
- 16-step kick/snare/hat grid, three rhythm presets, Web Audio look-ahead scheduling.
- Microphone takes, optional backing mixed into the take, input meter, sound check, visible save confirmation, audio import/download and interrupted-take recovery.
- IndexedDB persistence, full JSON backup including audio, validated additive restore, text export.
- Responsive interface, one labelled sample idea, original writing prompts and small curated rhyme bank.

## Limits

This is a browser app, not an installed native iPhone app. Data remains in the browser on one device; no automatic cloud sync. Export backups regularly. Microphone and speech recognition support varies by browser. The app stops recording when it goes into the background to avoid claiming reliable background recording. Use headphones for a clean voice plus backing recording. Audio is a sketch synthesizer, not sampled acoustic instruments. No multitrack editing, tab editor, AI lyric generation, large rhyme dictionary, MIDI export, service-worker offline installation, or automatic transcription. Google Fonts is optional; system font fallbacks are provided.

## Validation

`test-core.cjs` checks chord intervals and backup validation. `tests/recording.cjs` simulates the recording lifecycle to verify continuing a running loop, starting backing when stopped, preserving application gain, completion before re-enabling capture, saving before checkpoint cleanup, and keeping failed saves downloadable. These are regression tests, not physical microphone or Safari routing tests.

## Next improvements

1. Test microphone and keyboard dictation on a physical iPhone; tune capture latency.
2. Add authenticated durable cloud backup/sync and conflict handling.
3. Add named chord variations per idea and section-specific progressions.
4. Add MIDI export, tap tempo and richer drum sounds.
5. Consider a native wrapper only if reliable background capture becomes essential.
