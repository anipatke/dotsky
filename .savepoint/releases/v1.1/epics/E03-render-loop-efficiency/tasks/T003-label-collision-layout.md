---
id: E03-render-loop-efficiency/T003-label-collision-layout
status: planned
objective: Width-aware label collision avoidance with right-edge clamping and explicit §12 priority
depends_on: []
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

- [ ] A label reserves its full text extent (`labelX .. labelX + name.length`) on its row; overlapping candidates are skipped or placed on the other side of the point
- [ ] Labels are clamped so no character exceeds `viewportWidth - 1`
- [ ] Assignment order is an explicit §12 priority sort inside `assignLabels`, independent of input order
- [ ] `maxLabels = floor(width / 12)` cap unchanged
- [ ] Unit tests cover: adjacent bodies, right-edge body, priority contention when the cap is hit

## Implementation Plan

- [ ] Track occupancy as per-row column intervals instead of a single-cell set
- [ ] Add left-side fallback placement (`x - name.length - 1`) when the right side collides or clips
- [ ] Sort candidates by §12 priority before assignment
- [ ] Extend `tests/render/labelLayout.test.ts` with the geometry cases above

## Context Log

Pending.
