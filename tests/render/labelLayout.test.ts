import { describe, it, expect } from 'vitest';
import { assignLabels } from '../../src/render/labelLayout';
import type { ScreenPoint } from '../../src/projection/projectAltAz';

function pt(name: string, x: number, y: number, type?: ScreenPoint['type']): ScreenPoint {
  return { id: name, name, type: type ?? 'star', x, y, visible: true };
}

describe('assignLabels', () => {
  it('assigns label one column right of the point', () => {
    const [result] = assignLabels([pt('Sirius', 5, 5)], 80);
    expect(result.labelX).toBe(6);
    expect(result.labelY).toBe(5);
  });

  it('caps label count at floor(width / 12)', () => {
    const points = Array.from({ length: 20 }, (_, i) => pt(`Star${i}`, i * 4, 5));
    const result = assignLabels(points, 80);
    expect(result.length).toBeLessThanOrEqual(Math.floor(80 / 12));
  });

  it('does not assign two labels at the same position', () => {
    const points = [pt('A', 5, 5), pt('B', 5, 5)];
    const result = assignLabels(points, 80);
    if (result.length === 2) {
      const clash = result[0].labelX === result[1].labelX && result[0].labelY === result[1].labelY;
      expect(clash).toBe(false);
    }
  });

  it('returns empty array for empty input', () => {
    expect(assignLabels([], 80)).toHaveLength(0);
  });

  it('respects input priority order — first points get labels first', () => {
    const points = [
      pt('Venus', 0, 0, 'planet'),
      pt('Moon', 3, 0, 'moon'),
      pt('Sun', 6, 0, 'sun'),
    ];
    const result = assignLabels(points, 40);
    expect(result[0].name).toBe('Venus');
    expect(result[1].name).toBe('Moon');
    expect(result[2].name).toBe('Sun');
  });
});
