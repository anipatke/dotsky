---
id: E02-location-and-cli/T003-integrate-resolution-chain
status: done
objective: Wire CLI, cache, geo, and fallback into the full location resolution priority chain
depends_on: ["E02-location-and-cli/T001-ip-geolocation-service", "E02-location-and-cli/T002-location-cache"]
complexity_tier: medium
complexity_reason: Multi-module orchestration with --no-geo flag and async flow.
---

# T003: Integrate full resolution chain with --no-geo and fallback warning

## Problem

resolveLocation.ts only handles CLI args and hard Sydney fallback. The full priority chain (CLI → cache → geo → fallback) must be wired, including `--no-geo` flag and fallback warning in Footer.

## Context Files

- `src/location/resolveLocation.ts`
- `src/cli.ts`
- `src/ui/Footer.tsx`
- `tests/location/resolveLocation.test.ts`

## Acceptance Criteria

- [ ] `resolveLocation()` tries: CLI args → cache → IP geo → Sydney fallback
- [ ] `--no-geo` skips IP geolocation step (tries: CLI → cache → fallback)
- [ ] `locationSource` is propagated to App and rendered in Footer when "fallback"
- [ ] Footer shows `[Location fallback: Sydney]` when source is "fallback"
- [ ] IP geo success writes to cache for next launch

## Implementation Plan

- [x] Rewrite `resolveLocation.ts` to accept `{lat?, lon?, noGeo?}` and chain all sources
- [x] Update `cli.ts` to pass `noGeo` flag from meow
- [x] Update `Footer.tsx` to accept and conditionally render location source
- [x] Update `App.tsx` to pass `locationSource` to Footer
- [x] Write integration tests covering the full priority chain including `noGeo`

## Context Log

**Files read:** `src/location/resolveLocation.ts`, `src/cli.ts`, `src/ui/Footer.tsx`, `tests/location/resolveLocation.test.ts`, `src/App.tsx`

**Files edited:** `src/location/resolveLocation.ts`, `src/cli.ts`, `src/ui/Footer.tsx`, `src/App.tsx`, `tests/location/resolveLocation.test.ts`

**Quality gates:** `npx vitest run` — 16 files, 74 tests passed. `npx tsc --noEmit` — no errors.

**Changes:**
- `resolveLocation.ts`: Added `ResolveOptions` type with `noGeo?: boolean` param. Skips IP geo step when `noGeo` is true.
- `cli.ts`: Destructures `geo` flag and passes `noGeo: !geo` to `resolveLocation`. `--no-geo` sets `geo=false` → skips IP lookup.
- `Footer.tsx`: Accepts `locationSource` prop. Shows `[Location fallback: Sydney]` when `locationSource === 'fallback'`.
- `App.tsx`: Uses `props` instead of `_props` and passes `locationSource` to `Footer`.
- `resolveLocation.test.ts`: Added 2 `noGeo` test cases.

**Drift notes:** None.