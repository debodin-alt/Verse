# STATUS

Updated: 2026-11-06 by lead. Canonical current facts on main; discovery artifacts are under review on a branch.

## Now
- Verse registered in Orca: repo `dc5e76f5-5b54-43ef-a199-4f8e0e3813c3`, project `github:debodin-alt/verse`.
- GitHub source is public: https://github.com/debodin-alt/Verse; app baseline `c6fb551` (0.2.0).
- Existing hosted app: https://verse-daniel-songbook.dantheman1980.chatgpt.site ; Sites account confirms custom owner-only access, no external viewers. Latest saved version is 2; source SHA differs from GitHub head, byte parity not established.
- Discovery branch/worktree: `debodin-alt/verse-discovery`, `/Users/danielbodin/orca/workspaces/Verse/verse-discovery`; lead Codex conducting review and interview, no workers dispatched.
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
- Personal usefulness first; no subscription business assumed.
- Preserve existing user data; never clear storage as normal upgrade/troubleshooting.
- No major rewrite or release architecture decision before evidence, interview and scope checkpoint.
- No new paid services, external AI processing, analytics, audience changes or accounts without an explicit decision.

## Next
1. Daniel answers first interview round; lead continues review, founder-board intake and short interview rounds.
2. Agree scope/architecture and complete versioned brief, ADR, migration/data design, backlog, test matrix and delivery/recovery plan.
3. Merge docs-only file trail with Daniel's approval before starting build worktrees.

## Open questions
- Capture-first versus backing-first; mixed versus separate tracks; actual iPhone/audio routes.
- Offline/background needs, organisation/takes, backup/sync/privacy, exports, distribution and maintenance tolerance.
- Real-device audio/routing/recovery remains a release evidence gap.
