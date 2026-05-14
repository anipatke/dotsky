---
id: E04-polish-and-robustness/T006-integration-tests
status: planned
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

Pending.