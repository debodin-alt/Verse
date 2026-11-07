# Verse release proposal v0.3 — 2026-11-07

Status: concrete scope/architecture checkpoint, awaiting agreement. Round 3 confirms text, mixed-audio and separate voice/backing exports; private file-based sharing; and a coordinated iOS, web and Android launch. These latest answers supersede an earlier local draft's mixed-only scope. Physical device details and build/signing setup remain to verify; they do not reopen the answered product questions.

## Product brief

Verse is a songwriting and poetry workspace between a general notes app and a production DAW. Start with Daniel and writers who capture lyrics/topics/fragments or melodies, return to unfinished ideas, and occasionally freestyle over simple backing. Preserve the current familiar sample, readable writing surface and dedicated catalogue.

Objective: retain an idea immediately, develop it with simple backing, record a take, then reopen and continue without losing creative work.

Target journeys:
1. Open Verse offline after a prior successful installation/load; create a lyric/topic/poem, type or use device dictation, save, close and reopen, find it through the catalogue/search and continue. First-ever installation and OS dictation may need internet; disclose this distinction.
2. Open an idea, select simple chords/beat, play backing, capture voice with independent backing, stop/save, replay and continue or export the mix or its separate voice/backing files. Starting a take must not restart an already-running loop. Preserve a saved take's backing/timing; no DAW timeline or waveform editor is required.
3. Start a quick voice-only melody take and attach words later.
4. Leave the foreground/lock the phone during capture: stop, preserve available audio and explain the saved/recovered state on return. Do not advertise background recording.
5. Export a complete backup and restore it alongside existing work; failures preserve the original catalogue.

## Two release gates (recommended, not yet agreed)

**MVP / private validation release:** preserve the current UI and catalogue; offline startup/capture, foreground stop/save, separate voice/backing for new takes, mixed playback/export, text export, data-loss fixes, tested backups/migration/recovery and usable iOS/web/Android previews. Existing mixed takes stay playable/exportable as mixed audio; do not promise isolated voice from old mixes. Sharing uses exported files only. No payments or new Verse account required for local creation. Preserve existing hosted access. Manual off-device backups remain necessary and visible. Internal increments may be tested separately; do not declare or launch the first release while a platform remains unvalidated.

**First full public paid release:** MVP plus managed account/backup/sync, customer ownership/isolation, a measured storage allowance, support and account recovery/deletion/export, reproducible platform builds, incident/recovery procedures and one simple annual plan if customer/cost evidence supports it. All three platforms launch together after their release gates pass. Mac access is through the web app; a separate native macOS app is excluded. Billing uses appropriate store/web channels and shared verified access; unpaid/expired accounts retain a route to retrieve/export their work. Public release waits for native signing/store approval and device evidence. Coordinated availability does not guarantee identical store review dates. Exact price/provider/spend still require their decisions before activation.

This splits validation from commercial obligations; it is not a promise that a local-only MVP is ready for paying customers.

## Requirements

R1. Preserve the catalogue, types, words, notes, tags, progress, stars/archive, sample and core visual experience.
R2. Persist edits and recordings locally while offline, show truthful save/recovery states, prevent silent concurrent-tab overwrites.
R3. Preserve old data and legacy mixed takes through upgrades. Never reset storage as an upgrade or troubleshooting measure.
R4. Record voice-only or against backing. New accompanied takes retain independent voice/backing audio and alignment metadata, supporting mixed playback/export and separate audio-file exports. Changing the current backing must not alter an earlier take. Legacy mixed recordings remain compatible and are honestly labelled.
R5. On background/lock, stop capture and save what is available. On denial, interruption or storage failure, keep the notebook usable and expose recovery/download where possible. Do not label a failed save successful.
R6. Backup includes all user words, settings and audio; validation rejects unsupported/corrupt input before mutation. Restore adds copies by explicit design, preserving meaningful original timestamps and exact audio bytes.
R7. Offline startup uses a versioned static shell after installation. Updates wait until recording/saves settle; old cached shell remains available after a failed update.
R8. Full paid release adds private managed sync/backup without making capture depend on a connection or billing request. No creative content in analytics/logs; no external AI processing.
R9. Private sharing uses text/audio/backup files. No public links, collaboration or public creative catalogue.
R10. iOS, web and Android are equal first-release targets. Native packages, migration/transfer, permissions, offline storage, playback/export and device checks are release gates on both mobile platforms. See the [native build readiness assessment](../docs/discovery/native-build-readiness.md).

