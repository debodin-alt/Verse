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

## Round 3 — pending

Exports (text/mix/stems versus MIDI/DAW project), private file sharing versus links/collaboration, and platform rollout order. No new services or public exposure authorised.

## Remaining interview topics

Exports (text, mixed audio, stems, DAW integration), private sharing versus collaboration/public publishing, privacy/ownership and operational access to creative content, initial launch platform order and testers. Do not settle these from assumptions.
