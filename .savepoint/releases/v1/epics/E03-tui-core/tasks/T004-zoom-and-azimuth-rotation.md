---
id: E03-tui-core/T004-zoom-and-azimuth-rotation
status: done
objective: Implement zoom and azimuth rotation controls that affect projection output
depends_on: ["E03-tui-core/T001-app-state-and-render-loop"]
complexity_tier: medium
complexity_reason: State changes propagate through projection pipeline, needs zoom/offset math.
---

# T004: Zoom and azimuth rotation

## Problem

No zoom or azimuth rotation controls exist. The spec requires `+`/`-` for zoom and arrow keys for rotation.

## Context Files

- `src/App.tsx`
- `src/projection/projectAltAz.ts`

## Acceptance Criteria

- [ ] `+` increases zoom, `-` decreases zoom (default 1.0, range TBD)
- [ ] `left` rotates azimuth offset by -15°, `right` by +15°
- [ ] `r` resets zoom and azimuthOffset to defaults
- [ ] Zoom and azimuthOffset are passed to `projectBody()` via `ProjectionConfig`
- [ ] Projection applies offset and zoom correctly

## Implementation Plan

- [ ] Add `zoom: number` and `azimuthOffset: number` to App state
- [ ] Wire `+`/`-`/`left`/`right`/`r` keys from input.ts
- [ ] Pass `azimuthOffset` and `zoom` through to `projectBody` call
- [ ] Update `projectAltAz.ts` to apply azimuth offset before projecting x, and scale zoom
- [ ] Write tests for projection with offset and zoom values

## Context Log

Files read:
- `src/App.tsx` — state already had zoom/azimuthOffset, key handling already wired
- `src/projection/projectAltAz.ts` — needed real offset/zoom application
- `src/terminal/input.ts` — key mappings already correct
- `src/astronomy/objectTypes.ts` — type definitions
- `src/projection/aspectCorrection.ts` — helper reference

Files edited:
- `src/projection/projectAltAz.ts` — applied `azimuthOffset` (wrapping angle) and `zoom` (scale around viewport center)
- `tests/projection/projectAltAz.test.ts` — added 5 new tests covering offset shift, wrap, zoom spread/compress, center identity

Quality gates:
- `npx vitest run` — 121/121 passed (19 files)
- `npx tsc --noEmit` — clean (no errors)