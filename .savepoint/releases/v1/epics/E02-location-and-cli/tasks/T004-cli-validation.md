---
id: E02-location-and-cli/T004-cli-validation
status: done
objective: Validate CLI inputs (lat/lon range, time format) with clear error messages
depends_on: []
complexity_tier: low
complexity_reason: Single-file change to cli.ts meow validation, no cross-module impact.
---

# T004: CLI input validation

## Problem

Only basic lat/lon pairing validation exists. Range validation and time format validation are missing per spec §16.

## Context Files

- `src/cli.ts`

## Acceptance Criteria

- [ ] `--lat` must be in [-90, 90], `--lon` in [-180, 180] — clear error on violation
- [ ] `--time` must parse as valid ISO 8601 Date — clear error on violation
- [ ] `--fps` must be in [1, 60] range
- [ ] `--aspect` must be positive
- [ ] Invalid inputs exit with code 1 and a descriptive message

## Implementation Plan

- [x] Add lat/lon range checks after meow parsing
- [x] Add Date validity check for `--time`
- [x] Add fps and aspect range checks
- [x] Exit with code 1 and descriptive message on any violation
- [x] Write tests for cli validation (unit test the validation function)

## Context Log

**Files read:** `src/cli.ts`

**Files created:** `src/cli/validateFlags.ts`, `tests/cli/validateFlags.test.ts`

**Files edited:** `src/cli.ts`

**Quality gates:** `npx vitest run` — 17 files, 91 tests passed. `npx tsc --noEmit` — no errors.

**Changes:**
- Extracted `validateFlags()` into `src/cli/validateFlags.ts` for unit-testability
- Added range checks: lat [-90,90], lon [-180,180], fps [1,60], aspect > 0
- Added ISO 8601 validity check for `--time`
- `cli.ts` calls `validateFlags()` and exits with code 1 + descriptive message on any violation
- 17 test cases covering all valid/invalid scenarios

**Drift notes:** Validation was extracted to its own module rather than kept inline in cli.ts, enabling direct unit testing without spawning processes.