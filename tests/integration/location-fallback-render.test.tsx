import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { App } from '../../src/App';
import { resolveLocation } from '../../src/location/resolveLocation';

const mockReadFile = vi.hoisted(() => vi.fn());
const mockWriteFile = vi.hoisted(() => vi.fn());
const mockRename = vi.hoisted(() => vi.fn());
const mockMkdir = vi.hoisted(() => vi.fn());
const mockHomedir = vi.hoisted(() => vi.fn(() => '/home/test'));
const mockFetch = vi.hoisted(() => vi.fn());

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

vi.mock('node:process', () => ({
  ...vi.requireActual('node:process'),
  stdin: {
    isTTY: true,
    on: vi.fn(),
    setRawMode: vi.fn(),
  },
}));

globalThis.fetch = mockFetch;

describe('location fallback render integration', () => {
  beforeEach(() => {
    mockReadFile.mockReset();
    mockWriteFile.mockReset();
    mockRename.mockReset();
    mockMkdir.mockReset();
    mockFetch.mockReset();
  });

  test('renders fallback warning after cache and geolocation fail', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('ENOENT'));
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const location = await resolveLocation({});
    const { lastFrame } = render(
      <App lat={location.lat} lon={location.lon} locationSource={location.source} />
    );

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(location).toEqual({ lat: -33.8688, lon: 151.2093, source: 'fallback' });
    expect(lastFrame()).toContain('Lat: -33.87');
    expect(lastFrame()).toContain('Lon: 151.21');
    expect(lastFrame()).toContain('[Location fallback:');
    expect(lastFrame()).toContain('Sydney]');
  });
});
