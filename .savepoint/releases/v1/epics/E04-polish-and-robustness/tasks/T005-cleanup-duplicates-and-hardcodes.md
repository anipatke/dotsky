---
id: E04-polish-and-robustness/T005-cleanup-duplicates-and-hardcodes
status: done
objective: Remove duplicate Viewport.tsx, clean up hardcoded dimensions and stale references
depends_on: []
complexity_tier: low
complexity_reason: Deletion and minor refactoring, no architectural change.
---

# T005: Cleanup duplicates and hardcoded values

## Problem

Two Viewport files exist (`src/Viewport.tsx` and `src/ui/Viewport.tsx`). Several components still have hardcoded dimensions.

## Context Files

- `src/Viewport.tsx`
- `src/App.tsx`
- `src/ui/Header.tsx`
- `src/ui/Footer.tsx`
- `src/ui/Horizon.tsx`

## Acceptance Criteria

- [ ] `src/Viewport.tsx` (the duplicate outside `ui/`) is deleted
- [ ] No imports of the old `src/Viewport.tsx` remain
- [ ] No hardcoded `width={80}` or `height={24}` in any component
- [ | All dimension values come from props or state

## Implementation Plan

- [ ] Delete `src/Viewport.tsx`
- [ ] Search for and update any imports referencing the old file
- [ ] Replace hardcoded dimensions in Header, Footer, Horizon with prop values
- [ ] Verify build still compiles

## Context Log

Files read: src/App.tsx, src/ui/Header.tsx, src/ui/Footer.tsx, src/ui/Horizon.tsx, src/ui/Viewport.tsx
Files edited: src/App.tsx (import from constants.js, removed inline MIN_WIDTH/MIN_HEIGHT), src/ui/Footer.tsx (import constants.js, dynamic display string)
Files created: src/constants.ts (MIN_WIDTH=80, MIN_HEIGHT=24)
Files verified deleted: src/Viewport.tsx (already gone, no stale imports remain)

Quality gates:
- `npx tsc --noEmit`: passes
- `npx vitest run`: 20 files, 156 tests passed