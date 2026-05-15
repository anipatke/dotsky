// src/projection/projectAltAz.ts

/**
 * Altitude-azimuth projection module.
 *
 * Projection logic is isolated to allow future replacement with
 * stereographic, orthographic, or azimuthal equidistant projections.
 * Any projection must conform to the {@link ProjectionFunction} signature.
 */

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

export type ProjectionFunction = (
  body: CelestialBody,
  viewport: { width: number; height: number },
  config: ProjectionConfig,
) => ScreenPoint;

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function projectBody(
  body: CelestialBody,
  viewport: { width: number; height: number },
  config: ProjectionConfig,
): ScreenPoint {
  const adjustedAzimuth = normalizeAngle(body.azimuth + config.azimuthOffset);

  let nx = (adjustedAzimuth / 360) * viewport.width;
  let ny = (1 - body.altitude / 90) * viewport.height;

  const cx = viewport.width / 2;
  const cy = viewport.height / 2;

  nx = (nx - cx) * config.zoom + cx;
  ny = (ny - cy) * config.zoom + cy;
  ny = applyAspectCorrection(ny - cy, config.aspect) + cy;

  const x = Math.floor(nx);
  const y = Math.floor(ny);

  const inBounds =
    x >= 0 &&
    x < viewport.width &&
    y >= 0 &&
    y < viewport.height;
  const visible = body.altitude >= 0 && inBounds;

  return {
    id: body.id,
    name: body.name,
    type: body.type,
    x,
    y,
    visible,
    magnitude: body.magnitude,
  };
}
