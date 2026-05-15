import { createRequire } from 'node:module';
import type * as AstronomyEngine from 'astronomy-engine';
import type { CelestialBody } from './objectTypes.js';

const require = createRequire(import.meta.url);
const {
  Body,
  Observer,
  Equator,
  Horizon,
  Illumination,
} = require('astronomy-engine') as typeof AstronomyEngine;

const SOLAR_SYSTEM_BODIES: Array<{
  id: string;
  name: string;
  body: AstronomyEngine.Body;
  type: CelestialBody['type'];
}> = [
  { id: 'sun', name: 'Sun', body: Body.Sun, type: 'sun' },
  { id: 'moon', name: 'Moon', body: Body.Moon, type: 'moon' },
  { id: 'mercury', name: 'Mercury', body: Body.Mercury, type: 'planet' },
  { id: 'venus', name: 'Venus', body: Body.Venus, type: 'planet' },
  { id: 'mars', name: 'Mars', body: Body.Mars, type: 'planet' },
  { id: 'jupiter', name: 'Jupiter', body: Body.Jupiter, type: 'planet' },
  { id: 'saturn', name: 'Saturn', body: Body.Saturn, type: 'planet' },
];

export function calculateSolarSystemBodies(
  time: Date,
  lat: number,
  lon: number,
): CelestialBody[] {
  const observer = new Observer(lat, lon, 0);

  return SOLAR_SYSTEM_BODIES.map(({ id, name, body, type }) => {
    const eq = Equator(body, time, observer, true, true);
    const hor = Horizon(time, observer, eq.ra, eq.dec);
    const illum = Illumination(body, time);

    return {
      id,
      name,
      type,
      azimuth: hor.azimuth,
      altitude: hor.altitude,
      magnitude: illum.mag,
    };
  });
}
