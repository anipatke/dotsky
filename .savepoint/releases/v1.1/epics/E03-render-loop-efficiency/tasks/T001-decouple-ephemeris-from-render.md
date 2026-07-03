---
id: E03-render-loop-efficiency/T001-decouple-ephemeris-from-render
status: planned
objective: Compute celestial positions at 1 Hz and only re-project when inputs change, per PRD §9
depends_on: []
complexity_tier: high
complexity_reason: Restructures the App.tsx state/effect pipeline with regression risk across time modes, resize, and controls.
---

# T001: Decouple ephemeris computation from the render loop

## Problem

PRD §9: "Live mode updates celestial positions once per second. Render loop capped at fps." The current fps interval (`src/App.tsx:98-132`) recomputes the full ephemeris for all 104 bodies 15 times per second — a 15x overspend on the most expensive operation in the app — because compute and paint share one timer.

## Context Files

- `src/App.tsx`
- `src/astronomy/skyModel.ts`
- `src/timeControls.ts`
- `tests/App.test.tsx`
- `tests/astronomy/skyModel.test.ts`

## Acceptance Criteria

- [ ] `calculateCelestialBodies` runs at most ~1 Hz in steady-state live mode (asserted by a spy-based test over a multi-second window)
- [ ] Projection/density/labels recompute when and only when `time`, `azimuthOffset`, `zoom`, `dimensions`, or `aspect` change
- [ ] Rotation, zoom, resize, and time-stepping still update the view immediately (their input changes trigger recompute without waiting for the 1 Hz tick)
- [ ] Manual mode computes once per time change, not continuously
- [ ] Full suite green

## Implementation Plan

- [ ] Move `calculateCelestialBodies` out of the fps interval into a memo keyed on `(time, lat, lon)` — the 1 Hz live tick already updates `time`, giving §9's cadence for free
- [ ] Derive projected/density-limited/labeled points via `useMemo` on `(bodies, azimuthOffset, zoom, dimensions, aspect)` instead of `setScreenPoints`/`setLabeledPoints` state
- [ ] Retire the fps interval or reduce it to a paint-throttle if profiling shows Ink needs one
- [ ] Add the call-rate spy test; run the full suite; manual smoke of all keybindings

## Context Log

Pending.
