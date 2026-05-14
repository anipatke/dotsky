import { expect, test, vi } from 'vitest';
import { enterScreen, exitScreen } from '../../src/terminal/screen';

// Failing test: Terminal screen buffer not entered properly
test('should enter alternate screen buffer', () => {
  const mock = vi.fn();
  process.stdout.write = mock;
  enterScreen();
  expect(mock).toHaveBeenCalledWith('\u001B[?1049h');
});

// Failing test: Screen restoration on exit
test('should restore original screen buffer', () => {
  const mock = vi.fn();
  process.stdout.write = mock;
  exitScreen();
  expect(mock).toHaveBeenCalledWith('\u001B[?1049l');
});