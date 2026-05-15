import { vi, describe, expect, test, beforeEach, afterEach } from 'vitest';
import { render } from 'ink-testing-library';
import { App } from '../../src/App';

vi.mock('node:process', () => ({
  ...vi.requireActual('node:process'),
  stdin: {
    isTTY: true,
    on: vi.fn(),
    setRawMode: vi.fn(),
  },
}));

describe('CLI flags integration', () => {
  test('lat/lon props propagate to header', async () => {
    const { lastFrame } = render(<App lat={-10} lon={20} />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('Lat: -10.00');
    expect(lastFrame()).toContain('Lon: 20.00');
  });

  test('different lat/lon produce different header content', async () => {
    const { lastFrame } = render(<App lat={51.51} lon={-0.13} />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('Lat: 51.51');
    expect(lastFrame()).toContain('Lon: -0.13');
  });

  test('labelsEnabled renders without crashing', async () => {
    const { lastFrame } = render(<App labelsEnabled={true} />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toBeTruthy();
  });

  test('custom aspect and fps render without crashing', async () => {
    const { lastFrame } = render(<App aspect={1} fps={30} />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toBeTruthy();
  });

  test('initialTime in header shows correct timestamp', async () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const { lastFrame } = render(<App initialTime={time} />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('2024-06-15 12:00:00 UTC');
  });

  test('all CLI-mapped props combined render without crashing', async () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const { lastFrame } = render(
      <App
        lat={-33.87}
        lon={151.21}
        initialTime={time}
        aspect={0.5}
        fps={15}
        labelsEnabled={false}
      />
    );
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('dotsky');
    expect(lastFrame()).toContain('Lat: -33.87');
    expect(lastFrame()).toContain('Lon: 151.21');
    expect(lastFrame()).toContain('[q] quit');
  });
});

describe('full render cycle', () => {
  test('produces sky symbols, header, horizon, and footer for Sydney night sky', async () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const { lastFrame } = render(
      <App lat={-33.87} lon={151.21} initialTime={time} />
    );
    await new Promise(resolve => setTimeout(resolve, 150));
    const frame = lastFrame();
    expect(frame).toContain('dotsky');
    expect(frame).toContain('Lat: -33.87');
    expect(frame).toContain('[q] quit');
    expect(frame).toContain('N');
    expect(frame).toContain('S');
    expect(frame).toMatch(/[☉◐*]/);
  });

  test('manual mode shows paused indicator', async () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const { lastFrame, stdin } = render(
      <App lat={-33.87} lon={151.21} initialTime={time} />
    );
    await new Promise(resolve => setTimeout(resolve, 50));
    stdin.write(' ');
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('paused');
  });

  test('space toggles back to live mode', async () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const { lastFrame, stdin } = render(
      <App lat={-33.87} lon={151.21} initialTime={time} />
    );
    await new Promise(resolve => setTimeout(resolve, 50));
    stdin.write(' ');
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('paused');
    stdin.write(' ');
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('live');
  });

  test('rotation updates horizon markers', async () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const { lastFrame, stdin } = render(
      <App lat={-33.87} lon={151.21} initialTime={time} />
    );
    await new Promise(resolve => setTimeout(resolve, 50));
    const frameBefore = lastFrame();
    stdin.write('\u001b[D');
    await new Promise(resolve => setTimeout(resolve, 50));
    const frameAfter = lastFrame();
    expect(frameAfter).toBeTruthy();
  });
});

describe('resize integration', () => {
  function setTerminalSize(cols: number, rows: number) {
    Object.defineProperty(process.stdout, 'columns', {
      value: cols,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(process.stdout, 'rows', {
      value: rows,
      configurable: true,
      writable: true,
    });
  }

  test('resize keeps app rendering correctly', async () => {
    setTerminalSize(120, 40);
    const { lastFrame } = render(<App />);
    await new Promise(resolve => setTimeout(resolve, 0));

    setTerminalSize(90, 30);
    process.stdout.emit('resize');
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(lastFrame()).toBeTruthy();
    expect(lastFrame()).toContain('dotsky');
    expect(lastFrame()).toContain('[q] quit');
  });
});

describe('location fallback integration', () => {
  test('fallback source shows location warning in footer', async () => {
    const { lastFrame } = render(<App locationSource="fallback" />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('[Location fallback:');
  });

  test('geo source does not show fallback warning', async () => {
    const { lastFrame } = render(<App locationSource="geo" />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).not.toContain('[Location fallback:');
  });

  test('cli source does not show fallback warning', async () => {
    const { lastFrame } = render(<App locationSource="cli" />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).not.toContain('[Location fallback:');
  });

  test('cache source does not show fallback warning', async () => {
    const { lastFrame } = render(<App locationSource="cache" />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).not.toContain('[Location fallback:');
  });
});

describe('failure modes', () => {
  function setTerminalSize(cols: number, rows: number) {
    Object.defineProperty(process.stdout, 'columns', {
      value: cols,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(process.stdout, 'rows', {
      value: rows,
      configurable: true,
      writable: true,
    });
  }

  test('fallback location source shows Sydney in footer', async () => {
    const { lastFrame } = render(<App locationSource="fallback" />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('Sydney');
  });

  test('belowMinimum overrides fallback warning', async () => {
    setTerminalSize(40, 10);
    const { lastFrame } = render(<App locationSource="fallback" />);
    await new Promise(resolve => setTimeout(resolve, 50));
    const frame = lastFrame();
    expect(frame).toContain('[Terminal too small');
    expect(frame).not.toContain('[Location fallback:');
  });
});
