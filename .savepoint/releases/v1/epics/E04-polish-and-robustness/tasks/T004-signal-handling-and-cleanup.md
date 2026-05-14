---
id: E04-polish-and-robustness/T004-signal-handling-and-cleanup
status: planned
objective: Graceful SIGINT/SIGTERM handling and listener cleanup on exit
depends_on: []
complexity_tier: low
complexity_reason: Single-file changes to cli.ts and resize.ts for cleanup logic.
---

# T004: Signal handling and cleanup

## Problem

Per spec §2, exit must restore terminal state and clean listeners. Current code has a SIGTERM handler but no SIGINT beyond Ink's Ctrl+C. Resize listeners could leak.

## Context Files

- `src/cli.ts`
- `src/terminal/resize.ts`

## Acceptance Criteria

- [ ] SIGINT (Ctrl+C) exits gracefully via Ink
- [ ] SIGTERM calls `process.exit(0)` (existing)
- [ ] `removeAllResizeListeners()` called on exit
- [ ] No listener leaks on clean exit

## Implementation Plan

- [ ] Verify Ink's `exitOnCtrlC` handles SIGINT properly
- [ ] Call `removeAllResizeListeners()` in App unmount or cli.ts exit path
- [ ] Write test verifying cleanup function is called on mock signal

## Context Log

Pending.