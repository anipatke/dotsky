---
id: E01-test-suite-integrity/T001-remove-global-resize-teardown
status: planned
objective: Stop App unmount from destroying every instance's resize listeners via the module-level singleton
depends_on: []
complexity_tier: low
complexity_reason: Deleting one redundant effect in App.tsx; the onResize cleanup already unsubscribes correctly.
---

# T001: Remove global resize-listener teardown from App unmount

## Problem

`src/App.tsx:92-96` runs `removeAllResizeListeners()` in a component unmount effect. That clears the module-level listener set in `src/terminal/resize.ts` for *all* instances, so any other mounted `App` silently stops receiving resize events. This is the root cause of the order-dependent test failures and a latent production bug. The per-instance cleanup returned by `onResize` (`App.tsx:82-90`) already does the right thing.

## Context Files

- `src/App.tsx`
- `src/terminal/resize.ts`
- `src/cli.ts`
- `tests/terminal/resize.test.ts`

## Acceptance Criteria

- [ ] Unmounting one `App` instance leaves other instances' resize listeners registered and firing
- [ ] `removeAllResizeListeners()` remains exported and still called from the `process.on('exit')` path in `cli.ts`
- [ ] `tests/App.test.tsx` resize tests pass in the full-suite run, not just isolation
- [ ] No change to resize behavior of a single running app (debounce, dimensions)

## Implementation Plan

- [ ] Delete the unmount effect at `App.tsx:92-96`
- [ ] Add a unit test in `tests/terminal/resize.test.ts`: two subscribers, unsubscribe one, emit resize, assert the other still fires
- [ ] Run the full suite and confirm the two resize tests in `tests/App.test.tsx` now pass in-suite

## Context Log

Pending.
