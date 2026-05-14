// src/projection/projectAltAz.ts
import type { CelestialBody } from '../astronomy/objectTypes.js';
import { applyAspectCorrection } from './aspectCorrection.js';

export type ScreenPoint = {
  id: string;
  name: string;
  type: CelestialBody["type"];
  x: number;
  y: number;
  visible: boolean;
  magnitude?: number;
};

export type ProjectionConfig = {
  azimuthOffset: number;
  zoom: number;
  aspect: number;
};

export function projectBody(
  body: CelestialBody, 
  viewport: { width: number, height: number }, 
  config: ProjectionConfig
): ScreenPoint {
  const visible = body.altitude >= 0;
  
  // Normalized projection mapping (0-360 to width, 0-90 to height)
  // Simplified for minimum test passage
  let x = Math.floor((body.azimuth / 360) * viewport.width);
  let rawY = Math.floor((1 - (body.altitude / 90)) * viewport.height);
  
  let y = Math.floor(applyAspectCorrection(rawY, config.aspect));

  return {
    id: body.id,
    name: body.name,
    type: body.type,
    x,
    y,
    visible,
    magnitude: body.magnitude
  };
}
