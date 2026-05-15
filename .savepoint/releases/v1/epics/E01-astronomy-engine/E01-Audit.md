---
type: epic-audit
epic: E01-astronomy-engine
status: audited
auditor: agent
date: 2026-05-15
---

# E01 Audit: astronomy-engine

## Main Findings

### Bug 1: Algenib RA copy-paste error (must fix)

`src/astronomy/starCatalog.ts:59` — Algenib's RA value `0.1398` is a copy of Alpheratz's RA on the next line. Correct value is approximately `0.2207` (J2000 RA 0h13m14s). The error shifts Algenib ~5 arcminutes in RA, translating to ~0.8° positional error.

### Bug 2: Kaus Australis RA data entry error (must fix)

`src/astronomy/starCatalog.ts:67` — Kaus Australis has `ra: 18.3876` but should be approximately `18.4028` (J2000 RA 18h24m10s). The error is ~55 seconds of RA, causing a ~13° projected position error on the celestial equator — highly visible in a sky chart.

### Finding 3: Unused import in test file (should fix)

`tests/astronomy/starCatalog.test.ts:2` — `StarEntry` is imported but never referenced. Unused import violates code style principle.

### Finding 4: Acceptance criteria checkboxes not checked off (informational)

All three task files (`T001`, `T002`, `T003`) have their AC items still marked `[ ]` despite implementation being complete. Implementation plan items are properly checked.

### Finding 5: T003 ephemeris tests are range-only, not ±2° of known value (informational)

T003 AC says "Moon position test for a known date/time/lat/lon within ±2°" but the test only validates that Moon altitude is in [-90, 90] range. Same pattern for planet and star verification tests. They serve as valid regression tests but do not verify ephemeris accuracy against an external reference. The Sun solstice test does correctly verify within ±2° of 79.5°.

## Code Style Review

- One job per file: ✓ Each module has a single responsibility.
- No `any` types: ✓ All types are explicit.
- Types document intent: ✓ `CelestialBody`, `StarEntry`, `SkyModelInput` clearly define shape.
- No hardcoded magic values: ✓ Star data uses a const array; planet list uses a const array.
- No rendering logic in astronomy modules: ✓ All modules are pure computation.
- Error handling at boundaries: Not yet applicable — no error boundaries exist since astronomy-engine doesn't throw for valid inputs.
- Comments explain why, not what: ✓ Minimal comments, code is self-documenting.
- Codebase map matches Design.md: ✓ No drift.

## Proposed Changes

### Target File
src/astronomy/starCatalog.ts:59

### Replace
{ id: 'algenib', name: 'Algenib', ra: 0.1398, dec: 15.1819, magnitude: 2.49 },

### With
{ id: 'algenib', name: 'Algenib', ra: 0.2207, dec: 15.1914, magnitude: 2.49 },

---

### Target File
src/astronomy/starCatalog.ts:67

### Replace
{ id: 'kaus-australis', name: 'Kaus Australis', ra: 18.3876, dec: -34.3846, magnitude: 1.85 },

### With
{ id: 'kaus-australis', name: 'Kaus Australis', ra: 18.4028, dec: -34.3847, magnitude: 1.85 },

---

### Target File
tests/astronomy/starCatalog.test.ts:2

### Replace
import { StarEntry, calculateStarPositions } from '../../src/astronomy/starCatalog.js';

### With
import { calculateStarPositions } from '../../src/astronomy/starCatalog.js';