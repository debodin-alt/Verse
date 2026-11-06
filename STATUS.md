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

## Set up
| Thing | State | Notes |
|---|---|---|
| Local clone and Orca project | Done | `/Users/danielbodin/Verse` |
| Private hosted Site | Existing | `appgprj_6aeae4c3472881919db840c6fce739a9` |
| Sync / automatic cloud backup | Missing | Browser-local IndexedDB |
| Deployment pipeline | Missing in GitHub repo | Checks workflow only |
| Local gh CLI auth | Invalid token reported | Connected GitHub metadata tools work |

## Decided
- 2026-11-06 interview: preserve most of the current Verse experience; quick words/idea capture and backing-first freestyle, with a dedicated catalogue. Target iPhone, Mac/web and Android; wireless headphones matter.
- 2026-11-06 interview: commercial destination confirmed, full app for sale. V1 may omit payments; future pricing/model undecided. Separate voice/backing capability plus mix save/export desired. No multitrack editor agreed.
- 2026-11-07 interview: offline use required; no recording while locked, leaning against recording while switching apps; stop/save is reasonable. No restorable lyric history. Cheap annual pricing preferred; professional advice requested. Little ongoing maintenance preferred; no recurring-cost ceiling supplied. V1 sync/backup recommendation delegated, not an approved service/account choice.
- Preserve existing user data; never clear storage as normal upgrade/troubleshooting.
- No major rewrite or release architecture decision before evidence, interview and scope checkpoint.
- No new paid services, external AI processing, analytics, audience changes or accounts without an explicit decision.

## Next
1. Daniel answers round 3 on export formats, private sharing/collaboration and platform rollout.
2. Agree the concrete release proposal and proposed ADR. Research supports annual-price testing, not an established willingness-to-pay range or profit forecast.
3. Merge the discovery/file-trail PR with Daniel's approval before starting build worktrees; prioritise data integrity and verified offline/capture journey.

## Open questions
- Detailed separate-track behaviour, launch order and exact iPhone/iOS remain open.
- Exact release stages, backup/sync service/cost ceiling, exports, sharing/privacy defaults and distribution order.
- Real-device audio/routing/recovery remains a release evidence gap.
