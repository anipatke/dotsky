---
id: E03-render-loop-efficiency/T002-isolate-unchanged-viewport
status: planned
objective: Keep header-only state changes from rerendering an unchanged viewport subtree
depends_on: ["E03-render-loop-efficiency/T001-decouple-ephemeris-from-render"]
complexity_tier: medium
complexity_reason: Establishes a stable memoization boundary without suppressing legitimate view changes.
---

# T002: Isolate an unchanged viewport from header clock updates

## Problem

After T001, the live clock still changes root App state once per second. The header must show that time, but the much larger viewport should not rerender when its projected points, labels, and dimensions are referentially unchanged. A whole-frame signature would duplicate React's job and risks suppressing legitimate UI updates.

## Context Files

- `src/App.tsx`
- `src/ui/Viewport.tsx`
- `tests/App.test.tsx`
- `tests/ui/Viewport.test.tsx`

## Acceptance Criteria

- [ ] The Header updates once per live clock tick by design
- [ ] A header-only update does not rerender `Viewport` when its actual props are unchanged
- [ ] Body movement, label toggle, rotation, zoom, resize, and manual time step still update the viewport immediately
- [ ] No serialized frame signature or duplicate frame state is introduced
- [ ] Tests assert observable component-boundary behavior, not React root commit internals

## Implementation Plan

- [ ] Keep derived viewport props referentially stable with `useMemo`
- [ ] Wrap `Viewport` in `React.memo` using its actual props
- [ ] Add a focused render-spy test for the Viewport boundary and positive tests for legitimate updates
- [ ] Profile before adding any deeper memoization

## Context Log

Pending.
