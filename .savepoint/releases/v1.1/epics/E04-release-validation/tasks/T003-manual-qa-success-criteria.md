---
id: E04-release-validation/T003-manual-qa-success-criteria
status: planned
objective: Complete a recorded manual QA pass of every PRD §18 success criterion in a real terminal
depends_on: ["E04-release-validation/T001-packaging-hygiene", "E04-release-validation/T002-accuracy-validation"]
complexity_tier: low
complexity_reason: Checklist execution and recording; findings become defects rather than scope here.
---

# T003: Manual QA pass of PRD §18 success criteria

## Problem

The §18 criteria — full-screen reliability, terminal restoration, no flicker, responsive resize, offline operation, global CLI install — can only be proven in a real interactive terminal. Automated tests cover none of the terminal-restoration or flicker behavior. This task should run after all other v1.1 epics complete, as the release exit gate.

## Context Files

- `prd.md`
- `.savepoint/releases/v1.1/validation.md`

## Acceptance Criteria

- [ ] Each §18 criterion executed and marked pass/fail in `validation.md`, including: enter/exit alternate screen via `q`, Ctrl+C/SIGINT, SIGTERM, and rapid repeated shutdown; resize through 79x24, 80x23, 80x24, very narrow, and recovery; `--no-geo` and geo-failure paths; non-TTY launch; and global install from the generated tarball
- [ ] Flicker judged over a 60 s event-driven live-mode observation
- [ ] Locale cases include UTF-8 (`LANG=C.UTF-8`) and ASCII (`LC_ALL=C`) behavior
- [ ] Environment matrix records Node version, OS, terminal emulator, dimensions, and locale; cover Linux and macOS, plus Windows Terminal/WSL when claimed as supported
- [ ] Every failure filed via `savepoint-create-defect` against v1.1
- [ ] Release marked ready for handoff only when all criteria pass

## Implementation Plan

- [ ] Draft an environment matrix and checklist in `validation.md` from PRD §18 + §16 failure modes
- [ ] Execute in a real terminal (not CI), recording environment (terminal emulator, size, locale)
- [ ] File defects for failures; re-run after fixes

## Context Log

Pending.
