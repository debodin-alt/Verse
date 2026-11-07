# Delivery, rollback and recovery — proposed runbook

No release/deployment is authorised by this document. Existing Site identity/access and browser storage must be preserved. The GitHub checks workflow is not a deployment pipeline; hosted-source parity still needs establishing.

## Before a private release

1. Establish exact source/artifact provenance for the existing host. Reuse Site `appgprj_6aeae4c3472881919db840c6fce739a9` only through its supported source/version workflow; do not create a replacement Site or alter access. Match inspected assets to the intended commit, not just a similar version label.
2. Merge the accepted file trail, branch the next increment through Orca, implement/test/review it, and open a PR. Daniel approves merge/deploy. No force pushes or pushes of app code directly to main.
3. Run `npm run check` and increment-specific browser/data tests. Storage changes require old fixtures and preservation tests first. Record source commit, cache/app/data versions and compatibility. Pin release artifacts and keep the last known working artifact.
4. Offer a preview and short real-device checks from the matrix. Review actual console and failures. Do not treat synthetic audio or an iOS simulator as physical proof.
5. Export a full backup of existing device data and verify restoration using a separate disposable context. A downloaded file alone is not proof it restores. Explain any cross-origin/browser/native transfer; keep the original copy intact.
6. Build and validate iOS and Android alongside web, including signatures/private distribution, permission strings, offline/native storage and audio/file-export paths. Use the [native setup evidence](discovery/native-build-readiness.md); do not claim native builds from checked-in configuration alone. All three are first-release gates. Preserve the existing live app until the replacement release is ready and explicitly deployed.

## Safe publish/update

Package the tested source and record its commit. Deploy only after agreement using the host's supported version workflow. Preserve audience, origin, database and existing account access. Publish a minimal version notice with limitations and backup guidance.

Hold coordinated launch until all three targets satisfy the same release definition. Mac uses web. Internal previews do not count as a staggered product launch. A public paid launch waits for both store approvals and the commercial gates; store review completion dates cannot be guaranteed. No public sharing links/collaboration are in scope; sharing is through exported files.

For offline support, cache only intended static app assets, never login/error responses or customer records. Stage new assets separately and activate when recording and saves are idle. Do not force-reload during capture. Maintain a working offline shell and test it with the current data version before removing old caches. Exact deployment/cache implementation awaits scope and hosting decisions.

## Rollback

If a release breaks entry or capture, stop rollout, preserve the failing artifact/evidence and restore the known compatible app artifact on the same origin. Do not automatically downgrade the database or clear caches/storage as a repair. If the older app cannot read new additive data safely, use a forward repair or disable the affected action while retaining data; document the compatibility choice before shipping.

For paid releases, stop new purchases/rollout if access reconciliation is broken while preserving existing creative access/export. Reconcile signed purchase events idempotently after repair; never delete songs to resolve billing.

## Data recovery

- **Save failure:** keep Verse open, retain in-memory take/journal, download available audio and full backup, then diagnose storage. Do not claim success until commit; keep original committed data.
- **Interrupted recording:** reopen, inspect recovered take and replay. Label partial media; export it before further troubleshooting. Recovery should not create another copy at every launch.
- **Bad import:** abort without mutation; preserve the source backup, original data and error details without logging creative content.
- **Origin/container move:** export on the original app, verify backup, import on the destination and verify text/audio, retain original until Daniel confirms. Browser and native data do not automatically share a database.
- **Future cloud incident:** stop destructive writes, restore metadata and audio from a tested independent backup, reconcile offline queues/conflicts before resuming. Sync is not the independent backup.

## Operations and low-maintenance target

Private validation: no new recurring services by default; local diagnostics with version/save/recovery states. Public paid release: managed hosting/auth/storage, budget/usage alerts, small support surface, verified backup drill and a named owner for access/billing incidents. Collect no songs/recordings in telemetry; diagnostics must avoid creative content. Any telemetry/service requires an explicit decision.

Proposed cadence: monthly dependency/security/store requirement review, regular tested backups and per-release device smoke checks; exact ownership and schedule to agree. A paid app cannot credibly promise no ongoing maintenance. No recurring-cost ceiling, provider or new accounts have been approved.
