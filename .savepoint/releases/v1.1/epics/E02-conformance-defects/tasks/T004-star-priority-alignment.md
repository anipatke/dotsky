---
id: E02-conformance-defects/T004-star-priority-alignment
status: planned
objective: Make star-density priority in code and PRD §10 agree
depends_on: []
complexity_tier: low
complexity_reason: One constant in starDensity.ts or one PRD paragraph, plus test updates; decision is recorded in the epic.
---

# T004: Align star-density priority with PRD §10

## Problem

PRD §10 orders density priority Sun > Moon > Planets > bright stars > dim stars. `src/render/starDensity.ts:3` ships the inverse: `{ planet: 0, moon: 1, sun: 2, star: 3 }`. One of them is wrong; today the spec and the code silently disagree, which will mislead the next contributor.

## Context Files

- `src/render/starDensity.ts`
- `prd.md`
- `tests/render/starDensity.test.ts`

## Acceptance Criteria

- [ ] Code priority order and PRD §10 are identical (whichever direction the open decision in `E02-Detail.md` resolves)
- [ ] If the PRD is amended, §10 documents the rationale (planets-first favors what's actually interesting in a night sky; the Sun is below the horizon at night anyway)
- [ ] `tests/render/starDensity.test.ts` asserts the agreed order explicitly by name (sun/moon/planet), not just by count

## Implementation Plan

- [ ] Resolve the open decision with the owner (default: follow PRD §10 — sun, moon, planets)
- [ ] Apply the chosen side: flip the `PRIORITY` map or amend PRD §10
- [ ] Update/extend the density unit tests to lock in the order

## Context Log

Pending.
