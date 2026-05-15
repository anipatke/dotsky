---
type: audit-findings
audited: 2026-05-16
---

# Audit Findings: E04 Polish and Robustness

## Main Findings

E04 is implemented against the stated acceptance criteria. Dynamic sizing, viewport height calculation, Unicode/ASCII symbol selection, duplicate `src/Viewport.tsx` removal, resize cleanup, projection visibility bounds, and integration coverage are present in the source.

Verification run after applying audit findings:

- `npx vitest run` passed: 23 files, 175 tests.
- `npx tsc --noEmit` passed.

Applied findings:

1. `src/terminal/resize.ts` now uses `MIN_WIDTH` and `MIN_HEIGHT` from `src/constants.ts`, removing the duplicated `80` and `24` fallback literals.

2. `tests/integration/cli-bootstrap.test.ts` imports `src/cli.ts` with mocked `meow`, `resolveLocation`, and Ink `render`, verifying parsed CLI flags flow through location resolution into the rendered `App` props.

3. `tests/integration/location-fallback-render.test.tsx` verifies a failed cache read plus failed IP geolocation resolves to the Sydney fallback and reaches the rendered footer warning.

4. `tests/integration/app-lifecycle.test.tsx` now asserts that the full render cycle emits a real celestial symbol from the sky pipeline.

## Code Style Review

- [x] One job per file
- [x] One job per function
- [x] Test branches
- [x] Types document intent
- [x] Build only what is needed
- [x] Handle errors at boundaries
- [x] One source of truth
- [x] Comments explain WHY
- [x] Content in data files
- [x] Small diffs

## Proposed Changes

### Target File
src/terminal/resize.ts

### Replace
```ts
type ResizeDimensions = { width: number; height: number };
type ResizeCallback = (dim: ResizeDimensions) => void;

const listeners: Set<ResizeCallback> = new Set();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let attached = false;

function handleResize(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const dim = {
      width: process.stdout.columns ?? 80,
      height: process.stdout.rows ?? 24,
    };
    listeners.forEach(cb => cb(dim));
  }, 16);
}
```

### With
```ts
import { MIN_HEIGHT, MIN_WIDTH } from '../constants.js';

type ResizeDimensions = { width: number; height: number };
type ResizeCallback = (dim: ResizeDimensions) => void;

const listeners: Set<ResizeCallback> = new Set();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let attached = false;

function handleResize(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const dim = {
      width: process.stdout.columns ?? MIN_WIDTH,
      height: process.stdout.rows ?? MIN_HEIGHT,
    };
    listeners.forEach(cb => cb(dim));
  }, 16);
}
```

Additional integration coverage was applied in `tests/integration/cli-bootstrap.test.ts`, `tests/integration/location-fallback-render.test.tsx`, and `tests/integration/app-lifecycle.test.tsx`.
