---
type: epic-design
status: audited
---

# E02: location-and-cli

## Purpose

Complete the location resolution chain soObserver position is determined reliably from CLI args, IP geolocation, cache, or fallback — with proper error handling and CLI validation.

## What this epic adds

- IP geolocation lookup with timeout and graceful failure
- Location cache to `~/.config/dotsky/location.json` (or platform equivalent)
- `--no-geo` flag to skip IP geolocation
- Fallback warning rendered in the Footer
- CLI input validation with clear error messages

## Components and files

| Module | Purpose |
|--------|---------|
| `src/location/resolveLocation.ts` | Extend with geo/cache priority chain |
| `src/location/cacheLocation.ts` | New: read/write cached location |
| `src/location/ipGeolocation.ts` | New: IP→lat/lon lookup |
| `src/cli.ts` | Add `--no-geo` handling, input validation, pass source to Footer |
| `src/ui/Footer.tsx` | Conditionally show location fallback warning |
| `tests/location/resolveLocation.test.ts` | Expand to cover full priority chain |

## Architectural delta

Location resolution changes from a sync fallback-only function to an async priority chain (CLI → cache → IP → fallback). A new `ipGeolocation.ts` module handles network I/O; `cacheLocation.ts` handles local file I/O; `resolveLocation.ts` orchestrates the chain.

## Boundaries

**In scope:**
- IP geolocation service (e.g. ipapi.co or similar free API)
- Local filesystem cache for last-known location
- `--no-geo` flag skipping IP lookup
- Fallback warning string in Footer when source is "fallback"
- CLI validation (lat/lon range, time format)

**Out of scope:**
- City-name lookup
- Multiple geolocation provider fallbacks (v1: single provider)
- Offline map/OUI-based geolocation

## Quality gates

- All existing tests pass
- Location priority chain tested: CLI > cache > geo > fallback
- IP geolocation failure returns Sydney fallback with warning
- `--no-geo` skips IP call entirely
- Invalid lat/lon prints clear error and exits
- Cache read/write is tested

## Open decisions

- Which free IP geolocation API to use (ipapi.co is default, easy to swap)