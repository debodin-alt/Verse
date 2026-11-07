# ADR 0001: Preserve Verse and stage commercial readiness

Status: PROPOSED; 2026-11-07. Requires scope agreement. Supersedes no accepted architecture decision.

## Context

Daniel likes the current build, prioritises immediate words/melody capture and wants an eventually commercial product with a private first release. Latest round-3 answers confirm separate voice/backing exports, private sharing by exported files and all three platforms launching together, superseding the mixed-only local draft. Offline capture and foreground-only stop/save were answered in round 2. Existing JS/Web Audio/IndexedDB remains a useful baseline; native audio/device evidence is still limited.

## Proposed decision

Improve incrementally. Keep the product/UI and buildless web app initially. Separate persistence, recording state and mix/export logic into understandable modules when a concrete change requires it, backed by tests. Do not replace the UI framework for commercial branding alone.

Use local storage as the first save destination; version the offline app shell and data separately. Preserve old data and mixed takes. New accompanied takes need immutable independent audio assets plus frozen backing/timing; introduce that through an additive migration with old-version preservation tests first. Do not rewrite or claim to unmix old audio.

Recommend **one shared web product/UI with Capacitor iOS/Android packages**, retaining the existing JS code incrementally. Keep recording, persistence and file export behind small explicit boundaries so native implementations can be used only where required. This is the proposed architecture to approve, not an installed dependency or a claim that wrapping solves audio. Validate browser and WebView recording against the actual iPhone/Android/wireless matrix; if it fails, prove a native capture component behind the same interface. Native integration must preserve the web product and old data.

Build internal increments in a practical order, but gate the release on all three targets. Mac uses the web app. The current Mac cannot locally build the proposed current iOS toolchain, and Android setup is missing from checked locations. A suitable native build host/toolchain is a concrete prerequisite; no paid build service or system upgrade is authorised. See [build readiness](../discovery/native-build-readiness.md).

For the commercial release, prefer a managed auth/database/object-storage service over operating a custom server. Choose it using costs, private audio access, offline conflict behaviour, export/restore support and the maintenance burden. Managed services still need security updates, backup checks, account/billing support and release maintenance.

Keep customer identity, creative ownership and verified billing access separate. A single annual plan is a hypothesis, not an entitlement implementation yet. No account, provider, paid service or audience changes authorised here.

## Alternatives and tradeoffs

- **Web/PWA only:** smallest change and easiest UI reuse. Suitable candidate for private validation; does not prove store delivery or all wireless recording requirements.
- **Shared web UI plus native capability:** potentially reuses most work across stores while making capture/persistence platform-specific where needed. Adds native build/review/test upkeep; decide after the device proof.
- **Native or cross-platform UI rewrite:** can offer deeper platform control but has the highest rewrite/migration burden. Reconsider only if measured limitations prevent the agreed experience; current evidence does not justify it.
- **Local-only commercial app:** lower service cost, but a poor fit for seamless device access and hands-off protection. Retain only if Daniel explicitly accepts manual-backup obligations for paying users; not recommended.

## Consequences and open gates

Fewer visible changes, explicit compatibility and limited recurring infrastructure in private validation. Additional work before public sale is deliberate: sync, media security, quota, billing and operations are real features. Exact recording engine and cloud provider remain evidence-based gates; no promise of zero maintenance. Device failure may require revising this ADR before implementation continues.

Sources and store/payment constraints are in [commercial architecture options](../discovery/commercial-architecture-options.md). Scope: [release proposal](../../spec/verse-release-proposal.md).
