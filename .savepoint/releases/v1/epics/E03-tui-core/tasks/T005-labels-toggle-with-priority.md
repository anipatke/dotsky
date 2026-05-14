---
id: E03-tui-core/T005-labels-toggle-with-priority
status: planned
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

Pending.