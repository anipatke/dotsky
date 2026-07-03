---
id: E03-render-loop-efficiency/T002-skip-unchanged-frames
status: planned
objective: Avoid Ink re-renders when the computed frame is identical to the previous one
depends_on: ["E03-render-loop-efficiency/T001-decouple-ephemeris-from-render"]
complexity_tier: medium
complexity_reason: Requires a correct frame-identity check that must not suppress legitimate updates; builds on the T001 restructure.
---

# T002: Skip redraws for identical frames

## Problem

PRD §9 requires "avoid unnecessary redraws". Even after T001, a 1 Hz time tick can produce a frame where every body rounds to the same terminal cell as before (celestial motion is slow at terminal resolution); pushing new arrays into React each tick still forces Ink to re-render and repaint an identical screen.

## Context Files

- `src/App.tsx`
- `src/ui/Viewport.tsx`
- `tests/App.test.tsx`

## Acceptance Criteria

- [ ] When the projected point set (positions, symbols, labels) is unchanged, no new render is committed (test: frame count via a render spy stays flat across several identical ticks)
- [ ] Any real change — a body crossing to a new cell, label toggle, mode/header change — still renders immediately
- [ ] Header clock behavior is decided and consistent: either the header updates each second by design (document it) or it participates in the skip
- [ ] Full suite green

## Implementation Plan

- [ ] Implement a cheap frame signature (e.g. join of `x,y,symbol` plus label state) compared before committing state
- [ ] Memoize `Viewport` with `React.memo` keyed on its actual props
- [ ] Decide and document the header-clock exception
- [ ] Add the render-count test; manual check that the app still feels live

## Context Log

Pending.
