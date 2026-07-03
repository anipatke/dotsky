---
id: E04-release-validation/T001-packaging-hygiene
status: planned
objective: Ship a lean, correctly-declared npm package
depends_on: []
complexity_tier: low
complexity_reason: package.json metadata edits verified by npm pack; no code changes.
---

# T001: Packaging hygiene

## Problem

`package.json` lists `savepoint` (the dev workflow tool) under runtime `dependencies`, so every `npm install dotsky` pulls it in for nothing. There is no `engines` field declaring the supported Node range (the code uses `fetch`, top-level `await`, and ESM — effectively Node ≥18), and `author` is empty.

## Context Files

- `package.json`
- `package-lock.json`
- `README.md`

## Acceptance Criteria

- [ ] `savepoint` moved to `devDependencies`; `npm ls savepoint --omit=dev` shows nothing
- [ ] `engines.node` declares the tested floor (>=18)
- [ ] `author` filled in
- [ ] `npm pack --dry-run` payload is `dist/` + package.json + README only
- [ ] Fresh `npm install` + full test suite still green

## Implementation Plan

- [ ] Edit `package.json` (dependency move, `engines`, `author`); regenerate lockfile
- [ ] Run `npm pack --dry-run` and inspect the file list
- [ ] Reinstall clean and run the suite

## Context Log

Pending.
