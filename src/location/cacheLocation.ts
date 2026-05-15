import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CACHE_FILE = 'location.json';

function getCacheDir(): string {
  const home = os.homedir();
  if (process.env.XDG_CONFIG_HOME) {
    return path.join(process.env.XDG_CONFIG_HOME, 'dotsky');
  }
  if (process.platform === 'win32' && process.env.APPDATA) {
    return path.join(process.env.APPDATA, 'dotsky');
  }
  return path.join(home, '.config', 'dotsky');
}

export async function readCachedLocation(): Promise<{ lat: number; lon: number } | null> {
  try {
    const filePath = path.join(getCacheDir(), CACHE_FILE);
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    if (typeof parsed.lat !== 'number' || typeof parsed.lon !== 'number') return null;
    if (parsed.lat < -90 || parsed.lat > 90 || parsed.lon < -180 || parsed.lon > 180) return null;
    return { lat: parsed.lat, lon: parsed.lon };
  } catch {
    return null;
  }
}

export async function writeCachedLocation(lat: number, lon: number): Promise<void> {
  try {
    const dir = getCacheDir();
    const filePath = path.join(dir, CACHE_FILE);
    const tmpPath = filePath + '.tmp';

    await fs.mkdir(dir, { recursive: true });
    const data = JSON.stringify({ lat, lon, timestamp: Date.now() });
    await fs.writeFile(tmpPath, data, 'utf-8');
    await fs.rename(tmpPath, filePath);
  } catch {
    // Cache write is best-effort; failures must not crash the app.
  }
}
