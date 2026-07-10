---
id: E02-conformance-defects/T001-time-flag-manual-mode
status: planned
objective: Make --time actually control the observation time by starting in manual mode
depends_on: ["E01-test-suite-integrity/T002-test-isolation-and-green-suite"]
complexity_tier: medium
complexity_reason: Small code change but a product-behavior decision (mode semantics) spanning cli.ts, App.tsx, and tests.
---

# T001: `--time` starts the app in manual mode

## Problem

`dotsky --time="2024-06-15T22:00:00+10:00"` shows the current system time. The app always starts in `live` mode, and the live-mode interval (`src/App.tsx:134-140`) overwrites `initialTime` with `new Date()` within one second — the flag is effectively a no-op. PRD §15 defines live mode as "uses system time", which is incompatible with an explicit `--time`; the only coherent behavior is to start paused at the requested time.

## Context Files

- `src/App.tsx`
- `src/cli.ts`
- `tests/App.test.tsx`
- `tests/integration/app-lifecycle.test.tsx`
- `tests/integration/cli-bootstrap.test.ts`

## Acceptance Criteria

- [ ] Launching with `--time` starts in `manual` mode showing exactly the given time (header shows `[paused]`)
- [ ] The displayed time does not drift while paused
- [ ] `[` / `]` step from the given time; `space` snaps to live system time per §15
- [ ] Launching without `--time` still starts in `live` mode (unchanged)
- [ ] Integration test covers the full CLI-to-header path with `--time`

## Implementation Plan

- [ ] Derive initial mode from `initialTime !== undefined`; do not add a second prop that can contradict `initialTime`
- [ ] Ensure `reset` (`r`) sets mode to live and replaces the time with `new Date()` in the same state update, as well as resetting view and labels
- [ ] Add/adjust fake-timer tests: paused start, no drift over >1 s, step from flag time, reset snaps immediately to system time, plain launch still live
- [ ] Verify with a real run: `npm run dev -- --time="2024-06-15T22:00:00+10:00" --no-geo`

## Context Log

Pending.
