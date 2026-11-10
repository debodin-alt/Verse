# Verse

A phone-friendly songwriting notebook. Capture lyrics and voice ideas, develop them with chords and drum loops, and keep your works in progress together.

## Run

Requires Node 20 or later for development and tests. No package installation is needed. The checked-in offline worker is generated from the app files; regenerate it whenever those files change.

```sh
npm run dev              # http://localhost:5173
npm run prepare:offline  # after editing static app files or the worker template
npm run check            # syntax, pinned shell, core/recording/worker regressions
```

Deploy the `dist/` directory to any HTTPS static host. Microphone recording needs HTTPS (localhost also qualifies) and browser permission. The current private ChatGPT Site provides the access gate; a different host must supply its own access restrictions if required.

## Record over a loop

Step 2 / **Play** keeps your lyrics editable while you develop the backing. On a wide desktop, lyrics and music controls sit side by side; on smaller screens they stack, with Lyrics/Backing links to move between them. Words and Play use the same editor, autosave and selected idea. Typing or changing views keeps a running loop going. The Words view remains available for focused quick capture. Chord annotations above lyrics are a later exploration.

1. Open Play and choose chords and/or a drum pattern.
2. Press Play loop to experiment. Press **Record over this loop** when ready. A running loop continues rather than restarting.
3. Allow microphone access. For iPhone, use **Sound check → Enable mic & check sound** first if opening the microphone changes volume. Set comfortable device volume after permission is granted. Use headphones to avoid recording the backing twice through the microphone.
4. Press **Stop & save take**. Wait for the saved banner; Takes opens automatically for playback and download.
5. For an unaccompanied idea, turn off **Include loop** and use **Record voice only**.

The app requests the browser's play-and-record audio session before mic capture, resumes its audio context after the route transition, and restores playback mode after releasing the mic. Browser and OS routing (especially Bluetooth) cannot be guaranteed by JavaScript. No automatic gain boost is applied. This change needs physical iPhone verification.

## Data safety

Existing `verse-notebook` IndexedDB data is preserved by an additive upgrade from versions 1/2 to version 3. Version 3 adds a separate revision/deletion-marker store; existing idea and recording records are retained. If another old Verse tab blocks the upgrade, save/export its work and close it, then let the updated tab finish opening. Do not clear storage. Older version-2 app code cannot open a database already upgraded to version 3; recover with compatible code rather than downgrading/deleting the database.

Each recording writes a recovery checkpoint when MediaRecorder supplies a chunk (requested every two seconds; timing is browser-controlled). A complete take is saved before its checkpoint is removed. Reopening recovers available interrupted audio once; incomplete media may not play in every browser. Closing/force-quitting before the first chunk is emitted can still lose that audio. No background-recording guarantee is made.

If an idea changed in another tab, its stale save is rejected instead of replacing newer work. **Export your copy before reloading** the stale tab; its unsaved words/audio remain in memory, and Backup & restore can export them. Deletion markers prevent an old tab silently recreating a deleted idea. Saves within a single tab remain ordered. Backup imports create new copies while retaining original creation/modification dates and recording bytes.

Full backups include text, settings and recording bytes. Import is additive. Clearing browser data deletes local work. Use **Backup & restore** regularly. Safari and the Home Screen app may have separate storage, so export/import when switching.

## Phone use

Open in Safari and choose **Share → Add to Home Screen**. After an online load, wait for **Ready for offline capture** before relying on offline reopening. Use the same address and browser/Home Screen context: browser profiles and origins have separate data.

The app keeps a verified copy of its static files for offline typing, local backing, recording, saving and replay. Permission/codec support still applies. First-ever setup, sign-in and some OS/browser dictation need internet. Browser eviction can remove offline files/data; this is not a backup or a sync service. Hosted sign-in/cache behaviour and real iPhone/Home Screen recording still need release validation.

Updates prepare a separate complete copy and wait until all old Verse tabs are closed. Finish your take, wait for its saved confirmation, then close all Verse windows and reopen to use a pending update. Never clear storage to update. A failed download/redirect/mismatched asset leaves the existing offline release in place. The cache contains only app files, not songs, recordings, backups, auth pages or API responses. Local offline access is available to someone using the same device/browser profile; hosted sign-in does not encrypt local work.

## Included

- Ideas with song/poem/fragment types, progress, tags, search, stars and archive.
- Lyrics, scratchpad, optional browser speech recognition and keyboard dictation fallback.
- Synthesised chords, transposition, four progression presets, three timbres, tempo and volume.
- 16-step kick/snare/hat grid, three rhythm presets, Web Audio look-ahead scheduling.
- Microphone takes, optional backing mixed into the take, input meter, sound check, visible save confirmation, audio import/download and interrupted-take recovery.
- IndexedDB persistence, full JSON backup including audio, validated additive restore, text export.
- Responsive interface, one labelled sample idea, original writing prompts and small curated rhyme bank.

## Limits

This is a browser app, not an installed native iPhone app. Data remains in the browser on one device; no automatic cloud sync. Export backups regularly. Microphone and speech recognition support varies by browser. The app stops recording when it goes into the background to avoid claiming reliable background recording. Use headphones for a clean voice plus backing recording. Audio is a sketch synthesizer, not sampled acoustic instruments. No multitrack editing, tab editor, AI lyric generation, large rhyme dictionary, MIDI export or automatic transcription. Google Fonts is optional; system font fallbacks are provided.

## Validation

`test-core.cjs` checks chord intervals and backup validation. `tests/recording.cjs` simulates the recording lifecycle to verify continuing a running loop, starting backing when stopped, preserving application gain, completion before re-enabling capture, saving before checkpoint cleanup, and keeping failed saves downloadable. These are regression tests, not physical microphone or Safari routing tests.

`scripts/review-browser.mjs` additionally uses an existing Playwright installation and Chrome with disposable profiles and a synthetic microphone. Pass the module path and an output directory as its arguments. It verifies version-1/2 fixtures, timestamp/audio backup preservation, stale-write and deletion protection, queued saves, truthful save status and failed-save recovery using real IndexedDB. It installs no dependencies, blocks optional external fonts and writes synthetic backups only to the chosen output directory. This optional probe is not currently part of CI and does not verify a real iPhone/Android audio route.

Offline worker boundary/failure tests run in `npm run check`; they are not browser lifecycle proof. The optional `node scripts/review-offline-orca.mjs orca /absolute/result/directory` uses the supported Orca browser in a new isolated profile, actual offline app/data paths and an injected synthetic audio signal. It installs nothing and never uses the real microphone or existing browser profile. Read [the offline ADR](docs/adr/0002-offline-static-shell.md) and [increment criteria](spec/offline-capture-increment.md) for deployment limits and recorded verification.

The combined-writing journeys use `node scripts/review-workspace-orca.mjs orca /absolute/result/directory`. This checks the real responsive UI, keyboard controls, loop continuity, pending saves, synthetic recording, offline reopen, export payloads and stale-tab protection in a disposable profile. It uses native focus/Enter activation because Orca's emulated wide-viewport pointer missed the loop button during investigation. Human microphone/routing, touch/keyboard behaviour on an actual phone and full accessibility certification remain separate checks.

## Next improvements

1. Test microphone and keyboard dictation on a physical iPhone; tune capture latency.
2. Add authenticated durable cloud backup/sync and conflict handling.
3. Add named chord variations per idea and section-specific progressions.
4. Add MIDI export, tap tempo and richer drum sounds.
5. Package the shared app for iOS and Android under the accepted all-platform plan; native audio capabilities depend on device proof. See `spec/verse-release-proposal.md` for the complete release scope and remaining gates.
