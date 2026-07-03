---
id: E04-release-validation/T002-accuracy-validation
status: planned
objective: Verify rendered sky positions against Stellarium for at least three bodies
depends_on: []
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

- [ ] Alt/az of the Sun, the Moon, and at least one planet and one bright star compared against Stellarium for the same instant and observer (suggest Sydney, a fixed ISO time via `--time` — requires E02/T001)
- [ ] Agreement within ~1° alt/az for solar-system bodies; star positions sanity-checked (catalog uses fixed ICRS coords, so arc-minute drift is acceptable)
- [ ] Results recorded in `.savepoint/releases/v1.1/validation.md` with the exact time, location, and numbers
- [ ] Any body off by more than tolerance filed as a defect via `savepoint-create-defect`, not silently fixed

## Implementation Plan

- [ ] Write a small comparison script (scratch, not shipped) printing alt/az from `calculateSolarSystemBodies`/`calculateStarPositions` for a fixed instant
- [ ] Read the same values from Stellarium (or an equivalent authoritative ephemeris source)
- [ ] Record the table and verdict in `validation.md`

## Context Log

Pending.
