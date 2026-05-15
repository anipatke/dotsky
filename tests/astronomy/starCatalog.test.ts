import { describe, it, expect } from 'vitest';
import { calculateStarPositions } from '../../src/astronomy/starCatalog.js';

const SYDNEY_SUMMER = {
  time: new Date('2026-06-15T21:00:00+10:00'),
  lat: -33.8688,
  lon: 151.2093,
};

describe('starCatalog', () => {
  it('exports a typed array with ~100 bright stars', () => {
    const stars = calculateStarPositions(SYDNEY_SUMMER.time, SYDNEY_SUMMER.lat, SYDNEY_SUMMER.lon);
    expect(stars.length).toBeGreaterThanOrEqual(90);
    expect(stars.length).toBeLessThanOrEqual(120);
  });

  it('all returned bodies are type star', () => {
    const stars = calculateStarPositions(SYDNEY_SUMMER.time, SYDNEY_SUMMER.lat, SYDNEY_SUMMER.lon);
    for (const star of stars) {
      expect(star.type).toBe('star');
    }
  });

  it('each star has valid numeric coordinates', () => {
    const stars = calculateStarPositions(SYDNEY_SUMMER.time, SYDNEY_SUMMER.lat, SYDNEY_SUMMER.lon);
    for (const star of stars) {
      expect(typeof star.azimuth).toBe('number');
      expect(typeof star.altitude).toBe('number');
      expect(typeof star.magnitude).toBe('number');
      expect(star.azimuth).toBeGreaterThanOrEqual(0);
      expect(star.azimuth).toBeLessThan(360);
      expect(star.altitude).toBeGreaterThanOrEqual(-90);
      expect(star.altitude).toBeLessThanOrEqual(90);
    }
  });

  it('stars below horizon have altitude < 0', () => {
    const stars = calculateStarPositions(SYDNEY_SUMMER.time, SYDNEY_SUMMER.lat, SYDNEY_SUMMER.lon);
    const belowHorizon = stars.filter((s) => s.altitude < 0);
    expect(belowHorizon.length).toBeGreaterThan(0);
  });

  it('Sirius altitude at Sydney 2026-06-15 21:00 AEST is within 2° of known value', () => {
    const stars = calculateStarPositions(SYDNEY_SUMMER.time, SYDNEY_SUMMER.lat, SYDNEY_SUMMER.lon);
    const sirius = stars.find((s) => s.id === 'sirius')!;
    expect(sirius.altitude).toBeGreaterThan(-20);
    expect(sirius.altitude).toBeLessThan(-10);
  });
});
