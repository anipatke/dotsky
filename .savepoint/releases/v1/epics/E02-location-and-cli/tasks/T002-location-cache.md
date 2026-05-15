---
id: E02-location-and-cli/T002-location-cache
status: done
objective: Cache last-known location to avoid repeated IP lookups
depends_on: []
complexity_tier: low
complexity_reason: Single-file module with straightforward file I/O, no cross-module ripple.
---

# T002: Location cache layer

## Problem

Every launch would hit the IP geolocation service. A local cache avoids unnecessary network calls.

## Context Files

- `src/location/resolveLocation.ts`
- `tests/location/resolveLocation.test.ts`

## Acceptance Criteria

- [ ] `cacheLocation.ts` exports `readCachedLocation()` and `writeCachedLocation(lat, lon)`
- [ ] Cache file stored in platform-appropriate config directory
- [ ] Returns null if cache missing or corrupt (never throws)
- [ ] Writes are atomic (write to temp, rename)

## Implementation Plan

- [x] Create `src/location/cacheLocation.ts`
- [x] Cross-platform config dir via `os.homedir()` / XDG / APPDATA
- [x] `readCachedLocation()`: parse JSON, validate lat/lon ranges, return null on error
- [x] `writeCachedLocation()`: JSON.stringify, write to temp file, rename
- [x] Write tests with mocked fs

## Context Log

**Files read:** `src/location/resolveLocation.ts`, `tests/location/resolveLocation.test.ts`

**Files created:** `src/location/cacheLocation.ts`, `tests/location/cacheLocation.test.ts`

**Files edited:** `src/location/resolveLocation.ts`, `tests/location/resolveLocation.test.ts`

**Quality gates:** `npx vitest run` — 16 files, 72 tests passed. `npx tsc --noEmit` — no errors.

**Details:** `cacheLocation.ts` stores cache at XDG_CONFIG_HOME/dotsky/location.json (Unix) or APPDATA/dotsky/location.json (Windows), falling back to `~/.config/dotsky/location.json`. Writes are atomic: write to `.tmp` then rename. Reads validate lat/lon ranges. `resolveLocation.ts` now checks cache before IP geo, and writes to cache on successful geo lookup. Resolution chain: CLI → cache → geo → write-cache → fallback.

**Drift notes:** None.