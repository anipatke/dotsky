---
type: epic-design
status: planned
---

# E03: render-loop-efficiency

## Purpose

Bring the render loop into PRD §9 compliance and finish §12 label collision avoidance. Today the app recomputes the full ephemeris for all 104 bodies 15 times per second and unconditionally calls `setState` with fresh arrays, forcing Ink re-renders even when nothing changed.

## What this epic adds

- Celestial positions computed on the 1 Hz time tick (or when location changes), not in the fps loop
- Projection recomputed only when its inputs change (`time`, `azimuthOffset`, `zoom`, `dimensions`, `aspect`)
- No `setState`/re-render when the produced frame is identical to the previous one
- Width-aware label collision avoidance: labels reserve their full text extent, are clamped at the right viewport edge, and are assigned in explicit §12 priority order

## Components and files

| Module | Purpose |
|--------|---------|
| `src/App.tsx` | Split compute pipeline from render cadence; memoization; change detection |
| `src/render/labelLayout.ts` | Full-extent occupancy, right-edge clamping, explicit priority sort |
| `tests/render/labelLayout.test.ts` | New collision and clamping cases |
| `tests/App.test.tsx` | Assert no recompute storm (spy on `calculateCelestialBodies` call rate) |

## Architectural delta

The data flow `skyModel → projectBody → applyStarDensity → assignLabels` is unchanged; only its trigger moves from the fps interval to a derived-state recompute keyed on inputs. The fps setting remains the cap on paint frequency, matching §9's separation of "positions update 1 Hz" from "render capped at fps".

## Boundaries

**In scope:** compute/render decoupling, frame-identity skip, label layout.

**Out of scope:** changing the projection math, aspect-correction redesign, new Ink rendering strategy (per-point absolute Boxes stay as-is unless profiling proves them a problem).

## Quality gates

- All tests pass
- `calculateCelestialBodies` called ≤ 2 times per second during steady-state live mode (test-asserted)
- Rotating/zooming still feels immediate (manual check)
- CPU usage at idle visibly lower than v1 (spot check via `top` during a 60 s run)

## Open decisions

None.
