import { describe, it, expect } from 'vitest';
import { calculateCelestialBodies } from '../../src/astronomy/skyModel';

const SYDNEY = { lat: -33.8688, lon: 151.2093 };

const SYDNEY_NIGHT = {
  time: new Date('2026-04-29T21:00:00+10:00'),
  ...SYDNEY,
};

const SYDNEY_SUMMER = {
  time: new Date('2025-12-22T02:00:00Z'),
  ...SYDNEY,
};

describe('skyModel', () => {
  it('returns solar system bodies plus stars', () => {
    const bodies = calculateCelestialBodies(SYDNEY_NIGHT);
    expect(bodies.length).toBeGreaterThan(100);
  });

  it('includes all 7 solar system bodies', () => {
    const bodies = calculateCelestialBodies(SYDNEY_NIGHT);
    const expectedSolarIds = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
    const ids = bodies.map((b) => b.id);
    for (const id of expectedSolarIds) {
      expect(ids.indexOf(id)).toBeGreaterThanOrEqual(0);
    }
  });

  it('each body has correct properties', () => {
    const bodies = calculateCelestialBodies(SYDNEY_NIGHT);
    for (const body of bodies) {
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('type');
      expect(body).toHaveProperty('azimuth');
      expect(body).toHaveProperty('altitude');
      expect(body).toHaveProperty('magnitude');
      expect(typeof body.azimuth).toBe('number');
      expect(typeof body.altitude).toBe('number');
      expect(typeof body.magnitude).toBe('number');
    }
  });

  it('Sun is below horizon at night in Sydney', () => {
    const bodies = calculateCelestialBodies(SYDNEY_NIGHT);
    const sun = bodies.find((b) => b.id === 'sun')!;
    expect(sun.altitude).toBeLessThan(0);
  });
});

describe('ephemeris integration', () => {
  it('Sun altitude at Sydney summer solstice noon is ~79.5°', () => {
    const bodies = calculateCelestialBodies(SYDNEY_SUMMER);
    const sun = bodies.find((b) => b.id === 'sun')!;
    expect(sun.altitude).toBeGreaterThan(77.5);
    expect(sun.altitude).toBeLessThan(81.5);
  });

  it('Moon altitude at Sydney summer solstice is valid', () => {
    const bodies = calculateCelestialBodies(SYDNEY_SUMMER);
    const moon = bodies.find((b) => b.id === 'moon')!;
    expect(moon.altitude).toBeGreaterThan(-90);
    expect(moon.altitude).toBeLessThan(90);
    expect(moon.azimuth).toBeGreaterThanOrEqual(0);
    expect(moon.azimuth).toBeLessThan(360);
  });

  it('Venus altitude at Sydney summer solstice is valid', () => {
    const bodies = calculateCelestialBodies(SYDNEY_SUMMER);
    const venus = bodies.find((b) => b.id === 'venus')!;
    expect(venus.altitude).toBeGreaterThan(-90);
    expect(venus.altitude).toBeLessThan(90);
    expect(venus.azimuth).toBeGreaterThanOrEqual(0);
    expect(venus.azimuth).toBeLessThan(360);
    expect(venus.magnitude).toBeLessThan(0);
  });

  it('Jupiter altitude at Sydney summer solstice is valid', () => {
    const bodies = calculateCelestialBodies(SYDNEY_SUMMER);
    const jupiter = bodies.find((b) => b.id === 'jupiter')!;
    expect(jupiter.altitude).toBeGreaterThan(-90);
    expect(jupiter.altitude).toBeLessThan(90);
    expect(jupiter.azimuth).toBeGreaterThanOrEqual(0);
    expect(jupiter.azimuth).toBeLessThan(360);
    expect(jupiter.magnitude).toBeLessThan(0);
  });

  it('Sirius altitude at Sydney summer solstice is valid', () => {
    const bodies = calculateCelestialBodies(SYDNEY_SUMMER);
    const sirius = bodies.find((b) => b.id === 'sirius')!;
    expect(sirius.altitude).toBeGreaterThan(-90);
    expect(sirius.altitude).toBeLessThan(90);
    expect(sirius.azimuth).toBeGreaterThanOrEqual(0);
    expect(sirius.azimuth).toBeLessThan(360);
  });

  it('Vega altitude at Sydney summer solstice is valid', () => {
    const bodies = calculateCelestialBodies(SYDNEY_SUMMER);
    const vega = bodies.find((b) => b.id === 'vega')!;
    expect(vega.altitude).toBeGreaterThan(-90);
    expect(vega.altitude).toBeLessThan(90);
    expect(vega.azimuth).toBeGreaterThanOrEqual(0);
    expect(vega.azimuth).toBeLessThan(360);
  });

  it('Polaris altitude at Sydney summer solstice is valid', () => {
    const bodies = calculateCelestialBodies(SYDNEY_SUMMER);
    const polaris = bodies.find((b) => b.id === 'polaris')!;
    expect(polaris.altitude).toBeGreaterThan(-90);
    expect(polaris.altitude).toBeLessThan(90);
    expect(polaris.azimuth).toBeGreaterThanOrEqual(0);
    expect(polaris.azimuth).toBeLessThan(360);
  });
});

describe('edge cases', () => {
  it('polar latitude (lat=89) does not crash', () => {
    const bodies = calculateCelestialBodies({
      time: new Date('2026-06-15T12:00:00Z'),
      lat: 89,
      lon: 0,
    });
    expect(bodies.length).toBeGreaterThan(100);
    for (const body of bodies) {
      expect(typeof body.altitude).toBe('number');
      expect(body.altitude).toBeGreaterThanOrEqual(-90);
      expect(body.altitude).toBeLessThanOrEqual(90);
    }
  });

  it('equatorial latitude (lat=0) does not crash', () => {
    const bodies = calculateCelestialBodies({
      time: new Date('2026-03-20T06:00:00Z'),
      lat: 0,
      lon: 0,
    });
    expect(bodies.length).toBeGreaterThan(100);
    for (const body of bodies) {
      expect(typeof body.altitude).toBe('number');
      expect(typeof body.azimuth).toBe('number');
    }
  });

  it('date far in the future returns valid shape', () => {
    const bodies = calculateCelestialBodies({
      time: new Date('3000-06-15T12:00:00Z'),
      lat: 40,
      lon: -74,
    });
    expect(bodies.length).toBeGreaterThan(100);
    for (const body of bodies) {
      expect(typeof body.altitude).toBe('number');
      expect(typeof body.azimuth).toBe('number');
    }
  });

  it('date far in the past returns valid shape', () => {
    const bodies = calculateCelestialBodies({
      time: new Date('0001-01-01T12:00:00Z'),
      lat: 40,
      lon: -74,
    });
    expect(bodies.length).toBeGreaterThan(100);
    for (const body of bodies) {
      expect(typeof body.altitude).toBe('number');
      expect(typeof body.azimuth).toBe('number');
    }
  });

  it('negative longitude does not crash', () => {
    const bodies = calculateCelestialBodies({
      time: new Date('2026-04-29T21:00:00Z'),
      lat: 40.7128,
      lon: -74.006,
    });
    expect(bodies.length).toBeGreaterThan(100);
    const sun = bodies.find((b) => b.id === 'sun')!;
    expect(sun.azimuth).toBeGreaterThanOrEqual(0);
  });
});
