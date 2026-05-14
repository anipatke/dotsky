---
id: E03-tui-core/T002-key-handler
status: planned
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

Pending.