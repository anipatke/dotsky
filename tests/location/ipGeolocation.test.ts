import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getIPLocation } from '../../src/location/ipGeolocation.js';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('getIPLocation', () => {
  it('returns lat/lon on successful response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ latitude: 40.7128, longitude: -74.006 }),
    });

    const result = await getIPLocation();
    expect(result).toEqual({ lat: 40.7128, lon: -74.006 });
  });

  it('returns null on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const result = await getIPLocation();
    expect(result).toBeNull();
  });

  it('returns null on timeout', async () => {
    mockFetch.mockImplementationOnce((_url, { signal }) => {
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    });

    const result = await getIPLocation(10);
    expect(result).toBeNull();
  });

  it('returns null on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: () => Promise.resolve({}),
    });

    const result = await getIPLocation();
    expect(result).toBeNull();
  });

  it('returns null on invalid JSON (missing lat/lon)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ country: 'US' }),
    });

    const result = await getIPLocation();
    expect(result).toBeNull();
  });

  it('returns null on error flag in response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ error: true, reason: 'rate limited' }),
    });

    const result = await getIPLocation();
    expect(result).toBeNull();
  });

  it('returns null when lat/lon out of range', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ latitude: 100, longitude: 200 }),
    });

    const result = await getIPLocation();
    expect(result).toBeNull();
  });

  it('uses custom timeout when provided', async () => {
    mockFetch.mockImplementationOnce((_url, { signal }) => {
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    });

    const result = await getIPLocation(10);
    expect(result).toBeNull();
  });
});
