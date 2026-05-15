import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const cliMocks = vi.hoisted(() => {
  const waitUntilExit = vi.fn<() => Promise<void>>(() => Promise.resolve());
  return {
    flags: {} as Record<string, unknown>,
    render: vi.fn(() => ({ waitUntilExit })),
    resolveLocation: vi.fn(),
    waitUntilExit,
  };
});

vi.mock('meow', () => ({
  default: vi.fn(() => ({ flags: cliMocks.flags })),
}));

vi.mock('ink', async () => {
  const actual = await vi.importActual<typeof import('ink')>('ink');
  return {
    ...actual,
    render: cliMocks.render,
  };
});

vi.mock('../../src/location/resolveLocation.js', () => ({
  resolveLocation: cliMocks.resolveLocation,
}));

describe('CLI bootstrap integration', () => {
  beforeEach(() => {
    vi.resetModules();
    cliMocks.flags = {
      lat: -10,
      lon: 20,
      geo: true,
      time: '2024-06-15T12:00:00Z',
      aspect: 0.55,
      fps: 30,
      labels: true,
    };
    cliMocks.render.mockClear();
    cliMocks.resolveLocation.mockReset();
    cliMocks.waitUntilExit.mockReset();
    cliMocks.waitUntilExit.mockResolvedValue(undefined);
    vi.spyOn(process, 'exit').mockImplementation((() => undefined as never) as typeof process.exit);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('maps parsed CLI flags through location resolution into App props', async () => {
    cliMocks.resolveLocation.mockResolvedValueOnce({ lat: -10, lon: 20, source: 'cli' });

    await import('../../src/cli');

    expect(cliMocks.resolveLocation).toHaveBeenCalledWith({ lat: -10, lon: 20, noGeo: false });
    expect(cliMocks.render).toHaveBeenCalledOnce();

    const element = cliMocks.render.mock.calls[0][0] as { props: Record<string, unknown> };
    expect(element.props).toMatchObject({
      lat: -10,
      lon: 20,
      locationSource: 'cli',
      aspect: 0.55,
      fps: 30,
      labelsEnabled: true,
    });
    expect(element.props.initialTime).toEqual(new Date('2024-06-15T12:00:00Z'));
  });
});
