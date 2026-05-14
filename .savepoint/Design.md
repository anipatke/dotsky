---
type: project-design
status: active
last_audited: never
---

# astrolink — System Architecture

> Visual identity lives in `.savepoint/visual-identity.md`.

## 1. Architecture model

Strict bottom-up separation of concerns:

```
Terminal/IO → App State → Projection → Rendering
                  ↑
             Astronomy (data)
             Location (data)
```

Data modules (astronomy, location) have zero knowledge of rendering. Projection is pure math. Rendering is pure ASCII composition. App State orchestrates the pipeline. Terminal/IO handles stdin/stdout lifecycle.

## 2. Directory layout

```
src/
  cli.ts                    Entry point, meow parsing, app bootstrap
  App.tsx                   Root Ink component, owns all state
  terminal/
    screen.ts               Alternate screen buffer (reserved, Ink manages)
    input.ts                Key→action mapping for useInput
    resize.ts               Debounced terminal resize listener
  location/
    resolveLocation.ts      Orchestration: CLI → cache → geo → fallback
    cacheLocation.ts         Filesystem cache for last-known location
    ipGeolocation.ts         IP→lat/lon lookup with timeout
  astronomy/
    skyModel.ts              Aggregation entry point
    objectTypes.ts           CelestialBody type
    starCatalog.ts           Hipparcos bright-star data (~100 entries)
    planetPositions.ts        Sun/Moon/planet alt/az via astronomy-engine
  projection/
    projectAltAz.ts          Alt/az → screen coordinates
    aspectCorrection.ts      Character aspect ratio correction
  render/
    starDensity.ts           Viewport-area-based star limit
    asciiGrid.ts             Body type → ASCII/Unicode symbol
    labelLayout.ts           Collision-avoidance label placement
  ui/
    Header.tsx               Location, time, mode display
    Viewport.tsx             Star viewport (absolute-positioned Ink boxes)
    Horizon.tsx              Compass bar with azimuth rotation
    Footer.tsx               Keybinding help + fallback warning
tests/
  astronomy/                 skyModel, planetPositions, starCatalog tests
  location/                  resolveLocation, cacheLocation, ipGeolocation tests
  projection/                projectAltAz, aspectCorrection tests
  render/                    starDensity, asciiGrid, labelLayout tests
  terminal/                  screen, resize tests
```

## 3. Hierarchy semantics

- **Release**: v1 — the full terminal planetarium
- **Epic**: independently valuable milestone (E01 through E04)
- **Task**: smallest buildable unit, lives in an epic's `tasks/` dir
- **Defect**: post-build bug tracked in `.savepoint/releases/{release}/defects/`

## 4. Status model & gates

- Router `state`: pre-implementation → epic-design → epic-task-breakdown → task-building → audit-pending
- Task `status`: `planned` → `in_progress` (with `stage: build|test|audit`) → `done`
- Epic moves to audit after all its tasks are `done`
- Only the user may set a task to `done`

## 5. Dependencies

```
E01 (astronomy-engine) ──→ E03 (tui-core)
E02 (location-and-cli) ──→ E03 (tui-core)
E03 (tui-core) ──────────→ E04 (polish-and-robustness)
```

E01 and E02 are independent and can proceed in parallel. E03 depends on both. E04 depends on E03.

## 6. CLI surface

```
astrolink [--lat=N] [--lon=N] [--time=ISO] [--no-geo] [--aspect=N] [--fps=N] [--labels]
```

All flags optional. Location resolved via CLI → cache → IP geo → Sydney fallback.

## 7. Agent audit workflow

Savepoint audit is agent-led via `savepoint-audit` skill, not a CLI pipeline. At epic close, a fresh audit agent writes one `E##-Audit.md` with `## Main Findings` and `## Code Style Review`. File-specific `### Target File` / `### Replace` / `### With` blocks live under `## Proposed Changes`.

## 8. Testing strategy

- **Unit tests**: every module in `src/` has corresponding tests in `tests/`
- **Integration tests**: CLI override parsing, location resolution chain, full render pipeline, resize behavior
- **Runner**: Vitest
- **Coverage gate**: all new modules must have tests before task marked done
- Framework: `vitest` + `ink-testing-library` for React/Ink components

## 9. Release versioning

Semver. v1 is `1.0.0`. Patch for defect fixes, minor for new epics, major for breaking changes.

## 10. Key architectural decisions

- **Ink manages alternate screen**: `screen.ts` enter/exit functions exist but are not called manually — Ink's `alternateScreen` option handles this
- **astronomy-engine for ephemeris**: no custom math, all celestial calculations delegate to `astronomy-engine`
- **React/Ink for TUI**: state via hooks, rendering via Ink components, input via `useInput`
- **Bottom-up data flow**: Astronomy → Projection → Rendering, never reversed

## 11. Codebase map

| Module | Epic | Purpose |
|--------|------|---------|
| `src/cli.ts` | E02 | Entry point, meow parsing |
| `src/App.tsx` | E03 | Root state, render loop, key handling |
| `src/terminal/screen.ts` | E04 | Alt screen (reserved) |
| `src/terminal/input.ts` | E03 | Key→action mapping |
| `src/terminal/resize.ts` | E04 | Debounced resize |
| `src/location/resolveLocation.ts` | E02 | Location priority chain |
| `src/location/cacheLocation.ts` | E02 | Filesystem location cache |
| `src/location/ipGeolocation.ts` | E02 | IP geolocation |
| `src/astronomy/skyModel.ts` | E01 | Celestial body aggregation |
| `src/astronomy/objectTypes.ts` | E01 | Type definitions |
| `src/astronomy/starCatalog.ts` | E01 | Bright star data |
| `src/astronomy/planetPositions.ts` | E01 | Solar system positions |
| `src/projection/projectAltAz.ts` | E04 | Coordinate projection |
| `src/projection/aspectCorrection.ts` | E04 | Character aspect ratio |
| `src/render/starDensity.ts` | E01 | Star count limiting |
| `src/render/asciiGrid.ts` | E04 | Symbol mapping |
| `src/render/labelLayout.ts` | E03 | Label collision avoidance |
| `src/ui/Header.tsx` | E03 | Top bar component |
| `src/ui/Viewport.tsx` | E03 | Star rendering area |
| `src/ui/Horizon.tsx` | E03 | Compass bar |
| `src/ui/Footer.tsx` | E02 | Help bar + fallback warning |