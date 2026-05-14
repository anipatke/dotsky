---
id: E01-astronomy-engine/T003-skyModel-integration-tests
status: planned
objective: Comprehensive skyModel tests verifying real ephemeris positions and edge cases
depends_on: ["E01-astronomy-engine/T001-solar-system-positions", "E01-astronomy-engine/T002-bright-star-catalog"]
complexity_tier: low
complexity_reason: Single-module test expansion with known ephemeris data, no cross-module ripple.
---

# T003: SkyModel integration tests

## Problem

Current skyModel test only checks that the result is an array with basic shape. Real positions need verification against known astronomical data.

## Context Files

- `src/astronomy/skyModel.ts`
- `tests/astronomy/skyModel.test.ts`

## Acceptance Criteria

- [ ] Sun altitude at Sydney noon (summer solstice) is within ±2° of 79.5°
- [ ] Moon position test for a known date/time/lat/lon within ±2°
- [ ] At least 2 planet positions verified
- [ ] At least 3 star positions verified
- [ ] Edge case: polar latitude (lat=89) does not crash
- [ ] Edge case: date far in future/past returns valid shape
- [ ] No rendering logic in astronomy modules

## Implementation Plan

- [ ] Add ephemeris-verified test cases to `skyModel.test.ts`
- [ ] Use known ephemeris data for comparison values
- [ ] Test polar and equatorial observer positions
- [ ] Test edge-case dates (year 1, year 3000)

## Context Log

Pending.