---
type: epic-design
status: planned
---

# E02: conformance-defects

## Purpose

Fix the behavioral deviations from the PRD confirmed by running and reviewing the built app during the 2026-07-04 and 2026-07-10 reviews.

## What this epic adds

- `--time` actually works: passing it starts the app in manual mode at that time instead of being overwritten by the live-mode tick within one second
- Unicode symbols (`☉`, `◐`) render on standard Linux terminals (`LANG=C.UTF-8`, `TERM=xterm-256color`) — detection currently skips `LANG` entirely
- Terminals below 80x24 show a single warning line instead of a clamped 80-column sky that wraps and corrupts the display
- Star density priority matches PRD §10 (Sun > Moon > Planets > bright > dim) — currently inverted (`planet: 0, moon: 1, sun: 2`)
- `q`, Ctrl+C/SIGINT, and SIGTERM converge on one idempotent teardown path so the alternate screen buffer and cursor are restored
- Astronomy failures are caught at the App boundary and shown as a stable error state that can still exit cleanly
- Dead `src/terminal/screen.ts` removed (Ink owns the screen lifecycle per the `cli.ts` comment)

## Components and files

| Module | Purpose |
|--------|---------|
| `src/App.tsx` | Initial mode from props; below-minimum warning branch |
| `src/cli.ts` | Pass initial mode; SIGTERM handler unmounts before exit |
| `src/render/asciiGrid.ts` | `LANG` in `detectUnicodeSupport()` |
| `src/render/starDensity.ts` | Priority order per PRD §10 |
| `src/ui/Footer.tsx` | Warning moves out of footer for the below-minimum case |
| `src/terminal/screen.ts` | Delete |
| `src/astronomy/skyModel.ts` | Unchanged calculation boundary exercised by App failure tests |

## Architectural delta

`AppState.mode` initial value becomes prop-driven (`'manual'` when `--time` given). The below-minimum guard becomes a render branch (warning-only screen) instead of dimension clamping. No module boundaries change.

## Boundaries

**In scope:** the confirmed conformance defects above, unified shutdown, astronomy error containment, and dead-code removal.

**Out of scope:** render loop timing (E03), label layout (E03), packaging (E04).

## Quality gates

- All unit and integration tests pass
- Manual check: `dotsky --time="2024-06-15T22:00:00+10:00"` shows that time, paused, and it does not drift
- Manual check: `☉`/`◐` render under `LANG=C.UTF-8` with `LC_ALL`/`LC_CTYPE` unset
- Manual check: 60x10 terminal shows only the warning line; restoring size restores the sky
- `kill -TERM <pid>` leaves the terminal uncorrupted (prompt, cursor, primary buffer)

## Open decisions

None. Density priority follows PRD §10: Sun > Moon > Planets > bright stars > dim stars.
