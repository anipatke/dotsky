---
type: epic-design
status: audited
---

# E01: astronomy-engine

## Purpose

Replace the stub skyModel with real celestial position calculations so the app renders an accurate night sky.

## What this epic adds

- Real-time Sun, Moon, and naked-eye planet positions computed from observer lat/lon and time
- A catalog of ~100 bright stars with computed alt/az positions
- A pure data layer (no rendering logic) that feeds the projection pipeline

## Components and files

| Module | Purpose |
|--------|---------|
| `src/astronomy/skyModel.ts` | Replace stub with `astronomy-engine` calls |
| `src/astronomy/objectTypes.ts` | May need magnitude field refinements |
| `src/astronomy/starCatalog.ts` | New: Hipparcos bright-star catalog data |
| `src/astronomy/planetPositions.ts` | New: Sun/Moon/planet position calculator |
| `tests/astronomy/skyModel.test.ts` | Expand with ephemeris-verified cases |

## Architectural delta

`skyModel.ts` currently returns a hardcoded Sun object. After this epic it will call `astronomy-engine` to compute real alt/az positions for all body types. Two new modules ingest star catalog data and solar-system calculations respectively, keeping `skyModel.ts` as the single aggregation point.

## Boundaries

**In scope:**
- Integrate `astronomy-engine` package (already in dependencies)
- Compute alt/az for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn
- Build a static bright-star catalog (~100 entries) with RA/dec/magnitude
- Convert catalog RA/dec to alt/az for given observer/time
- Aggregate all bodies through `calculateCelestialBodies()`
- Unit tests verifying positions against known ephemeris data

**Out of scope:**
- Rendering or projection logic (E03/E04)
- Constellation lines
- Deep-sky objects (nebulae, galaxies)
- Pluto or other dwarf planets

## Quality gates

- All existing tests continue to pass
- skyModel returns >1 body for any valid lat/lon/time
- Sun altitude at Sydney noon 2026-06-21 is within ±2° of 79.5°
- Tests cover: Sun, Moon, at least 2 planets, at least 3 stars
- No rendering logic in astronomy modules

## Open decisions

None.