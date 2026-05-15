import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveLocation } from '../../src/location/resolveLocation';

const mockReadFile = vi.hoisted(() => vi.fn());
const mockWriteFile = vi.hoisted(() => vi.fn());
const mockRename = vi.hoisted(() => vi.fn());
const mockMkdir = vi.hoisted(() => vi.fn());
const mockHomedir = vi.hoisted(() => vi.fn(() => '/home/test'));

vi.mock('node:fs', () => ({
  promises: {
    readFile: mockReadFile,
    writeFile: mockWriteFile,
    rename: mockRename,
    mkdir: mockMkdir,
  },
}));

vi.mock('node:os', () => ({
  default: { homedir: mockHomedir },
  homedir: mockHomedir,
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  mockReadFile.mockReset();
  mockWriteFile.mockReset();
  mockRename.mockReset();
  mockMkdir.mockReset();
});

describe('resolveLocation', () => {
  it('prioritizes CLI options over everything', async () => {
    const loc = await resolveLocation({ lat: -10, lon: 20 });
    expect(loc.lat).toBe(-10);
    expect(loc.lon).toBe(20);
    expect(loc.source).toBe('cli');
  });

  it('returns cache before hitting IP geo', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ lat: 30, lon: 40, timestamp: 1000 }));

    const loc = await resolveLocation({});
    expect(loc.lat).toBe(30);
    expect(loc.lon).toBe(40);
    expect(loc.source).toBe('cache');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('falls through to geo when cache is empty', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('ENOENT'));
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ latitude: 51.5, longitude: -0.13 }),
    });

    const loc = await resolveLocation({});
    expect(loc.lat).toBe(51.5);
    expect(loc.lon).toBe(-0.13);
    expect(loc.source).toBe('geo');
    expect(mockWriteFile).toHaveBeenCalled();
  });

  it('returns Sydney fallback when cache and IP both fail', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('ENOENT'));
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const loc = await resolveLocation({});
    expect(loc.lat).toBe(-33.8688);
    expect(loc.lon).toBe(151.2093);
    expect(loc.source).toBe('fallback');
  });

  it('noGeo skips IP geo and goes to fallback when cache empty', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('ENOENT'));

    const loc = await resolveLocation({ noGeo: true });
    expect(loc.source).toBe('fallback');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('noGeo still reads cache before falling back', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ lat: 30, lon: 40, timestamp: 1000 }));

    const loc = await resolveLocation({ noGeo: true });
    expect(loc.lat).toBe(30);
    expect(loc.lon).toBe(40);
    expect(loc.source).toBe('cache');
  });
});
