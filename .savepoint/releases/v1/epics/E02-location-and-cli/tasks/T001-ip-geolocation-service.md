---
id: E02-location-and-cli/T001-ip-geolocation-service
status: done
objective: Add IP geolocation lookup with timeout and error handling
depends_on: []
complexity_tier: medium
complexity_reason: New network I/O module with error handling and timeout requirements.
---

# T001: IP geolocation service

## Problem

No IP geolocation exists. Location resolution falls straight to Sydney fallback when CLI args are absent.

## Context Files

- `src/location/resolveLocation.ts`
- `tests/location/resolveLocation.test.ts`

## Acceptance Criteria

- [ ] `ipGeolocation.ts` exports `async function getIPLocation(): Promise<{lat, lon} | null>`
- [ ] Returns null on network error, timeout, or invalid response
- [ ] Timeout is configurable (default 5s)
- [ ] No crash on offline scenarios

## Implementation Plan

- [x] Create `src/location/ipGeolocation.ts`
- [x] Use `fetch` to ipapi.co with AbortController timeout
- [x] Parse JSON response, validate lat/lon ranges
- [x] Return null on any failure (never throw)
- [x] Write tests with mocked fetch (success, timeout, invalid response)

## Context Log

**Files read:** `src/location/resolveLocation.ts`, `tests/location/resolveLocation.test.ts`

**Files created:** `src/location/ipGeolocation.ts`, `tests/location/ipGeolocation.test.ts`

**Files edited:** `src/location/resolveLocation.ts`, `tests/location/resolveLocation.test.ts`

**Quality gates:** `npx vitest run` — 15 files, 63 tests passed. `npx tsc --noEmit` — no errors.

**Details:** `ipGeolocation.ts` uses `ipapi.co/json/` with `AbortController` for configurable timeout (default 5s). Returns `null` on any failure (network error, timeout, non-ok status, invalid JSON, out-of-range coords) — never throws. `resolveLocation.ts` now calls `getIPLocation()` between CLI check and Sydney fallback.

**Drift notes:** None.