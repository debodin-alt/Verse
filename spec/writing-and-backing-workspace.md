# Step 2: write with the backing

Status: APPROVED by Daniel on 2026-11-10; planning PR #4 merged as `547b4f1` before the implementation worktree started. The approved increment keeps lyrics editable alongside backing with desktop split/mobile stacked views. Chords above lyric lines remain exploratory. Implementation/review evidence follows below; no storage migration is needed.

## Objective

Develop words and music together: see and edit the current idea's lyrics while listening to and adjusting its backing, without switching between Words and Play.

## Product evidence

Daniel: “it really is important to be able to play around with both the music and the loop and edit the lyrics in one place — especially on a computer”. A split view was suggested, and placing chords above lyrics was offered as a possible playful extension. This strengthens the core creative journey; it does not request a DAW, multitrack editor or broad redesign.

## Approved first increment

1. Keep the familiar catalogue, sample and Words capture view. In Step 2 / Play, also show editable lyrics belonging to the selected idea.
2. On a roomy desktop, put lyrics on the left and the existing chords, beat and backing controls on the right. Keep useful writing space and transport/save feedback reachable as either side grows. Choose the precise breakpoint from the preview, starting with 1440px desktop validation.
3. On narrow screens, stack the writing and music areas in the same Play view; avoid squeezing two narrow columns onto an iPhone. Test 390px and software-keyboard behaviour.
4. Keep one authoritative lyrics value and the existing autosave/conflict/export paths. Editing in either view must immediately reflect the same words; no independent drafts or manual “copy to song” operation.
5. Editing words, switching between Words/Play or resizing must not stop/restart a running loop, discard unsaved words or corrupt a recording. Editing lyrics during a synthetic take must preserve both the final text and committed audio.
6. Preserve offline use and regenerate the pinned shell for static changes. No schema migration, new account, dependency, cloud processing or audience change is needed for this first increment.

## Acceptance criteria

- [x] W1: at 1440px, Play shows editable lyrics and the backing controls simultaneously with no horizontal document overflow; the current selected idea is unambiguous.
- [x] W2: changing a distinctive lyric while the loop runs updates its normal model/save state and leaves playback running without resetting its step/phase. Reload preserves the exact words.
- [x] W3: edits made in Words appear in Play and vice versa, including switching while a save is pending. A stale tab still cannot overwrite newer work.
- [x] W4: an actual native browser recorder with synthetic input can capture while lyrics are edited; final save/reopen retains both words and decodable, byte-preserved audio. This is not physical microphone/routing proof.
- [ ] W5: 390px Play retains both writing and backing in one usable stacked view; labelled controls, focus order and reachable stop/save are verified. Physical software-keyboard/VoiceOver checks remain a device gate.
- [x] W6: existing text/backup exports contain the intended unchanged-format lyrics, with no duplicate editor state or unsolicited chord markup. Offline capture/reopen and worker integrity checks pass after the new static files are pinned.

## Chords above lyrics: next exploration

A small optional annotation layer could let a writer pencil chord names above a word or line while listening. Before treating it as a committed feature, prototype insertion, movement and lyric reflow, then decide how annotations behave in editing, transposition, plain-text export and backup. Keep existing lyrics and chord progressions intact. Do not silently inject chord syntax into existing text or create a new persisted model without its preservation/migration tests.

This idea does not yet require per-word timing, tablature, automatic chord recognition, rich document formatting, a notation editor or a new recording engine.

## Delivery

Land this file trail through the repository's planning review gate before the implementation worktree. Build the combined view as one reviewed increment, preserve data, check actual browser/audio behaviour, and provide desktop/mobile previews. Keep chord annotations separate so they do not delay the essential write-and-listen experience.

## 2026-11-10 — review

W1–W4 and W6 pass the scoped local/browser gates. Evidence: [six actual Orca browser journeys](../docs/validation/writing-workspace-browser.json) and `npm run check` (19 core assertions, recording simulations and worker boundary/failure tests). The browser uses real IndexedDB, AudioContext and MediaRecorder with generated input. Source hashes in the evidence match this implementation. W2 continuity is supported by unchanged AudioContext/scheduler identities across typing, held persistence writes, view switches and resize, plus inspection showing no audio calls in `switchTab`.

W5 is partially verified: the 320/390/768/1024/1440px layouts have no horizontal overflow; 390px jump links, labelled lyrics, native Tab focus and the visible record control pass. Desktop/mobile screenshots were visually reviewed. Physical software-keyboard, touch, VoiceOver and stop/save reachability during actual phone recording remain unchecked; desktop emulation cannot close this gate. The existing hidden-library focus risk also remains outside this increment.

No scope violations or source-review defects found. The sole lyric element/listeners remain intact; visibility/layout changes do not replace editor DOM or touch persistence, recording or the schema. Generated offline metadata matches the changed static files. Export checks cover exact text and backup/audio payloads at the existing download boundary; file-save UI was not retested. Console entries were empty. Native focus/Enter activation was used after emulated pointer targeting missed the loop control; exact tab roles avoid similarly named idea/chord buttons.

Verdict: ready for focused code-PR review; the full physical-device criterion is not met and no release/deployment readiness is claimed. Next action after code review: test the combined view on Daniel's phone with its software keyboard and actual microphone/headphone route. Chord annotations remain outside this build.
