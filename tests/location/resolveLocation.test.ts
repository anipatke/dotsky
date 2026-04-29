// tests/location/resolveLocation.test.ts
import { describe, it, expect } from 'vitest';
import { resolveLocation } from '../../src/location/resolveLocation';

describe('resolveLocation', () => {
  it('prioritizes CLI options over fallback', async () => {
    const loc = await resolveLocation({ lat: -10, lon: 20 });
    expect(loc.lat).toBe(-10);
    expect(loc.lon).toBe(20);
    expect(loc.source).toBe('cli');
  });

  it('returns Sydney fallback when no inputs provided', async () => {
    const loc = await resolveLocation({});
    expect(loc.lat).toBe(-33.8688);
    expect(loc.lon).toBe(151.2093);
    expect(loc.source).toBe('fallback');
  });
});
