import { vi, describe, expect, test, beforeEach, afterEach } from 'vitest';
import { render } from 'ink-testing-library';
import { App } from '../src/App';

vi.mock('node:process', () => ({
  ...vi.requireActual('node:process'),
  stdin: {
    isTTY: true,
    on: vi.fn(),
    setRawMode: vi.fn(),
  },
}));

describe('App component', () => {
  beforeEach(() => {
    vi.spyOn(global.process.stdin, 'on').mockClear();
  });

  test('handles keyboard input', async () => {
    const { lastFrame } = render(<App />);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(lastFrame()).toContain('dotsky');
    expect(lastFrame()).toContain('[q] quit');
    expect(lastFrame()).toContain('N');
  });

  test('keyboard controls do not crash the app', async () => {
    const { lastFrame } = render(<App />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toBeTruthy();
  });

  test('stepping time with initial time changes output', async () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const { lastFrame, stdin } = render(<App initialTime={time} />);
    await new Promise(resolve => setTimeout(resolve, 50));
    const frame1 = lastFrame();

    stdin.write(' ');
    stdin.write(']');
    await new Promise(resolve => setTimeout(resolve, 50));
    const frame2 = lastFrame();

    expect(frame2).not.toBe(frame1);
  });

  test('stepping time back and forward produces different frames', async () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const { lastFrame, stdin } = render(<App initialTime={time} />);
    await new Promise(resolve => setTimeout(resolve, 50));
    stdin.write(' ');
    stdin.write(']');
    await new Promise(resolve => setTimeout(resolve, 50));
    const forwardFrame = lastFrame();

    stdin.write('[');
    await new Promise(resolve => setTimeout(resolve, 50));
    const backFrame = lastFrame();

    expect(forwardFrame).not.toBe(backFrame);
  });

  test('l key toggles labels without crashing', async () => {
    const { lastFrame, stdin } = render(<App />);
    await new Promise(resolve => setTimeout(resolve, 50));
    const frameBefore = lastFrame();

    stdin.write('l');
    await new Promise(resolve => setTimeout(resolve, 50));
    const frameAfter = lastFrame();

    expect(frameAfter).toBeTruthy();
  });

  function setTerminalSize(cols: number, rows: number) {
    Object.defineProperty(process.stdout, 'columns', { value: cols, configurable: true, writable: true });
    Object.defineProperty(process.stdout, 'rows', { value: rows, configurable: true, writable: true });
  }

  test('shows below-minimum warning when terminal is smaller than 80x24', async () => {
    setTerminalSize(40, 10);

    const { lastFrame } = render(<App />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('[Terminal too small');
  });

  test('resize from adequate to small shows warning', async () => {
    setTerminalSize(120, 40);

    const { lastFrame } = render(<App />);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(lastFrame()).not.toContain('[Terminal too small');

    setTerminalSize(60, 10);
    process.stdout.emit('resize');
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(lastFrame()).toContain('[Terminal too small');
  });

  test('resize from small to adequate removes warning', async () => {
    setTerminalSize(60, 10);

    const { lastFrame } = render(<App />);
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(lastFrame()).toContain('[Terminal too small');

    setTerminalSize(120, 40);
    process.stdout.emit('resize');
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(lastFrame()).not.toContain('[Terminal too small');
  });
});
