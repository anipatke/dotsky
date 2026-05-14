# Astrolink Agents Guide

## Project

Terminal planetarium rendering the live night sky. Stack: Node.js + Ink + React + astronomy-engine. Full spec in `engineeringspec.md`.

## Workflow

1. Read `.savepoint/router.md` — state + next action
2. Activate skill per table below
3. Read: router → epic → task → source files

The phase skill is the canonical workflow source. This guide defines routing, terminology, and repo rules only.

## Skill Activation

| State | Skill |
|-------|-------|
| pre-implementation | savepoint-draft-prd or savepoint-create-plan |
| epic-design | savepoint-system-design |
| epic-task-breakdown | savepoint-create-task |
| task-building | savepoint-build-task |
| audit-pending | savepoint-audit |
| defect-building | savepoint-build-task |

Use the `skill` tool when available. If not found, read `agent-skills/{skill}/SKILL.md` directly.

## Terminology

- Router `state`: current phase (`epic-design`, `task-building`, etc.)
- Task `status`: only `planned`, `in_progress`, or `done`
- Task `stage` (build/test/audit): **required** when `status: in_progress` — omitting is a parse error
- Only the user may set a task to `status: done`

## Defects

- Use `savepoint-create-defect` when the user reports a concrete bug or regression
- Defects live at `.savepoint/releases/{release}/defects/D###-slug.md`
- Lifecycle: `open` → `in_progress` → `resolved`

## Implementation Rules

1. Read the task's `## Context Files` one at a time; don't explore outside task context unless required
2. Read `## Acceptance Criteria` and `## Implementation Plan`
3. Set task frontmatter to `status: in_progress` and `stage: build`
4. Follow `savepoint-build-task` for execution, AC verification, quality gates, and handoff
5. Stop and prompt the user before continuing

## Drift Check

If new files/modules aren't in Codebase Map or architecture changed from Design.md → append `## Drift Notes` to task file.

## Audit

- Builder must not audit own epic; start a fresh session
- Agent-led via `savepoint-audit`, not CLI pipeline
- Write one `E##-Audit.md` with `## Main Findings` and `## Code Style Review`
- Put `### Target File` / `### Replace` / `### With` blocks under `## Proposed Changes`

## Code Style

- One job per file and per function
- Test meaningful conditionals and edge cases
- Types document intent — no `any`, prefer types over comments
- No hardcoded values — constants or config
- Handle errors at boundaries
- One source of truth — no duplicated rules, constants, or state
- Comments explain **why**, not what
- Small diffs — minimal, reviewable, behaviour-preserving changes

## Build & Test

```bash
npx vitest run
npx tsc --noEmit
```

## Codebase Map

| Module | Epic | Purpose |
|--------|------|---------|
| `src/cli.ts` | E02 | Entry point, meow parsing |
| `src/App.tsx` | E03 | Root state, render loop, key handling |
| `src/terminal/screen.ts` | E04 | Alt screen buffer (reserved) |
| `src/terminal/input.ts` | E03 | Key→action mapping |
| `src/terminal/resize.ts` | E04 | Debounced terminal resize |
| `src/location/resolveLocation.ts` | E02 | Location priority chain |
| `src/location/cacheLocation.ts` | E02 | Filesystem location cache |
| `src/location/ipGeolocation.ts` | E02 | IP geolocation |
| `src/astronomy/skyModel.ts` | E01 | Celestial body aggregation |
| `src/astronomy/objectTypes.ts` | E01 | Type definitions |
| `src/astronomy/starCatalog.ts` | E01 | Bright star data (~100) |
| `src/astronomy/planetPositions.ts` | E01 | Solar system positions |
| `src/projection/projectAltAz.ts` | E04 | Alt/az → screen coords |
| `src/projection/aspectCorrection.ts` | E04 | Character aspect ratio |
| `src/render/starDensity.ts` | E01 | Star count limiting |
| `src/render/asciiGrid.ts` | E04 | Body type → symbol |
| `src/render/labelLayout.ts` | E03 | Label collision avoidance |
| `src/ui/Header.tsx` | E03 | Top bar |
| `src/ui/Viewport.tsx` | E03 | Star rendering area |
| `src/ui/Horizon.tsx` | E03 | Compass bar |
| `src/ui/Footer.tsx` | E02 | Help bar + fallback warning |

## CLI Rules

**Never run `savepoint` commands.** The CLI is for the human. Edit files directly.

## Epic Map

| Epic | Purpose | Depends On |
|------|---------|------------|
| E01 astronomy-engine | Real celestial calculations | — |
| E02 location-and-cli | Location resolution + CLI | — |
| E03 tui-core | State, input, render loop, time | E01, E02 |
| E04 polish-and-robustness | Dynamic sizing, projection, fallback, tests | E03 |