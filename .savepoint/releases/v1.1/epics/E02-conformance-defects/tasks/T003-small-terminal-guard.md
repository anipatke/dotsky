---
id: E02-conformance-defects/T003-small-terminal-guard
status: planned
objective: Render a single warning line instead of a corrupted clamped sky when the terminal is below 80x24
depends_on: ["E01-test-suite-integrity/T002-test-isolation-and-green-suite"]
complexity_tier: medium
complexity_reason: Render-branch change in App.tsx with resize interplay and updates to existing warning-footer tests.
---

# T003: Below-minimum terminal shows a warning screen, not a clamped sky

## Problem

Below 80x24 the app clamps dimensions to the minimum (`clampDimensions`, `src/App.tsx:43-48`) and keeps rendering an 80-column layout into the smaller terminal — lines wrap, the display corrupts, and even the footer warning wraps across two lines. PRD §16 requires graceful handling; the v1 Plan (Task 12) specified rendering a single warning line instead of the sky, clearing automatically when resized back.

## Context Files

- `src/App.tsx`
- `src/ui/Footer.tsx`
- `src/constants.ts`
- `tests/App.test.tsx`

## Acceptance Criteria

- [ ] When `width < 80 || height < 24`, the app renders only a warning truncated to the actual terminal width so it cannot wrap
- [ ] Resizing back to ≥80x24 restores the full sky view automatically (resize listener keeps working while the warning shows)
- [ ] The footer no longer carries the too-small warning (that path is dead once the guard branch exists)
- [ ] At exactly 80x24 the full UI renders
- [ ] Width-only, height-only, 79x24, 80x23, very narrow, and repeated threshold-crossing cases are covered
- [ ] Existing resize tests updated to assert the new warning-screen behavior

## Implementation Plan

- [ ] Preserve actual terminal dimensions and use an early-return render branch keyed on `belowMinimum`; truncate the warning to the raw width
- [ ] Keep the resize subscription active in the warning branch so recovery works
- [ ] Remove the `belowMinimum` warning from `Footer.tsx` and its props
- [ ] Update `tests/App.test.tsx` resize tests (they currently assert the footer-warning behavior)
- [ ] Manual check in a real terminal: shrink below minimum, confirm single line; restore, confirm sky returns

## Context Log

Pending.
