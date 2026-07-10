---
id: E04-release-validation/T001-packaging-hygiene
status: planned
objective: Ship a lean package with truthful Node.js compatibility and documentation
depends_on: ["E03-render-loop-efficiency/T002-isolate-unchanged-viewport", "E03-render-loop-efficiency/T003-label-collision-layout"]
complexity_tier: low
complexity_reason: package.json metadata edits verified by npm pack; no code changes.
---

# T001: Packaging hygiene

## Problem

`package.json` lists `savepoint` under runtime `dependencies`, so every install pulls it in for nothing. Compatibility metadata is also inaccurate by omission: README claims Node 18+, while installed Ink 7.0.1 requires Node ≥22 and Meow 14.1.0 requires Node ≥20. With the current dependency set, the truthful supported floor is Node 22. `author` is empty.

## Context Files

- `package.json`
- `package-lock.json`
- `README.md`

## Acceptance Criteria

- [ ] `savepoint` moved to `devDependencies`; `npm ls savepoint --omit=dev` shows nothing
- [ ] `engines.node` declares `>=22`, matching the strictest runtime dependency
- [ ] README requirement changes from Node 18+ to Node 22+
- [ ] `author` filled in
- [ ] `npm pack --dry-run` payload is `dist/` + package.json + README only
- [ ] The packed tarball installs and launches under the minimum supported Node 22 runtime
- [ ] Fresh `npm install` + full test suite still green

## Implementation Plan

- [ ] Edit `package.json` (dependency move, `engines: { node: ">=22" }`, author); regenerate lockfile and update README
- [ ] Run `npm pack --dry-run` and inspect the file list
- [ ] Install the generated tarball under Node 22, launch it, then reinstall clean and run the suite

## Context Log

Pending.
