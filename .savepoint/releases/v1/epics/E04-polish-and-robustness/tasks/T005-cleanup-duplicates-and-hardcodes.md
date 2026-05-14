---
id: E04-polish-and-robustness/T005-cleanup-duplicates-and-hardcodes
status: planned
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

Pending.