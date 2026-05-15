---
id: E03-tui-core/T001-app-state-and-render-loop
status: done
objective: Replace stub App with full state management and FPS-capped render loop
depends_on: []
complexity_tier: high
complexity_reason: Cross-module rewrite of App.tsx with state, effects, and render loop integration.
---

# T001: App state shape and render loop

## Problem

App.tsx is a stub with hardcoded preview data. It needs the full state shape from the spec and an FPS-capped render loop that recalculates celestial positions.

## Context Files

- `src/App.tsx`
- `src/astronomy/skyModel.ts`
- `src/projection/projectAltAz.ts`
- `src/render/starDensity.ts`
- `src/terminal/resize.ts`

## Acceptance Criteria

- [ ] App state matches spec: `{location, time, mode, labelsEnabled, azimuthOffset, zoom, dimensions}`
- [ ] FPS-capped render loop runs at configured rate (default 15)
- [ ] Live mode: time updates from system clock every second
- [ ] `dimensions` tracked from terminal via `onResize`
- [ ] Render pipeline: skyModel → projectBody → applyStarDensity → asciiGrid symbols → Viewport
- [ ] No unnecessary redraws outside of tick interval

## Implementation Plan

- [ ] Define `AppState` type in App.tsx per spec
- [ ] Replace preview data with real pipeline: `calculateCelestialBodies()` → `projectBody()` → `applyStarDensity()` → `getSymbolForBody()`
- [ ] Add `useEffect` for render tick loop with `requestAnimationFrame` or `setInterval` at fps interval
- [ ] Add `useEffect` for live time update (1s interval in live mode)
- [ ] Wire `onResize` to update `dimensions` state
- [ ] Clean up intervals on unmount

## Context Log

Pending.