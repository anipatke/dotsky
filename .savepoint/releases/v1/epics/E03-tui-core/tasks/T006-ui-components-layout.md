---
id: E03-tui-core/T006-ui-components-layout
status: done
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

- **Read**: `src/ui/Header.tsx`, `src/ui/Footer.tsx`, `src/ui/Horizon.tsx`, `src/ui/Viewport.tsx`, `src/App.tsx`, `tests/ui/Header.test.tsx`, `tests/ui/Footer.test.tsx`, `tests/ui/Horizon.test.tsx`, `tests/App.test.tsx`
- **Edited**: `src/ui/Header.tsx` — accepts `location`, `time`, `mode` props; shows real lat/lon, UTC time, live/paused state
- **Edited**: `src/ui/Horizon.tsx` — accepts `azimuthOffset` prop; rotates cardinal markers (N/E/S/W) by offset
- **Edited**: `src/App.tsx` — passes real state down to Header (location, time, mode) and Horizon (azimuthOffset)
- **Edited**: `tests/ui/Header.test.tsx` — updated for new props, lat/lon, UTC time, mode display
- **Edited**: `tests/ui/Horizon.test.tsx` — added rotation tests for 90°/180°/270°/360° offsets
- **Unchanged**: `src/ui/Footer.tsx` — already wired with `locationSource` from prior tasks
- **Unchanged**: `src/ui/Viewport.tsx` — already wired with `screenPoints`/`labeledPoints`/`labelsEnabled` from T005
- **Quality gates**: `npx vitest run` → 133/133 passed (19 files), `npx tsc --noEmit` → clean