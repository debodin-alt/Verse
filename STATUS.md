# STATUS

Updated: 2026-11-07 by lead. Canonical current facts on main; discovery artifacts are under review on a branch.

## Now
- Verse registered in Orca: repo `dc5e76f5-5b54-43ef-a199-4f8e0e3813c3`, project `github:debodin-alt/verse`.
- GitHub source is public: https://github.com/debodin-alt/Verse; app baseline `c6fb551` (0.2.0).
- Existing hosted app: https://verse-daniel-songbook.dantheman1980.chatgpt.site ; Sites account confirms custom owner-only access, no external viewers. Latest saved version is 2; source SHA differs from GitHub head, byte parity not established.
- Discovery branch/worktree: `debodin-alt/verse-discovery`, `/Users/danielbodin/orca/workspaces/Verse/verse-discovery`; draft PR https://github.com/debodin-alt/Verse/pull/1 . Lead Codex conducting review and interview; three founder lens subagents completed advisory memos (no Orca coding workers dispatched).
- Founder board: 3 FUND IF, average 5.3/10; product focus stronger than evidence of buyer demand/distribution. Conditional qualitative advice, not market validation. Round-1 interview, commercial architecture alternatives and board memos are on the discovery branch.
- Baseline checks pass. Isolated Chrome verifies text persistence, native MediaRecorder with synthetic mic plus saved/reopened playback, full backup/audio-byte restore, v1→v2 DB fixture preservation, mic denial and injected save-failure recovery. Physical iPhone recording/routing/interruption remains unverified.
- Reproduced defects: stale tab overwrites newer lyrics; backup restore resets idea creation times. No app source/schema fixes made yet.
- Draft scope/ADR/data model/backlog/test matrix/delivery plan and dated assessment are on the discovery branch. Recommendation is private validation release first, managed backup/sync and commercial operations before public paid launch; not yet accepted.
- Round-3 product choices are answered: text/mix/separate voice-backing file exports, private file sharing, and all three platforms launching together. Concrete v0.3 checkpoint proposes shared current web UI plus Capacitor iOS/Android packages; architecture and discovery PR merge still need agreement.
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
- Preserve existing user data; never clear storage as normal upgrade/troubleshooting.
- No major rewrite or release architecture decision before evidence, interview and scope checkpoint.
- No new paid services, external AI processing, analytics, audience changes or accounts without an explicit decision.

## Next
1. Daniel reviews the concrete v0.3 scope/shared-web-plus-Capacitor architecture checkpoint and approves the discovery/file-trail PR merge before build worktrees start.
2. After approval, build small increments starting with preservation/integrity; establish suitable native build setup alongside shared product work. All three targets gate release.
3. Research supports annual-price testing, not an established willingness-to-pay range or profit forecast. No cloud/billing activation before provider/cost/account decisions.

## Open questions
- Scope/architecture checkpoint, suitable native build/signing setup and exact target-device details.
- Backup/sync service/cost ceiling and paid-release activation decisions; product export/sharing/rollout choices are answered.
- Real-device audio/routing/recovery remains a release evidence gap.