## Exclusions and later opportunities

No DAW timeline, destructive waveform editing, production multitrack suite, tab editor, AI writing/transcription, lyric-version UI, background recording, MIDI/DAW project export, collaboration/public links, native desktop app or unlimited hosted audio promise in the first release. Separate voice/backing audio files are included; sophisticated production editing is excluded. Richer instruments and future integrations remain later opportunities.

## Draft MVP acceptance criteria

- [ ] AC01: existing version-1 and version-2 fixture libraries retain idea IDs, text, settings, timestamps and audio hashes after upgrade; all legacy mixed takes remain playable where their codecs are supported.
- [ ] AC02: after one online installation, airplane-mode reopen displays the catalogue and permits new text/voice capture, local save and subsequent reopen. First-time offline entry gives a useful explanation.
- [ ] AC03: new takes preserve independent voice/backing audio and alignment; save/reopen/replay, mixed export and separate-file exports retain the performance when the current loop changes. Text export works. Legacy mixes remain playable as mixes. Required physical iPhone/Android volume, routing, timing and audible quality checks pass.
- [ ] AC04: record-over-loop preserves running-loop phase; stopped backing starts as specified. Save waits for final media events and committed data before confirming success.
- [ ] AC05: denial, permission dismissal, microphone disconnect, app switch and lock produce usable controls and truthful save/recovery messages. Recordings do not continue in the background as a product promise.
- [ ] AC06: injected write failures preserve existing committed data and available audio; an unsaved take can be downloaded; a journal is removed only after a durable take exists; startup recovery is idempotent.
- [ ] AC07: downloaded full backup restores into a fresh test profile with exact audio hashes and agreed fields, preserves original dates, and leaves existing ideas untouched. Corrupt/unsupported input creates no partial import.
- [ ] AC08: editing in a stale tab cannot silently replace newer content or remove a newer take; a safe conflict/blocked-edit path is explained.
- [ ] AC09: key capture controls remain usable at 320/390px width, with the software keyboard and larger text. Closed-library controls are not focusable; accessible labels/status announcements and keyboard navigation are verified.
- [ ] AC10: the release artifact maps to a reviewed commit; preview/device test results, limitations, update instructions and data-compatible rollback/recovery steps are documented. All relevant automated checks pass and Daniel accepts physical-device results.
- [ ] AC11: the same agreed release is ready on web, signed/testable iOS and signed/testable Android with their device checks, private distribution/access and verified data-transfer procedure. A web-only result does not satisfy the first-release gate. Public store launch additionally waits for approval on both stores and the full-release criteria.

## Full-release additions

- [ ] FC01: account isolation and authorised media access proven with two users; exports/deletion/recovery and data retention documented.
- [ ] FC02: offline edits/audio reconcile after reconnection without silent overwrite; retry/duplicate upload and quota cases tested; backup restore drill succeeds independently of sync.
- [ ] FC03: verified purchase/renewal/expiry/refund events are idempotent; restore purchases and account linking work; cancellation does not delete creative work; support can reconcile access without reading songs.
- [ ] FC04: final storage/cost limits, annual price hypothesis, platform/region policy checks, customer support owner and maintenance cadence accepted before selling.

## Definition of done

Each increment meets its accepted criteria; meaningful regression tests pass; runtime behaviour and console are checked; storage changes have preservation/migration tests before implementation; source/review/docs are current; no unapproved services/spend/exposure; remaining device limits are explicit. Release additionally needs approved physical iPhone results, recovery drill, deploy/rollback instructions and Daniel's merge/deploy agreement. A passing synthetic-audio test cannot satisfy a physical-device criterion.
