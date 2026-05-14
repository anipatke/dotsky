---
id: E04-polish-and-robustness/T003-unicode-ascii-fallback
status: planned
objective: Detect Unicode support and fall back to ASCII symbols when unavailable
depends_on: []
complexity_tier: low
complexity_reason: Single-module change to asciiGrid with straightforward detection logic.
---

# T003: Unicode detection and ASCII fallback

## Problem

`asciiGrid.ts` uses Unicode symbols (☉, ◐) without fallback. Per spec §11, there must be an ASCII-safe mode.

## Context Files

- `src/render/asciiGrid.ts`
- `tests/render/asciiGrid.test.ts`

## Acceptance Criteria

- [ ] `getSymbolForBody()` accepts a `unicode: boolean` option
- [ ] When `unicode: false`, Sun returns `O`, Moon returns `o`, others unchanged
- [ ] Unicode detection checks `process.env.LC_ALL`, `process.env.LC_CTYPE`, or `process.env.TERM` for UTF-8
- [ ] Default is Unicode mode; ASCII mode activated when no UTF-8 locale detected

## Implementation Plan

- [ ] Add `unicode` parameter to `getSymbolForBody`
- [ ] Define ASCII fallback map: Sun → O, Moon → o
- [ ] Add `detectUnicodeSupport()` helper checking env vars
- [ ] Update Viewport to pass unicode flag
- [ ] Write tests for both Unicode and ASCII mode output

## Context Log

Pending.