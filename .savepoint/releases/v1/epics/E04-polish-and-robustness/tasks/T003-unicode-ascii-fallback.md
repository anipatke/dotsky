---
id: E04-polish-and-robustness/T003-unicode-ascii-fallback
status: done
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

- Read: src/render/asciiGrid.ts, tests/render/asciiGrid.test.ts, src/ui/Viewport.tsx, src/App.tsx, E04-Detail.md
- Edited: src/render/asciiGrid.ts (added detectUnicodeSupport, unicode param, ASCII fallback map)
- Edited: src/App.tsx (import detectUnicodeSupport, pass flag to getSymbolForBody)
- Edited: tests/render/asciiGrid.test.ts (added ASCII-mode tests, detectUnicodeSupport tests)
- Quality gates: vitest run — 153/153 passed; tsc --noEmit — clean