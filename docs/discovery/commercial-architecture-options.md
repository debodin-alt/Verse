# Commercial architecture options — draft, 2026-11-06

Status: recommendation inputs, not an accepted ADR. Preserve the current catalogue and UI; no new service, payment integration or schema change is authorised by this document.

## Implications of the first interview

The destination is a paid iPhone/web/Android product. V1 may omit payments. Quick text capture, return-to-development and backing-first freestyle remain the centre. Separate voice/backing is desired with mix save/export; that does not imply a timeline editor, live monitoring, stem editing or a full production engine.

Proposed boundaries to evaluate:

1. **Creative records:** idea, lyric revision (if required), backing revision, immutable audio asset and take. Each take refers to the backing/settings and timing used when recorded; later progression changes must not silently rewrite the meaning of an old take. Keep legacy mixed takes playable as mixed assets; their voice cannot simply be recovered as an isolated track.
2. **Recording and export:** a recording engine captures voice with its timing; a mix renderer combines assets/backing when needed. Separately stored audio does not itself guarantee synchronised playback. Measure start offset, drift, mix headroom, decode support and interruption behaviour on real devices.
3. **Storage/sync:** an explicit persistence boundary with versioned migrations. If sync is accepted, plan stable IDs, ownership, revisions/conflicts, resumable private audio transfer and deletion recovery. Avoid overwriting entire concurrent snapshots. No backend/provider is selected; budget and sync needs are pending.
4. **Customer identity and access:** keep a Verse customer identity separate from payment-provider IDs, creative ownership and platform receipts. Verified purchase events grant product entitlements (feature access). Cancellation must not delete creative work. Exact post-expiry access policy remains a product decision.
5. **Customer operations:** onboarding/recovery, support contact, subscription management where applicable, refund/access reconciliation, account export/deletion, retention and incident recovery. Stripe's portal handles billing tasks, not the whole Verse account/support system.

These boundaries are design constraints; do not create speculative microservices or unused adapters to claim readiness.

## Platform alternatives

| Path | Benefit | Tradeoff / decision evidence |
|---|---|---|
| Improve existing web app/PWA first | Preserves UI and source; fastest way to validate the core journey | Offline startup needs deliberate caching; browser recording/background limits and wireless routes still need testing; no store binary |
| Retain web UI with Capacitor and native capability where needed | Candidate route to iOS/Android while reusing much of the app | A wrapper alone does not solve recording quality, persistence transfer or store review. Native audio/storage/billing require implementation, tests and platform maintenance |
| Rebuild with native UI or another cross-platform stack | Could suit demanding native recording/background requirements | Highest rewrite/migration effort and regression risk; not justified by the existing evidence or Daniel's preference for minimal product changes |

Provisional recommendation: retain the current product/UI, prove data and recording behaviour, then decide whether web alone or a shared UI with a native recording boundary meets the agreed release. Background/locked recording and reliable wireless overdubbing may change that decision. Do not choose a wrapper or rebuild on packaging convenience alone.

## Payments and store constraints

Apple guideline 3.1.1 generally requires in-app purchase for digital feature unlocks; 3.1.3(b) addresses cross-platform access, and regional exceptions exist. Google Play similarly generally requires Play Billing for in-app digital functionality with specified exceptions. Therefore do not assume a Stripe checkout inside every app is the distribution plan. Evaluate launch storefronts and current rules again before implementation/submission. Apple 4.2 also requires adequate utility beyond a repackaged website. These are planning inputs, not a guarantee of acceptance. [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), [Google Play Payments](https://support.google.com/googleplay/android-developer/answer/9858738).

For web billing, Stripe supports subscription event webhooks and a hosted customer portal. If selected, verify webhook signatures, handle retries/duplicate events and cancellation/payment failures, and reconcile entitlements server-side rather than trusting a browser checkout redirect. Account deletion, creative-data ownership and customer support need Verse-specific handling. [Stripe subscription webhooks](https://docs.stripe.com/billing/subscriptions/webhooks), [Stripe customer portal](https://docs.stripe.com/customer-management).

Capacitor is a candidate native runtime for web applications with access to native capabilities, not a guarantee that the existing Web Audio/MediaRecorder path behaves identically in a mobile container. No dependency was installed. [Capacitor documentation](https://capacitorjs.com/docs).

## Pending decisions

Offline/startup/background behaviour; sync/backup requirement and operating budget; lyric history; exact exports and sharing; first release platforms and launch regions; privacy expectations; paid model. Turn the resolved decisions into a versioned ADR with migration/rollback acceptance tests before building.
