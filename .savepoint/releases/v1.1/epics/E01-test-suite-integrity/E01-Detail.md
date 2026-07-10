---
type: epic-design
status: planned
---

# E01: test-suite-integrity

## Purpose

Make the full test suite pass deterministically regardless of test order, restoring the `prepublishOnly` gate. Three tests currently fail in the full run but pass in isolation — pure cross-test state pollution, not product defects.

## What this epic adds

- `App.tsx` no longer destroys other instances' resize listeners on unmount
- Tests unmount their rendered Ink instances so module-level state cannot leak between tests
- Unicode support detection is evaluated per app instance instead of frozen at module load
- Every discovered test passes without leaked App timers, resize listeners, or process handlers

## Components and files

| Module | Purpose |
|--------|---------|
| `src/App.tsx` | Remove the unmount effect calling `removeAllResizeListeners()` (lines 92-96); the `onResize` return value already unsubscribes correctly |
| `src/terminal/resize.ts` | Unchanged contract; verify listener add/remove symmetry under multiple instances |
| `src/render/asciiGrid.ts` | Allow Unicode detection to be injected or re-evaluated rather than captured in a module constant |
| `tests/App.test.tsx` | Unmount instances; assert resize behavior is order-independent |
| `tests/integration/app-lifecycle.test.tsx` | Unmount instances |

## Architectural delta

None to product behavior. The only semantic change is that unmounting one `App` instance no longer detaches every registered resize listener — a latent production bug if the component ever remounts (Ink hot reload, embedding).

## Boundaries

**In scope:**
- Listener lifecycle correctness in `App.tsx`
- Test hygiene (unmount, module-state isolation)
- Keeping `removeAllResizeListeners()` available for the process-exit path in `cli.ts`

**Out of scope:**
- New product features
- Restructuring the render loop (E03)

## Quality gates

- `npx vitest run` — every discovered test passes, repeated 3 times to confirm determinism
- `npx tsc --noEmit` passes
- `npm pack --dry-run` no longer blocked by the test gate
- App tests leave no live timers, resize listeners, or process handlers after cleanup

## Open decisions

None.
