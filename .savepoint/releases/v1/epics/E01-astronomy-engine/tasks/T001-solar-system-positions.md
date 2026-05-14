---
id: E01-astronomy-engine/T001-solar-system-positions
status: planned
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

- [ ] Create `src/astronomy/planetPositions.ts` with `calculateSolarSystemBodies(time, lat, lon): CelestialBody[]`
- [ ] Use `astronomy-engine` APIs: `Sun.position()`, `Moon.position()`, `Planet.position()` etc. to compute topocentric alt/az
- [ ] Update `skyModel.ts` to call `planetPositions` and merge with star catalog (star catalog from T002)
- [ ] Write ephemeris-verified test cases for Sun altitude at known times/places

## Context Log

Pending.