---
id: E02-conformance-defects/T004-star-priority-alignment
status: planned
objective: Make star-density priority follow PRD §10 and keep visible solar-system bodies ahead of stars
depends_on: ["E01-test-suite-integrity/T002-test-isolation-and-green-suite"]
complexity_tier: low
complexity_reason: One priority constant plus explicit constrained-density regression tests; the product order is already decided.
---

# T004: Align star-density priority with PRD §10

## Problem

PRD §10 orders density priority Sun > Moon > Planets > bright stars > dim stars. `src/render/starDensity.ts:3` ships the inverse: `{ planet: 0, moon: 1, sun: 2, star: 3 }`. One of them is wrong; today the spec and the code silently disagree, which will mislead the next contributor.

## Context Files

- `src/render/starDensity.ts`
- `prd.md`
- `tests/render/starDensity.test.ts`

## Acceptance Criteria

- [ ] Code priority is Sun > Moon > Planets > bright stars > dim stars, matching PRD §10
- [ ] `tests/render/starDensity.test.ts` asserts the agreed order explicitly by name (sun/moon/planet), not just by count
- [ ] Under a constrained density limit, a star never displaces a visible Sun, Moon, or planet

## Implementation Plan

- [ ] Flip the `PRIORITY` map to follow PRD §10
- [ ] Update/extend the density unit tests to lock in the order

## Context Log

Pending.
