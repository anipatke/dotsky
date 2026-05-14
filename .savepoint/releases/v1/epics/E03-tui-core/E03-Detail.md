---
type: epic-design
status: planned
---

# E03: tui-core

## Purpose

Bring the terminal UI to life with real state management, all keybindings, an FPS-capped render loop, and live/manual time modes.

## What this epic adds

- App state shape matching the spec (location, time, mode, labels, zoom, azimuthOffset, dimensions)
- All 10 keybindings working: q, l, space, left, right, +, -, r, [, ]
- FPS-capped render loop driving celestial recalculation
- Live mode (system clock updates every second) and manual mode (frozen time, step forward/back)

## Components and files

| Module | Purpose |
|--------|---------|
| `src/App.tsx` | Rewrite with full state management + render loop |
| `src/terminal/input.ts` | New: unified key handler mapping keys to state actions |
| `src/terminal/resize.ts` | Wire into App for dimension tracking |
| `src/ui/Header.tsx` | Dynamic lat/lon, time, mode display |
| `src/ui/Viewport.tsx` | Real celestial data rendering |
| `src/ui/Footer.tsx` | Keybinding hints + location source |
| `src/ui/Horizon.tsx` | Dynamic compass bar with azimuth offset |

## Architectural delta

App.tsx goes from a stub with hardcoded preview data to a stateful component with `useState` for all app state, `useInput` for key handling, `useEffect` for render tick loop, and `onResize` for dimension tracking. A new `input.ts` module centralizes key→action mapping.

## Boundaries

**In scope:**
- App state: location, time, mode (live/manual), labelsEnabled, azimuthOffset, zoom, dimensions
- Keybinding handler for all 10 keys
- FPS-capped render loop (default 15 FPS)
- Live mode: update time from system clock every second
- Manual mode: frozen time with [+10min]/[-10min] stepping
- Zoom in/out (+/-)
- Azimuth rotation (left/right arrows)
- Labels toggle (l key)
- Reset to defaults (r key)

**Out of scope:**
- Dynamic terminal sizing (E04)
- Projection improvements (E04)
- Unicode fallback (E04)
- Minimum terminal enforcement (E04)

## Quality gates

- All keybindings produce observable state changes
- Live mode updates celestial positions every second
- Manual mode freezes time and steps correctly
- Render loop caps at configured FPS
- App renders without crash in 80x24 terminal
- All existing unit tests pass

## Open decisions

None.