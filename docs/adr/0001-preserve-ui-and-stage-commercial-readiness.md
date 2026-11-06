# ADR 0001: Preserve Verse and stage commercial readiness

Status: PROPOSED; 2026-11-07. Requires scope agreement. Supersedes no accepted architecture decision.

## Context

Daniel likes the current build, wants offline use and foreground-only stop/save, separate voice/backing and mixed exports, and an eventually paid Apple/web/Android app with low maintenance. Existing plain JS/Web Audio/IndexedDB is a useful baseline but lacks separate stems, offline shell and commercial services. No real iPhone proof establishes a need for a complete rewrite.

## Proposed decision

Improve incrementally. Keep the product/UI and buildless web app initially. Separate persistence, recording state and mix/export logic into understandable modules when a concrete change requires it, backed by tests. Do not replace the UI framework for commercial branding alone.

Use local storage as the first save destination; version the offline app shell and data separately. Preserve old data and legacy mixed takes. Introduce immutable stem assets and per-take backing/timing metadata through an additive tested migration; avoid rewriting existing audio.

Validate the existing browser recording path against the accepted iPhone/wireless matrix. If it cannot meet the recording/mix criteria, choose a native capture component behind the same product interface. A Capacitor container is a candidate for store distribution and native capabilities; it is not selected or installed by this ADR. Keep the web path viable.

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
