---
id: E02-conformance-defects/T005-sigterm-unmount-and-dead-code
status: planned
objective: Restore the terminal through one idempotent shutdown path and delete the dead screen.ts module
depends_on: ["E01-test-suite-integrity/T002-test-isolation-and-green-suite"]
complexity_tier: low
complexity_reason: Handler change in cli.ts plus a file deletion; behavior verified with the existing signal-cleanup tests.
---

# T005: SIGTERM unmounts Ink before exit; remove dead `screen.ts`

## Problem

`src/cli.ts:76` handles SIGTERM with a bare `process.exit(0)`, which can skip Ink's alternate-screen/cursor restoration — risking a corrupted terminal, directly against PRD §2.1 and the §18 "terminal restored correctly" criterion. Separately, `src/terminal/screen.ts` is dead code: the comment in `cli.ts:52-54` says Ink owns the screen lifecycle, so the module contradicts the stated design.

## Context Files

- `src/cli.ts`
- `src/terminal/screen.ts`
- `tests/terminal/screen.test.ts`
- `tests/terminal/signal-cleanup.test.ts`

## Acceptance Criteria

- [ ] `q`, Ctrl+C/SIGINT, SIGTERM, and normal Ink exit converge on one idempotent teardown function
- [ ] Teardown unmounts Ink, removes application-owned listeners, permits restoration output to flush, and exits exactly once
- [ ] After `kill -TERM <pid>` in a real terminal: primary buffer restored, cursor visible, prompt intact
- [ ] `src/terminal/screen.ts` and its test file are removed; no remaining imports reference it
- [ ] `signal-cleanup` tests updated to assert unmount-before-exit ordering
- [ ] Two rapid shutdown requests do not double-unmount or double-exit

## Implementation Plan

- [ ] Capture the `render()` instance and introduce a single guarded shutdown function with explicit unmount → cleanup → flush/exit ordering
- [ ] Delete `src/terminal/screen.ts` and `tests/terminal/screen.test.ts`
- [ ] Update `tests/terminal/signal-cleanup.test.ts` for the new handler shape
- [ ] Manual verification: run in a real terminal, `kill -TERM`, inspect terminal state

## Context Log

Pending.
