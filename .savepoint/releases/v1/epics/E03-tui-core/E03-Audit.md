---
type: audit-findings
audited: 2026-05-15
---

# Audit Findings: E03 tui-core

## Main Findings

E03 is implemented against the epic scope: app state exists, the render pipeline is wired through `skyModel -> projectBody -> applyStarDensity -> assignLabels -> Viewport`, all required key actions are mapped, live/manual time mode works, and the UI components receive real app state.

Verification run:

- `npm.cmd test` passed: 19 files, 134 tests.
- `npx.cmd tsc --noEmit` passed.
- `node --import tsx src/astronomy/planetPositions.ts` passed.
- Bounded `npm.cmd run dev -- --no-geo` smoke no longer emits the `astronomy-engine` named export startup error; the TUI was stopped after startup.

Applied findings:

1. `src/render/starDensity.ts` now implements body priority as `planet -> moon -> sun -> star`, matching T005 acceptance criteria. `tests/render/starDensity.test.ts` now locks the corrected order.

2. `src/ui/Horizon.tsx` now places cardinal markers by azimuth position instead of 90-degree buckets, and `tests/ui/Horizon.test.tsx` covers the 15-degree keybinding increment.

3. `src/astronomy/planetPositions.ts` and `src/astronomy/starCatalog.ts` now load `astronomy-engine` through `createRequire()` so the `tsx` dev runtime and TypeScript agree on the package shape.

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
src/astronomy/planetPositions.ts

### Replace
```ts
import {
  Body,
  Observer,
  Equator,
  Horizon,
  Illumination,
} from 'astronomy-engine';
import type { CelestialBody } from './objectTypes.js';
```

### With
```ts
import { createRequire } from 'node:module';
import type * as AstronomyEngine from 'astronomy-engine';
import type { CelestialBody } from './objectTypes.js';

const require = createRequire(import.meta.url);
const {
  Body,
  Observer,
  Equator,
  Horizon,
  Illumination,
} = require('astronomy-engine') as typeof AstronomyEngine;
```

### Target File
src/astronomy/starCatalog.ts

### Replace
```ts
import { Observer, Horizon } from 'astronomy-engine';
import type { CelestialBody } from './objectTypes.js';
```

### With
```ts
import { createRequire } from 'node:module';
import type * as AstronomyEngine from 'astronomy-engine';
import type { CelestialBody } from './objectTypes.js';

const require = createRequire(import.meta.url);
const { Observer, Horizon } = require('astronomy-engine') as typeof AstronomyEngine;
```

### Target File
src/render/starDensity.ts

### Replace
```ts
const PRIORITY: Record<string, number> = { sun: 0, moon: 1, planet: 2, star: 3 };
```

### With
```ts
const PRIORITY: Record<string, number> = { planet: 0, moon: 1, sun: 2, star: 3 };
```

### Target File
tests/render/starDensity.test.ts

### Replace
```ts
  it('sorts by priority: sun < moon < planet < star', () => {
    const points = [pt('star', 2), pt('sun'), pt('planet'), pt('moon')];
    const result = applyStarDensity(points, 80, 24);
    expect(result[0].type).toBe('sun');
    expect(result[1].type).toBe('moon');
    expect(result[2].type).toBe('planet');
    expect(result[3].type).toBe('star');
  });
```

### With
```ts
  it('sorts by priority: planet < moon < sun < star', () => {
    const points = [pt('star', 2), pt('sun'), pt('planet'), pt('moon')];
    const result = applyStarDensity(points, 80, 24);
    expect(result[0].type).toBe('planet');
    expect(result[1].type).toBe('moon');
    expect(result[2].type).toBe('sun');
    expect(result[3].type).toBe('star');
  });
```

### Target File
src/ui/Horizon.tsx

### Replace
```ts
export function Horizon({ width, azimuthOffset }: HorizonProps) {
  const markerCount = 4;
  const markerWidth = 1;
  const spacesForDashes = width - markerCount * markerWidth - (markerCount - 1) * 1;
  const segLen = Math.max(0, Math.floor(spacesForDashes / markerCount));
  const dashes = (n: number) => '-'.repeat(n);

  const cardinals = ['N', 'E', 'S', 'W'];
  const shift = ((Math.round(azimuthOffset / 90) % 4) + 4) % 4;
  const rotated = [...cardinals.slice(shift), ...cardinals.slice(0, shift)];

  const compassLine = rotated.map((c, i) => (i === 0 ? c : ` ${dashes(segLen)} ${c}`)).join('');

  return (
    <Box flexDirection="column">
      <Text>{dashes(width)}</Text>
      <Text>{compassLine}</Text>
    </Box>
  );
}
```

### With
```ts
const CARDINALS = [
  { label: 'N', azimuth: 0 },
  { label: 'E', azimuth: 90 },
  { label: 'S', azimuth: 180 },
  { label: 'W', azimuth: 270 },
];

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function Horizon({ width, azimuthOffset }: HorizonProps) {
  const dashes = (n: number) => '-'.repeat(n);
  const compass = Array.from({ length: Math.max(0, width) }, () => ' ');

  for (const marker of CARDINALS) {
    const adjusted = normalizeAngle(marker.azimuth - azimuthOffset);
    const position = Math.floor((adjusted / 360) * width);
    if (position >= 0 && position < compass.length) {
      compass[position] = marker.label;
    }
  }

  return (
    <Box flexDirection="column">
      <Text>{dashes(width)}</Text>
      <Text>{compass.join('')}</Text>
    </Box>
  );
}
```

### Target File
tests/ui/Horizon.test.tsx

### Replace
```ts
  it('rotates markers with azimuthOffset 90 — E appears first', async () => {
    const out = await renderToString(horizon(80, 90));
    expect(compassLine(out).startsWith('E')).toBe(true);
  });
```

### With
```ts
  it('moves markers with a 15 degree azimuthOffset', async () => {
    const baseline = compassLine(await renderToString(horizon(80, 0)));
    const rotated = compassLine(await renderToString(horizon(80, 15)));
    expect(rotated).not.toBe(baseline);
  });

  it('rotates markers with azimuthOffset 90 — E appears first', async () => {
    const out = await renderToString(horizon(80, 90));
    expect(compassLine(out).startsWith('E')).toBe(true);
  });
```
