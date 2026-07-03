---
id: E01-test-suite-integrity/T002-test-isolation-and-green-suite
status: planned
objective: Make all 175 tests pass deterministically in a single full vitest run
depends_on: ["E01-test-suite-integrity/T001-remove-global-resize-teardown"]
complexity_tier: medium
complexity_reason: Touches several test files plus module-state design in asciiGrid; ordering bugs need repeated-run verification.
---

# T002: Test isolation — unmount instances, per-instance Unicode detection

## Problem

Three tests fail in the full suite but pass in isolation. Beyond the T001 root cause, test files render `App` instances that are never unmounted (leaking intervals and listeners into later tests), and `src/App.tsx:41` freezes `detectUnicodeSupport()` in a module constant at import time, so environment-dependent behavior cannot be isolated per test. The failing integration test (`app-lifecycle` symbol assertion) is a downstream victim of this leakage.

## Context Files

- `src/App.tsx`
- `src/render/asciiGrid.ts`
- `tests/App.test.tsx`
- `tests/integration/app-lifecycle.test.tsx`
- `tests/integration/location-fallback-render.test.tsx`

## Acceptance Criteria

- [ ] `npx vitest run` passes 175/175, three consecutive runs
- [ ] Every `render(<App .../>)` in the test suite has a corresponding `unmount()` (afterEach or inline)
- [ ] Unicode support is resolved per `App` instance (prop with env-based default, or lazy evaluation) instead of a module-load constant
- [ ] `npm test` (the `prepublishOnly` gate) exits 0

## Implementation Plan

- [ ] Replace the module-level `unicodeSupported` constant with a prop defaulting to `detectUnicodeSupport()` at mount, keeping CLI behavior identical
- [ ] Add `afterEach` unmount handling in `tests/App.test.tsx` and both integration test files
- [ ] Re-run the previously failing trio in-suite; then the full suite three times
- [ ] Confirm `npm test && npm run build` (the publish gate) succeeds end-to-end

## Context Log

Pending.
