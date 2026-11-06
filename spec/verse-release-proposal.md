# Verse release proposal v0.1 — 2026-11-07

Status: draft for scope/architecture agreement. No build authorised by this document. Pending round-3 answers may change exports, sharing and rollout.

## Product brief

Verse is a songwriting and poetry workspace between a general notes app and a production DAW. Start with Daniel and writers who capture lyrics/topics/fragments or melodies, return to unfinished ideas, and occasionally freestyle over simple backing. Preserve the current familiar sample, readable writing surface and dedicated catalogue.

Objective: retain an idea immediately, develop it with simple backing, record a take, then reopen and continue without losing creative work.

Target journeys:
1. Open Verse offline after a prior successful installation/load; create a lyric/topic/poem, type or use device dictation, save, close and reopen, find it through the catalogue/search and continue. First-ever installation and OS dictation may need internet; disclose this distinction.
2. Open an idea, select simple chords/beat, play backing, capture a voice take against it, stop/save, replay and later adjust voice/backing balance or export a mix. Starting a take must not restart an already-running loop.
3. Start a quick voice-only melody take and attach words later.
4. Leave the foreground/lock the phone during capture: stop, preserve available audio and explain the saved/recovered state on return. Do not advertise background recording.
5. Export a complete backup and restore it alongside existing work; failures preserve the original catalogue.

## Two release gates (recommended, not yet agreed)

**MVP / private validation release:** keep the current UI; offline app startup/capture, safe stop/save, independent voice/backing assets for new takes, mixed playback/export, data-loss fixes, tested backups/migration/recovery and usable device preview. No payment integration; no new account needed for local creation. Existing hosted access remains unchanged unless explicitly approved. Manual off-device backups remain necessary and must be visible. Validate on actual devices before treating this as the only copy of work.

**First full public paid release:** MVP plus managed account/backup/sync, customer ownership/isolation, a measured storage allowance, support and account recovery/deletion/export, reproducible platform builds, documented incident/recovery procedures and one simple annual plan if customer/cost evidence supports it. Web/iOS/Android rollout order awaits Daniel. Billing uses appropriate store/web channels and shared verified access; unpaid/expired accounts retain a route to retrieve/export their work. No public launch until these gates and device tests pass.

This splits validation from commercial obligations; it is not a promise that a local-only MVP is ready for paying customers.

## Requirements

R1. Preserve the catalogue, types, words, notes, tags, progress, stars/archive, sample and core visual experience.
R2. Persist edits and recordings locally while offline, show truthful save/recovery states, prevent silent concurrent-tab overwrites.
R3. Preserve old data and legacy mixed takes through upgrades. Never reset storage as an upgrade or troubleshooting measure.
R4. Record voice-only or against backing. New takes retain independent voice/backing assets and backing settings/timing; mix playback/export must use the intended alignment. Editing a progression must not change a saved performance silently.
R5. On background/lock, stop capture and save what is available. On denial, interruption or storage failure, keep the notebook usable and expose recovery/download where possible. Do not label a failed save successful.
R6. Backup includes all user words, settings and audio; validation rejects unsupported/corrupt input before mutation. Restore adds copies by explicit design, preserving meaningful original timestamps and exact audio bytes.
R7. Offline startup uses a versioned static shell after installation. Updates wait until recording/saves settle; old cached shell remains available after a failed update.
R8. Full paid release adds private managed sync/backup without making capture depend on a connection or billing request. No creative content in analytics/logs; no external AI processing.

## Exclusions and later opportunities

No DAW timeline, destructive waveform editing, multitrack production suite, tab editor, AI writing/transcription, lyric-version UI, background recording or unlimited hosted audio promise. MIDI/project exports, collaboration/public links, richer instruments and native desktop app remain options; round-3 export/sharing answers may refine this list.

## Draft MVP acceptance criteria

- [ ] AC01: existing version-1 and version-2 fixture libraries retain idea IDs, text, settings, timestamps and audio hashes after upgrade; all legacy mixed takes remain playable where their codecs are supported.
- [ ] AC02: after one online installation, airplane-mode reopen displays the catalogue and permits new text/voice capture, local save and subsequent reopen. First-time offline entry gives a useful explanation.
- [ ] AC03: new takes preserve separate voice/backing assets, capture timing and frozen backing identity; changing the current loop does not alter an earlier take. Replay and mix/stem exports meet agreed device timing/quality checks.
- [ ] AC04: record-over-loop preserves running-loop phase; stopped backing starts as specified. Save waits for final media events and committed data before confirming success.
- [ ] AC05: denial, permission dismissal, microphone disconnect, app switch and lock produce usable controls and truthful save/recovery messages. Recordings do not continue in the background as a product promise.
- [ ] AC06: injected write failures preserve existing committed data and available audio; an unsaved take can be downloaded; a journal is removed only after a durable take exists; startup recovery is idempotent.
- [ ] AC07: downloaded full backup restores into a fresh test profile with exact audio hashes and agreed fields, preserves original dates, and leaves existing ideas untouched. Corrupt/unsupported input creates no partial import.
- [ ] AC08: editing in a stale tab cannot silently replace newer content or remove a newer take; a safe conflict/blocked-edit path is explained.
- [ ] AC09: key capture controls remain usable at 320/390px width, with the software keyboard and larger text. Closed-library controls are not focusable; accessible labels/status announcements and keyboard navigation are verified.
- [ ] AC10: the release artifact maps to a reviewed commit; preview/device test results, limitations, update instructions and data-compatible rollback/recovery steps are documented. All relevant automated checks pass and Daniel accepts physical-device results.

## Full-release additions

- [ ] FC01: account isolation and authorised media access proven with two users; exports/deletion/recovery and data retention documented.
- [ ] FC02: offline edits/audio reconcile after reconnection without silent overwrite; retry/duplicate upload and quota cases tested; backup restore drill succeeds independently of sync.
- [ ] FC03: verified purchase/renewal/expiry/refund events are idempotent; restore purchases and account linking work; cancellation does not delete creative work; support can reconcile access without reading songs.
- [ ] FC04: final storage/cost limits, annual price hypothesis, platform/region policy checks, customer support owner and maintenance cadence accepted before selling.

## Definition of done

Each increment meets its accepted criteria; meaningful regression tests pass; runtime behaviour and console are checked; storage changes have preservation/migration tests before implementation; source/review/docs are current; no unapproved services/spend/exposure; remaining device limits are explicit. Release additionally needs approved physical iPhone results, recovery drill, deploy/rollback instructions and Daniel's merge/deploy agreement. A passing synthetic-audio test cannot satisfy a physical-device criterion.
