// tests/projection/projectAltAz.test.ts
import { describe, it, expect } from 'vitest';
import { projectBody } from '../../src/projection/projectAltAz';
import { applyAspectCorrection } from '../../src/projection/aspectCorrection';
import { CelestialBody } from '../../src/astronomy/objectTypes';

describe('Projection', () => {
  it('correctly applies aspect ratio', () => {
    expect(applyAspectCorrection(10, 0.5)).toBe(5);
  });

  it('projects body to screen coordinates and filters below horizon', () => {
    const body: CelestialBody = { id: 'test', name: 'Test', type: 'star', azimuth: 180, altitude: 45 };
    const viewport = { width: 80, height: 24 };
    
    const point = projectBody(body, viewport, { azimuthOffset: 0, zoom: 1, aspect: 0.5 });
    
    expect(point.visible).toBe(true);
    expect(point.x).toBeGreaterThanOrEqual(0);
    expect(point.y).toBeGreaterThanOrEqual(0);
  });

  it('hides objects below the horizon', () => {
    const body: CelestialBody = { id: 'test2', name: 'Test 2', type: 'star', azimuth: 180, altitude: -10 };
    const viewport = { width: 80, height: 24 };
    const point = projectBody(body, viewport, { azimuthOffset: 0, zoom: 1, aspect: 0.5 });
    expect(point.visible).toBe(false);
  });
});
