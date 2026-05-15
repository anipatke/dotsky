---
id: E03-tui-core/T002-key-handler
status: done
objective: Implement unified key handler for all 10 keybindings
depends_on: []
complexity_tier: medium
complexity_reason: Multi-key handler with state mutations, needs integration with Ink useInput.
---

# T002: Key handler (all keybindings)

## Problem

Only `q` to quit is bound. The spec requires 10 keybindings.

## Context Files

- `src/App.tsx`
- `src/terminal/input.ts` (new)

## Acceptance Criteria

- [ ] `input.ts` maps keys to state actions: q (quit), l (toggle labels), space (toggle live/manual), left/right (rotate azimuth ±15°), +/- (zoom in/out), r (reset), [/] (step time ±10min)
- [ ] App uses `useInput` with the input module
- [ ] Ctrl+C exits (handled by Ink `exitOnCtrlC`)
- [ ] All key state changes are observable (labels toggles, zoom changes, etc.)

## Implementation Plan

- [ ] Create `src/terminal/input.ts` with key→action mapping type
- [ ] Integrate into App.tsx via `useInput`
- [ ] Each action updates the corresponding `useState`
- [ ] Write tests verifying key→action mappings

## Context Log

### Files Read
- `src/App.tsx` — existing state management, render loop, minimal key handling
- `src/terminal/resize.ts` — resize listener pattern reference
- `vitest.config.ts` — test configuration

### Files Created
- `src/terminal/input.ts` — pure key→action mapper exporting `KeyAction` union type and `mapKey()` function
- `tests/terminal/input.test.ts` — 14 tests covering all 10 keybindings, alternative keys (`=`, `_`), null returns, and input-over-key precedence

### Files Modified
- `src/App.tsx` — added `mapKey` import, replaced single-key `useInput` with full `handleKey` callback dispatching all 10 actions via `setState`
- `.savepoint/releases/v1/epics/E03-tui-core/tasks/T002-key-handler.md` — set `status: in_progress` / `stage: build`

### Quality Gates
- `npx tsc --noEmit` — no errors
- `npx vitest run` — 18 files, 108 tests, all passed

### Acceptance Criteria Verification
- [x] `input.ts` maps keys to state actions: q (quit), l (toggle labels), space (toggle live/manual), left/right (rotate azimuth ±15°), +/- (zoom in/out), r (reset), [/] (step time ±10min)
- [x] App uses `useInput` with the input module
- [x] Ctrl+C exits (handled by Ink `exitOnCtrlC`)
- [x] All key state changes are observable (labels toggle, zoom changes, azimuth rotation, mode switch, time stepping, reset)