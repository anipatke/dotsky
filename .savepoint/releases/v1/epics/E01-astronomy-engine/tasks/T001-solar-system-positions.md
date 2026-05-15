---
id: E01-astronomy-engine/T001-solar-system-positions
status: done
objective: Compute Sun, Moon, and naked-eye planet alt/az positions using astronomy-engine
depends_on: []
complexity_tier: medium
complexity_reason: Multi-file change integrating an external package with cross-module type impact.
---

# T001: Solar system body positions

## Problem

skyModel.ts returns a hardcoded Sun object. Real planet positions must come from `astronomy-engine`.

## Context Files

- `src/astronomy/skyModel.ts`
- `src/astronomy/objectTypes.ts`
- `package.json` (astronomy-engine already listed)
- `tests/astronomy/skyModel.test.ts`

## Acceptance Criteria

- [ ] `calculateCelestialBodies()` returns Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn for any valid lat/lon/time
- [ ] Each body has correct `id`, `name`, `type`, `azimuth`, `altitude`, `magnitude`
- [ ] Bodies below the horizon have `altitude < 0` (visibility is a projection concern)
- [ ] No rendering logic in astronomy modules

## Implementation Plan

- [x] Create `src/astronomy/planetPositions.ts` with `calculateSolarSystemBodies(time, lat, lon): CelestialBody[]`
- [x] Use `astronomy-engine` APIs: `Equator()`, `Horizon()`, `Illumination()` to compute topocentric alt/az
- [x] Update `skyModel.ts` to call `planetPositions` and merge with star catalog (star catalog from T002)
- [x] Write ephemeris-verified test cases for Sun altitude at known times/places

## Context Log

**Files read:** `src/astronomy/skyModel.ts`, `src/astronomy/objectTypes.ts`, `package.json`, `tests/astronomy/skyModel.test.ts`, `node_modules/astronomy-engine/astronomy.d.ts`

**Files created:** `src/astronomy/planetPositions.ts`

**Files edited:** `src/astronomy/skyModel.ts`, `tests/astronomy/skyModel.test.ts`

**Quality gates:** `npx vitest run` — 13 files, 36 tests passed. `npx tsc --noEmit` — no errors.

**Drift notes:** None. Implementation follows Design.md and existing module conventions. The original plan referenced `Sun.position()`, `Moon.position()`, `Planet.position()` but the actual `astronomy-engine` API uses `Equator()` + `Horizon()` + `Illumination()` for topocentric alt/az + magnitude — a more accurate and idiomatic combination. No architectural drift.