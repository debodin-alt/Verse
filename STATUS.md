# STATUS

Updated: 2026-11-10 by lead. Canonical current facts on main; data-integrity and offline increments merged, neither deployed.

## Now
- Verse registered in Orca: repo `dc5e76f5-5b54-43ef-a199-4f8e0e3813c3`, project `github:debodin-alt/verse`.
- GitHub source is public: https://github.com/debodin-alt/Verse; app baseline `c6fb551` (0.2.0).
- Existing hosted app: https://verse-daniel-songbook.dantheman1980.chatgpt.site ; Sites account confirms custom owner-only access, no external viewers. Latest saved version is 2; source SHA differs from GitHub head, byte parity not established.
- Planning PR https://github.com/debodin-alt/Verse/pull/1 merged with Daniel's explicit approval; scope v0.3 and ADR 0001 accepted. First implementation worktree: `/Users/danielbodin/orca/workspaces/Verse/verse-data-integrity`, branch `debodin-alt/verse-data-integrity`. V-01/V-02 increment merged; Orca card completed. No workers dispatched.
- Founder board: 3 FUND IF, average 5.3/10; product focus stronger than evidence of buyer demand/distribution. Conditional qualitative advice, not market validation. Round-1 interview, commercial architecture alternatives and board memos are on the discovery branch.
- Baseline checks pass. Isolated Chrome verifies text persistence, native MediaRecorder with synthetic mic plus saved/reopened playback, full backup/audio-byte restore, v1→v2 DB fixture preservation, mic denial and injected save-failure recovery. Physical iPhone recording/routing/interruption remains unverified.
- Data-integrity fixes on main prevent stale-tab overwrites/deletion resurrection, preserve restore dates and avoid premature saved feedback. IndexedDB v3 adds revision/deletion markers while retaining v1/v2 creative records. Not deployed; rollback requires v3-compatible code, never clearing/downgrading storage.
- Implementation PR https://github.com/debodin-alt/Verse/pull/2 merged with Daniel's explicit approval as `f89067a1b0bb3b1692d13a68fae6ab5bce0fb81b`. Approved head `6a507fd` had successful GitHub CI; post-merge local `npm run check` passes (19 core assertions plus recording simulations). Committed twelve-case real-IndexedDB/synthetic-audio browser evidence remains source-hash matched; it was not rerun for the merge. Browser probe is optional and not yet in CI. Physical-device/native release gates remain pending.
- Accepted scope/file trail is on main: private all-platform validation first, managed backup/sync/customer billing before public paid launch. Shared current web UI plus Capacitor iOS/Android packaging approved; no new services or paid spend activated.
- Preview for data-integrity increment: http://localhost:5191 on this Mac, served in its Orca worktree. It has separate local test data; hosted app/data unchanged.
- Offline PR https://github.com/debodin-alt/Verse/pull/3 merged with Daniel's explicit approval as `e65ac024e217456a759d28adae6bb07488cc94e5`; approved head `12b3c4a` had successful GitHub CI. Post-merge `npm run check` passes; committed eight-case Orca-browser evidence is unchanged, not rerun for the merge. Offline text/audio reopen, safe waiting/activation and failed update/first-setup handling use injected synthetic audio, not a real microphone. Standalone browser startup timeouts are not counted as passes. Orca offline workspace marked completed; preview http://localhost:5193 on this Mac retained for review. Not deployed.
- New Step 2 writing-workspace brief in `/Users/danielbodin/orca/workspaces/Verse/verse-writing-plan`, draft PR https://github.com/debodin-alt/Verse/pull/4 . Records Daniel's requirement to edit lyrics while developing/listening to backing; proposes desktop side-by-side/mobile stacked layout with shared lyrics/autosave and uninterrupted loop. Chords above lyrics are an optional exploration. Planning only; no app/data changes or workers.
- Offline app caches only eight hashed static files; no changes to IndexedDB v3 or existing recording logic. Run `npm run prepare:offline` after static edits; checks reject stale generated worker metadata. Updates wait until old app pages close. Physical phone/Home Screen and existing-host sign-in/worker/cache-policy validation remain release gates; offline browser access is not fresh server authentication or encryption.
- Native setup evidence: macOS 13.7.8, Command Line Tools selected; xcodebuild requires full Xcode and simctl is unavailable. No Java runtime/adb/Gradle/Android Studio/SDK found through PATH and checked standard paths. No native build/device/store validation claimed; current Capacitor iOS toolchain needs a suitable newer Mac/build host. No system/dependency/service changes made.

