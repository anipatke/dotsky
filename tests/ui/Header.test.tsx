import { describe, expect, test } from 'vitest';
import { render } from 'ink-testing-library';
import { Header } from '../../src/ui/Header';

const defaultProps = {
  location: { lat: -33.8688, lon: 151.2093 },
  time: new Date('2024-06-15T12:00:00Z'),
  mode: 'live' as const,
};

describe('Header', () => {
  test('renders dotsky title', () => {
    const { lastFrame } = render(<Header {...defaultProps} />);
    expect(lastFrame()).toContain('dotsky');
  });

  test('renders latitude and longitude', () => {
    const { lastFrame } = render(<Header {...defaultProps} />);
    expect(lastFrame()).toContain('-33.87');
    expect(lastFrame()).toContain('151.21');
  });

  test('renders time string in UTC', () => {
    const { lastFrame } = render(<Header {...defaultProps} />);
    expect(lastFrame()).toContain('2024-06-15 12:00:00 UTC');
  });

  test('shows live mode', () => {
    const { lastFrame } = render(<Header {...defaultProps} />);
    expect(lastFrame()).toContain('live');
  });

  test('shows paused mode when manual', () => {
    const { lastFrame } = render(<Header {...defaultProps} mode="manual" />);
    expect(lastFrame()).toContain('paused');
  });
});