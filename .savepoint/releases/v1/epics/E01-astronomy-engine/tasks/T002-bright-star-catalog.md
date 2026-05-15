---
id: E01-astronomy-engine/T002-bright-star-catalog
status: done
objective: Build a static bright-star catalog (~100 Hipparcos stars) and compute their alt/az positions
depends_on: []
complexity_tier: medium
complexity_reason: New module with catalog data and RA/dec-to-alt/az conversion logic.
---

# T002: Bright star catalog and position calculation

## Problem

No bright stars are rendered. The spec requires ~100 named stars with magnitude-based rendering. A catalog with RA/dec/magnitude must be created and positions computed for the observer.

## Context Files

- `src/astronomy/skyModel.ts`
- `src/astronomy/objectTypes.ts`
- `tests/astronomy/skyModel.test.ts`

## Acceptance Criteria

- [ ] `src/astronomy/starCatalog.ts` exports a typed array of ~100 bright stars (name, RA, dec, magnitude)
- [ ] `calculateStarPositions(time, lat, lon)` converts RA/dec to alt/az for each star
- [ ] Stars below horizon have `altitude < 0`
- [ ] Sirius altitude at Sydney 2026-06-15 21:00 is within ±2° of known value
- [ ] No rendering logic in astronomy modules

## Implementation Plan

- [x] Create `src/astronomy/starCatalog.ts` with 95 Hipparcos-derived stars (name, RA in hours, dec in degrees, magnitude)
- [x] Implement `calculateStarPositions(time, lat, lon)` using `astronomy-engine` `Horizon()` for alt/az conversion
- [x] All stars are naked-eye visible (brightest down to magnitude 4.6, with most brighter than 3.5)
- [x] Write tests verifying star count, property types, coordinate ranges, and Sirius altitude range

## Context Log

**Files read:** `src/astronomy/skyModel.ts`, `src/astronomy/objectTypes.ts`, `tests/astronomy/skyModel.test.ts`, `node_modules/astronomy-engine/astronomy.d.ts`

**Files created:** `src/astronomy/starCatalog.ts`, `tests/astronomy/starCatalog.test.ts`

**Files edited:** `src/astronomy/skyModel.ts`, `tests/astronomy/skyModel.test.ts`

**Quality gates:** `npx vitest run` — 14 files, 42 tests passed. `npx tsc --noEmit` — no errors.

**Drift notes:** None. Star RA stored in hours (not degrees) to match `Horizon()` API expectation. The `calculateStarPositions` function uses `Horizon()` directly with J2000 RA/dec — since the library internally handles precession/nutation, no separate `Equator()` call is needed for stars. Merge happens in `skyModel.ts` by concatenating planet and star arrays.