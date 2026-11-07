# Verse renewed intake and verification — 2026-11-07

Application baseline: `c6fb551`; discovery began at `5cc30ac`. `dist/app.js` SHA-256 remains `9b16cee6e070991b5ac4a6181ec144f972c83679d881396478fd597abf60c465`. No application, storage schema or deployed assets changed in this intake.

## Concurrent-session scope conflict — unresolved

During this intake another session advanced the shared discovery branch through `7128be4` and merged planning PR #1 into main as `e897f16`. Its v0.3 specification records approval for independent voice/backing files and coordinated iOS/web/Android delivery. This conversation's explicit answer accepts mixed takes initially. Neither answer is silently discarded: a clarification was sent to Daniel before further scope edits or implementation.

The following evidence describes this session's work and observations at the time collected. It does not revoke the other session's approval or approve either architecture. The four current answers were commercial destination/private first release, lyrics and the current ledger-first experience, capture now/develop later, and mixed takes initially. Phone/OS/routes remain unanswered here.

To avoid further shared-file races, moved only this session's uncommitted report into a dedicated Orca evidence workspace `/Users/danielbodin/orca/workspaces/Verse/verse-intake-recheck`, branch `debodin-alt/verse-intake-recheck`, based on `e897f16`. Removed this session's own two-line uncommitted log insertion from the shared discovery workspace; preserved the other session's committed work. No coding agent was launched and no source fixes were implemented by this session.

## Registration and instructions

