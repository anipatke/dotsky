const DEFAULT_TIMEOUT_MS = 5000;
const API_URL = 'https://ipapi.co/json/';

type IpApiResponse = {
  latitude?: number;
  longitude?: number;
  error?: boolean;
};

export async function getIPLocation(
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<{ lat: number; lon: number } | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timer);

    if (!response.ok) return null;

    const data: IpApiResponse = await response.json();

    if (data.error) return null;
    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') return null;

    const { latitude: lat, longitude: lon } = data;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

    return { lat, lon };
  } catch {
    return null;
  }
}
