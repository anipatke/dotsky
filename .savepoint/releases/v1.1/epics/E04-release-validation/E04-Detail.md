---
type: epic-design
status: planned
---

# E04: release-validation

## Purpose

Make the package publishable and prove the PRD §18 success criteria before handoff: packaging hygiene, astronomical accuracy validation against a reference planetarium, and a manual QA pass in a real terminal.

## What this epic adds

- `savepoint` (dev workflow tool) removed from runtime `dependencies` — it currently bloats every `npm install dotsky`
- `engines.node` field declaring the supported Node range
- Documented accuracy comparison of ≥3 bodies against Stellarium at a known time/location (Phase 3 validation strategy)
- A completed §18 checklist: full-screen reliability, terminal restoration, no flicker, responsive resize, offline operation, global install

## Components and files

| Module | Purpose |
|--------|---------|
| `package.json` | Dependency move, `engines`, `author` |
| `.savepoint/releases/v1.1/validation.md` | Accuracy comparison record and QA checklist results |

## Architectural delta

None.

## Boundaries

**In scope:** packaging metadata, validation, QA record.

**Out of scope:** fixing new defects found during QA — file those via `savepoint-create-defect` against this release instead of expanding this epic.

## Quality gates

- `npm pack --dry-run` shows only `dist/` payload and no savepoint in the dependency tree
- `npm i -g $(npm pack)` then `dotsky --no-geo` works from a clean shell
- Alt/az of Sun, Moon, and one planet within ~1° of Stellarium for the same time/location
- Every §18 criterion checked off with pass/fail noted in `validation.md`

## Open decisions

None.
