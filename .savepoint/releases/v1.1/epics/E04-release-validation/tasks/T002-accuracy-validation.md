---
id: E04-release-validation/T002-accuracy-validation
status: planned
objective: Establish documented reference comparisons and repeatable astronomy regression fixtures
depends_on: ["E03-render-loop-efficiency/T002-isolate-unchanged-viewport", "E03-render-loop-efficiency/T003-label-collision-layout"]
complexity_tier: low
complexity_reason: Known procedure from the v1 plan's Phase 3 validation strategy; comparison and write-up only.
---

# T002: Accuracy validation against a reference planetarium

## Problem

PRD §18 requires "accurate celestial positioning" but nothing has ever compared dotsky's output against a trusted reference. The v1 plan's Phase 3 validation strategy (spot-check ≥3 bodies against Stellarium at a known time/location) was never executed.

## Context Files

- `src/astronomy/planetPositions.ts`
- `src/astronomy/starCatalog.ts`
- `.savepoint/releases/v1.1/validation.md`

## Acceptance Criteria

- [ ] Cases cover Sun, Moon, at least one planet, and one bright star across Sydney, one northern-hemisphere location, and a near-horizon body
- [ ] Each case records UTC instant, observer coordinates/elevation, refraction and apparent/geometric-coordinate settings, reference tool/version, astronomy-engine version, expected values, actual values, and tolerance
- [ ] Agreement within the documented tolerance (initial target ~1° alt/az for solar-system bodies); star positions account explicitly for fixed-catalog epoch limitations
- [ ] Validated values become automated regression fixtures with tolerances, not only a one-time manual table
- [ ] Results and assumptions are recorded in `.savepoint/releases/v1.1/validation.md`
- [ ] Any body off by more than tolerance filed as a defect via `savepoint-create-defect`, not silently fixed

## Implementation Plan

- [ ] Write a scratch comparison script printing alt/az for fixed instants and locations
- [ ] Compare with Stellarium or an equivalent authoritative ephemeris using matched coordinate/refraction settings
- [ ] Record the table and verdict, then add stable fixtures to the astronomy tests

## Context Log

Pending.
