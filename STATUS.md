# STATUS

Updated: 2026-11-07 by lead. Canonical current facts on main; discovery artifacts are under review on a branch.

## Now
- Verse registered in Orca: repo `dc5e76f5-5b54-43ef-a199-4f8e0e3813c3`, project `github:debodin-alt/verse`.
- GitHub source is public: https://github.com/debodin-alt/Verse; app baseline `c6fb551` (0.2.0).
- Existing hosted app: https://verse-daniel-songbook.dantheman1980.chatgpt.site ; Sites account confirms custom owner-only access, no external viewers. Latest saved version is 2; source SHA differs from GitHub head, byte parity not established.
- Planning PR https://github.com/debodin-alt/Verse/pull/1 merged with Daniel's explicit approval; scope v0.3 and ADR 0001 accepted. First implementation worktree: `/Users/danielbodin/orca/workspaces/Verse/verse-data-integrity`, branch `debodin-alt/verse-data-integrity`. Lead Codex building/reviewing V-01/V-02; no workers dispatched.
- Founder board: 3 FUND IF, average 5.3/10; product focus stronger than evidence of buyer demand/distribution. Conditional qualitative advice, not market validation. Round-1 interview, commercial architecture alternatives and board memos are on the discovery branch.
- Baseline checks pass. Isolated Chrome verifies text persistence, native MediaRecorder with synthetic mic plus saved/reopened playback, full backup/audio-byte restore, v1→v2 DB fixture preservation, mic denial and injected save-failure recovery. Physical iPhone recording/routing/interruption remains unverified.
- First implementation fixes target stale-tab overwrites/deletion resurrection, restore dates and premature saved feedback. Branch adds transactional revision/deletion markers in IndexedDB v3 while preserving v1/v2 creative records. Not merged or deployed; review/test evidence belongs to that branch.
- Accepted scope/file trail is on main: private all-platform validation first, managed backup/sync/customer billing before public paid launch. Shared current web UI plus Capacitor iOS/Android packaging approved; no new services or paid spend activated.
- Preview for data-integrity increment: http://localhost:5191 on this Mac, served in its Orca worktree. It has separate local test data; hosted app/data unchanged.
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
- Preserve existing user data; never clear storage as normal upgrade/troubleshooting.
- No major rewrite or release architecture decision before evidence, interview and scope checkpoint.
- No new paid services, external AI processing, analytics, audience changes or accounts without an explicit decision.

## Next
1. Finish/review V-01/V-02 data-integrity branch, publish its source/test evidence/preview in a PR for merge review.
2. Continue offline/capture/stem/native increments through Orca; establish suitable native build setup alongside shared product work. All three targets gate release.
3. Research supports annual-price testing, not an established willingness-to-pay range or profit forecast. No cloud/billing activation before provider/cost/account decisions.

## Open questions
- Suitable native build/signing setup and exact target-device details. Scope/architecture approval is complete.
- Backup/sync service/cost ceiling and paid-release activation decisions; product export/sharing/rollout choices are answered.
- Real-device audio/routing/recovery remains a release evidence gap.
