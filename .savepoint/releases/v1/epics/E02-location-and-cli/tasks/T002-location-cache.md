---
id: E02-location-and-cli/T002-location-cache
status: planned
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

- [ ] Create `src/location/cacheLocation.ts`
- [ ] Use `os.homedir() + '/.config/astrolink/location.json'` as cache path
- [ ] `readCachedLocation()`: parse JSON, validate lat/lon ranges, return null on error
- [ ] `writeCachedLocation()`: JSON.stringify, write to temp file, rename
- [ ] Write tests with mocked fs

## Context Log

Pending.