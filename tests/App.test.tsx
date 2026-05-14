import { vi, describe, expect, test, beforeEach } from 'vitest';
import { render } from 'ink-testing-library';
import { App } from '../src/App';

vi.mock('node:process', () => ({
  ...vi.requireActual('node:process'),
  stdin: {
    on: vi.fn(),
  },
}));

describe('App component', () => {
  beforeEach(() => {
    vi.spyOn(global.process.stdin, 'on').mockClear();
  });

  test('handles keyboard input', async () => {
    const { lastFrame } = render(<App />);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(lastFrame()).toContain('Astrolink');
    expect(lastFrame()).toContain('[q] quit');
    expect(lastFrame()).toContain('N');
  });
});
