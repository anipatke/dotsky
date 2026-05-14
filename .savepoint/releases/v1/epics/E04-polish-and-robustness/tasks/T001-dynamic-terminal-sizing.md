---
id: E04-polish-and-robustness/T001-dynamic-terminal-sizing
status: planned
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

Pending.