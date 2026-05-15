// tests/projection/projectAltAz.test.ts
import { describe, it, expect } from 'vitest';
import { projectBody } from '../../src/projection/projectAltAz.js';
import { applyAspectCorrection } from '../../src/projection/aspectCorrection.js';
import type { CelestialBody } from '../../src/astronomy/objectTypes.js';

describe('Projection', () => {
  it('correctly applies aspect ratio', () => {
    expect(applyAspectCorrection(10, 0.5)).toBe(5);
  });

  it('projects body to screen coordinates with defaults', () => {
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

  describe('azimuthOffset', () => {
    it('shifts x position when offset is applied', () => {
      const body: CelestialBody = { id: 's', name: 'S', type: 'star', azimuth: 0, altitude: 45 };
      const viewport = { width: 360, height: 24 };

      const p0 = projectBody(body, viewport, { azimuthOffset: 0, zoom: 1, aspect: 0.5 });
      const p45 = projectBody(body, viewport, { azimuthOffset: 45, zoom: 1, aspect: 0.5 });

      expect(p45.x).toBeGreaterThan(p0.x);
    });

    it('wraps azimuth past 360 degrees', () => {
      const body: CelestialBody = { id: 's', name: 'S', type: 'star', azimuth: 350, altitude: 45 };
      const viewport = { width: 360, height: 24 };

      const point = projectBody(body, viewport, { azimuthOffset: 20, zoom: 1, aspect: 0.5 });

      expect(point.x).toBeLessThan(30);
    });
  });

  describe('zoom', () => {
    it('zoom=1 produces same position as no zoom at center', () => {
      const body: CelestialBody = { id: 's', name: 'S', type: 'star', azimuth: 180, altitude: 45 };
      const viewport = { width: 360, height: 24 };
      const point = projectBody(body, viewport, { azimuthOffset: 0, zoom: 1, aspect: 0.5 });
      expect(point.x).toBe(180);
    });

    it('zoom=2 spreads points away from center', () => {
      const body: CelestialBody = { id: 's', name: 'S', type: 'star', azimuth: 90, altitude: 45 };
      const viewport = { width: 360, height: 24 };

      const p1 = projectBody(body, viewport, { azimuthOffset: 0, zoom: 1, aspect: 0.5 });
      const p2 = projectBody(body, viewport, { azimuthOffset: 0, zoom: 2, aspect: 0.5 });

      const dist1 = Math.abs(p1.x - 180);
      const dist2 = Math.abs(p2.x - 180);
      expect(dist2).toBeGreaterThan(dist1);
    });

    it('zoom=0.5 compresses points toward center', () => {
      const body: CelestialBody = { id: 's', name: 'S', type: 'star', azimuth: 0, altitude: 45 };
      const viewport = { width: 360, height: 24 };

      const p1 = projectBody(body, viewport, { azimuthOffset: 0, zoom: 1, aspect: 0.5 });
      const pHalf = projectBody(body, viewport, { azimuthOffset: 0, zoom: 0.5, aspect: 0.5 });

      const dist1 = Math.abs(p1.x - 180);
      const distHalf = Math.abs(pHalf.x - 180);
      expect(distHalf).toBeLessThan(dist1);
    });
  });

  describe('viewport bounds', () => {
    it('marks body as visible when inside viewport', () => {
      const body: CelestialBody = { id: 's', name: 'S', type: 'star', azimuth: 180, altitude: 45 };
      const viewport = { width: 80, height: 24 };
      const point = projectBody(body, viewport, { azimuthOffset: 0, zoom: 1, aspect: 0.5 });
      expect(point.visible).toBe(true);
    });

    it('marks body as invisible when zoom pushes x outside viewport', () => {
      const body: CelestialBody = { id: 's', name: 'S', type: 'star', azimuth: 0, altitude: 45 };
      const viewport = { width: 80, height: 24 };
      const point = projectBody(body, viewport, { azimuthOffset: 0, zoom: 10, aspect: 0.5 });
      expect(point.visible).toBe(false);
    });

    it('marks body as invisible when below horizon', () => {
      const body: CelestialBody = { id: 's', name: 'S', type: 'star', azimuth: 180, altitude: -5 };
      const viewport = { width: 80, height: 24 };
      const point = projectBody(body, viewport, { azimuthOffset: 0, zoom: 1, aspect: 0.5 });
      expect(point.visible).toBe(false);
    });
  });
});
