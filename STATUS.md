# STATUS

Updated: 2026-11-06 by lead. Canonical current facts on main; discovery artifacts are under review on a branch.

## Now
- Verse registered in Orca: repo `dc5e76f5-5b54-43ef-a199-4f8e0e3813c3`, project `github:debodin-alt/verse`.
- GitHub source is public: https://github.com/debodin-alt/Verse; app baseline `c6fb551` (0.2.0).
- Existing hosted app: https://verse-daniel-songbook.dantheman1980.chatgpt.site ; Sites account confirms custom owner-only access, no external viewers. Latest saved version is 2; source SHA differs from GitHub head, byte parity not established.
- Discovery branch/worktree: `debodin-alt/verse-discovery`, `/Users/danielbodin/orca/workspaces/Verse/verse-discovery`; draft PR https://github.com/debodin-alt/Verse/pull/1 . Lead Codex conducting review and interview; three founder lens subagents completed advisory memos (no Orca coding workers dispatched).
- Founder board: 3 FUND IF, average 5.3/10; product focus stronger than evidence of buyer demand/distribution. Conditional qualitative advice, not market validation. Round-1 interview, commercial architecture alternatives and board memos are on the discovery branch.
- Baseline checks pass. Browser text capture/save/reload and loop scheduling observed; physical iPhone recording and recovery unverified.
- Discovery docs on branch: `docs/discovery/2026-11-06.md` and `docs/discovery/workflows-and-evaluations.md`.

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
- Preserve existing user data; never clear storage as normal upgrade/troubleshooting.
- No major rewrite or release architecture decision before evidence, interview and scope checkpoint.
- No new paid services, external AI processing, analytics, audience changes or accounts without an explicit decision.

## Next
1. Daniel answers round 2 on offline/background, sync, lyric versions, pricing hypothesis and operating budget; lead continues competitor research and evidence review.
2. Agree scope/architecture and complete versioned brief, ADR, migration/data design, backlog, test matrix and delivery/recovery plan.
3. Merge docs-only file trail with Daniel's approval before starting build worktrees.

## Open questions
- Detailed separate-track behaviour, launch order and exact iPhone/iOS remain open.
- Offline/background needs, organisation/takes, backup/sync/privacy, exports, distribution and maintenance tolerance.
- Real-device audio/routing/recovery remains a release evidence gap.
