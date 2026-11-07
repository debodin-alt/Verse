# Data, persistence and migration proposal

Status: logical stem/sync model remains proposed for future increments under the accepted scope. This data-integrity increment upgrades `verse-notebook` v1/v2 to v3 by adding `revisions` (ID, revision and deletion marker), keeping `ideas` with embedded take Blobs and `sessions` with captured chunks intact. Legacy ideas start at revision zero when no marker exists; subsequent guarded writes advance revisions atomically. Backup envelope version 1 is independent of DB version and does not export internal revision markers.

Cross-tab revision comparison and the corresponding idea mutation share one transaction. This tab's own operations are queued and known revisions advance only after commit. A conflicting tab preserves its in-memory copy for export and cannot silently overwrite newer content or resurrect a deletion. Rollback requires v3-compatible code; never clear/downgrade the database to run v2 code. Fixture evidence is in `docs/validation/data-integrity-browser.json`.

## Logical model and later extensions

Latest round-3 approval includes separate voice/backing exports, superseding the earlier mixed-only local draft. Preserve existing mixed assets. Backing revisions, independent audio assets and alignment metadata below are required logical capabilities for new accompanied takes; the physical schema/migration remains subject to the architecture checkpoint. Introduce only changes justified by those accepted export and integrity/recovery requirements.

| Record | Content / invariants |
|---|---|
| Idea | Stable ID, title/type/stage/tags/words/notes/star/archive, original created/updated times; revision token for safe saves, not lyric history UI |
| Backing revision | Immutable chords, beat, sound, tempo, rendering version/seed if applicable; ID/hash. Current editable backing can change without altering old takes |
| Audio asset | Stable ID, kind (voice/backing/mixed legacy), media type, bytes/hash, creation time and measured duration; files are immutable |
| Take | Name, owner idea, asset IDs, backing revision, alignment/timing and recovery status. Legacy take stays marked mixed; do not claim to extract its isolated voice |
| Capture journal | Session ID, intended owner/backing, available chunks, media type, created time and finalisation state; kept until durable audio/take commit |
| Future sync/customer | Owner/account mapping, server revision, local pending operation/upload state and deletion tombstones; provider IDs do not replace creative record IDs |

This is a logical model; choose physical stores and the next schema version only with an accepted implementation slice and fixtures. For native containers evaluate durable audio files plus transactional metadata; web retains browser storage limitations. Do not duplicate large audio in every text update.

## Migration and restore invariants

1. Preserve the current origin/database while upgrading. Moving domain or browser-to-native storage is an explicit transfer, not the same automatic IndexedDB upgrade.
2. Capture fixture libraries at old versions before changing schema, including archived ideas, Unicode, named takes, empty ideas, large clips and incomplete journals. Verify exact fields/audio hashes and old playable codecs before/after upgrade.
3. Prefer additive stores/fields. Make transformations transactional where possible and retryable/idempotent otherwise; do not drop originals until a separate proven cleanup policy exists. Do not destructively downgrade data for a code rollback.
4. Handle blocked upgrades/other tabs and close/reload connections on versionchange deliberately. Prevent stale whole-idea writes from overwriting newer data; preserve a conflict copy or stop the stale edit with an explanation.
5. Backup is a distinct off-device recovery path, not merely sync. Validate envelope, field types/counts, media and size/hash before import. A failed transaction must add nothing and remove nothing. Restore-copy semantics create new IDs with valid internal references while retaining meaningful original dates.
6. Capture finalisation writes the complete take before deleting its journal. If storage fails, retain committed data, available chunks and a downloadable in-memory take. Recovery is repeatable without duplicate takes. Sub-first-chunk termination remains a risk until measured on target devices.
7. Before cloud sync, test account linking, retries, conflict/deletion handling, private audio access, quota and partial upload. Local capture must work when server/auth/billing is unavailable. No paid account expiry deletes creative data as a side effect.

Recovery procedure and rollback gates: [delivery plan](deployment-and-recovery.md). Detailed test cases: [matrix](test-matrix.md).
