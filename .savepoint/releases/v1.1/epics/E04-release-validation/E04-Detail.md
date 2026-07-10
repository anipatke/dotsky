---
type: epic-design
status: planned
---

# E04: release-validation

## Purpose

Make the package publishable and prove the PRD §18 success criteria before handoff: packaging hygiene, astronomical accuracy validation against a reference planetarium, and a manual QA pass in a real terminal.

## What this epic adds

- `savepoint` (dev workflow tool) removed from runtime `dependencies` — it currently bloats every `npm install dotsky`
- `engines.node` and README truthfully declare Node `>=22` (required by Ink 7.0.1; Meow 14.1.0 itself requires Node `>=20`)
- Documented reference comparisons across multiple locations/scenarios, promoted into repeatable regression fixtures
- A completed §18 environment matrix: full-screen reliability, terminal restoration, flicker, responsive resize, locale handling, offline operation, non-TTY behavior, and packed global install

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
- Install the generated tarball globally, then `dotsky --no-geo` works from a clean shell under Node 22+
- Alt/az reference cases record UTC instant, coordinates, elevation, refraction/apparent-coordinate settings, tool versions, and tolerance
- Every §18 criterion checked off with pass/fail noted in `validation.md`

## Open decisions

None.
