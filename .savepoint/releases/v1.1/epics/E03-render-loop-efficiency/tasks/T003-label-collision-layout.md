---
id: E03-render-loop-efficiency/T003-label-collision-layout
status: planned
objective: Deterministic viewport-safe label placement that reserves labels and celestial symbols
depends_on: ["E02-conformance-defects/T004-star-priority-alignment"]
complexity_tier: medium
complexity_reason: Algorithm change in labelLayout with real geometry cases; isolated module but needs careful test coverage.
---

# T003: Real label collision avoidance

## Problem

`src/render/labelLayout.ts` only checks whether the single anchor cell `(x+1, y)` is taken — two labels one column apart happily overprint each other, labels near the right edge run off the viewport, and priority is inherited implicitly from `applyStarDensity`'s sort order rather than stated. PRD §12 requires collision avoidance and priority planets > moon > sun > bright stars.

## Context Files

- `src/render/labelLayout.ts`
- `src/render/starDensity.ts`
- `src/ui/Viewport.tsx`
- `tests/render/labelLayout.test.ts`

## Acceptance Criteria

- [ ] A label reserves its full text extent and every celestial symbol cell is treated as occupied
- [ ] Labels are clamped so no character exceeds `viewportWidth - 1`
- [ ] Assignment order is an explicit §12 priority sort inside `assignLabels`, independent of input order
- [ ] Equal-priority bodies use magnitude then stable body ID as deterministic tie-breakers
- [ ] Placement tries right, left, above, and below when safe before dropping a label
- [ ] `maxLabels = floor(width / 12)` cap unchanged
- [ ] Unit tests cover: adjacent bodies, right-edge body, priority contention when the cap is hit

## Implementation Plan

- [ ] Track symbol cells and label occupancy as per-row column intervals
- [ ] Add deterministic right/left/above/below candidate placement with viewport bounds checks
- [ ] Sort candidates by §12 priority, magnitude, then ID
- [ ] Extend `tests/render/labelLayout.test.ts` with the geometry cases above

## Context Log

Pending.
