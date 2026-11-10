# Verse validation matrix — draft

Baseline automated checks: `npm run check`. Optional investigation harness: `node scripts/review-browser.mjs /absolute/path/to/playwright/index.mjs /absolute/result/directory`. Playwright/Chrome must already exist; the script installs nothing, serves the checked-out dist on loopback and uses new disposable contexts and a fake microphone. Its results do not establish real device recording quality. Do not point it at hosted user data.

Offline-specific checks: worker failure/request-boundary tests are in ordinary `npm run check`; real browser lifecycle tests use `node scripts/review-offline-orca.mjs orca /absolute/result/directory`. They create an isolated profile, refuse server connections during offline stages and inject a Web Audio source for native MediaRecorder; they do not prove microphone permission/routing or physical-phone behaviour.

| Area | Automated/browser proof required | Physical proof required |
|---|---|---|
| Capture/catalogue | new text/poem/fragment, search/star/archive, save/reload, no input loss | iPhone portrait, software keyboard, large text, quick reopen and return to an old idea |
| Write with backing | 1440px side-by-side/320–1024px stacked layout; one shared lyrics editor; type/switch/resize without resetting loop; held save across views; synthetic recording with lyric edits; offline reopen/export/stale-tab preservation | actual phone software keyboard, touch jump links, VoiceOver and stop/save reachability while editing/recording |
| Offline | first install online, close/reopen offline; text/record/local save/reopen; useful first-time offline state | airplane mode on actual Safari/Home Screen app; device dictation availability disclosed |
| Persistence | v1/v2 fixtures, exact fields/audio hashes, blocked migration, retries, stale-tab conflicts | existing disposable library survives actual app update; never clear storage |
| Recording | real MediaRecorder with synthetic source, start/stop/finalisation, preserved loop phase, exact saved bytes and media decode | phone microphone with speaker and actual wireless routes, voice-only and backing; level/latency/clipping/drift judged from recordings |
| Stem/mix | independent voice/backing assets and alignment; prior take unaffected by loop edits; mix/stem decode/export and original dates/bytes | sing/clap against click; compare onset/end for 10-second and 2-minute takes on both mobile platforms; judge level, clipping, timing and audible quality |
| Failures | denied/dismissed mic, injected writes failing before/during/final capture, zero bytes, corrupt/oversize imports | permission denial/re-enable, headphone disconnect, app switch/lock, incoming call; controls and recovery on return |
| Backup/recovery | download full JSON and import into fresh profile; exact audio hashes, original dates, additive identity mapping, no partial import; idempotent journal recovery | back up a disposable library to Files, restore in a separate safe context and replay; interrupted media may be incomplete and must be labelled |
| Accessibility | labels, roles, keyboard/focus, hidden library, contrast/target measurements; Lighthouse when tool available | VoiceOver, larger text, keyboard overlap, reachable stop/save controls and readable errors |
| Delivery | artifact/commit identity, safe caching/update, offline fallback, old-code/data compatibility | update installed preview, retain data, reopen offline and record/replay again |
| All-platform release | signed/testable iOS and Android packages plus web artifact tied to reviewed source; file sharing and browser/native transfer checks | physical iPhone and Android plus Mac/web pass required journeys; coordinate release only after all are ready, with store approvals for public distribution |
| Commercial | two-user isolation, sync conflicts/duplicate upload, quota; account deletion/export; signed billing event replay/refund/expiry | store sandbox buy/restore/cancel and account switching; review access and customer recovery |

## Short device checks

Before testing use a disposable idea and export existing work; do not clear storage. Record phone model, OS, Safari versus Home Screen/native, headphone model/route and app version/commit.

1. **Capture:** after one online load, wait for Ready for offline capture; create a disposable idea and wait for saved status. Close Verse, enable airplane mode, reopen the same app/browser, find the idea, add a distinctive line, wait for saved status, close/reopen and confirm the line. Never clear storage. First-ever offline entry and OS dictation are outside this guarantee.
2. **Voice/backing:** play a default loop, listen to its level, record a 10-second sung/clapped take with normal wireless headphones, stop/save, replay, reopen and replay again. Report level changes, missing beginnings, alignment and distorted audio. Repeat for voice-only and speaker only if that route matters.
3. **Background:** start a disposable take, wait several seconds, switch apps or lock, then return. Expect stopped capture plus truthful saved/recovered state. Replay the available audio; repeat headphone disconnection. Force-quit tests follow only after the backup drill succeeds.
4. **Backup:** export the disposable library, restore into a separate safe test context and confirm text, names and playable recordings. Never overwrite the only copy to test recovery.

A simulator/desktop emulation cannot sign off iPhone audio sessions or Bluetooth behaviour. Device failures become backlog/reproduction cases, not reasons to erase storage.
