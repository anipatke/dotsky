import type { CelestialBody } from './objectTypes.js';
import { calculateSolarSystemBodies } from './planetPositions.js';
import { calculateStarPositions } from './starCatalog.js';

export type SkyModelInput = {
  time: Date;
  lat: number;
  lon: number;
};

export function calculateCelestialBodies(input: SkyModelInput): CelestialBody[] {
  const planets = calculateSolarSystemBodies(input.time, input.lat, input.lon);
  const stars = calculateStarPositions(input.time, input.lat, input.lon);
  return [...planets, ...stars];
}
