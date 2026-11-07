# Product interview

## Round 1 — 2026-11-06

Confirmed by Daniel:
- Ideas usually begin with lyrics, a verse, a topic or loose words; sometimes a melody.
- Apple Notes mingles writing with unrelated notes. GarageBand/Ableton Live introduce too much production machinery for brainstorming. Desired middle ground: dedicated catalogue/dashboard and accessible songwriting development.
- Preserve most of the current Verse build and visual/product experience; no broad redesign requested.
- Both quick capture then return, and backing-first freestyle, are target journeys.
- Use iPhone/iOS and Mac; AirPods/Bluetooth/other wireless headphones matter. Exact hardware/OS remains unknown.
- Separate voice/backing capability is desired, with save/export of a mix. This is a capability goal, not approval of a multitrack editor or specific recording engine.
- Commercial destination is now explicit: a full app for sale across Apple/web/Android, with payment/customer handling. V1 may omit monetisation, but avoid architecture that blocks commercialisation. Stripe is a candidate, not a mandate for every platform.

## Round 2 — 2026-11-07

- Capture should work without internet. Do not record while the phone is locked. Daniel leans against recording while switching apps; safely stop and save is reasonable. Working v1 requirement: stop/save on background; confirm behaviour in the scope checkpoint and real-device tests.
- Daniel delegates the v1 backup/sync recommendation. Recommendation under review: private validation release with verified manual backup; automatic managed backup and cross-device sync before a public paid launch. This staged recommendation is not an accepted backend/account decision.
- Restorable lyric history is not wanted. Keep editable lyrics and multiple named takes; internal revision checks for concurrency/migration safety are implementation details, not a version-history feature.
- A very cheap annual price is preferred; Daniel requests evidence-led advice. Price, cloud storage allowance and payment model are not final.
- Little to no ongoing maintenance is preferred. No recurring-cost ceiling has been specified. Recommend managed services and a small product surface; do not promise zero maintenance or silently authorise spend.

## Renewed intake — 2026-11-07

The current conversation reconfirms an eventual commercial product with a private first release. Daniel starts with lyrics and says he likes how the "ledger is first" in the current web version. Preserve that starting experience; do not rename or redesign it based on an assumed interpretation.

The priority journey is **capture words or a melody immediately, then develop it later**. A **reliable mixed take is sufficient initially**, superseding the earlier separate-track requirement for the first release. Independent voice/backing remains a possible later capability, not a prerequisite for private validation. Scope and architecture are still proposals.

The current intake also asks for exact iPhone/iOS/headphone routes and confirmation of the earlier offline/stop-and-save preferences; that answer is pending. No new services, accounts, spend or audience changes are authorised.

## Round 3 — latest explicit answers, 2026-11-07

- Daniel accepts text, mixed-audio and separate voice/backing file exports; MIDI/DAW project files are deferred.
- Daniel accepts a private notebook with sharing through exported files; no links/collaboration required.
- Daniel requires all three platforms to launch together. iOS and Android are release prerequisites alongside web; Mac uses web unless a separate native desktop app is requested later.
- These answers supersede the earlier local draft's mixed-only first-release assumption and any proposed Android-later launch. Offline/stop-save preferences from round 2 remain answered; exact hardware details are device-test inputs, not unresolved product direction.
- This completes the focused product interview. The concrete v0.3 scope and proposed architecture await a single checkpoint agreement before major implementation. No new services/accounts/spend/public exposure authorised by these answers.

## Checkpoint approval — 2026-11-07

Daniel answered “yes” to approval of the concrete v0.3 scope/shared-web/Capacitor architecture and merging planning PR #1 so implementation can start with data-protection fixes. Record the accepted file trail on main before creating build worktrees. This does not approve deployments, paid service/account activation or future implementation PR merges.

## Remaining interview topics

Implementation/release inputs: actual target phone/OS/headphone details, signing/build-host access, cost ceiling and provider choice before cloud/billing activation. Defaults in the checkpoint are private user-owned content, no external AI/analytics, no public creative catalogue and no paid feature that deletes work on expiry. These remain visible in the proposed plan, not silently introduced services.
