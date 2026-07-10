---
type: epic-design
status: planned
---

# E03: event-driven-rendering

## Purpose

Bring rendering into PRD §9's intent without retaining an artificial frame timer. Today the app recomputes the full ephemeris for all 104 bodies 15 times per second and commits fresh arrays continuously. In v1.1, state changes drive rendering: the live clock ticks at 1 Hz, manual controls and debounced resize update immediately, and memoized subtrees isolate unchanged viewport work.

## What this epic adds

- The continuous fps interval is removed; celestial positions derive from time/location changes
- Projection recomputed only when its inputs change (`time`, `azimuthOffset`, `zoom`, `dimensions`, `aspect`)
- Header clock updates do not rerender an unchanged memoized viewport subtree
- `--fps` remains accepted but is documented as deprecated because event-driven updates no longer need a paint loop
- Labels reserve full text and symbol extents, use deterministic priority, and try viewport-safe right/left/vertical placement

## Components and files

| Module | Purpose |
|--------|---------|
| `src/App.tsx` | Event-driven derived pipeline and memoization |
| `src/ui/Viewport.tsx` | Memoized viewport boundary |
| `src/render/labelLayout.ts` | Full-extent occupancy, right-edge clamping, explicit priority sort |
| `tests/render/labelLayout.test.ts` | New collision and clamping cases |
| `tests/App.test.tsx` | Assert no recompute storm (spy on `calculateCelestialBodies` call rate) |

## Architectural delta

The data flow `skyModel → projectBody → applyStarDensity → assignLabels` is unchanged; its trigger moves from a timer to derived state keyed on inputs. `--fps` remains parse-compatible for v1.1 but is deprecated and has no active timer to govern; removal is reserved for the next breaking CLI release. PRD §9 and README are updated to describe the event-driven model.

## Boundaries

**In scope:** timer removal, derived computation, viewport subtree isolation, `--fps` deprecation documentation, label layout.

**Out of scope:** changing the projection math, aspect-correction redesign, new Ink rendering strategy (per-point absolute Boxes stay as-is unless profiling proves them a problem).

## Quality gates

- All tests pass
- `calculateCelestialBodies` called once on initial render and at most once per live clock tick (fake-timer test)
- Rotating/zooming still feels immediate (manual check)
- CPU usage at idle visibly lower than v1 (spot check via `top` during a 60 s run)
- No continuous paint or compute interval remains other than the 1 Hz live clock

## Open decisions

None.
