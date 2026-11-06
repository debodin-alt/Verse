# Workflow and evaluation record — 2026-11-06

## Discovery

Loaded Orca's installed version guide with `orca skills get orca-cli --json`, browser reference, CLI help and `orca skills installed --json`. Registration used supported `repo add` and `worktree create` commands. No agents were launched for initial inspection.

Global installed home skills include `spec`, `build`, `review`, and the founder pack: board → competitors → consumer → pricing → offer → cfo → marketing → brand → ops → launch → plan. These are instruction workflows, not `orca founder` CLI commands. No literal `/founder` entry was found in the inspected catalogs. Use actual installed skills by reading their SKILL.md and carrying out their procedure, not inventing a CLI invocation.

Sources read:
- `~/.agents/skills/orca-cli/SKILL.md`, version-matched guide and browser reference.
- `~/.claude/CLAUDE.md`, factory templates and home memory index.
- `~/.claude/skills/{spec,build,review,founder-board,founder-competitors,founder-consumer,founder-plan}/SKILL.md` (consumer reviewed through panel execution steps).
- Installed Agent Skills 0.6.8: using-agent-skills, code-review-and-quality, security-and-hardening, browser-testing-with-devtools, definition-of-done.
- Chrome DevTools plugin 1.11.0 a11y-debugging; Sites skill/local preview guide for existing-host inspection.
- Agent Skills evaluation README and runner; upstream AGENTS.md explicitly scopes itself to that skill repository, not Verse.

Available persona files in Agent Skills: code-reviewer, security-auditor, test-engineer and web-performance-auditor. Discovery does not mean these agents executed. Founder-board subsequently convened three separate subagents using the installed workflow and a standalone brief; see the round-1 follow-up below.

## Selected workflow

- `/spec` interview is in progress. Wait for consequential answers; no implementation code in this stage.
- `/founder-board` initial intake was pending commercial clarification. Daniel subsequently confirmed a paid-product destination, explicitly allowing v1 without payments. Future price/model is intentionally open and was asked about in round 2; no economic assumptions were supplied to the board. The board reviewed conditionally with those unknowns recorded.
- `/founder-competitors` follows the target-user answers and idea file; use public linked sources. Not run yet.
- Consumer simulation is optional and cannot substitute for Daniel's real use or real interviews; do not invent a target buyer distribution or paid pitch. Pricing/CFO/plan only when relevant. No founder verdict or market validation claimed.
- After scope agreement: `/build` implements accepted criteria in small slices, `/review` proves each criterion and logs gaps. Global convention requires file-trail PR merge before build worktrees and Daniel approval before merge/deploy.

## Evaluations actually run

Agent Skills installed package root:
`/Users/danielbodin/.claude/plugins/cache/addy-agent-skills/agent-skills/0.6.8`

| Command | Result | Meaning |
|---|---|---|
| `node scripts/validate-skills.js` | 25 skills, 0 errors/warnings | Tier 1 instruction structure |
| `node scripts/validate-commands.js` | 9 commands, 0 errors | Command parity and description sync |
| `node scripts/run-evals.js --min-rank1 80` | 136 checks passed; 0 errors/warnings; rank-1 86% (72/84) | Tier 2 lexical trigger/routing, collision, schema/coverage checks |
| Same Tier 2 command in marketplace checkout | Same result | Discovery cross-check; installed-package run is authoritative here |
| Verse `npm run check` | Pass | Syntax + 12 core assertions + simulated recorder lifecycle |
| Orca browser capture/save/reload and loop runtime | Pass for limited observed behaviours | See dated assessment; not real iPhone audio proof |

Tier 3 behavioral evaluations were not run: those launch headless Claude agents on generic fixtures and spend tokens. Tier 1/2 do not prove agent task quality or Verse release readiness. No skill was changed. Skill-creator trigger optimization is not an app-quality test and was not used.

## Missing coverage / setup

- Chrome DevTools MCP/Lighthouse tools are not exposed in this session. The prescribed a11y automated audit and DevTools-specific workflow did not run. Orca snapshots, console and layout inspection are separate partial evidence, not a substitute score.
- No audio-specialist runnable eval found in the inspected catalogs. Real recording/routing/latency needs browser and device-specific tests.
- `/review` release certification awaits an agreed spec. Initial five-axis review used baseline tests/code and records risks; it does not approve a release.
- `gh auth status` reports an invalid local GitHub CLI token. Connected GitHub tools can still read repository metadata. No login changes were made.
- No project-local AGENTS.md/SDLC setup existed. This record establishes the applicable global conventions without installing services or changing accounts.

## Honest journey matrix

| Journey | Automated | Browser | Physical iPhone |
|---|---|---|---|
| Capture/reopen lyric | No integration test | Exact text survives reload | Pending |
| Loop/record/save/replay | Mock lifecycle only | Loop scheduler starts/stops; capture not verified | Pending |
| Reopen saved audio | Not covered | Pending | Pending |
| Denial/interruption/storage failure | Mock final-save failure only | Pending | Pending |
| Full backup/restore | Synthetic audio validator only | Dialog opens; download/restore pending | Pending |

For the first device check, use a disposable idea after exporting existing work: play a default loop, record 10 seconds using normal headphones, stop and wait for saved banner, replay, close/reopen and replay again. Record phone/iOS, route, level before/during capture, missing beginnings and playback result. Repeat speaker/Bluetooth only for routes Daniel uses. Do not clear storage. Interruptions and restore tests follow once a verified backup exists.

## Round-1 follow-up

Read founder-board's full skill and lenses. Wrote `founder/idea.md`, standalone `founder/board/brief.md`, and launched three general subagents through the session's collaboration tool, one per lens as required by the skill. These were session subagents, not Orca worker dispatches or a literal slash-command execution. Each wrote its own memo; the lead read all three and compiled `founder/board.md`, preserving score differences and every condition. Result: 3 FUND IF; 5.3/10 average. This is qualitative advice, not investability, customer evidence or a profitability test.

Recorded round-1 answers in `docs/discovery/interview.md` and commercial/platform options in `docs/discovery/commercial-architecture-options.md`. No app implementation or schema changes made. The earlier evaluation results remain unchanged; no claim of rerunning skill evaluations or app tests on a documentation-only change.
