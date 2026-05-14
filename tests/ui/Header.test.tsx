import { expect, test } from 'vitest';
import { render } from 'ink-testing-library';
import { Header } from '../../src/ui/Header';

// Failing test: Header component not rendering correctly
test('renders astrolink title', () => {
  const { lastFrame } = render(<Header />);
  expect(lastFrame()).toContain('astrolink');
  expect(lastFrame()).toContain('astrolink');
});