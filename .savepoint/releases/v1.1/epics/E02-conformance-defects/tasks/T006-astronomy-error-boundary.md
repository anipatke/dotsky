---
id: E02-conformance-defects/T006-astronomy-error-boundary
status: planned
objective: Contain astronomy calculation failures without corrupting the terminal
depends_on: ["E02-conformance-defects/T005-sigterm-unmount-and-dead-code"]
complexity_tier: medium
complexity_reason: Adds an App boundary state and must preserve terminal input and shutdown behavior after a calculation exception.
---

# T006: Astronomy failures render a recoverable terminal-safe error state

## Problem

PRD §16 requires astronomy calculation errors to be handled gracefully, but an exception from `calculateCelestialBodies()` currently escapes the render timer. A calculation or invalid-data failure can terminate the TUI without a stable message or coordinated terminal teardown.

## Context Files

- `src/App.tsx`
- `src/astronomy/skyModel.ts`
- `src/cli.ts`
- `tests/App.test.tsx`

## Acceptance Criteria

- [ ] An exception from the astronomy boundary produces a concise error view rather than an unhandled rejection or corrupted frame
- [ ] The error view retains working `q`, Ctrl+C/SIGINT, and SIGTERM shutdown
- [ ] The original exception is reported once without exposing a stack trace in the alternate-screen UI
- [ ] Tests inject a failing astronomy function and assert the visible error plus clean teardown

## Implementation Plan

- [ ] Add an injectable or mockable astronomy boundary and catch failures where App invokes it
- [ ] Store a typed fatal-error state and render a terminal-width-safe message
- [ ] Exercise keyboard and signal teardown from the error state

## Context Log

Pending.
