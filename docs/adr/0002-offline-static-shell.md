# ADR 0002: Verified static offline shell, normal waiting updates

Implementation of the accepted offline capture requirement; no change to the agreed product/platform architecture. Data stays in existing IndexedDB v3; this increment does not migrate user records or change audio formats.

Cache a fixed list of eight static same-origin files, each pinned by SHA-256. Generate the worker with `npm run prepare:offline`; `npm run check` rejects a missing/stale generated release. No framework, library or runtime dependency is added. Optional Google Fonts and speech-recognition services are not prerequisites for offline typing, local backing or recording; device/browser permissions and codec support still apply.

During worker install, fetch with redirects rejected and verify every byte hash before writing this release's separate cache. An HTTP error, sign-in page, mixed deployment or interrupted/quota-failed cache write prevents activation and removes only that candidate cache. Previously active caches and IndexedDB are retained. Never cache arbitrary navigation, query parameters, auth endpoints, APIs, words, audio blobs or backups. Match only the known shell paths; use the cached index for the exact app root.

Use the browser's normal waiting phase: no `skipWaiting`, update button that interrupts capture, automatic page reload or `controllerchange` reload. A complete update activates after all old controlled pages close, then removes only obsolete shell caches belonging to this scope. Serve the pinned shell consistently while it is active. Text/audio writes continue independently of cache/network readiness; each has its own status.

The UI asks the active worker to check its complete cache before reporting offline readiness. A failed or evicted shell is not described as ready. This is a point-in-time check, not a guarantee against later browser eviction. First-ever offline visits cannot load an app that has never been downloaded. A prior online load, completed readiness, same origin/browser and retained storage are prerequisites.

Local offline access remains available to someone using the same device/browser profile. ChatGPT sign-in guards hosted network access; it is not encryption or a fresh offline identity check. No audience/account change is made here. Hosted service-worker headers, sign-in redirects and any server-side HTML transformation must be verified before deployment; exact-byte verification intentionally rejects transformed/incomplete releases. Native bundles remain separate platform work.

Alternatives: network-first HTML can mix current HTML with older assets and depends on timeout/fallback behaviour; immediate activation can disrupt a recording; an external caching library adds dependency/build cost to this small fixed shell. A pinned cache with normal waiting lifecycle is enough for this increment. Full offline sync, background capture and offline OS dictation are not promised.

Supporting API/lifecycle references inspected during implementation: [Chrome service-worker lifecycle](https://developer.chrome.com/docs/workbox/service-worker-lifecycle), [MDN redirect handling](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirected), [MDN SHA digest](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest).
