import type { ScreenPoint } from '../projection/projectAltAz.js';

const PRIORITY: Record<string, number> = { sun: 0, moon: 1, planet: 2, star: 3 };

export function applyStarDensity(
  points: ScreenPoint[],
  viewportWidth: number,
  viewportHeight: number,
): ScreenPoint[] {
  const limit = Math.max(1, Math.floor((viewportWidth * viewportHeight) / 120));
  const visible = points.filter(p => p.visible);

  const sorted = [...visible].sort((a, b) => {
    const pa = PRIORITY[a.type] ?? 99;
    const pb = PRIORITY[b.type] ?? 99;
    if (pa !== pb) return pa - pb;
    return (a.magnitude ?? 0) - (b.magnitude ?? 0);
  });

  return sorted.slice(0, limit);
}
