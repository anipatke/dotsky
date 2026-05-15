import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readCachedLocation, writeCachedLocation } from '../../src/location/cacheLocation.js';

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

beforeEach(() => {
  mockReadFile.mockReset();
  mockWriteFile.mockReset();
  mockRename.mockReset();
  mockMkdir.mockReset();
});

describe('readCachedLocation', () => {
  it('returns lat/lon when cache file is valid', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ lat: 40.71, lon: -74.01, timestamp: 1000 }));

    const result = await readCachedLocation();
    expect(result).toEqual({ lat: 40.71, lon: -74.01 });
  });

  it('returns null when file does not exist', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('ENOENT'));

    const result = await readCachedLocation();
    expect(result).toBeNull();
  });

  it('returns null on corrupt JSON', async () => {
    mockReadFile.mockResolvedValueOnce('not json');

    const result = await readCachedLocation();
    expect(result).toBeNull();
  });

  it('returns null when lat/lon missing', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ name: 'test' }));

    const result = await readCachedLocation();
    expect(result).toBeNull();
  });

  it('returns null when lat out of range', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ lat: 100, lon: 0 }));

    const result = await readCachedLocation();
    expect(result).toBeNull();
  });

  it('returns null when lon out of range', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ lat: 0, lon: 200 }));

    const result = await readCachedLocation();
    expect(result).toBeNull();
  });
});

describe('writeCachedLocation', () => {
  it('writes to temp file and renames', async () => {
    await writeCachedLocation(40.71, -74.01);

    expect(mockMkdir).toHaveBeenCalledOnce();
    expect(mockWriteFile).toHaveBeenCalledOnce();
    expect(mockRename).toHaveBeenCalledOnce();

    const writeArg = mockWriteFile.mock.calls[0][1];
    const parsed = JSON.parse(writeArg);
    expect(parsed.lat).toBe(40.71);
    expect(parsed.lon).toBe(-74.01);
    expect(typeof parsed.timestamp).toBe('number');
  });

  it('writes to .tmp file then renames to final', async () => {
    await writeCachedLocation(10, 20);

    const tmpPath = mockWriteFile.mock.calls[0][0];
    const finalPath = mockRename.mock.calls[0][1];
    expect(tmpPath).toMatch(/\.tmp$/);
    expect(finalPath).not.toMatch(/\.tmp$/);
  });
});
