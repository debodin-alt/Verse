# V-04: Offline capture and safe app updates

Parent: approved release R2/R3/R5/R7, AC02/04/06/10; Daniel reconfirmed offline idea capture/save and foreground stop/save. This implements the web portion in an Orca branch. Native packaging, separate stems and physical-device sign-off remain separate release gates.

No storage schema/recording-format changes; no account, hosting, analytics or service changes. After one successful online load and offline-ready confirmation:

- [x] O1: close all app pages, disconnect, reopen the same address and capture/save/reopen exact text in the existing catalogue.
- [x] O2: offline voice-only and voice-plus-loop synthetic recordings commit, reopen, decode/play and retain exact saved bytes. Clearly separate synthetic browser evidence from phone routing/quality.
- [x] O3: a complete static app release is cached; only explicitly listed same-origin, query-free GET app files are intercepted. Login redirects/pages, failed or mismatched assets, API responses and creative content never enter the shell cache.
- [x] O4: a new release waits while any current app page is open, including during capture. No forced reload/skipWaiting; after pages close, the complete next release activates and existing idea/audio data remains intact.
- [x] O5: missing, redirected, corrupt or partially written release assets fail installation without replacing the working offline release. Readiness failures are visible and do not disable writing/saving.
- [x] O6: retain the existing foreground-only recording/data implementation unchanged; document prior online preparation, eviction, first-ever offline visits and dictation limits. No new background-recording promise.
- [ ] Device gate: physical-phone airplane-mode capture/reopen, real microphone/background/lock and actual hosted-sign-in/cache checks remain pending.
- [x] O7: checks detect a stale generated shell manifest. Document cache/update/recovery and usable preview/device steps; preserve old tests and data. No user storage is cleared.

Verification: Node worker boundary/failure tests in ordinary CI plus a separate real-browser offline/lifecycle probe with disposable profiles. Phone/Home Screen and actual hosted-sign-in/cache policy require physical/deployment checks before release.

Evidence: `docs/validation/offline-browser.json` (seven cases) and `offline-setup-browser.json` (one targeted setup-failure case), plus `npm run check`. Native browser recording uses injected synthetic Web Audio, not a physical microphone. Parent release AC02/05/10/11 remain incomplete pending device/hosting/platform checks.
