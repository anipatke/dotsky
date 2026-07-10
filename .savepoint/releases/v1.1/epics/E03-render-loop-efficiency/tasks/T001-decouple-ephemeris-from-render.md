---
id: E03-render-loop-efficiency/T001-decouple-ephemeris-from-render
status: planned
objective: Replace the fps timer with event-driven sky derivation keyed to actual inputs
depends_on: ["E02-conformance-defects/T001-time-flag-manual-mode", "E02-conformance-defects/T003-small-terminal-guard", "E02-conformance-defects/T006-astronomy-error-boundary"]
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

- [ ] The first sky frame is derived immediately rather than waiting for the first interval
- [ ] `calculateCelestialBodies` runs once initially and at most once per 1 Hz live clock tick, asserted with fake timers
- [ ] Projection/density/labels recompute when and only when `time`, `azimuthOffset`, `zoom`, `dimensions`, or `aspect` change
- [ ] Rotation, zoom, resize, and time-stepping still update the view immediately (their input changes trigger recompute without waiting for the 1 Hz tick)
- [ ] Manual mode computes once per time change, not continuously
- [ ] No fps/paint interval remains; `--fps` stays accepted for v1.1 compatibility and is documented as deprecated
- [ ] Full suite green

## Implementation Plan

- [ ] Move `calculateCelestialBodies` out of the fps interval into a memo keyed on `(time, lat, lon)` — the 1 Hz live tick already supplies the cadence
- [ ] Derive projected/density-limited/labeled points via `useMemo` on `(bodies, azimuthOffset, zoom, dimensions, aspect)` instead of `setScreenPoints`/`setLabeledPoints` state
- [ ] Retire the fps interval; do not add a signature or throttle unless profiling demonstrates a measured problem
- [ ] Update README/PRD CLI and rendering notes to deprecate `--fps` while retaining parsing compatibility
- [ ] Add fake-timer call-rate and immediate-first-frame tests; run the full suite; manually smoke all keybindings

## Context Log

Pending.
