// tests/astronomy/skyModel.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCelestialBodies } from '../../src/astronomy/skyModel';

describe('skyModel', () => {
  it('calculates celestial bodies without rendering logic', () => {
    const input = {
      time: new Date('2026-04-29T21:00:00+10:00'),
      lat: -33.8688,
      lon: 151.2093
    };
    
    const bodies = calculateCelestialBodies(input);
    expect(bodies).toBeInstanceOf(Array);
    if (bodies.length > 0) {
      expect(bodies[0]).toHaveProperty('id');
      expect(bodies[0]).toHaveProperty('type');
      expect(bodies[0]).toHaveProperty('azimuth');
      expect(bodies[0]).toHaveProperty('altitude');
    }
  });
});
