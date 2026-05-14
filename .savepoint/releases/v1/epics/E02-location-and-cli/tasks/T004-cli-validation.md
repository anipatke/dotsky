---
id: E02-location-and-cli/T004-cli-validation
status: planned
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

- [ ] Add lat/lon range checks after meow parsing
- [ ] Add Date validity check for `--time`
- [ ] Add fps and aspect range checks
- [ ] Exit with code 1 and descriptive message on any violation
- [ ] Write tests for cli validation (spawn process or unit test the validation function)

## Context Log

Pending.