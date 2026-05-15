---
type: epic-audit
epic: E02-location-and-cli
status: audited
auditor: agent
date: 2026-05-15
---

# E02 Audit: location-and-cli

## Main Findings

### Bug 1: `writeCachedLocation` has no error handling (must fix)

`src/location/cacheLocation.ts:31-39` — `writeCachedLocation` can throw on filesystem errors (permissions, disk full, etc.). The call in `src/location/resolveLocation.ts:30` is not wrapped in try/catch, so a cache write failure would crash the app. Cache is a performance optimization — write failures should be silent.

### Finding 2: Footer fallback warning not tested (should fix)

T003 AC4 requires Footer to show `[Location fallback: Sydney]` when `locationSource === 'fallback'`. The Footer component (`src/ui/Footer.tsx`) has the conditional rendering, but `tests/ui/Footer.test.tsx` only tests the default render without the `locationSource` prop. No test verifies the fallback warning appears.

### Finding 3: `src/cli/validateFlags.ts` not in Design.md codebase map (informational)

The new `validateFlags.ts` module was created under `src/cli/` but is not listed in the Design.md codebase map. The map lists `src/cli.ts` (E02) but not the subdirectory module.

### Finding 4: Acceptance criteria checkboxes not checked off (informational)

All four task files have `[ ]` instead of `[x]` in their Acceptance Criteria sections despite implementation being complete.

## Code Style Review

- One job per file: ✓ Each module has a clear single responsibility.
- No `any` types: ✓ No `any` found in location or cli modules.
- Types document intent: ✓ `LocationResult`, `ResolveOptions`, `CliFlags`, `IpApiResponse` are all explicit.
- No hardcoded values: ✓ API URL and timeout are constants. Sydney coords are an intentional fallback.
- Error handling at boundaries: ✗ `writeCachedLocation` throws instead of returning null/void safely.
- Comments explain why, not what: ✓ Minimal and appropriate.
- No duplicate logic: ✓ Lat/lon range validation appears in both `ipGeolocation.ts` and `cacheLocation.ts` but for different purposes (API response validation vs cache integrity) — acceptable duplication.

## Proposed Changes

### Target File
src/location/cacheLocation.ts:31-39

### Replace
```ts
export async function writeCachedLocation(lat: number, lon: number): Promise<void> {
  const dir = getCacheDir();
  const filePath = path.join(dir, CACHE_FILE);
  const tmpPath = filePath + '.tmp';

  await fs.mkdir(dir, { recursive: true });
  const data = JSON.stringify({ lat, lon, timestamp: Date.now() });
  await fs.writeFile(tmpPath, data, 'utf-8');
  await fs.rename(tmpPath, filePath);
}
```

### With
```ts
export async function writeCachedLocation(lat: number, lon: number): Promise<void> {
  try {
    const dir = getCacheDir();
    const filePath = path.join(dir, CACHE_FILE);
    const tmpPath = filePath + '.tmp';

    await fs.mkdir(dir, { recursive: true });
    const data = JSON.stringify({ lat, lon, timestamp: Date.now() });
    await fs.writeFile(tmpPath, data, 'utf-8');
    await fs.rename(tmpPath, filePath);
  } catch {
    // Cache write is best-effort; failures must not crash the app.
  }
}
```

---

### Target File
tests/ui/Footer.test.tsx

### Replace
```tsx
  it('renders zoom hint', async () => {
    const out = await renderToString(createElement(Footer));
    expect(out).toContain('[+/-] zoom');
  });
});
```

### With
```tsx
  it('renders zoom hint', async () => {
    const out = await renderToString(createElement(Footer));
    expect(out).toContain('[+/-] zoom');
  });

  it('renders fallback warning when locationSource is fallback', async () => {
    const out = await renderToString(createElement(Footer, { locationSource: 'fallback' }));
    expect(out).toContain('Location fallback: Sydney');
  });

  it('does not render fallback warning when locationSource is geo', async () => {
    const out = await renderToString(createElement(Footer, { locationSource: 'geo' }));
    expect(out).not.toContain('Location fallback');
  });
});
```