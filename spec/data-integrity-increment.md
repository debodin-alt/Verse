# V-01/V-02: Data integrity increment

Parent: approved [release scope](verse-release-proposal.md), AC01/06/07/08. This increment is not the complete cross-platform release. It changes no recording format, service, account, hosting audience or billing.

Acceptance for this increment:
- [x] A stale tab cannot overwrite newer committed lyrics/takes; its own unsaved text remains available for export with an explanatory status.
- [x] A stale tab cannot recreate an idea deleted by another tab.
- [x] Own queued edits commit without false cross-tab conflicts.
- [x] Old save completion cannot label later unsaved text as saved.
- [x] Restore-copy import retains original idea creation/modification dates and exact audio bytes while leaving existing ideas intact.
- [x] v1 and v2 IndexedDB fixtures retain identities/text/settings/audio through the additive v3 revision-store upgrade and subsequent edits.
- [x] Native browser MediaRecorder with synthetic input still saves/reopens/plays; injected final-save failure still retains recoverable audio and recovers once.
- [ ] Physical iPhone/Android migration/audio checks and full production rollout (separate release gates, not claimed here).

Evidence: 19 core assertions, recording simulations and 12 optional real-IndexedDB Chrome cases; see `_BUILD-LOG.md` and `docs/validation/data-integrity-browser.json`. No complete parent criterion is checked off merely from a subset of its device/security requirements.
