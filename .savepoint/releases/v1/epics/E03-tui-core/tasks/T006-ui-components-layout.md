---
id: E03-tui-core/T006-ui-components-layout
status: planned
objective: Wire Header, Footer, Horizon to real app state; Viewport renders projected sky
depends_on: ["E03-tui-core/T001-app-state-and-render-loop"]
complexity_tier: medium
complexity_reason: Multiple UI components need state props, Viewport rendering logic is non-trivial.
---

# T006: UI components wired to state

## Problem

Header uses hardcoded lat/lon, Footer is static, Horizon doesn't reflect azimuth offset, Viewport uses mock data. All need real state.

## Context Files

- `src/ui/Header.tsx`
- `src/ui/Footer.tsx`
- `src/ui/Horizon.tsx`
- `src/ui/Viewport.tsx`
- `src/App.tsx`

## Acceptance Criteria

- [ ] Header shows real lat, lon, and current time/mode
- [ ] Footer shows keybinding help and location source warning when fallback
- [ ] Horizon compass rotates with `azimuthOffset`
- [ ] Viewport renders actual projected ScreenPoints with correct symbols
- [ ] Labels render when `labelsEnabled` is true

## Implementation Plan

- [ ] Refactor Header to accept `location`, `time`, `mode` props
- [ ] Refactor Footer to accept `locationSource` prop, conditionally show fallback warning
- [ ] Refactor Horizon to accept `azimuthOffset` and rotate compass markers
- [ ] Refactor Viewport to accept `ScreenPoint[]` and `LabeledPoint[]` and render symbols + optional labels
- [ ] App passes all state down as props

## Context Log

Pending.