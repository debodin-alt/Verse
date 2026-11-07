# Prioritised backlog — proposal v0.3

Status: scope/architecture approved by Daniel on 2026-11-07; acceptance references [release proposal](../spec/verse-release-proposal.md). Start build worktrees after the approved planning PR merges. One small reviewed vertical slice at a time.

| ID / priority | Increment | Acceptance / evidence |
|---|---|---|
| V-01 P0 | Data protection baseline | AC01/06/07: durable fixtures; migration, downloaded backup round-trip and failed-save/journal checks. Record baseline defects before changing schema |
| V-02 P0 | Concurrent editing and restore integrity | AC07/08: stale-tab edit cannot lose newer lyrics/takes; preserved creation dates; corrupt batch restores no partial records |
| V-03 P0 | Foreground capture and interrupted-save states | AC04/05/06: denial/dismissal/disconnect/background/lock settle controls; save confirmation only after commit; available interrupted audio recovered once |
| V-04 P0 | Offline entry and safe updates | AC02/10: install online, close/reopen offline, capture/save/reopen; cached shell and DB version compatibility; update never interrupts capture |
| V-05 P0 | Separate voice/backing and mixed replay/export | AC03/04: new take assets/timing/frozen backing; text, mix and stem exports; legacy playback; native capture where proven necessary. No DAW editor |
| V-06 P1 | Exports and capture UX/accessibility | AC03/07/09: accepted formats; consistent naming, readable controls, mobile keyboard, tab/library focus and VoiceOver verification |
| V-07 P0 release gate | All-platform proof and deployable private release | AC10/11: iPhone + Android routes + Mac/web, native build/signing readiness, recovery/transfer drill, reproducible previews/artifacts and compatible rollback; coordinated release after all gates |
| V-08 P0 commercial | Managed identity, private backup and sync | FC01/02: service/cost decision, owner access tests, offline queue/conflicts, upload retry, deletion and independent backup restore |
| V-09 P0 commercial | Annual plan and customer lifecycle | FC03/04: accepted price/storage, appropriate store/web billing, verified/replayed events, restore purchase, cancellation/export and customer recovery |
| V-10 P0 commercial | Distribution and support readiness | FC04: platform/region order, store review checks, support owner, maintenance cadence, incident/account/data recovery docs and costs accepted |

Later opportunities: MIDI/DAW project integration, richer instruments, collaboration, public links, performance tools and production editing. Latest scope includes text/mix/stem files and private file sharing; it excludes collaboration/public links. No automated customer-demand or profitability gate passes without real inputs.

P0 here means prerequisite for the named release gate, not permission to build ahead of scope agreement. P1 accessibility remains a release requirement; its scheduling priority does not waive AC09.
