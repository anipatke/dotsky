import { describe, it, expect } from 'vitest';
import { toggleTimeMode, stepTime, STEP_MS } from '../src/timeControls';

describe('toggleTimeMode', () => {
  it('switches from live to manual preserving time', () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const result = toggleTimeMode('live', time);
    expect(result.mode).toBe('manual');
    expect(result.time).toBe(time);
  });

  it('switches from manual to live snapping to current time', () => {
    const frozen = new Date('2024-01-01T00:00:00Z');
    const before = Date.now();
    const result = toggleTimeMode('manual', frozen);
    expect(result.mode).toBe('live');
    expect(result.time.getTime()).toBeGreaterThanOrEqual(before);
    expect(result.time.getTime()).toBeLessThanOrEqual(Date.now());
    expect(result.time.getTime()).not.toBe(frozen.getTime());
  });
});

describe('stepTime', () => {
  it('adds 10 minutes on forward', () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const result = stepTime(time, 'forward');
    expect(result.getTime()).toBe(time.getTime() + STEP_MS);
  });

  it('subtracts 10 minutes on back', () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const result = stepTime(time, 'back');
    expect(result.getTime()).toBe(time.getTime() - STEP_MS);
  });

  it('does not mutate the original date', () => {
    const time = new Date('2024-06-15T12:00:00Z');
    const original = time.getTime();
    stepTime(time, 'forward');
    expect(time.getTime()).toBe(original);
  });
});
