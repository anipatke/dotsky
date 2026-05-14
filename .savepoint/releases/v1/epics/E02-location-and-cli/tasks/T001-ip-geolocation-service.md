---
id: E02-location-and-cli/T001-ip-geolocation-service
status: planned
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

- [ ] Create `src/location/ipGeolocation.ts`
- [ ] Use `fetch` to ipapi.co (or similar) with AbortController timeout
- [ ] Parse JSON response, validate lat/lon ranges
- [ ] Return null on any failure (never throw)
- [ ] Write tests with mocked fetch (success, timeout, invalid response)

## Context Log

Pending.