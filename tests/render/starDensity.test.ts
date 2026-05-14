import { describe, it, expect } from 'vitest';
import { applyStarDensity } from '../../src/render/starDensity';
import type { ScreenPoint } from '../../src/projection/projectAltAz';

function pt(type: ScreenPoint['type'], mag?: number, visible = true): ScreenPoint {
  return { id: type, name: type, type, x: 0, y: 0, visible, magnitude: mag };
}

describe('applyStarDensity', () => {
  it('limits output to viewportArea / 120', () => {
    const points = Array.from({ length: 500 }, (_, i) => pt('star', i));
    const result = applyStarDensity(points, 80, 24);
    expect(result.length).toBeLessThanOrEqual(Math.floor((80 * 24) / 120));
  });

  it('filters out non-visible points', () => {
    const points = [pt('sun', undefined, false), pt('moon', undefined, true)];
    const result = applyStarDensity(points, 80, 24);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('moon');
  });

  it('sorts by priority: sun < moon < planet < star', () => {
    const points = [pt('star', 2), pt('sun'), pt('planet'), pt('moon')];
    const result = applyStarDensity(points, 80, 24);
    expect(result[0].type).toBe('sun');
    expect(result[1].type).toBe('moon');
    expect(result[2].type).toBe('planet');
    expect(result[3].type).toBe('star');
  });

  it('returns empty array when no visible points', () => {
    const points = [pt('star', 1, false), pt('moon', undefined, false)];
    expect(applyStarDensity(points, 80, 24)).toHaveLength(0);
  });
});
