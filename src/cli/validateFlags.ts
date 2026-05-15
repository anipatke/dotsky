export type CliFlags = {
  lat?: number;
  lon?: number;
  time?: string;
  fps?: number;
  aspect?: number;
};

export function validateFlags(flags: CliFlags): string | null {
  const { lat, lon, time: timeStr, fps, aspect } = flags;

  if ((lat !== undefined) !== (lon !== undefined)) {
    return '--lat and --lon must be provided together.';
  }

  if (lat !== undefined && (isNaN(lat) || typeof lat !== 'number')) {
    return '--lat must be a valid number.';
  }

  if (lon !== undefined && (isNaN(lon) || typeof lon !== 'number')) {
    return '--lon must be a valid number.';
  }

  if (lat !== undefined && (lat < -90 || lat > 90)) {
    return '--lat must be in the range [-90, 90].';
  }

  if (lon !== undefined && (lon < -180 || lon > 180)) {
    return '--lon must be in the range [-180, 180].';
  }

  if (timeStr !== undefined) {
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) {
      return '--time must be a valid ISO 8601 date string.';
    }
  }

  if (fps !== undefined && (fps < 1 || fps > 60 || isNaN(fps) || typeof fps !== 'number')) {
    return '--fps must be in the range [1, 60].';
  }

  if (aspect !== undefined && (aspect <= 0 || isNaN(aspect) || typeof aspect !== 'number')) {
    return '--aspect must be a positive number.';
  }

  return null;
}
