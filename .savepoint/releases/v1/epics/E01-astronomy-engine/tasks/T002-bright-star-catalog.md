---
id: E01-astronomy-engine/T002-bright-star-catalog
status: planned
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

- [ ] Create `src/astronomy/starCatalog.ts` with Hipparcos-derived data (name, RA in degrees, dec in degrees, magnitude)
- [ ] Implement `calculateStarPositions(time, lat, lon)` using `astronomy-engine` horizontal coordinate conversion
- [ ] Filter out stars with magnitude > 6.0 (naked-eye limit)
- [ ] Write tests verifying at least 3 named stars against known ephemeris positions

## Context Log

Pending.