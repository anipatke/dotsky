// src/location/resolveLocation.ts
import { getIPLocation } from './ipGeolocation.js';
import { readCachedLocation, writeCachedLocation } from './cacheLocation.js';

export type LocationResult = {
  lat: number;
  lon: number;
  source: "cli" | "cache" | "geo" | "fallback";
};

export type ResolveOptions = {
  lat?: number;
  lon?: number;
  noGeo?: boolean;
};

export async function resolveLocation(options: ResolveOptions = {}): Promise<LocationResult> {
  if (options.lat !== undefined && options.lon !== undefined) {
    return { lat: options.lat, lon: options.lon, source: 'cli' };
  }

  const cached = await readCachedLocation();
  if (cached) {
    return { lat: cached.lat, lon: cached.lon, source: 'cache' };
  }

  if (!options.noGeo) {
    const geo = await getIPLocation();
    if (geo) {
      await writeCachedLocation(geo.lat, geo.lon);
      return { lat: geo.lat, lon: geo.lon, source: 'geo' };
    }
  }

  return { lat: -33.8688, lon: 151.2093, source: 'fallback' };
}
