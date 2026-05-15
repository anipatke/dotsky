---
id: E03-tui-core/T005-labels-toggle-with-priority
status: done
objective: Wire labels toggle (l key) with priority-based collision avoidance
depends_on: ["E03-tui-core/T001-app-state-and-render-loop"]
complexity_tier: low
complexity_reason: Existing labelLayout module just needs priority input and toggle wiring.
---

# T005: Labels toggle with priority ordering

## Problem

Labels are disabled by default with no toggle. The `l` key should toggle labels on/off, and label assignment must respect body priority.

## Context Files

- `src/App.tsx`
- `src/render/labelLayout.ts`
- `src/render/starDensity.ts`

## Acceptance Criteria

- [ ] `l` toggles `labelsEnabled` state (default: false)
- [ ] When enabled, labels render next to bodies using `assignLabels()`
- [ ] Label priority: planets > moon > sun > bright stars (density-sorted bodies feed into assignLabels in priority order)
- [ ] `maxLabels = Math.floor(width / 12)` per spec
- [ ] When disabled, no labels shown

## Implementation Plan

- [ ] Add `labelsEnabled: boolean` to App state (default from CLI `--labels`)
- [ ] Wire `l` key to toggle
- [ ] Feed density-sorted points (already priority-ordered) into `assignLabels()`
- [ ] Render label text next to each point in Viewport when enabled
- [ ] Write tests verifying toggle and priority

## Context Log

- **Read**: `src/App.tsx`, `src/render/labelLayout.ts`, `src/render/starDensity.ts`, `src/ui/Viewport.tsx`, `src/projection/projectAltAz.ts`, `src/terminal/input.ts`, `src/astronomy/objectTypes.ts`, `src/cli.ts`, `tests/App.test.tsx`, `tests/render/labelLayout.test.ts`, `tests/ui/Viewport.test.tsx`
- **Edited**: `src/App.tsx` — wired `assignLabels()` into render loop, added `labeledPoints` state, passed labels to Viewport
- **Edited**: `src/ui/Viewport.tsx` — added `labeledPoints`/`labelsEnabled` props, renders label text when enabled
- **Edited**: `tests/render/labelLayout.test.ts` — added priority-order test
- **Edited**: `tests/ui/Viewport.test.tsx` — added labels enabled/disabled rendering tests
- **Edited**: `tests/App.test.tsx` — added `l` key toggle test
- **Quality gates**: `npx vitest run` → 125/125 passed (19 files), `npx tsc --noEmit` → clean