## Set up
| Thing | State | Notes |
|---|---|---|
| Local clone and Orca project | Done | `/Users/danielbodin/Verse` |
| Private hosted Site | Existing | `appgprj_6aeae4c3472881919db840c6fce739a9` |
| Sync / automatic cloud backup | Missing | Browser-local IndexedDB |
| Deployment pipeline | Missing in GitHub repo | Checks workflow only |
| Local gh CLI auth | Invalid token reported | Connected GitHub metadata tools work |
| iOS native toolchain | Not ready locally | Current macOS/toolchain cannot build proposed current iOS target |
| Android native toolchain | Not established | No runnable Java/SDK found in checked configuration |

## Decided
- 2026-11-06 interview: preserve most of the current Verse experience; quick words/idea capture and backing-first freestyle, with a dedicated catalogue. Target iPhone, Mac/web and Android; wireless headphones matter.
- 2026-11-06 interview: commercial destination confirmed, full app for sale. V1 may omit payments; future pricing/model undecided. Separate voice/backing capability plus mix save/export desired. No multitrack editor agreed.
- 2026-11-07 interview: offline use required; no recording while locked, leaning against recording while switching apps; stop/save is reasonable. No restorable lyric history. Cheap annual pricing preferred; professional advice requested. Little ongoing maintenance preferred; no recurring-cost ceiling supplied. V1 sync/backup recommendation delegated, not an approved service/account choice.
- 2026-11-07 round 3: text, mixed audio and separate voice/backing audio files accepted; MIDI/DAW project exports deferred. Private notebook with exported-file sharing; links/collaboration excluded. iOS/web/Android must launch together; no Android-later launch. These latest answers override a mixed-only uncommitted draft encountered during scope preparation.
- 2026-11-07: Daniel approved scope/architecture and planning PR #1 merge; it merged as e897f16. Implementation can proceed under the accepted file trail; future code merges/deployments retain their review/approval gates.
- Follow-up: capture and saving ideas must work offline; other offline features are not automatically required. Locking the phone or leaving the app may stop and save recording. Phone/OS/headphone details are deferred to device testing, not a blocker to these product decisions.
- 2026-11-09: Daniel explicitly approved PR #2 merge. Merge completed as `f89067a`; hosted app/deployment/audience unchanged.
- 2026-11-10: Daniel explicitly approved PR #3 merge; completed as `e65ac02`, no deployment. He requires lyrics to remain visible/editable in Step 2 while experimenting with music/loops, especially on desktop. Split view is a proposed layout; pencilling chords above lyrics is exploratory, not an approved annotation schema or editor expansion.
- Preserve existing user data; never clear storage as normal upgrade/troubleshooting.
- No major rewrite or release architecture decision before evidence, interview and scope checkpoint.
- No new paid services, external AI processing, analytics, audience changes or accounts without an explicit decision.

## Next
1. Review the concise Step 2 combined-writing workspace brief in draft PR #4. Land the file trail before the next build worktree; keep optional chord annotations separate from the essential edit-and-listen workflow. PR #3 is merged; host/device verification and deployment remain separate release work.
2. Continue capture/native work through Orca; establish suitable native build setup alongside shared product work. Recording/platform scope differences recorded in the intake recheck still require reconciliation before changing the accepted stem/all-platform requirements. All three targets remain in the merged release plan.
3. Research supports annual-price testing, not an established willingness-to-pay range or profit forecast. No cloud/billing activation before provider/cost/account decisions.

## Open questions
- Suitable native build/signing setup and exact target-device details. Scope/architecture approval is complete.
- Backup/sync service/cost ceiling and paid-release activation decisions; product export/sharing/rollout choices are answered.
- Real-device audio/routing/recovery remains a release evidence gap.
