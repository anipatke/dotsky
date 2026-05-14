---
id: E02-location-and-cli/T003-integrate-resolution-chain
status: planned
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

- [ ] Rewrite `resolveLocation.ts` to accept `{lat?, lon?, noGeo?: boolean}` and chain all sources
- [ ] Update `cli.ts` to pass `noGeo` flag from meow
- [ ] Update `Footer.tsx` to accept and conditionally render location source
- [ ] Update `App.tsx` props to include locationSource and pass to Footer
- [ ] Write integration tests covering the full priority chain

## Context Log

Pending.