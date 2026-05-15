---
type: epic-design
status: audited
---

# E04: polish-and-robustness

## Purpose

Make the app production-ready: dynamic terminal sizing, proper projection math, Unicode fallback, failure mode handling, cleanup, and integration tests.

## What this epic adds

- Dynamic viewport sizing from actual terminal dimensions
- Proper spec-compliant projection (azimuth offset + zoom applied, aspect on both axes)
- Unicode detection with ASCII-safe fallback
- Minimum terminal size enforcement
- Signal handling and listener cleanup on exit
- Remove duplicate/stale files
- Integration tests covering render cycle, resize, and fallback handling

## Components and files

| Module | Purpose |
|--------|---------|
| `src/App.tsx` | Dynamic sizing, signal handlers, cleanup |
| `src/ui/Header.tsx` | Responsive to terminal width |
| `src/ui/Viewport.tsx` | Responsive height calculation |
| `src/ui/Horizon.tsx` | Responsive width |
| `src/ui/Footer.tsx` | Responsive width |
| `src/projection/projectAltAz.ts` | Apply offset, zoom, aspect correctly |
| `src/projection/aspectCorrection.ts` | Apply to both axes or correct axis |
| `src/render/asciiGrid.ts` | Unicode detection + ASCII fallback |
| `src/render/labelLayout.ts` | Star priority in label assignment |
| `src/terminal/screen.ts` | May be removed (Ink handles alt screen) |
| `src/Viewport.tsx` | Remove duplicate |

## Architectural delta

Projection becomes fully spec-compliant with offset and zoom math. Viewport height is calculated from actual terminal dimensions minus header/horizon/footer. Unicode fallback path is added to asciiGrid. Duplicate `src/Viewport.tsx` is deleted.

## Boundaries

**In scope:**
- Dynamic resize-driven viewport
- Spec layout math: viewportHeight = totalHeight - 1 (header) - 2 (horizon) - 1 (footer)
- Azimuth offset and zoom applied in projection
- Aspect correction applied properly (both axes or documented per spec)
- Unicode detection and ASCII-safe mode
- Minimum 80x24 terminal check
- SIGINT/SIGTERM cleanup
- Remove `src/Viewport.tsx` duplicate
- Integration tests

**Out of scope:**
- Stereographic/orthographic projection (future)
- Constellation lines
- Deep-sky objects

## Quality gates

- All unit tests pass
- App works in terminal sizes from 80x24 to large
- Unicode-safe mode activates when Unicode rendering fails
- Terminal restored correctly on exit
- No hardcoded dimensions remain

## Open decisions

None.
