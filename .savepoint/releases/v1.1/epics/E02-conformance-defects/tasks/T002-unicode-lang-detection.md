---
id: E02-conformance-defects/T002-unicode-lang-detection
status: planned
objective: Detect UTF-8 support via LANG so standard Linux terminals get Unicode symbols
depends_on: []
complexity_tier: low
complexity_reason: One function in asciiGrid.ts plus unit tests; no cross-module impact.
---

# T002: Unicode detection must check `LANG`

## Problem

`detectUnicodeSupport()` (`src/render/asciiGrid.ts:13-27`) checks `LC_ALL`, `LC_CTYPE`, then `TERM` — never `LANG`. On a standard Linux/WSL setup (`LANG=C.UTF-8`, `LC_ALL`/`LC_CTYPE` unset, `TERM=xterm-256color`) it falls through to the `TERM` branch, finds no "utf", and returns false — so a fully UTF-8-capable terminal renders the ASCII fallback (`o` moon instead of `◐`, `O` sun instead of `☉`). Verified live during review. The v1 Plan (Task 12) explicitly called for checking `LANG`.

## Context Files

- `src/render/asciiGrid.ts`
- `tests/render/asciiGrid.test.ts`

## Acceptance Criteria

- [ ] Precedence: `LC_ALL` → `LC_CTYPE` → `LANG`, matching POSIX locale resolution; `TERM` only as a last resort
- [ ] `LANG=C.UTF-8` (nothing else set) → Unicode enabled
- [ ] `LC_ALL=C` overrides a UTF-8 `LANG` → ASCII mode
- [ ] Existing fallback behavior when nothing indicates UTF-8 is unchanged
- [ ] Unit tests cover each precedence branch

## Implementation Plan

- [ ] Insert `LANG` into the checked-variable chain in `detectUnicodeSupport()`
- [ ] Add table-driven unit tests stubbing `process.env` for the precedence cases
- [ ] Verify live: `LANG=C.UTF-8 npm run dev -- --no-geo` renders `☉`/`◐`

## Context Log

Pending.
