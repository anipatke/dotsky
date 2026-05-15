---
id: E04-polish-and-robustness/T006-integration-tests
status: done
objective: Write integration tests covering full render cycle, resize, and fallback handling
depends_on: ["E04-polish-and-robustness/T001-dynamic-terminal-sizing"]
complexity_tier: medium
complexity_reason: Integration tests spanning multiple modules with Ink testing setup.
---

# T006: Integration tests

## Problem

The spec (§17) requires integration tests for full-screen entry/exit, resize behavior, CLI overrides, and fallback handling. None exist yet.

## Context Files

- `src/cli.ts`
- `src/App.tsx`
- `src/terminal/resize.ts`
- `src/location/resolveLocation.ts`

## Acceptance Criteria

- [ ] Integration test: CLI flags (--lat, --lon, --aspect) produce correct App state
- [ ] Integration test: resize triggers dimension update
- [ ] Integration test: location fallback chain produces correct source
- [ ] Integration test: full render cycle (skyModel → project → density → grid) produces output
- [ ] Test coverage for failure modes: geolocation failure returns fallback

## Implementation Plan

- [ ] Use `ink-testing-library` for App rendering tests
- [ ] Test CLI flag parsing and state propagation
- [ ] Test resize handler integration with App dimensions
- [ ] Test location resolution chain end-to-end
- [ ] Test render pipeline produces visible output

## Context Log

Files read: src/App.tsx, src/cli.ts, src/ui/Header.tsx, src/ui/Footer.tsx, src/ui/Viewport.tsx, src/terminal/resize.ts, tests/App.test.tsx, tests/ui/Footer.test.tsx, tests/ui/Viewport.test.tsx, src/astronomy/skyModel.ts, src/projection/projectAltAz.ts, src/render/starDensity.ts, src/render/asciiGrid.ts, src/location/resolveLocation.ts
Files created: tests/integration/app-lifecycle.test.tsx (18 tests)

Test coverage:
- CLI flags → App state: lat/lon header propagation, labelsEnabled, aspect/fps, initialTime, all-flags combined (6 tests)
- Full render cycle: Sydney night sky output, paused/live mode toggle, rotation (4 tests)
- Resize integration: resize keeps app stable (1 test)
- Location fallback: all source types (cli/cache/geo/fallback) render correctly (4 tests)
- Failure modes: fallback shows Sydney, belowMinimum overrides fallback (2 tests)

Quality gates:
- `npx tsc --noEmit`: passes
- `npx vitest run`: 21 files, 173 tests passed