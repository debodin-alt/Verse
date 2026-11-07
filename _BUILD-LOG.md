# Build and review log

## 2026-11-07 — data-integrity build

Implemented the accepted V-01/V-02 foundation covering parts of release AC01/06/07 and the stale-write portion of AC08. Added transactional revision comparison and deletion markers in a new additive IndexedDB v3 store; legacy creative records are preserved. Own writes are serialised separately from cross-tab revision checks. On conflict the stale copy stays in memory and is explicitly exportable before reload. Restore retains meaningful original dates. Save feedback tracks edit generation to avoid confirming unsaved newer text.

Before implementation: the new Node test failed on original creation-time preservation; browser regressions failed on dates, stale overwrite and stale deletion. The version-2 preservation fixture passed against the baseline before storage changes. The investigation also exposed an older-save/newer-edit status race. No original user data or real microphone was accessed.

After implementation: `npm run check` passed (19 core assertions plus recording simulations); the final isolated Chrome probe passed 12 cases with real IndexedDB and synthetic microphone/recording bytes. This includes protecting a newly added audio asset, downloading the stale tab's unsaved copy, and recovering a deleted parent's journal into one new identity. No uncaught page errors. Console resource failures corresponded to deliberately blocked optional Google Fonts. Final evidence: `docs/validation/data-integrity-browser.json`; app SHA-256 `5aaad6fc6e4dc5a0ff982de34ee950b5255b3702fba8f80397f27692d8efda37`. One follow-up run stalled during disposable-browser setup and was stopped/retried; no successful result is claimed for that run. Physical audio/routing, actual disk exhaustion/crash and native build/device tests remain unverified. No deployment performed.

## 2026-11-07 — review

Reviewed the data paths against [increment criteria](spec/data-integrity-increment.md): compare/read/write/delete share one transaction; a failed/aborted transaction does not advance this tab's known revisions; old versions cannot bypass the v3 protocol after upgrade; full imports validate before their atomic write; journals are deleted after take persistence. Original idea/audio records are not rewritten during upgrade. A missing/deleted journal owner recovers into a new identity rather than resurrecting a deletion, and prior recovered take IDs are checked for idempotency.

Remaining release gaps: full hostile/large import coverage, simultaneous recovery contention, physical-device migration/partial media decoding, offline startup, stems, native packaging, sync/billing and all-platform release. Schema rollback must use v3-compatible code; never reopen with v2 code by clearing data. The optional browser probe is not wired into CI yet. No whole-release readiness claim.

Verdict: increment passes the listed browser/automated criteria; parent release remains incomplete. Reviewable branch/PR and a local preview precede merge/deploy approval.
