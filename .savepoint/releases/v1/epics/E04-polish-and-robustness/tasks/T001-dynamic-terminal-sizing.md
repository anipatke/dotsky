---
id: E04-polish-and-robustness/T001-dynamic-terminal-sizing
status: done
objective: Make all UI components respond to actual terminal dimensions via resize listener
depends_on: []
complexity_tier: medium
complexity_reason: Multi-file change converting hardcoded dimensions to dynamic state-driven sizing.
---

# T001: Dynamic terminal sizing

## Problem

All UI components use hardcoded width=80. The spec requires dynamic sizing based on actual terminal dimensions.

## Context Files

- `src/App.tsx`
- `src/ui/Header.tsx`
- `src/ui/Viewport.tsx`
- `src/ui/Horizon.tsx`
- `src/ui/Footer.tsx`
- `src/terminal/resize.ts`

## Acceptance Criteria

- [ ] App tracks `dimensions.width` and `dimensions.height` from `onResize`
- [ ] `viewportHeight = totalHeight - headerHeight(1) - horizonHeight(2) - footerHeight(1)`
- [ ] Header occupies 1 row, Horizon 2 rows, Footer 1 row
- [ ] Viewport renders in the remaining height
- [ ] All components use width from props, not hardcoded 80
- [ ] 80x24 is the minimum; app shows warning or centers below minimum

## Implementation Plan

- [ ] App uses `onResize` to set width/height state
- [ ] Initial dimensions from `process.stdout.columns`/`rows` with 80x24 defaults
- [ ] Pass width/height down to all UI components
- [ ] Viewport height = total - 4 (1 header + 2 horizon + 1 footer)
- [ ] Remove all hardcoded 80/24 values
- [ ] Write tests for resize behavior

## Context Log

### Files Read
- `src/App.tsx` — existing state, resize handler, render logic
- `src/ui/Header.tsx` — auto-sizing, no width prop needed
- `src/ui/Viewport.tsx` — already accepts width/height props
- `src/ui/Horizon.tsx` — already accepts width prop
- `src/ui/Footer.tsx` — no width/hardcoded values
- `src/terminal/resize.ts` — debounced resize listener
- `src/Viewport.tsx` — stale duplicate with hardcoded 80x24 (deleted)
- `src/render/labelLayout.ts` — uses viewportWidth from props
- `src/projection/projectAltAz.ts` — uses viewport dimensions
- `src/render/starDensity.ts` — uses viewport dimensions
- `tests/App.test.tsx` — existing test patterns
- `tests/ui/Footer.test.tsx` — existing test patterns

### Files Edited
- `src/App.tsx` — added `MIN_WIDTH`/`MIN_HEIGHT`, `clampDimensions` helper, `belowMinimum` state, viewport height calculation, fixed render interval to use viewport dimensions
- `src/ui/Footer.tsx` — added `belowMinimum` prop, warning message
- `tests/App.test.tsx` — added 3 resize-related tests

### Files Deleted
- `src/Viewport.tsx` — stale duplicate of `src/ui/Viewport.tsx` with hardcoded 80x24

### Quality Gates
- `npx vitest run` — 137/137 tests pass
- `npx tsc --noEmit` — clean, no errors

### Acceptance Criteria Verification
- [x] App tracks `dimensions.width` and `dimensions.height` from `onResize`
- [x] `viewportHeight = totalHeight - 4` (1 header + 2 horizon + 1 footer)
- [x] Header 1 row, Horizon 2 rows, Footer 1 row accounted for
- [x] Viewport renders in remaining height
- [x] All components use dynamic dimensions, not hardcoded 80
- [x] 80x24 minimum enforced with warning in Footer