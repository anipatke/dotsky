// src/location/resolveLocation.ts
export type LocationResult = {
  lat: number;
  lon: number;
  source: "cli" | "cache" | "geo" | "fallback";
};

export async function resolveLocation(cliArgs: { lat?: number, lon?: number }): Promise<LocationResult> {
  if (cliArgs.lat !== undefined && cliArgs.lon !== undefined) {
    return { lat: cliArgs.lat, lon: cliArgs.lon, source: 'cli' };
  }
  
  // Minimal fallback implementation
  return { lat: -33.8688, lon: 151.2093, source: 'fallback' };
}
