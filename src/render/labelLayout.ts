import type { ScreenPoint } from '../projection/projectAltAz.js';

export type LabeledPoint = ScreenPoint & { labelX: number; labelY: number };

export function assignLabels(points: ScreenPoint[], viewportWidth: number): LabeledPoint[] {
  const maxLabels = Math.floor(viewportWidth / 12);
  const occupied = new Set<string>();
  const result: LabeledPoint[] = [];

  for (const point of points) {
    if (result.length >= maxLabels) break;

    const lx = point.x + 1;
    const ly = point.y;
    const key = `${lx},${ly}`;

    if (!occupied.has(key)) {
      occupied.add(key);
      result.push({ ...point, labelX: lx, labelY: ly });
    }
  }

  return result;
}
