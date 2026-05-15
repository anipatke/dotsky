---
id: E03-tui-core/T003-manual-time-mode
status: done
objective: Implement manual time mode with freeze and ±10 minute stepping
depends_on: ["E03-tui-core/T001-app-state-and-render-loop"]
complexity_tier: medium
complexity_reason: Stateful time management with two modes and step logic, moderate cross-module impact.
---

# T003: Manual time mode with stepping

## Problem

No manual time mode exists. The spec requires a pause/live toggle and ±10 minute stepping.

## Context Files

- `src/App.tsx`

## Acceptance Criteria

- [x] `space` toggles between `live` and `manual` mode
- [x] In `live` mode, time follows system clock (1s updates)
- [x] In `manual` mode, time is frozen at last live time
- [x] `]` steps time forward 10 minutes
- [x] `[` steps time backward 10 minutes
- [x] Returning to `live` snaps to current system time

## Implementation Plan

- [x] Add `mode: 'live' | 'manual'` to App state with `useState`
- [x] `space` toggles mode; switching to live resets time to `new Date()`
- [x] In manual mode, `[`/`]` adjust time state by ±600000ms
- [x] Live mode `useEffect` only runs when `mode === 'live'`
- [x] Write tests for mode toggling and time stepping logic

## Context Log

Pending.