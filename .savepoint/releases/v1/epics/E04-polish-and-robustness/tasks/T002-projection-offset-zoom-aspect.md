---
id: E04-polish-and-robustness/T002-projection-offset-zoom-aspect
status: done
objective: Apply azimuth offset, zoom, and proper aspect correction in projection
depends_on: []
complexity_tier: medium
complexity_reason: Core math changes in projection with potential rendering ripple.
---

# T002: Projection improvements (offset, zoom, aspect)

## Problem

`projectAltAz.ts` does a simple linear mapping without azimuth offset, zoom, or proper aspect correction. The spec requires all three applied in projection.

## Context Files

- `src/projection/projectAltAz.ts`
- `src/projection/aspectCorrection.ts`
- `tests/projection/projectAltAz.test.ts`

## Acceptance Criteria

- [ ] Azimuth offset shifts x: `(azimuth + offset) % 360` before normalization
- [ ] Zoom scales the visible azimuth/altitude range: higher zoom = narrower field of view
- [ ] Aspect correction applied to y (and possibly x) per spec §8
- [ ] Bodies outside the zoomed viewport have `visible: false`
- [ ] Projection interface is documented to allow future swappable projections (§7)

## Implementation Plan

- [ ] Update `projectBody`: add azimuth offset to body azimuth before x-calculation
- [ ] Update `projectBody`: zoom narrows the visible azimuth/altitude range
- [ ] Verify aspect correction direction (spec says "applied in projection, not rendering")
- [ ] Mark bodies outside zoomed viewport as `visible: false`
- [ ] Add type/documentation for swappable projection interface
- [ ] Write tests for offset, zoom, and combined projections

## Context Log

Files read:
- `src/projection/projectAltAz.ts`
- `src/projection/aspectCorrection.ts`
- `tests/projection/projectAltAz.test.ts`
- `engineeringspec.md` (§7 Projection Rules, §8 Terminal Aspect Correction)
- `.savepoint/releases/v1/epics/E04-polish-and-robustness/E04-Detail.md`

Files edited:
- `src/projection/projectAltAz.ts` — fixed aspect to apply before floor (no double floor), centered aspect correction applied after zoom, added viewport bounds check for `visible`, exported `ProjectionFunction` type for swappable projections
- `tests/projection/projectAltAz.test.ts` — added `viewport bounds` describe block with tests for in-bounds visible, zoom-push invisible, below-horizon invisible

Quality gates: `npx vitest run` → 19 passed, 140 tests. `npx tsc --noEmit` → no errors.

## Drift Notes

None. Changes stay within `projectAltAz.ts` (projection module) and its test file, per Codebase Map and E04-Detail design.