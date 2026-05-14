import { expect, test } from 'vitest';
import { render } from 'ink-testing-library';
import { Viewport } from '../../src/ui/Viewport';

// Failing test: Viewport component not rendering points correctly
test('renders screen points', async () => {
  const screenPoints = [
    { x: 0, y: 0, symbol: '*' },
    { x: 10, y: 5, symbol: '+' }
  ];
  const { lastFrame } = render(<Viewport screenPoints={screenPoints} />);
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(lastFrame()).toContain('*');
  expect(lastFrame()).toContain('+');
});
