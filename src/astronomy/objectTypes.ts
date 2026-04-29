// src/astronomy/objectTypes.ts
export type CelestialBodyType = "star" | "planet" | "sun" | "moon";

export type CelestialBody = {
  id: string;
  name: string;
  type: CelestialBodyType;
  azimuth: number;
  altitude: number;
  magnitude?: number;
};
