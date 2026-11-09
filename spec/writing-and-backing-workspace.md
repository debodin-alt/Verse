# Step 2: write with the backing

Status: feature brief for the next increment, based on Daniel's explicit feedback on 2026-11-10. Editing lyrics alongside backing is required. The responsive arrangement below is a proposed implementation; chords above lyric lines remain exploratory. No application code or storage changes in this planning PR.

## Objective

Develop words and music together: see and edit the current idea's lyrics while listening to and adjusting its backing, without switching between Words and Play.

## Product evidence

Daniel: “it really is important to be able to play around with both the music and the loop and edit the lyrics in one place — especially on a computer”. A split view was suggested, and placing chords above lyrics was offered as a possible playful extension. This strengthens the core creative journey; it does not request a DAW, multitrack editor or broad redesign.

## Proposed first increment

1. Keep the familiar catalogue, sample and Words capture view. In Step 2 / Play, also show editable lyrics belonging to the selected idea.
2. On a roomy desktop, put lyrics on the left and the existing chords, beat and backing controls on the right. Keep useful writing space and transport/save feedback reachable as either side grows. Choose the precise breakpoint from the preview, starting with 1440px desktop validation.
3. On narrow screens, stack the writing and music areas in the same Play view; avoid squeezing two narrow columns onto an iPhone. Test 390px and software-keyboard behaviour.
4. Keep one authoritative lyrics value and the existing autosave/conflict/export paths. Editing in either view must immediately reflect the same words; no independent drafts or manual “copy to song” operation.
5. Editing words, switching between Words/Play or resizing must not stop/restart a running loop, discard unsaved words or corrupt a recording. Editing lyrics during a synthetic take must preserve both the final text and committed audio.
6. Preserve offline use and regenerate the pinned shell for static changes. No schema migration, new account, dependency, cloud processing or audience change is needed for this first increment.

## Acceptance criteria

- [ ] W1: at 1440px, Play shows editable lyrics and the backing controls simultaneously with no horizontal document overflow; the current selected idea is unambiguous.
- [ ] W2: changing a distinctive lyric while the loop runs updates its normal model/save state and leaves playback running without resetting its step/phase. Reload preserves the exact words.
- [ ] W3: edits made in Words appear in Play and vice versa, including switching while a save is pending. A stale tab still cannot overwrite newer work.
- [ ] W4: an actual native browser recorder with synthetic input can capture while lyrics are edited; final save/reopen retains both words and decodable, byte-preserved audio. This is not physical microphone/routing proof.
- [ ] W5: 390px Play retains both writing and backing in one usable stacked view; labelled controls, focus order and reachable stop/save are verified. Physical software-keyboard/VoiceOver checks remain a device gate.
- [ ] W6: existing text/backup exports contain the intended unchanged-format lyrics, with no duplicate editor state or unsolicited chord markup. Offline capture/reopen and worker integrity checks pass after the new static files are pinned.

## Chords above lyrics: next exploration

A small optional annotation layer could let a writer pencil chord names above a word or line while listening. Before treating it as a committed feature, prototype insertion, movement and lyric reflow, then decide how annotations behave in editing, transposition, plain-text export and backup. Keep existing lyrics and chord progressions intact. Do not silently inject chord syntax into existing text or create a new persisted model without its preservation/migration tests.

This idea does not yet require per-word timing, tablature, automatic chord recognition, rich document formatting, a notation editor or a new recording engine.

## Delivery

Land this file trail through the repository's planning review gate before the implementation worktree. Build the combined view as one reviewed increment, preserve data, check actual browser/audio behaviour, and provide desktop/mobile previews. Keep chord annotations separate so they do not delay the essential write-and-listen experience.