The existing Orca registration was verified and initially reused: project `github:debodin-alt/verse`, repo `dc5e76f5-5b54-43ef-a199-4f8e0e3813c3`, workspace `/Users/danielbodin/orca/workspaces/Verse/verse-discovery`, branch `debodin-alt/verse-discovery`, then-open draft [PR #1](https://github.com/debodin-alt/Verse/pull/1). The working tree was clean before this intake. Remote main was initially `1fb093c`; GitHub confirms public source. PR #1 subsequently merged in the concurrent session as described above.

Read the installed Orca CLI skill/guide and browser reference, home `.claude/CLAUDE.md`, memory index, factory template, current `origin/main:STATUS.md`, existing project discovery/release/data/delivery documents and relevant installed workflow instructions. No pre-existing Verse/ancestor AGENTS.md was found. A project AGENTS.md now records the applicable data-preservation and delivery conventions; the Agent Skills package's own AGENTS.md explicitly applies only to that package.

Supported SDLC: `/spec` interview and acceptance criteria, then `/build` and evidence-based `/review` after agreement. File-trail PR precedes build worktrees; Daniel approves merge/deploy. No build worktree or coding worker was launched.

## Interview update

Current answers reconfirm eventual commercial distribution with a private first release. Lyrics come first; preserve the current "ledger is first" experience. Prioritise capture words/melody immediately and develop later. This conversation accepts reliable mixed takes initially. Draft release/ADR/data-model/backlog/matrix edits reflected that answer before concurrent commits superseded the draft; no reversal of the merged scope was attempted. See the unresolved conflict above.

Exact phone/OS/routes and confirmation of offline/background preferences remain pending. Later rounds still cover organisation/takes, export/integration, backup/sync/privacy/ownership, sharing, initial testers/platform rollout and costs/maintenance. Earlier notes are retained as history, not silently treated as new answers.

## Founder and skill workflows

`orca skills installed --json` confirms `/founder-board`, `/founder-competitors`, `/founder-consumer`, `/founder-pricing`, `/founder-offer`, `/founder-cfo`, `/founder-marketing`, `/founder-brand`, `/founder-ops`, `/founder-launch`, `/founder-plan`, plus `/spec`, `/build`, `/review` and Agent Skills engineering instructions. There is no literal `/founder` CLI entry.

The prior founder-board memos and competitor assessment were read, not regenerated. The earlier board's 3 conditional votes are advisory judgements for that brief, not current market validation. Select board and competitor procedures to challenge the agreed user/job; update the brief after interview before reconvening. Pricing/CFO require real inputs; buyer simulation is optional and cannot prove demand. Do not run the whole commercial pack ceremonially for a personal validation release.

Reran the installed Agent Skills 0.6.8 documented evaluations:

| Procedure | Result | Meaning |
|---|---|---|
| `node scripts/validate-skills.js` | 25 skills; no errors/warnings | Tier 1 instruction structure |
| `node scripts/validate-commands.js` | 9 commands; no errors | Command parity/description consistency |
| `node scripts/run-evals.js --min-rank1 80` | 136 passed; no errors/warnings; 86% rank 1 (72/84) | Tier 2 lexical routing approximation |
| `node scripts/run-evals.js --behavioral code-review-and-quality --dry-run` | Printed one execution-fixture plan | Dry run only; no agent execution or behavioural verdict |

These evaluate the installed skill package, not Verse or the separate home founder pack. Chrome DevTools MCP tools are not exposed in this session, so its prescribed accessibility/performance audit did not run. No dedicated audio skill evaluator was found. Tier 3 was not executed; generic agent-fixture performance would not certify the app. Use the five-axis review, security boundaries and frontend/accessibility checks as relevant review procedures, with actual application tests and physical-device evidence.

## Fresh application verification

`npm run check` passed: syntax, 12 core assertions and mocked recording lifecycle regressions. No third-party runtime or development dependencies are declared in Verse's package.json. CI runs this check on push/PR; no deployment job or hosting manifest exists in the repository.

The existing optional isolated-Chrome probe was attempted twice. The sandboxed launch aborted with SIGABRT/EPERM; the approved retry launched Chrome 156 but timed out navigating to its loopback server before any journey check ran. Its result has **zero completed checks**. This is a blocked recheck, not an app test pass or demonstrated app defect. The probe closed its browser/server. Failed-run metadata is under `/private/tmp/verse-intake-20261107*`; the earlier successful evidence file was not overwritten.

Fresh Orca browser work used a new isolated profile `3b7dee71-abda-49b5-87b1-36925fd59056`, page `450544f0-4976-465a-8ef8-4e9bff61bbb7`, existing local server `http://localhost:5187/`:

- Filled the disposable sample's title/lyrics through UI controls, observed saved status, reloaded, and verified exact title `Intake disposable capture` and words `Keep this fleeting lyric for another day` persisted. This verifies edit/save/reload, not the complete new-idea journey. Initial emulated click commands did not establish new-idea creation and are not counted as proof.
- At 390×844 mobile emulation, DOM inspection reported document width and scroll width both 390 and lyric text 22px. This is limited layout evidence, not iPhone, keyboard or accessibility certification.
- With the library closed, nine library buttons/inputs remained at nonnegative tabIndex entirely offscreen and appeared in the accessibility snapshot. P1 accessibility risk: navigation can reach invisible controls; ensure the closed library is excluded from focus and accessibility navigation.
- Read the console after these inspections: empty entries, not truncated. A high-DPI screenshot showed duplicated tiles, so it is not used as visual-layout sign-off.

Existing hosted user content/storage was not accessed or altered. All test edits used the isolated local profile; no storage was cleared. No real microphone was used.

## Current classification and release implications

| Classification | Finding / evidence | Impact / priority |
|---|---|---|
| Verified now | Baseline checks and isolated local text edit/save/reload | Useful foundation; limited coverage |
| Previously verified, same source hash | Earlier Chrome synthetic recording/playback, backup/audio-byte round trip, migration fixture, denial and injected-save recovery | Retain dated evidence; fresh comprehensive recheck blocked; no iPhone proof |
| Broken, previously reproduced | Stale whole-idea save overwrites newer lyrics (`app.js:15–16`); earlier browser evidence confirms loss | P0 before release; protect text/takes against concurrent writers |
| Broken, previously reproduced | Restore recreates idea dates (`app.js:186`); earlier backup probe confirms date changes | P1; exact metadata preservation test and fix |
| Risk verified now | Closed mobile library remains focusable offscreen | P1; keyboard/screen-reader usability |
| Implemented but unverified on target | Human voice/backing quality, iPhone volume/routing, Bluetooth latency, lock/call/disconnect and real quota/crash recovery | Physical-device release gate |
| Missing | Offline shell, automated backup/sync, source-to-host pipeline/provenance and operational release evidence | Agree private-release obligations; commercial services are later decisions |

Sites `get_site` reconfirms owner-only custom access, no external visitors and latest saved version 2. Version history gives source SHA `b9222c5f4cd078f48dd74b7c0117943e9110838f`, distinct from GitHub. Different commit provenance does not establish different asset bytes; byte parity and current deployed-artifact identity remain unverified. No access/deployment change was made.

Recommendation: improve incrementally, starting with data integrity and reliable capture/save/reopen. If Daniel selects mixed-only initial scope, that removes the immediate justification for a stem schema or recording-engine rewrite. Preserve the UI/sample and decide capture capabilities from requirements and real-device evidence. Resolve the concurrent-session scope conflict before this session changes the approved specification or begins implementation.
